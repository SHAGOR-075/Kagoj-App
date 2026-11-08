import { Key, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

interface SetupScreenProps {
  onRegister: (setupKey?: string) => Promise<boolean>;
  error: string | null;
  onClearError: () => void;
}

export function SetupScreen({ onRegister, error, onClearError }: SetupScreenProps) {
  const [setupKey, setSetupKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleRegister = async () => {
    onClearError();
    setIsRegistering(true);
    try {
      await onRegister(setupKey.trim() || undefined);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#18181b] flex items-center justify-center p-6 text-[#1c1917] dark:text-[#f4efe8]">
      <div className="max-w-xs w-full text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40 dark:border-emerald-800/40 flex items-center justify-center">
          <ShieldCheck className="w-10 h-10" strokeWidth={1.5} />
        </div>

        <h1 className="text-xl font-bold font-serif mb-2 text-stone-900 dark:text-stone-100">
          Setup Biometric Lock
        </h1>
        <p className="text-xs text-stone-600 dark:text-stone-400 mb-6 font-sans leading-relaxed">
          Secure your notes with your phone's fingerprint, face unlock, or screen lock.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-800 dark:text-rose-300">
            {error.includes('enrolled') || error.includes('supported')
              ? 'Please enable a fingerprint, face unlock, or screen lock in your phone settings.'
              : error}
          </div>
        )}

        {showKeyInput && (
          <div className="mb-4 text-left">
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1">
              Setup Key (Optional for secondary devices)
            </label>
            <input
              type="password"
              value={setupKey}
              onChange={(e) => setSetupKey(e.target.value)}
              placeholder="Enter SETUP_KEY"
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
          </div>
        )}

        <button
          onClick={handleRegister}
          disabled={isRegistering}
          className="w-full py-3.5 px-6 rounded-2xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-sm font-semibold tracking-wide active:scale-[0.98] transition-all disabled:opacity-50 mb-3"
        >
          {isRegistering ? 'Registering...' : 'Register Fingerprint'}
        </button>

        {!showKeyInput && (
          <button
            onClick={() => setShowKeyInput(true)}
            className="text-xs text-stone-600 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 flex items-center justify-center gap-1.5 mx-auto"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Add new device with Setup Key</span>
          </button>
        )}
      </div>
    </div>
  );
}

