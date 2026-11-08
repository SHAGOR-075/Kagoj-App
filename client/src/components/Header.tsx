// Top navigation bar with brand identity, note counts, and responsive action controls.

import { Notebook } from 'lucide-react';
import { ViewMode } from '../types/note';
import { HeaderActions } from './HeaderActions';

interface HeaderProps {
  totalNotes: number;
  pinnedCount: number;
  viewMode: ViewMode;
  onToggleView: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  canInstall?: boolean;
  onInstall?: () => void;
  isLockEnabled?: boolean;
  onOpenLockSettings: () => void;
  onLockNow: () => void;
}

export function Header(props: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-[#fbfbfa]/90 dark:bg-[#18181b]/90 border-b border-stone-200/80 dark:border-stone-800/80 transition-colors pt-safe pl-safe pr-safe">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 h-14 min-[360px]:h-15 flex items-center justify-between gap-2 min-[360px]:gap-3">
        <div className="flex items-center gap-2 min-[360px]:gap-2.5 min-w-0 shrink">
          <div className="w-8 h-8 rounded-xl bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center shadow-xs shrink-0">
            <Notebook className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-baseline gap-1.5 leading-none">
              <span className="font-serif text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100 whitespace-nowrap leading-tight">
                কাগজ
              </span>
              <span className="font-sans text-xs font-medium text-stone-500 dark:text-stone-400 whitespace-nowrap">
                Kagoj
              </span>
            </div>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 font-sans truncate leading-none mt-1">
              {props.totalNotes} {props.totalNotes === 1 ? 'note' : 'notes'} {props.pinnedCount > 0 ? `· ${props.pinnedCount} pinned` : ''}
            </p>
          </div>
        </div>
        <HeaderActions {...props} />
      </div>
    </header>
  );
}
