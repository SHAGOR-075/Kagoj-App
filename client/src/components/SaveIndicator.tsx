// Visual indicator showing auto-save status.

export type SaveStatus = 'idle' | 'saving' | 'saved';

interface SaveIndicatorProps {
  status: SaveStatus;
}

export function SaveIndicator({ status }: SaveIndicatorProps) {
  if (status === 'idle') return null;

  return (
    <span
      className={`text-xs font-sans transition-opacity duration-200 ${
        status === 'saving'
          ? 'text-stone-400 dark:text-stone-500 animate-pulse'
          : 'text-stone-600 dark:text-stone-300 font-medium'
      }`}
    >
      {status === 'saving' ? 'Saving…' : 'Saved ✓'}
    </span>
  );
}
