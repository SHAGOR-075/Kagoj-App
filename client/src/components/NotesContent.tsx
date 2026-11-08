// Renders loading, error, empty, or notes grid content.

import { Note, ViewMode } from '../types/note';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { NoteGrid } from './NoteGrid';
import { SkeletonCard } from './SkeletonCard';

interface NotesContentProps {
  loading: boolean;
  error: string | null;
  notes: Note[];
  isSearching: boolean;
  viewMode: ViewMode;
  onRetry: () => void;
  onClearSearch: () => void;
  onNewNote: () => void;
  onSelectNote: (note: Note) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onRequestDelete: (note: Note) => void;
}

export function NotesContent({
  loading,
  error,
  notes,
  isSearching,
  viewMode,
  onRetry,
  onClearSearch,
  onNewNote,
  onSelectNote,
  onTogglePin,
  onRequestDelete,
}: NotesContentProps) {
  if (loading) return <SkeletonCard count={6} />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (notes.length === 0) {
    return <EmptyState isSearch={isSearching} onAction={isSearching ? onClearSearch : onNewNote} />;
  }
  return (
    <NoteGrid
      notes={notes}
      viewMode={viewMode}
      onSelectNote={onSelectNote}
      onTogglePin={onTogglePin}
      onRequestDelete={onRequestDelete}
    />
  );
}
