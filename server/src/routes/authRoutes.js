import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  disableBiometrics,
  forgotPassword,
  getBiometricRegisterOptions,
  getBiometricUnlockOptions,
  getMe,
  lockSession,
  login,
  logout,
  resendRegisterOtp,
  resetPassword,
  startRegister,
  unlockWithPassword,
  verifyBiometricRegister,
  verifyBiometricUnlock,
  verifyPasswordOtp,
  verifyRegister,
} from '../controllers/authController.js';
import { mobileOnly } from '../middleware/mobileOnly.js';
import { requireSession } from '../middleware/requireAuth.js';

const router = express.Router();

// Strict rate limiter on authentication endpoints (50 requests per 15 minutes per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again later.' },
});

router.use(authLimiter);

// 1. Registration routes (Mobile only)
router.post('/register/start', mobileOnly, startRegister);
router.post('/register/verify', mobileOnly, verifyRegister);
router.post('/register/resend', mobileOnly, resendRegisterOtp);

// 2. Login & Logout routes (Mobile only for login)
router.post('/login', mobileOnly, login);
router.post('/logout', logout);

// 3. Password reset routes (Mobile only)
router.post('/password/forgot', mobileOnly, forgotPassword);
router.post('/password/verify-otp', mobileOnly, verifyPasswordOtp);
router.post('/password/reset', mobileOnly, resetPassword);

// 4. Current user profile
router.get('/me', requireSession, getMe);

// 5. App lock & unlock state
router.post('/lock', requireSession, lockSession);
router.post('/unlock-with-password', requireSession, unlockWithPassword);

// 6. Biometric Passkey routes (Mobile only + session required)
router.post('/biometric/register/options', mobileOnly, requireSession, getBiometricRegisterOptions);
router.post('/biometric/register/verify', mobileOnly, requireSession, verifyBiometricRegister);
router.post('/biometric/unlock/options', mobileOnly, requireSession, getBiometricUnlockOptions);
router.post('/biometric/unlock/verify', mobileOnly, requireSession, verifyBiometricUnlock);
router.delete('/biometric', requireSession, disableBiometrics);

export default router;
