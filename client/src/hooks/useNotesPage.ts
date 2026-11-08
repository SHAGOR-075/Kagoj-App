// Hook coordinating page actions, modal interactions, privacy lock, and deletion toasts.

import { useState } from 'react';
import { useAppLock } from './useAppLock';
import { useNoteModals } from './useNoteModals';
import { usePWAInstall } from './usePWAInstall';
import { useToast } from './useToast';
import { Note, ViewMode } from '../types/note';

interface NotesPageHooks {
  notes: Note[];
  addNote: (data: any) => Promise<Note>;
  editNote: (id: string, data: any) => Promise<Note>;
  removeNote: (id: string) => Promise<Note | undefined>;
  restoreNote: (note: Note) => void;
}

export function useNotesPage({ notes, addNote, editNote, removeNote, restoreNote }: NotesPageHooks) {
  const modals = useNoteModals();
  const { toast, showToast, dismissToast } = useToast(5000);
  const pwa = usePWAInstall();
  const lock = useAppLock();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showLockSettings, setShowLockSettings] = useState(false);

  const handleSave = async (data: { title: string; content: string; color: string; pinned: boolean; clientId: string; noteId?: string }) => {
    const targetId = data.noteId || modals.activeNote?._id;
    if (targetId) {
      return await editNote(targetId, {
        title: data.title,
        content: data.content,
        color: data.color,
        pinned: data.pinned,
      });
    } else {
      const created = await addNote(data);
      modals.openEditNote(created);
      return created;
    }
  };

  const handleDeleteEmpty = async (noteId: string) => {
    await removeNote(noteId);
  };

  const handleConfirmDelete = async () => {
    if (!modals.deleteCandidate) return;
    const target = modals.deleteCandidate;
    modals.cancelDelete();
    if (modals.activeNote?._id === target._id) modals.closeEditor();
    const deleted = await removeNote(target._id);
    if (deleted) showToast('Note deleted. Undo?', () => restoreNote(deleted));
  };

  const togglePin = (id: string) => {
    const target = notes.find((n) => n._id === id);
    if (target) editNote(id, { pinned: !target.pinned });
  };

  return {
    modals,
    toast,
    dismissToast,
    pwa,
    lock,
    showLockSettings,
    setShowLockSettings,
    viewMode,
    toggleView: () => setViewMode((v) => (v === 'grid' ? 'list' : 'grid')),
    handleSave,
    handleDeleteEmpty,
    handleConfirmDelete,
    togglePin,
  };
}
