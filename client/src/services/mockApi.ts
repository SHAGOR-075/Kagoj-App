// LocalStorage mock API implementation for zero-backend preview.

import { INITIAL_MOCK_NOTES } from '../constants/mockNotes';
import { CreateNoteInput, Note, UpdateNoteInput } from '../types/note';
import { getStoredItem, setStoredItem } from '../utils/storage';

const STORAGE_KEY = 'kagoj_notes_data';

export const mockApi = {
  async getNotes(): Promise<Note[]> {
    let notes = getStoredItem<Note[] | null>(STORAGE_KEY, null);
    if (!notes) {
      notes = INITIAL_MOCK_NOTES;
      setStoredItem(STORAGE_KEY, notes);
    }
    return [...notes];
  },

  async createNote(data: CreateNoteInput): Promise<Note> {
    const notes = await this.getNotes();
    const newNote: Note = {
      ...data,
      _id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setStoredItem(STORAGE_KEY, [newNote, ...notes]);
    return newNote;
  },

  async updateNote(id: string, data: UpdateNoteInput): Promise<Note> {
    const notes = await this.getNotes();
    const index = notes.findIndex((n) => n._id === id);
    if (index === -1) throw new Error('Note not found');
    const updated: Note = {
      ...notes[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    notes[index] = updated;
    setStoredItem(STORAGE_KEY, notes);
    return updated;
  },

  async deleteNote(id: string): Promise<{ success: boolean; id: string }> {
    const notes = await this.getNotes();
    const filtered = notes.filter((n) => n._id !== id);
    setStoredItem(STORAGE_KEY, filtered);
    return { success: true, id };
  },
};
