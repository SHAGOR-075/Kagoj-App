// Form fields for configuring new PIN and biometric lock options.

import { Fingerprint } from 'lucide-react';

interface LockSetupFormProps {
  pin: string;
  onChangePin: (v: string) => void;
  useBio: boolean;
  onToggleBio: (v: boolean) => void;
  hasBiometrics: boolean;
  error: string | null;
}

export function LockSetupForm({
  pin, onChangePin, useBio, onToggleBio, hasBiometrics, error,
}: LockSetupFormProps) {
  return (
    <div className="space-y-3 mb-5">
      <div>
        <label className="text-xs font-semibold text-stone-700 dark:text-stone-200 block mb-1">Set 4-Digit PIN</label>
        <input
          type="password"
          maxLength={4}
          value={pin}
          onChange={(e) => onChangePin(e.target.value)}
          placeholder="••••"
          className="w-full h-11 px-3 text-center tracking-widest text-lg bg-stone-100 dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 focus:outline-none"
        />
      </div>
      {hasBiometrics && (
        <label className="flex items-center gap-2.5 text-xs text-stone-700 dark:text-stone-200 cursor-pointer pt-1">
          <input type="checkbox" checked={useBio} onChange={(e) => onToggleBio(e.target.checked)} className="rounded" />
          <Fingerprint className="w-4 h-4 text-stone-500" />
          <span>Enable Face ID / Fingerprint verification</span>
        </label>
      )}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
