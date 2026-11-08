import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';
import { isValidGmail } from '../utils/gmail';
import { validatePasswordStrength } from '../utils/password';

interface AuthScreenProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onStartRegister: (email: string, pass: string, name: string) => Promise<void>;
  onForgotPassword: () => void;
}

export function AuthScreen({ onLogin, onStartRegister, onForgotPassword }: AuthScreenProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailInvalid = email.length > 0 && !isValidGmail(email);
  const passCheck = validatePasswordStrength(password, email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!isValidGmail(email)) {
      return setError('Only Gmail addresses (@gmail.com) are allowed.');
    }
    if (tab === 'register' && !passCheck.valid) {
      return setError(passCheck.message);
    }
    setLoading(true);
    try {
      if (tab === 'login') await onLogin(email, password);
      else await onStartRegister(email, password, displayName);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] dark:bg-[#18181b] flex items-center justify-center p-6 text-[#1c1917] dark:text-[#f4efe8]">
      <div className="max-w-xs w-full">
        <h1 className="text-2xl font-bold font-serif text-center mb-1">কাগজ (Kagoj)</h1>
        <p className="text-xs text-stone-600 dark:text-stone-400 text-center mb-6">Calm, private mobile stationery</p>

        <div className="flex bg-stone-200/60 dark:bg-stone-800 p-1 rounded-xl mb-6">
          <button onClick={() => { setTab('login'); setError(null); }} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${tab === 'login' ? 'bg-white dark:bg-stone-900 shadow-sm' : 'text-stone-600 dark:text-stone-400'}`}>Log in</button>
          <button onClick={() => { setTab('register'); setError(null); }} className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${tab === 'register' ? 'bg-white dark:bg-stone-900 shadow-sm' : 'text-stone-600 dark:text-stone-400'}`}>Register</button>
        </div>

        {error && <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-800 dark:text-rose-300">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'register' && (
            <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your Name (Optional)" className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500/40 outline-none" />
          )}

          <div>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="yourname@gmail.com" className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500/40 outline-none" />
            {emailInvalid && <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-1">Only Gmail addresses (@gmail.com) are allowed.</p>}
          </div>

          <div className="relative">
            <input type={showPass ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:ring-2 focus:ring-amber-500/40 outline-none pr-9" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-2.5 top-2.5 text-stone-600 dark:text-stone-400">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {tab === 'register' && (
            <div className="text-[11px] text-stone-600 dark:text-stone-400 px-1 leading-tight">
              Min 8 chars, 1 letter & 1 number. (Max 72).
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-xs font-semibold active:scale-[0.98] transition disabled:opacity-50 mt-2">
            {loading ? 'Please wait...' : tab === 'login' ? 'Log In' : 'Continue with Gmail'}
          </button>
        </form>

        {tab === 'login' && (
          <button onClick={onForgotPassword} className="block text-xs text-stone-600 dark:text-stone-400 hover:underline mx-auto mt-4">
            Forgot password?
          </button>
        )}
      </div>
    </div>
  );
}

