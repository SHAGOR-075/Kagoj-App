// Hook to filter notes instantly by title, content, and paper color tag.

import { useMemo, useState } from 'react';
import { Note } from '../types/note';

export function useFilteredNotes(notes: Note[]) {
  const [searchQuery, setSearchQuery] = useState('');
  const [colorFilter, setColorFilter] = useState<string | null>(null);

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return notes.filter((n) => {
      const matchText =
        !q ||
        n.title?.toLowerCase().includes(q) ||
        n.content?.toLowerCase().includes(q);
      const matchColor = !colorFilter || n.color === colorFilter;
      return matchText && matchColor;
    });
  }, [notes, searchQuery, colorFilter]);

  return {
    searchQuery,
    setSearchQuery,
    colorFilter,
    setColorFilter,
    filteredNotes,
    isSearching: searchQuery.trim().length > 0 || colorFilter !== null,
  };
}
