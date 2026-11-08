// Hook to manage notes state with optimistic updates and error handling.

import { useCallback, useEffect, useState } from 'react';
import { createNote, deleteNote, getNotes, updateNote } from '../services/api';
import { CreateNoteInput, Note, UpdateNoteInput } from '../types/note';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setNotes(await getNotes());
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const addNote = async (input: CreateNoteInput): Promise<Note> => {
    const tempId = `temp-${Date.now()}`;
    const optimistic: Note = { ...input, _id: tempId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setNotes((prev) => [optimistic, ...prev]);
    try {
      const saved = await createNote(input);
      setNotes((prev) => prev.map((n) => (n._id === tempId ? saved : n)));
      return saved;
    } catch (err) {
      setNotes((prev) => prev.filter((n) => n._id !== tempId));
      throw err;
    }
  };

  const editNote = async (id: string, input: UpdateNoteInput): Promise<Note> => {
    const prev = [...notes];
    setNotes((list) => list.map((n) => (n._id === id ? { ...n, ...input, updatedAt: new Date().toISOString() } : n)));
    try {
      const saved = await updateNote(id, input);
      setNotes((list) => list.map((n) => (n._id === id ? saved : n)));
      return saved;
    } catch (err) {
      setNotes(prev);
      throw err;
    }
  };

  const removeNote = async (id: string): Promise<Note | undefined> => {
    const target = notes.find((n) => n._id === id);
    if (!target) return;
    setNotes((prev) => prev.filter((n) => n._id !== id));
    try {
      await deleteNote(id);
      return target;
    } catch (err) {
      setNotes((prev) => [target, ...prev]);
      throw err;
    }
  };

  const restoreNote = async (note: Note) => {
    setNotes((prev) => [note, ...prev.filter((n) => n._id !== note._id)]);
    try {
      const restored = await createNote({
        title: note.title,
        content: note.content,
        color: note.color,
        pinned: note.pinned,
      });
      setNotes((prev) => prev.map((n) => (n._id === note._id ? restored : n)));
    } catch (err) {
      console.error('Failed to restore note on server:', err);
    }
  };

  return { notes, loading, error, fetchNotes, addNote, editNote, removeNote, restoreNote };
}
