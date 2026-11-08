import { useEffect, useRef, useState } from 'react';
import { SaveStatus } from '../components/SaveIndicator';
import { Note } from '../types/note';
import { useDebounce } from './useDebounce';

export function useEditorState(
  note: Note | null,
  isOpen: boolean,
  onSave: (data: { title: string; content: string; color: string; pinned: boolean; clientId: string; noteId?: string }) => Promise<Note | void>,
  onDeleteEmpty?: (noteId: string) => Promise<void>
) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('paper');
  const [pinned, setPinned] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const isDirty = useRef(false);
  const clientIdRef = useRef(crypto.randomUUID());
  const serverNoteIdRef = useRef<string | null>(null);
  const isInFlight = useRef(false);
  const queuedData = useRef<{ title: string; content: string; color: string; pinned: boolean } | null>(null);

  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setColor(note?.color || 'paper');
    setPinned(note?.pinned || false);
    serverNoteIdRef.current = note?._id || null;
    if (!note) clientIdRef.current = crypto.randomUUID();
    isDirty.current = false;
    setSaveStatus('idle');
  }, [note, isOpen]);

  const debounced = useDebounce({ title, content, color, pinned }, 800);

  const executeSave = async (data: typeof debounced) => {
    const hasText = Boolean(data.title.trim() || data.content.trim());
    if (!hasText) {
      if (serverNoteIdRef.current && onDeleteEmpty) {
        await onDeleteEmpty(serverNoteIdRef.current);
        serverNoteIdRef.current = null;
        setSaveStatus('idle');
      }
      return;
    }

    if (isInFlight.current) {
      queuedData.current = data;
      return;
    }

    isInFlight.current = true;
    setSaveStatus('saving');
    try {
      const res = await onSave({ ...data, clientId: clientIdRef.current, noteId: serverNoteIdRef.current || undefined });
      if (res?._id) serverNoteIdRef.current = res._id;
      setSaveStatus('saved');
      isDirty.current = false;
    } catch {
      setSaveStatus('idle');
    } finally {
      isInFlight.current = false;
      if (queuedData.current) {
        const next = queuedData.current;
        queuedData.current = null;
        executeSave(next);
      }
    }
  };

  useEffect(() => {
    if (!isOpen || !isDirty.current) return;
    executeSave(debounced);
  }, [debounced, isOpen]);

  const manualSave = async (onClose: () => void) => {
    const hasText = Boolean(title.trim() || content.trim());
    if (!hasText) {
      if (serverNoteIdRef.current && onDeleteEmpty) {
        await onDeleteEmpty(serverNoteIdRef.current);
      }
      onClose();
      return;
    }
    await executeSave({ title, content, color, pinned });
    onClose();
  };

  return {
    title,
    setTitle: (v: string) => { isDirty.current = true; setTitle(v); },
    content,
    setContent: (v: string) => { isDirty.current = true; setContent(v); },
    color,
    setColor: (v: string) => { isDirty.current = true; setColor(v); },
    pinned,
    togglePin: () => { isDirty.current = true; setPinned((p) => !p); },
    saveStatus,
    manualSave,
  };
}
