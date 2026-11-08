import { ArrowLeft } from 'lucide-react';
import React, { useRef } from 'react';

interface Props {
  email: string;
  digits: string[];
  onChange: (idx: number, val: string) => void;
  onVerify: () => void;
  onResend: () => void;
  onChangeEmail: () => void;
  cooldown: number;
  loading: boolean;
}

export function ForgotPasswordOtpStep({ email, digits, onChange, onVerify, onResend, onChangeEmail, cooldown, loading }: Props) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <div className="text-center">
      <h2 className="text-lg font-bold font-serif mb-1">Enter Reset Code</h2>
      <p className="text-xs text-stone-600 dark:text-stone-400 mb-4">Sent to <span className="font-semibold">{email}</span></p>
      <div className="flex justify-between gap-1.5 mb-4">
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={6}
            value={d}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => e.key === 'Backspace' && !digits[i] && i > 0 && inputsRef.current[i - 1]?.focus()}
            className="w-10 h-12 text-center text-lg font-mono font-bold rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
          />
        ))}
      </div>
      <button onClick={onVerify} disabled={loading || !digits.every(Boolean)} className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-xs font-semibold disabled:opacity-50 mb-3">
        {loading ? 'Verifying...' : 'Verify Code'}
      </button>
      <button onClick={onResend} disabled={cooldown > 0} className="text-xs text-amber-700 dark:text-amber-400 font-medium disabled:opacity-50 block mx-auto mb-2">
        {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
      </button>
      <button onClick={onChangeEmail} className="text-xs text-stone-500 flex items-center justify-center gap-1 mx-auto hover:underline">
        <ArrowLeft className="w-3 h-3" /> Change email
      </button>
    </div>
  );
}

