// Non-intrusive offline connectivity banner.

import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  if (isOnline) return null;

  return (
    <div className="bg-amber-100 dark:bg-amber-950/80 border-b border-amber-200 dark:border-amber-900/60 px-4 py-2 text-center text-xs font-sans text-amber-900 dark:text-amber-200 flex items-center justify-center gap-2 transition-all">
      <WifiOff className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
      <span>Offline mode active. Notes are saved locally on this device.</span>
    </div>
  );
}
