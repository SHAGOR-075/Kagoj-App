// Centered confirmation dialog for deleting notes with high-contrast dark mode support.

import { AlertTriangle, Trash2 } from 'lucide-react';
import { Note } from '../types/note';

interface ConfirmSheetProps {
  note: Note | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmSheet({ note, isOpen, onConfirm, onCancel }: ConfirmSheetProps) {
  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#1f1e20] p-6 shadow-2xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 border border-red-200 dark:border-red-900/50">
            <Trash2 className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-stone-900 dark:text-white">
              Delete this note?
            </h3>
            <span className="text-[11px] font-sans text-stone-500 dark:text-stone-300">
              Cannot be undone after 5s
            </span>
          </div>
        </div>

        <div className="bg-stone-100 dark:bg-stone-800/90 text-stone-800 dark:text-stone-100 px-3 py-2.5 rounded-xl text-xs font-sans font-medium line-clamp-2 border border-stone-200 dark:border-stone-700 mb-3">
          "{note.title || note.content || 'Untitled Note'}"
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-200 font-sans leading-relaxed mb-5">
          This note will be moved to trash. You can undo this action immediately from the notification.
        </p>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 font-semibold text-xs text-stone-800 dark:text-stone-100 border border-stone-300 dark:border-stone-600 active:scale-95 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 font-semibold text-xs text-white shadow-md shadow-red-600/20 transition flex items-center justify-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
