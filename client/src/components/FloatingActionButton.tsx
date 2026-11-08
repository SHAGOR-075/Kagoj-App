// Floating action button with warm ink texture and spring touch feedback.

import { Feather } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label="Write a new note"
      title="Write a new note"
      className="fixed right-5 bottom-6 z-30 min-h-[56px] min-w-[56px] w-14 h-14 rounded-2xl bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-lg shadow-stone-900/20 dark:shadow-black/40 border border-stone-800/20 dark:border-white/20 flex items-center justify-center active:scale-90 hover:scale-105 transition-all cursor-pointer group"
    >
      <Feather className="w-6 h-6 stroke-[2] group-hover:rotate-12 transition-transform duration-200" />
    </button>
  );
}
