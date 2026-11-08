// Dialog guiding users on adding Kagoj to their home screen with clear dark mode contrast.

import { Share, PlusSquare, X } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  onNativeInstall?: () => void;
}

export function PWAInstallModal({
  isOpen,
  onClose,
  isIOS,
  onNativeInstall,
}: PWAInstallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#1f1e20] p-6 shadow-2xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-serif font-bold text-base text-stone-900 dark:text-white">Install Kagoj Notepad</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isIOS ? (
          <div className="space-y-3 text-xs text-stone-700 dark:text-stone-200 font-sans leading-relaxed mb-5">
            <p className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center font-bold shrink-0">1</span>
              <span>Tap the <strong className="inline-flex items-center gap-1">Share <Share className="w-3.5 h-3.5 inline" /></strong> button in Safari.</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center font-bold shrink-0">2</span>
              <span>Scroll down and tap <strong className="inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 inline" /> Add to Home Screen</strong>.</span>
            </p>
          </div>
        ) : (
          <p className="text-xs text-stone-600 dark:text-stone-200 font-sans leading-relaxed mb-5">
            Install this notepad on your device for instant launch, offline access, and a full-screen native experience.
          </p>
        )}

        <div className="flex gap-2.5">
          {!isIOS && onNativeInstall && (
            <button
              onClick={onNativeInstall}
              className="flex-1 h-11 rounded-xl bg-stone-900 text-stone-100 dark:bg-stone-100 dark:text-stone-900 font-semibold text-xs shadow-xs"
            >
              Install Now
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-600 font-semibold text-xs text-stone-800 dark:text-stone-100"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
