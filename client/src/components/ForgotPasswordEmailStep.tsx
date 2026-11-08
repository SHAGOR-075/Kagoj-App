import { KeyRound } from 'lucide-react';
import React from 'react';

interface Props {
  email: string;
  setEmail: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function ForgotPasswordEmailStep({ email, setEmail, onSubmit, loading }: Props) {
  return (
    <form onSubmit={onSubmit} className="text-center">
      <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
        <KeyRound className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-bold font-serif mb-1">Reset Password</h2>
      <p className="text-xs text-stone-600 dark:text-stone-400 mb-4">Enter your Gmail to receive an OTP.</p>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="yourname@gmail.com"
        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500/40 outline-none mb-3"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-xs font-semibold disabled:opacity-50"
      >
        {loading ? 'Sending OTP...' : 'Send OTP'}
      </button>
    </form>
  );
}

