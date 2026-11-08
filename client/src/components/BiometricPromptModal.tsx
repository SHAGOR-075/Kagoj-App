import { Fingerprint } from 'lucide-react';
import { useState } from 'react';

interface BiometricPromptModalProps {
  onEnable: () => Promise<void>;
  onDismiss: () => void;
}

export function BiometricPromptModal({ onEnable, onDismiss }: BiometricPromptModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnable = async () => {
    setLoading(true);
    setError(null);
    try {
      await onEnable();
    } catch (err: any) {
      setError(err.message || 'Failed to register biometric');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-6 text-[#1c1917] dark:text-[#f4efe8]">
      <div className="bg-[#FAF8F5] dark:bg-[#1E1D1C] border border-stone-300/80 dark:border-stone-800 rounded-3xl p-6 max-w-xs w-full text-center shadow-lg">
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
          <Fingerprint className="w-8 h-8" strokeWidth={1.5} />
        </div>
        <h2 className="text-lg font-bold font-serif mb-1">Protect with Fingerprint?</h2>
        <p className="text-xs text-stone-600 dark:text-stone-400 mb-4 leading-relaxed">
          Enable biometric lock for faster, more secure access next time you open Kagoj.
        </p>

        {error && <div className="mb-3 p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 rounded-xl text-xs">{error}</div>}

        <div className="space-y-2">
          <button onClick={handleEnable} disabled={loading} className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-xs font-semibold disabled:opacity-50">
            {loading ? 'Activating...' : 'Enable Fingerprint'}
          </button>
          <button onClick={onDismiss} disabled={loading} className="w-full py-2 text-xs text-stone-600 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300">
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

