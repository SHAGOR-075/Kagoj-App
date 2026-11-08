import { CheckCircle2, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { forgotPasswordApi, resetPasswordApi, verifyPasswordOtpApi } from '../services/auth';
import { isValidGmail } from '../utils/gmail';
import { validatePasswordStrength } from '../utils/password';
import { ForgotPasswordEmailStep } from './ForgotPasswordEmailStep';
import { ForgotPasswordNewPassStep } from './ForgotPasswordNewPassStep';
import { ForgotPasswordOtpStep } from './ForgotPasswordOtpStep';

interface ForgotPasswordProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function ForgotPasswordModal({ onClose, onSuccess }: ForgotPasswordProps) {
  const [step, setStep] = useState<'email' | 'otp' | 'newPassword' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cooldown, setCooldown] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (step !== 'otp' || cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [step, cooldown]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidGmail(email)) return setError('Only Gmail addresses (@gmail.com) are allowed.');
    setLoading(true);
    setError(null);
    try {
      await forgotPasswordApi(email);
      setCooldown(60);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    if (code.length !== 6) return;
    setLoading(true);
    setError(null);
    try {
      const res = await verifyPasswordOtpApi(email, code);
      setResetToken(res.resetToken);
      setStep('newPassword');
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return setError('Passwords do not match.');
    const check = validatePasswordStrength(newPassword, email);
    if (!check.valid) return setError(check.message);
    if (!resetToken) return setError('Session expired. Please request a new code.');

    setLoading(true);
    setError(null);
    try {
      await resetPasswordApi(resetToken, newPassword);
      setResetToken(null);
      setNewPassword('');
      setConfirmPassword('');
      setStep('done');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (idx: number, val: string) => {
    const next = [...otpDigits];
    if (val.length > 1) {
      val.replace(/\D/g, '').slice(0, 6).split('').forEach((ch, i) => { if (idx + i < 6) next[idx + i] = ch; });
      setOtpDigits(next);
      if (next.every(Boolean)) handleVerifyOtp(next.join(''));
      return;
    }
    next[idx] = val.replace(/\D/g, '');
    setOtpDigits(next);
    if (next.every(Boolean)) handleVerifyOtp(next.join(''));
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto text-[#1c1917] dark:text-[#f4efe8]">
      <div className="bg-[#FAF8F5] dark:bg-[#1E1D1C] border border-stone-300/80 dark:border-stone-800 rounded-3xl p-6 max-w-xs w-full relative shadow-xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200">
          <X className="w-4 h-4" />
        </button>

        {error && <div className="mb-4 p-2.5 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 rounded-xl text-xs">{error}</div>}

        {step === 'email' && (
          <ForgotPasswordEmailStep email={email} setEmail={setEmail} onSubmit={handleSendOtp} loading={loading} />
        )}
        {step === 'otp' && (
          <ForgotPasswordOtpStep
            email={email}
            digits={otpDigits}
            onChange={handleOtpChange}
            onVerify={() => handleVerifyOtp(otpDigits.join(''))}
            onResend={() => { setCooldown(60); forgotPasswordApi(email); }}
            onChangeEmail={() => setStep('email')}
            cooldown={cooldown}
            loading={loading}
          />
        )}
        {step === 'newPassword' && (
          <ForgotPasswordNewPassStep
            newPass={newPassword}
            setNewPass={setNewPassword}
            confirmPass={confirmPassword}
            setConfirmPass={setConfirmPassword}
            onSubmit={handleSavePassword}
            loading={loading}
          />
        )}
        {step === 'done' && (
          <div className="text-center py-2">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <h2 className="text-lg font-bold font-serif mb-1">Password Changed</h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-5">Your password has been updated. Please log in with your new password.</p>
            <button onClick={onSuccess} className="w-full py-2.5 rounded-xl bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 text-xs font-semibold">
              Return to Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
