// Action buttons for Header: app lock, settings, PWA install, view toggle, and theme switch.

import { Download, Grid, LayoutList, Lock, Moon, Sun, User as UserIcon } from 'lucide-react';
import { ViewMode } from '../types/note';

interface HeaderActionsProps {
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

export function HeaderActions({
  viewMode,
  onToggleView,
  isDark,
  onToggleTheme,
  isInstallable,
  onInstall,
  onOpenLockSettings,
  onLockNow,
}: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-0.5">
      <button
        onClick={onLockNow}
        title="Lock app now"
        aria-label="Lock app now"
        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition"
      >
        <Lock className="w-4 h-4" />
      </button>

      <button
        onClick={onOpenLockSettings}
        title="Account & Security Settings"
        aria-label="Account Settings"
        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition"
      >
        <UserIcon className="w-4 h-4" />
      </button>

      {isInstallable && (
        <button
          onClick={onInstall}
          title="Install App"
          aria-label="Install App"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition"
        >
          <Download className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={onToggleView}
        title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to 2-column grid'}
        aria-label="Toggle layout view"
        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition"
      >
        {viewMode === 'grid' ? <LayoutList className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
      </button>

      <button
        onClick={onToggleTheme}
        title={isDark ? 'Switch to light paper' : 'Switch to night mode'}
        aria-label="Toggle theme"
        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition"
      >
        {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
      </button>
    </div>
  );
}
