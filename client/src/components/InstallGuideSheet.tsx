import { Compass, PlusSquare, Share, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isIosSafari: boolean;
}

export function InstallGuideSheet({ isOpen, onClose, isIosSafari }: Props) {
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4"
    >
      <div className="w-full max-w-sm rounded-t-3xl sm:rounded-3xl bg-[#FAF8F5] dark:bg-[#1E1D1C] border-t sm:border border-stone-300/80 dark:border-stone-800 p-6 shadow-2xl text-stone-900 dark:text-stone-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif font-bold text-base">Install Kagoj Notepad</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="min-h-[36px] min-w-[36px] flex items-center justify-center text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isIosSafari ? (
          <div className="space-y-3.5 text-xs text-stone-700 dark:text-stone-300 font-sans leading-relaxed mb-6">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-400 font-bold flex items-center justify-center shrink-0">1</span>
              <span>Tap the <strong className="inline-flex items-center gap-1 font-semibold">Share <Share className="w-3.5 h-3.5 inline text-amber-700 dark:text-amber-400" /></strong> button in Safari's toolbar.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-400 font-bold flex items-center justify-center shrink-0">2</span>
              <span>Scroll down and tap <strong className="inline-flex items-center gap-1 font-semibold">Add to Home Screen <PlusSquare className="w-3.5 h-3.5 inline text-amber-700 dark:text-amber-400" /></strong>.</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-800 dark:text-amber-400 font-bold flex items-center justify-center shrink-0">3</span>
              <span>Tap <strong className="font-semibold">Add</strong> in the top right corner.</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-2 mb-6">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Open this page in <strong>Safari</strong> on your iPhone or iPad to install Kagoj to your home screen.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 text-xs font-semibold active:scale-[0.98] transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
