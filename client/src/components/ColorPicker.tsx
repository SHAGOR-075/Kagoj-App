// Palette selector for choosing soft pastel note paper colors.

import { NOTE_COLORS } from '../constants/colors';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (colorId: string) => void;
}

export function ColorPicker({ selectedColor, onSelectColor }: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-2 no-scrollbar">
      <span className="text-xs text-stone-400 dark:text-stone-500 font-sans mr-1 shrink-0">Color</span>
      {NOTE_COLORS.map((c) => {
        const isSelected = selectedColor === c.id;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectColor(c.id)}
            aria-label={`Select ${c.name} paper color`}
            title={c.name}
            style={{ backgroundColor: c.swatch }}
            className={`min-h-[36px] min-w-[36px] w-8 h-8 rounded-full border border-stone-300/80 dark:border-stone-700 transition-all shrink-0 ${
              isSelected ? 'ring-2 ring-stone-800 dark:ring-stone-200 scale-105' : 'hover:scale-105'
            }`}
          />
        );
      })}
    </div>
  );
}
