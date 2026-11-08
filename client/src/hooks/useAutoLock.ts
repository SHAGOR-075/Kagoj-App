import { useEffect } from 'react';

export function useAutoLock(enabled: boolean, onLock: () => void) {
  useEffect(() => {
    let hideTime = 0;
    const handleVis = () => {
      if (document.visibilityState === 'hidden') {
        if (enabled) hideTime = Date.now();
      } else if (document.visibilityState === 'visible') {
        if (hideTime > 0 && enabled && Date.now() - hideTime >= 30000) {
          onLock();
        }
        hideTime = 0;
      }
    };
    document.addEventListener('visibilitychange', handleVis);
    return () => document.removeEventListener('visibilitychange', handleVis);
  }, [enabled, onLock]);
}

