import { Download, Sparkles, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { isRunningAsInstalledApp } from '../utils/pwaDetect';

interface InstallBannerProps {
  canInstall: boolean;
  onInstall: () => void;
}

export function InstallBanner({ canInstall, onInstall }: InstallBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isRunningAsInstalledApp() || !canInstall || dismissed) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      if (!isRunningAsInstalledApp() && canInstall && !dismissed) {
        setIsVisible(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [canInstall, dismissed]);

  if (isRunningAsInstalledApp() || !canInstall || dismissed || !isVisible) {
    return null;
  }

  return (
    <div className="mx-3 sm:mx-4 mb-3 animate-fade-in select-none">
      <div className="max-w-3xl mx-auto rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-600/20 dark:border-amber-400/20 p-3 flex items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-600 text-amber-50 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 stroke-[2]" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 truncate">
              Install Kagoj Notepad
            </p>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 truncate">
              Instant launch & offline access
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onInstall}
            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={() => {
              setDismissed(true);
              setIsVisible(false);
            }}
            aria-label="Dismiss banner"
            className="min-h-[44px] min-w-[44px] w-11 h-11 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
