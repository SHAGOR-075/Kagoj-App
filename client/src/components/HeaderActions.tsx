import { Grid, LayoutList, Lock, Moon, Sun, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ViewMode } from '../types/note';
import { HeaderOverflowMenu } from './HeaderOverflowMenu';
import { InstallButton } from './InstallButton';

interface HeaderActionsProps {
  viewMode: ViewMode;
  onToggleView: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  canInstall?: boolean;
  onInstall?: () => void;
  onOpenLockSettings: () => void;
  onLockNow: () => void;
}

const BTN_CLS = 'min-h-[44px] min-w-[44px] w-11 h-11 flex items-center justify-center rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/60 dark:hover:bg-stone-800 active:scale-95 transition';

export function HeaderActions({
  viewMode,
  onToggleView,
  isDark,
  onToggleTheme,
  canInstall = false,
  onInstall = () => {},
  onOpenLockSettings,
  onLockNow,
}: HeaderActionsProps) {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth < 340);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="flex items-center gap-0.5 min-[360px]:gap-1 shrink-0">
      <button
        onClick={onLockNow}
        title="Lock app now"
        aria-label="Lock app now"
        className="min-h-[44px] min-w-[44px] w-11 h-11 flex items-center justify-center rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 active:scale-95 transition"
      >
        <Lock className="w-5 h-5 stroke-[1.8]" />
      </button>

      <button onClick={onOpenLockSettings} title="Account Settings" aria-label="Account Settings" className={BTN_CLS}>
        <UserIcon className="w-5 h-5 stroke-[1.8]" />
      </button>

      <InstallButton canInstall={canInstall} onInstall={onInstall} />

      {isNarrow && canInstall ? (
        <HeaderOverflowMenu viewMode={viewMode} onToggleView={onToggleView} isDark={isDark} onToggleTheme={onToggleTheme} />
      ) : (
        <>
          <button onClick={onToggleView} title="Toggle view" aria-label="Toggle layout view" className={BTN_CLS}>
            {viewMode === 'grid' ? <LayoutList className="w-5 h-5 stroke-[1.8]" /> : <Grid className="w-5 h-5 stroke-[1.8]" />}
          </button>
          <button onClick={onToggleTheme} title="Toggle theme" aria-label="Toggle theme" className={BTN_CLS}>
            {isDark ? <Sun className="w-5 h-5 stroke-[1.8] text-amber-400" /> : <Moon className="w-5 h-5 stroke-[1.8]" />}
          </button>
        </>
      )}
    </div>
  );
}
