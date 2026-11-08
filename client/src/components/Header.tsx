// Top navigation bar with brand identity, note counts, and action controls.

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
  isInstallable?: boolean;
  onInstall?: () => void;
  isLockEnabled?: boolean;
  onOpenLockSettings: () => void;
  onLockNow: () => void;
}

export function Header(props: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 backdrop-blur-md bg-[#fbfbfa]/90 dark:bg-[#18181b]/90 border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-3xl mx-auto px-4 h-15 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 flex items-center justify-center shadow-xs">
            <Notebook className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-lg font-bold tracking-tight text-stone-900 dark:text-stone-100">কাগজ</span>
              <span className="font-sans text-xs font-medium text-stone-500 dark:text-stone-400">Kagoj</span>
            </div>
            <p className="text-[11px] text-stone-400 dark:text-stone-500 font-sans -mt-0.5">
              {props.totalNotes} {props.totalNotes === 1 ? 'note' : 'notes'} {props.pinnedCount > 0 ? `· ${props.pinnedCount} pinned` : ''}
            </p>
          </div>
        </div>
        <HeaderActions {...props} />
      </div>
    </header>
  );
}
