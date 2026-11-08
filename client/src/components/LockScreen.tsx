import { Fingerprint, Key } from 'lucide-react';
import React, { useState } from 'react';

interface LockScreenProps {
  onUnlockBiometric: () => Promise<boolean>;
  onUnlockPassword: (password: string) => Promise<void>;
  error: string | null;
  onClearError: () => void;
}

export function LockScreen({ onUnlockBiometric, onUnlockPassword, error, onClearError }: LockScreenProps) {
  const [usePassword, setUsePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [verifying, setVerifying] = useState(false);

  const handleBio = async () => {
    onClearError();
    setVerifying(true);
    try {
      await onUnlockBiometric();
    } finally {
      setVerifying(false);
    }
  };

  const handlePass = async (e: React.FormEvent) => {
    e.preventDefault();
    onClearError();
    setVerifying(true);
    try {
      await onUnlockPassword(password);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#18181b] flex items-center justify-center p-6 text-[#1c1917] dark:text-[#f4efe8]">
      <div className="max-w-xs w-full text-center">
        {!usePassword ? (
          <>
            <button onClick={handleBio} disabled={verifying} className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-300/40 dark:border-amber-700/40 flex items-center justify-center active:scale-95 transition-all shadow-sm">
              <Fingerprint className={`w-12 h-12 ${verifying ? 'animate-pulse' : ''}`} strokeWidth={1.4} />
            </button>
            <h1 className="text-xl font-bold font-serif mb-1">কাগজ Locked</h1>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-6">Touch the sensor to unlock</p>
            {error && <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 rounded-xl text-xs">{error}</div>}
            <button onClick={handleBio} disabled={verifying} className="w-full py-3.5 rounded-2xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-xs font-semibold mb-3">
              {verifying ? 'Verifying...' : 'Unlock with Fingerprint'}
            </button>
            <button onClick={() => setUsePassword(true)} className="text-xs text-stone-600 dark:text-stone-400 flex items-center justify-center gap-1 mx-auto hover:underline">
              <Key className="w-3.5 h-3.5" /> Use password instead
            </button>
          </>
        ) : (
          <form onSubmit={handlePass}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Key className="w-8 h-8" strokeWidth={1.4} />
            </div>
            <h1 className="text-xl font-bold font-serif mb-1">Enter Password</h1>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-6">Unlock using your account password</p>
            {error && <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 rounded-xl text-xs">{error}</div>}
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500/40 outline-none mb-3" />
            <button type="submit" disabled={verifying} className="w-full py-3 rounded-2xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-xs font-semibold mb-3">
              {verifying ? 'Verifying...' : 'Unlock'}
            </button>
            <button type="button" onClick={() => setUsePassword(false)} className="text-xs text-stone-600 dark:text-stone-400 flex items-center justify-center gap-1 mx-auto hover:underline">
              <Fingerprint className="w-3.5 h-3.5" /> Use biometric unlock
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
