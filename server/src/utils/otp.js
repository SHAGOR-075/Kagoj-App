import crypto from 'crypto';

export function generateOtpCode() {
  // Cryptographically secure 6-digit number between 100000 and 999999
  return crypto.randomInt(100000, 1000000).toString();
}

export function hashOtpCode(code) {
  const secret = process.env.OTP_SECRET || 'kagoj-otp-secret-key-32-chars-long!';
  return crypto.createHmac('sha256', secret).update(String(code).trim()).digest('hex');
}

export function verifyOtpCode(providedCode, expectedHash) {
  if (!providedCode || !expectedHash) return false;
  try {
    const providedHash = hashOtpCode(providedCode);
    const a = Buffer.from(providedHash, 'hex');
    const b = Buffer.from(expectedHash, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

