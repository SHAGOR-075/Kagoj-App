// Error recovery view with friendly retry trigger.

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="py-16 px-4 text-center max-w-sm mx-auto">
      <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-base font-semibold text-stone-900 dark:text-stone-100 mb-1">
        Couldn't load notes
      </h3>
      <p className="text-xs text-stone-500 dark:text-stone-400 font-sans mb-4">
        {message || 'Something went wrong. Please check connection and try again.'}
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 text-xs font-medium active:scale-95 transition"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Retry
      </button>
    </div>
  );
}
