import { Eye, EyeOff, Lock } from 'lucide-react';
import React, { useState } from 'react';

interface Props {
  newPass: string;
  setNewPass: (v: string) => void;
  confirmPass: string;
  setConfirmPass: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function ForgotPasswordNewPassStep({ newPass, setNewPass, confirmPass, setConfirmPass, onSubmit, loading }: Props) {
  const [showPass, setShowPass] = useState(false);

  return (
    <form onSubmit={onSubmit} className="text-center">
      <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-500/10 text-amber-700 dark:text-amber-400 flex items-center justify-center">
        <Lock className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <h2 className="text-lg font-bold font-serif mb-1">New Password</h2>
      <p className="text-xs text-stone-600 dark:text-stone-400 mb-4">Min 8 chars, 1 letter & 1 number.</p>
      <div className="relative mb-2">
        <input
          type={showPass ? 'text' : 'password'}
          required
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          placeholder="New password"
          className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500/40 outline-none pr-8"
        />
        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2.5 top-2.5 text-stone-400">
          {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      <input
        type={showPass ? 'text' : 'password'}
        required
        value={confirmPass}
        onChange={(e) => setConfirmPass(e.target.value)}
        placeholder="Confirm password"
        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500/40 outline-none mb-3"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-xs font-semibold disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save New Password'}
      </button>
    </form>
  );
}

