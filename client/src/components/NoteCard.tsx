// Note card displaying title, preview, relative timestamp, and swipe triggers.

import { CheckSquare, List } from 'lucide-react';
import { getColorConfig } from '../constants/colors';
import { useSwipe } from '../hooks/useSwipe';
import { Note } from '../types/note';
import { formatRelativeTime } from '../utils/time';
import { PinButton } from './PinButton';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
  onTogglePin: (e: React.MouseEvent) => void;
  onRequestDelete: (note: Note) => void;
}

export function NoteCard({ note, onClick, onTogglePin, onRequestDelete }: NoteCardProps) {
  const color = getColorConfig(note.color);
  const swipe = useSwipe({
    onSwipeLeft: () => onRequestDelete(note),
    onLongPress: () => onRequestDelete(note),
  });

  const hasChecklist = note.content.includes('[ ]') || note.content.includes('[x]');
  const hasBullets = note.content.includes('•') || note.content.startsWith('-');

  return (
    <article
      onClick={onClick}
      {...swipe}
      className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] ${color.classes}`}
    >
      <div className="flex items-start justify-between gap-1.5 mb-2">
        <h3 className="font-serif font-semibold text-[15px] sm:text-base leading-snug line-clamp-2 text-stone-900 dark:text-stone-50 tracking-tight">
          {note.title || 'Untitled Note'}
        </h3>
        <PinButton
          pinned={note.pinned}
          onToggle={onTogglePin}
          className="-mr-1.5 -mt-1.5 shrink-0 opacity-75 group-hover:opacity-100"
        />
      </div>

      <p className="text-xs leading-relaxed line-clamp-3 text-stone-700 dark:text-stone-200 mb-3 whitespace-pre-wrap break-words font-sans">
        {note.content || 'Empty note'}
      </p>

      <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 font-sans pt-2 border-t border-stone-200/50 dark:border-stone-800/60">
        <span className="tabular-nums">{formatRelativeTime(note.updatedAt || note.createdAt)}</span>
        <div className="flex items-center gap-2">
          {hasChecklist && <CheckSquare className="w-3 h-3 text-stone-400 dark:text-stone-400" />}
          {hasBullets && !hasChecklist && <List className="w-3 h-3 text-stone-400 dark:text-stone-400" />}
          {note.pinned && (
            <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-800 dark:text-amber-300">
              PINNED
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
