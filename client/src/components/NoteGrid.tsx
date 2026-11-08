// Renders notes in responsive 2-column grid or single-column list with pinned grouping.

import { Pin } from 'lucide-react';
import { Note, ViewMode } from '../types/note';
import { NoteCard } from './NoteCard';

interface NoteGridProps {
  notes: Note[];
  viewMode: ViewMode;
  onSelectNote: (note: Note) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  onRequestDelete: (note: Note) => void;
}

export function NoteGrid({
  notes,
  viewMode,
  onSelectNote,
  onTogglePin,
  onRequestDelete,
}: NoteGridProps) {
  const pinnedNotes = notes.filter((n) => n.pinned);
  const otherNotes = notes.filter((n) => !n.pinned);
  const containerClass = viewMode === 'grid' ? 'grid grid-cols-2 gap-3 sm:gap-4' : 'flex flex-col gap-3';

  const renderSection = (title: string, list: Note[], isPinnedSection = false) => {
    if (list.length === 0) return null;
    return (
      <section className="mb-6">
        {pinnedNotes.length > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-stone-400 dark:text-stone-500 mb-2.5 px-1">
            {isPinnedSection && <Pin className="w-3 h-3 text-amber-600 dark:text-amber-400 fill-current rotate-45" />}
            <span>{title}</span>
            <span className="text-stone-300 dark:text-stone-600 font-normal">({list.length})</span>
          </div>
        )}
        <div className={containerClass}>
          {list.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onClick={() => onSelectNote(note)}
              onTogglePin={(e) => onTogglePin(note._id, e)}
              onRequestDelete={onRequestDelete}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="px-4 pb-28 max-w-3xl mx-auto">
      {renderSection('Pinned Notes', pinnedNotes, true)}
      {renderSection(pinnedNotes.length > 0 ? 'Other Notes' : 'All Notes', otherNotes)}
    </div>
  );
}
