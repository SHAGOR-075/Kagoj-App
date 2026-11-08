// Sticky search input with instant clear affordance and palette filter strip.

import { Search, X } from 'lucide-react';
import { ColorFilterBar } from './ColorFilterBar';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  selectedColor: string | null;
  onSelectColor: (colorId: string | null) => void;
}

export function SearchBar({
  value,
  onChange,
  selectedColor,
  onSelectColor,
}: SearchBarProps) {
  return (
    <div className="sticky top-15 z-10 pt-2 pb-2 px-4 bg-[#fbfbfa]/95 dark:bg-[#18181b]/95 backdrop-blur-md transition-colors border-b border-stone-200/50 dark:border-stone-800/50">
      <div className="max-w-3xl mx-auto flex flex-col gap-2">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-stone-400 dark:text-stone-500 pointer-events-none" />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Search notes in English or বাংলা…"
            aria-label="Search notes"
            className="w-full h-11 pl-10 pr-10 text-sm bg-stone-100/90 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-500 rounded-xl border border-stone-200/70 dark:border-stone-800 focus:outline-none focus:ring-1.5 focus:ring-stone-400 dark:focus:ring-stone-600 transition shadow-inner"
          />
          {value && (
            <button
              onClick={() => onChange('')}
              aria-label="Clear search text"
              className="absolute right-1 min-h-[40px] min-w-[40px] flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <ColorFilterBar selectedColor={selectedColor} onSelectColor={onSelectColor} />
      </div>
    </div>
  );
}
