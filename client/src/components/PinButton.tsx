// Pin button for pinning note to top.

import { Pin } from 'lucide-react';

interface PinButtonProps {
  pinned: boolean;
  onToggle: (e: React.MouseEvent) => void;
  className?: string;
}

export function PinButton({ pinned, onToggle, className = '' }: PinButtonProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={pinned ? 'Unpin note' : 'Pin note to top'}
      title={pinned ? 'Unpin note' : 'Pin note to top'}
      className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg transition-colors ${
        pinned
          ? 'text-amber-800 dark:text-amber-300'
          : 'text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-300'
      } ${className}`}
    >
      <Pin className={`w-3.5 h-3.5 ${pinned ? 'fill-current rotate-45' : ''}`} />
    </button>
  );
}
