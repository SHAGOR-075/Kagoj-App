// Type definitions for notes and app state.

export interface Note {
  _id: string;
  clientId?: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateNoteInput = Omit<Note, '_id' | 'createdAt' | 'updatedAt'>;
export type UpdateNoteInput = Partial<CreateNoteInput>;

export type ViewMode = 'grid' | 'list';
