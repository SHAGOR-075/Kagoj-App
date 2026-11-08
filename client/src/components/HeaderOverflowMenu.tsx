import { Grid, LayoutList, Moon, MoreHorizontal, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ViewMode } from '../types/note';

interface HeaderOverflowMenuProps {
  viewMode: ViewMode;
  onToggleView: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export function HeaderOverflowMenu({
  viewMode,
  onToggleView,
  isDark,
  onToggleTheme,
}: HeaderOverflowMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showMenu) return;
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, [showMenu]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu((v) => !v)}
        aria-label="More options"
        className="min-h-[44px] min-w-[44px] w-11 h-11 flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 active:scale-95 transition"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
      {showMenu && (
        <div className="absolute right-0 top-12 z-50 bg-[#FAF8F5] dark:bg-[#1E1D1C] border border-stone-300/80 dark:border-stone-800 rounded-2xl shadow-xl p-1.5 flex flex-col gap-1 min-w-[130px]">
          <button
            onClick={() => {
              onToggleView();
              setShowMenu(false);
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs text-stone-700 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-xl"
          >
            {viewMode === 'grid' ? <LayoutList className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            <span>{viewMode === 'grid' ? 'List View' : 'Grid View'}</span>
          </button>
          <button
            onClick={() => {
              onToggleTheme();
              setShowMenu(false);
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs text-stone-700 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 rounded-xl"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            <span>{isDark ? 'Light Paper' : 'Dark Mode'}</span>
          </button>
        </div>
      )}
    </div>
  );
}

