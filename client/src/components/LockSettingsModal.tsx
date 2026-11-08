// Modal dialog for configuring App Lock, biometric authentication, and PIN.

import { Lock, X } from 'lucide-react';
import { useState } from 'react';
import { LockSetupForm } from './LockSetupForm';

interface LockSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLockEnabled: boolean;
  hasBiometrics: boolean;
  onEnableLock: (pin: string, useBio: boolean) => Promise<void>;
  onDisableLock: () => void;
}

export function LockSettingsModal({
  isOpen, onClose, isLockEnabled, hasBiometrics, onEnableLock, onDisableLock,
}: LockSettingsModalProps) {
  const [pin, setPin] = useState('');
  const [useBio, setUseBio] = useState(hasBiometrics);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (isLockEnabled) { onDisableLock(); onClose(); return; }
    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setError('Please enter a 4-digit numeric PIN.');
      return;
    }
    await onEnableLock(pin, useBio);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#1F1E20] p-6 shadow-2xl border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="font-serif font-bold text-base">App Privacy Lock</h3>
          </div>
          <button onClick={onClose} className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-stone-600 dark:text-stone-300 font-sans mb-4 leading-relaxed">
          {isLockEnabled
            ? 'App Lock is active. Your notes require biometric or PIN verification to open.'
            : 'Secure your notes with device biometrics (Face ID, Fingerprint) or a 4-digit PIN.'}
        </p>

        {!isLockEnabled && (
          <LockSetupForm
            pin={pin}
            onChangePin={(p) => { setError(null); setPin(p); }}
            useBio={useBio}
            onToggleBio={setUseBio}
            hasBiometrics={hasBiometrics}
            error={error}
          />
        )}

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl bg-stone-100 dark:bg-stone-800 text-xs font-semibold">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 h-11 rounded-xl text-xs font-semibold text-white transition ${isLockEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-stone-900 dark:bg-stone-100 dark:text-stone-900'}`}
          >
            {isLockEnabled ? 'Turn Off Lock' : 'Enable Lock'}
          </button>
        </div>
      </div>
    </div>
  );
}
