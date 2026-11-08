import { Fingerprint, Lock, LogOut, X } from 'lucide-react';
import React, { useState } from 'react';
import { UserProfile } from '../services/auth';

interface AccountSettingsModalProps {
  user: UserProfile;
  onClose: () => void;
  onLockNow: () => void;
  onLogout: () => void;
  onEnableBiometric: () => Promise<void>;
  onDisableBiometric: (password: string) => Promise<void>;
}

export function AccountSettingsModal({
  user,
  onClose,
  onLockNow,
  onLogout,
  onEnableBiometric,
  onDisableBiometric,
}: AccountSettingsModalProps) {
  const [password, setPassword] = useState('');
  const [showDisablePass, setShowDisablePass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    setError(null);
    if (!user.biometricEnabled) {
      setLoading(true);
      try {
        await onEnableBiometric();
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      setShowDisablePass(true);
    }
  };

  const handleConfirmDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onDisableBiometric(password);
      setShowDisablePass(false);
      setPassword('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-6 text-[#1c1917] dark:text-[#f4efe8]">
      <div className="bg-[#FAF8F5] dark:bg-[#1E1D1C] border border-stone-300/80 dark:border-stone-800 rounded-3xl p-6 max-w-xs w-full shadow-lg relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-stone-600 dark:text-stone-400">
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-lg font-bold font-serif mb-1">Account & Security</h2>
        <p className="text-xs text-stone-600 dark:text-stone-400 mb-4">{user.email}</p>

        {error && <div className="mb-3 p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 rounded-xl text-xs">{error}</div>}

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              <Fingerprint className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <div>
                <div className="text-xs font-semibold">Biometric Lock</div>
                <div className="text-[10px] text-stone-600 dark:text-stone-400">Fingerprint or Face ID</div>
              </div>
            </div>
            <button
              onClick={handleToggle}
              disabled={loading}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                user.biometricEnabled ? 'bg-amber-600' : 'bg-stone-300 dark:bg-stone-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition ${
                  user.biometricEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {showDisablePass && (
            <form onSubmit={handleConfirmDisable} className="p-3 bg-stone-100 dark:bg-stone-900/60 rounded-xl space-y-2">
              <div className="text-[11px] font-semibold">Confirm account password to disable:</div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 text-xs bg-white dark:bg-stone-900" />
              <button type="submit" disabled={loading} className="w-full py-1.5 bg-rose-600 text-white rounded-lg text-xs font-semibold">
                Confirm Disable
              </button>
            </form>
          )}

          <div className="pt-2 border-t border-stone-200 dark:border-stone-800 space-y-2">
            <button
              onClick={() => { onClose(); onLockNow(); }}
              className="w-full py-2.5 px-3 rounded-xl border border-stone-300 dark:border-stone-700 flex items-center justify-center gap-2 text-xs font-semibold hover:bg-stone-200/50"
            >
              <Lock className="w-3.5 h-3.5" /> Lock App Now
            </button>
            <button
              onClick={() => { onClose(); onLogout(); }}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 flex items-center justify-center gap-2 text-xs font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" /> Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

