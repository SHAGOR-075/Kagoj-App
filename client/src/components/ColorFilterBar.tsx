// Horizontal scrollable filter bar for browsing notes by paper color tag.

import { NOTE_COLORS } from '../constants/colors';

interface ColorFilterBarProps {
  selectedColor: string | null;
  onSelectColor: (colorId: string | null) => void;
}

export function ColorFilterBar({ selectedColor, onSelectColor }: ColorFilterBarProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
      <button
        onClick={() => onSelectColor(null)}
        className={`px-3 py-1 text-xs rounded-full transition-all shrink-0 font-medium ${
          selectedColor === null
            ? 'bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-xs'
            : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
        }`}
      >
        All
      </button>

      {NOTE_COLORS.map((c) => {
        const active = selectedColor === c.id;
        return (
          <button
            key={c.id}
            onClick={() => onSelectColor(active ? null : c.id)}
            title={`Filter by ${c.name}`}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full transition-all shrink-0 border ${
              active
                ? 'border-stone-800 dark:border-stone-200 bg-white/80 dark:bg-stone-800 shadow-xs font-semibold'
                : 'border-stone-200/60 dark:border-stone-800/80 bg-stone-100/60 dark:bg-stone-900/40 text-stone-600 dark:text-stone-400'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
              style={{ backgroundColor: c.dotColor }}
            />
            <span>{c.name}</span>
          </button>
        );
      })}
    </div>
  );
}
