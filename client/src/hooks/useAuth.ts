import { useCallback, useEffect, useState } from 'react';
import { setUnauthorizedHandler } from '../services/api';
import {
  disableBiometricApi, fetchMe, lockSessionApi, loginApi,
  logoutApi, registerBiometricPasskey, unlockWithBiometric,
  unlockWithPasswordApi, UserProfile,
} from '../services/auth';
import { clearAppData } from '../utils/cleanup';
import { useAutoLock } from './useAutoLock';

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);

  const checkSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const profile = await fetchMe();
      setUser(profile);
      setIsLocked(Boolean(profile.biometricEnabled && (profile.locked || true)));
    } catch {
      setUser(null);
      setIsLocked(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { checkSession(); }, [checkSession]);

  useEffect(() => {
    setUnauthorizedHandler((isLockedSession) => {
      if (isLockedSession && user?.biometricEnabled) setIsLocked(true);
      else { setUser(null); setIsLocked(false); }
    });
  }, [user]);

  const lock = useCallback(async () => {
    if (user?.biometricEnabled) {
      try { await lockSessionApi(); } catch {}
      setIsLocked(true);
    }
  }, [user?.biometricEnabled]);

  useAutoLock(Boolean(user?.biometricEnabled), lock);

  const setAuthenticatedUser = (profile: UserProfile) => {
    setUser(profile);
    setIsLocked(false);
    setError(null);
    if (!profile.biometricEnabled && !localStorage.getItem('kagoj_bio_prompt_dismissed')) {
      setShowBiometricPrompt(true);
    }
  };

  const login = async (email: string, pass: string) => {
    setError(null);
    const { user: profile } = await loginApi(email, pass);
    setAuthenticatedUser(profile);
  };

  const unlockBiometric = async () => {
    setError(null);
    try {
      await unlockWithBiometric();
      setIsLocked(false);
      return true;
    } catch (err: any) {
      setError(err.message || "Fingerprint didn't match, try again");
      return false;
    }
  };

  const unlockPassword = async (pass: string) => {
    setError(null);
    await unlockWithPasswordApi(pass);
    setIsLocked(false);
  };

  const logout = async () => {
    await logoutApi();
    clearAppData();
    setUser(null);
    setIsLocked(false);
  };

  const enableBiometric = async () => {
    await registerBiometricPasskey();
    setUser((prev) => (prev ? { ...prev, biometricEnabled: true } : null));
    setShowBiometricPrompt(false);
  };

  const disableBiometric = async (password: string) => {
    await disableBiometricApi(password);
    setUser((prev) => (prev ? { ...prev, biometricEnabled: false } : null));
    setIsLocked(false);
  };

  return {
    user,
    isAuthenticated: Boolean(user),
    isLocked: Boolean(user?.biometricEnabled && isLocked),
    isLoading,
    error,
    showBiometricPrompt,
    setAuthenticatedUser,
    login,
    unlockBiometric,
    unlockPassword,
    lock,
    logout,
    enableBiometric,
    disableBiometric,
    dismissBiometricPrompt: () => {
      localStorage.setItem('kagoj_bio_prompt_dismissed', 'true');
      setShowBiometricPrompt(false);
    },
    clearError: () => setError(null),
    refreshSession: checkSession,
  };
}
