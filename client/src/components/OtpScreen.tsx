import { ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface OtpProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onSuccess?: () => void;
  onResend: () => Promise<void>;
  onChangeEmail: () => void;
  error?: string | null;
}

export function OtpScreen({ email, onVerify, onSuccess, onResend, onChangeEmail, error }: OtpProps) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [cooldown, setCooldown] = useState(60);
  const [verified, setVerified] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const submit = async (code: string) => {
    try {
      await onVerify(code);
      setVerified(true);
      setTimeout(() => { if (onSuccess) onSuccess(); }, 1000);
    } catch {}
  };

  const handleChange = (idx: number, val: string) => {
    if (val.length > 1) {
      const pasted = val.replace(/\D/g, '').slice(0, 6).split('');
      const next = [...digits];
      pasted.forEach((ch, i) => { if (idx + i < 6) next[idx + i] = ch; });
      setDigits(next);
      if (next.every(Boolean)) submit(next.join(''));
      return;
    }
    const next = [...digits];
    next[idx] = val.replace(/\D/g, '');
    setDigits(next);
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
    if (next.every(Boolean)) submit(next.join(''));
  };

  if (verified) {
    return (
      <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#18181b] flex items-center justify-center p-6 text-center">
        <div>
          <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-bold font-serif mb-1">Verified!</h1>
          <p className="text-xs text-stone-600 dark:text-stone-400">Opening your notepad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#18181b] flex items-center justify-center p-6 text-[#1c1917] dark:text-[#f4efe8]">
      <div className="max-w-xs w-full text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
          <KeyRound className="w-8 h-8" strokeWidth={1.5} />
        </div>
        <h1 className="text-xl font-bold font-serif mb-1">Enter Verification Code</h1>
        <p className="text-xs text-stone-600 dark:text-stone-400 mb-6">Sent to <span className="font-semibold">{email}</span></p>

        {error && <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-800 dark:text-rose-300 rounded-xl">{error}</div>}

        <div className="flex justify-between gap-2 mb-6">
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
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => e.key === 'Backspace' && !digits[i] && i > 0 && inputsRef.current[i - 1]?.focus()}
              className="w-11 h-13 text-center text-xl font-mono font-bold rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            />
          ))}
        </div>

        <button onClick={async () => { setCooldown(60); await onResend(); }} disabled={cooldown > 0} className="text-xs text-amber-700 dark:text-amber-400 font-medium disabled:opacity-50 mb-6 block mx-auto">
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend verification code'}
        </button>

        <button onClick={onChangeEmail} className="text-xs text-stone-600 dark:text-stone-400 flex items-center justify-center gap-1 mx-auto hover:underline">
          <ArrowLeft className="w-3.5 h-3.5" /> Change email address
        </button>
      </div>
    </div>
  );
}
