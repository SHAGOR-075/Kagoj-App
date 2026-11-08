// Friendly empty state view with hand-drawn style notebook illustration.

import { FileSearch, Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  isSearch: boolean;
  onAction: () => void;
}

export function EmptyState({ isSearch, onAction }: EmptyStateProps) {
  return (
    <div className="py-16 px-6 text-center flex flex-col items-center justify-center max-w-sm mx-auto animate-fade-in">
      <div className="w-18 h-18 rounded-3xl bg-amber-50/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center mb-4 shadow-sm">
        {isSearch ? (
          <FileSearch className="w-7 h-7 stroke-[1.6] text-stone-500" />
        ) : (
          <svg className="w-9 h-9 text-stone-700 dark:text-stone-300" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="8" y="6" width="32" height="36" rx="4" fill="currentColor" fillOpacity="0.08" />
            <line x1="16" y1="16" x2="32" y2="16" strokeLinecap="round" />
            <line x1="16" y1="24" x2="28" y2="24" strokeLinecap="round" />
            <line x1="16" y1="32" x2="24" y2="32" strokeLinecap="round" />
            <path d="M30 30l6-6 4 4-6 6-4-4z" fill="currentColor" fillOpacity="0.2" />
          </svg>
        )}
      </div>

      <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100 mb-1 tracking-tight">
        {isSearch ? 'No notes matched' : 'Your notepad is empty'}
      </h3>

      <p className="text-xs text-stone-500 dark:text-stone-400 font-sans leading-relaxed mb-5">
        {isSearch
          ? 'No notes match your current search and color filter. Tap below to clear filters.'
          : 'Write down fleeting thoughts, grocery lists, ideas, or reminders in English or বাংলা.'}
      </p>

      <button
        onClick={onAction}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 text-xs font-medium shadow-sm hover:opacity-95 active:scale-95 transition"
      >
        {isSearch ? (
          <>
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Filter
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 stroke-[2.2]" />
            Write First Note
          </>
        )}
      </button>
    </div>
  );
}
