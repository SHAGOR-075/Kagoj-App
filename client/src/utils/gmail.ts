/**
 * Frontend Gmail validation and canonicalization.
 */

export function isValidGmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();

  // No spaces permitted
  if (/\s/.test(trimmed)) return false;

  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;
  if (!localPart || !domain) return false;

  if (domain.toLowerCase() !== 'gmail.com') return false;
  if (!/^[a-zA-Z0-9.+_-]+$/.test(localPart)) return false;

  return true;
}

export function canonicalizeGmail(email: string): string {
  if (!isValidGmail(email)) {
    throw new Error('Only valid @gmail.com email addresses are allowed.');
  }

  const [rawLocalPart] = email.trim().split('@');
  let cleanLocal = rawLocalPart.toLowerCase();

  const plusIndex = cleanLocal.indexOf('+');
  if (plusIndex !== -1) {
    cleanLocal = cleanLocal.slice(0, plusIndex);
  }

  cleanLocal = cleanLocal.replace(/\./g, '');
  return `${cleanLocal}@gmail.com`;
}

