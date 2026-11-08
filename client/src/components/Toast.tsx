// Notification toast with immediate Undo action and high-contrast dark mode.

import { RotateCcw, X } from 'lucide-react';
import { ToastState } from '../hooks/useToast';

interface ToastProps {
  toast: ToastState;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  if (!toast.visible) return null;

  return (
    <div className="fixed bottom-6 inset-x-4 z-50 flex justify-center pointer-events-none animate-fade-in">
      <div className="pointer-events-auto max-w-sm w-full bg-stone-900 text-stone-50 dark:bg-[#27262a] dark:text-stone-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 border border-stone-800 dark:border-stone-700">
        <span className="text-xs font-sans font-medium text-stone-100 dark:text-stone-100 truncate">
          {toast.message}
        </span>

        <div className="flex items-center gap-2 shrink-0">
          {toast.onUndo && (
            <button
              onClick={() => {
                toast.onUndo?.();
                onDismiss();
              }}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 dark:text-amber-300 rounded-lg active:scale-95 transition border border-amber-400/30"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Undo
            </button>
          )}

          <button
            onClick={onDismiss}
            aria-label="Dismiss notification"
            className="p-1 text-stone-400 hover:text-stone-200 dark:text-stone-400 dark:hover:text-stone-100 rounded-md transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
