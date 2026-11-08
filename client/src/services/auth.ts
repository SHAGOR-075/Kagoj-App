import {
  startAuthentication,
  startRegistration,
} from '@simplewebauthn/browser';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface UserProfile {
  email: string;
  displayName: string;
  biometricEnabled: boolean;
  locked?: boolean;
}

async function authFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/auth${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

export async function fetchMe(): Promise<UserProfile> {
  return authFetch<UserProfile>('/me');
}

export async function startRegistrationApi(email: string, password: string, displayName?: string): Promise<{ debugOtp?: string }> {
  return authFetch<{ debugOtp?: string }>('/register/start', {
    method: 'POST',
    body: JSON.stringify({ email, password, displayName }),
  });
}

export async function verifyRegistrationApi(email: string, otp: string): Promise<{ user: UserProfile }> {
  return authFetch<{ user: UserProfile }>('/register/verify', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
}

export async function resendRegisterOtpApi(email: string): Promise<{ debugOtp?: string }> {
  return authFetch<{ debugOtp?: string }>('/register/resend', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function loginApi(email: string, password: string): Promise<{ user: UserProfile }> {
  return authFetch<{ user: UserProfile }>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function forgotPasswordApi(email: string): Promise<{ debugOtp?: string }> {
  return authFetch<{ debugOtp?: string }>('/password/forgot', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function verifyPasswordOtpApi(email: string, otp: string): Promise<{ resetToken: string }> {
  return authFetch<{ resetToken: string }>('/password/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
}

export async function resetPasswordApi(resetToken: string, newPassword: string): Promise<void> {
  await authFetch('/password/reset', {
    method: 'POST',
    body: JSON.stringify({ resetToken, newPassword }),
  });
}

export async function logoutApi(): Promise<void> {
  try {
    await authFetch('/logout', { method: 'POST' });
  } catch {
    // Ignore network error on logout
  }
}

export async function lockSessionApi(): Promise<void> {
  await authFetch('/lock', { method: 'POST' });
}

export async function unlockWithPasswordApi(password: string): Promise<void> {
  await authFetch('/unlock-with-password', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export async function registerBiometricPasskey(): Promise<void> {
  const optionsJSON = await authFetch<any>('/biometric/register/options', {
    method: 'POST',
  });
  const regResponse = await startRegistration({ optionsJSON });
  await authFetch('/biometric/register/verify', {
    method: 'POST',
    body: JSON.stringify(regResponse),
  });
}

export async function unlockWithBiometric(): Promise<void> {
  const optionsJSON = await authFetch<any>('/biometric/unlock/options', {
    method: 'POST',
  });
  const authResponse = await startAuthentication({ optionsJSON });
  await authFetch('/biometric/unlock/verify', {
    method: 'POST',
    body: JSON.stringify(authResponse),
  });
}

export async function disableBiometricApi(password: string): Promise<void> {
  await authFetch('/biometric', {
    method: 'DELETE',
    body: JSON.stringify({ password }),
  });
}
