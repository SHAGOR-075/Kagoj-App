/**
 * Validates and canonicalizes Gmail addresses.
 *
 * Rules:
 * - Must end strictly with "@gmail.com" (case-insensitive).
 * - Reject googlemail.com, other domains, spaces, and multiple '@' characters.
 * - Canonicalize: lowercase, remove all dots from the local part, strip any "+tag" suffix.
 */

export function isValidGmail(email) {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();

  // No spaces permitted anywhere
  if (/\s/.test(trimmed)) return false;

  const parts = trimmed.split('@');
  if (parts.length !== 2) return false;

  const [localPart, domain] = parts;
  if (!localPart || !domain) return false;

  // Domain must be exactly "gmail.com" (case-insensitive)
  if (domain.toLowerCase() !== 'gmail.com') return false;

  // Valid local-part regex (standard RFC characters allowed before +)
  if (!/^[a-zA-Z0-9.+_-]+$/.test(localPart)) return false;

  return true;
}

export function canonicalizeGmail(email) {
  if (!isValidGmail(email)) {
    throw new Error('Invalid Gmail address. Only @gmail.com addresses are permitted.');
  }

  const [rawLocalPart] = email.trim().split('@');
  let cleanLocal = rawLocalPart.toLowerCase();

  // Strip +tag suffix (e.g. user+news -> user)
  const plusIndex = cleanLocal.indexOf('+');
  if (plusIndex !== -1) {
    cleanLocal = cleanLocal.slice(0, plusIndex);
  }

  // Remove all dots from the local part (e.g. j.o.h.n -> john)
  cleanLocal = cleanLocal.replace(/\./g, '');

  if (!cleanLocal) {
    throw new Error('Invalid Gmail username.');
  }

  return `${cleanLocal}@gmail.com`;
}

