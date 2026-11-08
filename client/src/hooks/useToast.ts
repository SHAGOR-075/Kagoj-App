// Hook for managing auto-expiring toast with optional undo action.

import { useCallback, useRef, useState } from 'react';

export interface ToastState {
  message: string;
  onUndo?: () => void;
  visible: boolean;
}

export function useToast(duration: number = 5000) {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    visible: false,
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((message: string, onUndo?: () => void) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, onUndo, visible: true });

    timerRef.current = setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, duration);
  }, [duration]);

  const dismissToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast((prev) => ({ ...prev, visible: false }));
  }, []);

  return { toast, showToast, dismissToast };
}
