// Hook to detect touch swipe-left and long-press gestures on mobile cards.

import { useRef } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onLongPress?: () => void;
}

export function useSwipe({ onSwipeLeft, onLongPress }: SwipeHandlers) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isSwiping = useRef(false);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    isSwiping.current = false;

    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        if (!isSwiping.current) onLongPress();
      }, 550);
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null || startY.current === null) return;
    const diffX = e.touches[0].clientX - startX.current;
    const diffY = e.touches[0].clientY - startY.current;

    if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
      isSwiping.current = true;
      if (longPressTimer.current) clearTimeout(longPressTimer.current);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (startX.current === null || startY.current === null) return;

    const diffX = e.changedTouches[0].clientX - startX.current;
    const diffY = e.changedTouches[0].clientY - startY.current;

    // Swipe left trigger (diffX < -50 and predominantly horizontal)
    if (diffX < -50 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
      onSwipeLeft?.();
    }

    startX.current = null;
    startY.current = null;
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
}
