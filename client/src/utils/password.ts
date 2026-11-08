/**
 * Frontend password validation utility.
 */

export function validatePasswordStrength(password: string, email: string = ''): { valid: boolean; message: string } {
  if (!password) {
    return { valid: false, message: 'Password is required.' };
  }

  if (password.length < 8) {
    return { valid: false, message: 'Must be at least 8 characters long.' };
  }

  if (password.length > 72) {
    return { valid: false, message: 'Cannot exceed 72 characters.' };
  }

  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, message: 'Must contain both letters and numbers.' };
  }

  if (email) {
    const rawLocal = email.split('@')[0]?.toLowerCase().trim();
    if (rawLocal && password.toLowerCase().trim() === rawLocal) {
      return { valid: false, message: 'Cannot be identical to your email name.' };
    }
  }

  return { valid: true, message: 'Strong password.' };
}

