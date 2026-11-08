import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Challenge } from '../models/Challenge.js';
import { Credential } from '../models/Credential.js';
import { Otp } from '../models/Otp.js';
import { ResetToken } from '../models/ResetToken.js';
import { User } from '../models/User.js';
import { encryptDek, generateDek } from '../services/crypto.js';
import { sendOtpEmail } from '../services/mailer.js';
import { canonicalizeGmail, isValidGmail } from '../utils/gmail.js';
import { generateOtpCode, hashOtpCode, verifyOtpCode } from '../utils/otp.js';
import { validatePassword } from '../utils/password.js';

export function getJwtSecret() {
  return process.env.JWT_SECRET || 'kagoj-super-secret-jwt-key-change-me';
}
const DUMMY_HASH = '$2a$12$e80yq206eZ88e7jN9Y9z8.yE9e9e9e9e9e9e9e9e9e9e9e9e9e9e9';

export function getCookieOptions() {
  const isHttps =
    (process.env.CLIENT_URL && process.env.CLIENT_URL.startsWith('https:')) ||
    process.env.NODE_ENV === 'production' ||
    Boolean(process.env.VERCEL);
  return {
    httpOnly: true,
    secure: Boolean(isHttps),
    sameSite: isHttps ? 'none' : 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/',
  };
}

export function issueSessionCookie(res, user, locked = false) {
  const token = jwt.sign(
    { userId: user._id, tokenVersion: user.tokenVersion, locked },
    getJwtSecret(),
    { expiresIn: '30d' }
  );
  res.cookie('token', token, getCookieOptions());
  return token;
}

export function getRpConfig() {
  const rpID = process.env.RP_ID || 'localhost';
  const rpName = process.env.RP_NAME || 'Kagoj Quick Notes';
  const origin = process.env.ORIGIN || process.env.CLIENT_URL || 'http://localhost:3000';
  return { rpID, rpName, origin };
}

// POST /api/auth/register/start
export async function startRegister(req, res, next) {
  try {
    const { email, password, displayName } = req.body;

    if (!isValidGmail(email)) {
      return res.status(400).json({
        message: 'Invalid email. Only valid Gmail addresses (@gmail.com) are permitted.',
      });
    }

    const canonicalEmail = canonicalizeGmail(email);
    const passCheck = validatePassword(password, canonicalEmail);
    if (!passCheck.valid) {
      return res.status(400).json({ message: passCheck.message });
    }

    // Check if user is already registered (generic response to prevent enumeration)
    const existingUser = await User.findOne({ email: canonicalEmail });
    if (existingUser) {
      return res.json({
        success: true,
        message: 'If this email is eligible, a verification code was sent to your Gmail.',
      });
    }

    // Rate limits: max 5 OTPs per email per hour
    const oneHourAgo = new Date(Date.now() - 3600 * 1000);
    const hourlyCount = await Otp.countDocuments({
      email: canonicalEmail,
      createdAt: { $gte: oneHourAgo },
    });
    if (hourlyCount >= 5) {
      return res.status(429).json({
        message: 'Too many verification code requests. Please wait an hour before trying again.',
      });
    }

    // 60-second resend cooldown check
    const recentOtp = await Otp.findOne({ email: canonicalEmail, purpose: 'register' }).sort({
      createdAt: -1,
    });
    if (recentOtp && recentOtp.resendAvailableAt > new Date()) {
      const waitSec = Math.ceil((recentOtp.resendAvailableAt.getTime() - Date.now()) / 1000);
      return res.status(429).json({
        message: `Please wait ${waitSec}s before requesting another verification code.`,
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const otpCode = generateOtpCode();
    const codeHash = hashOtpCode(otpCode);

    // Delete existing registration OTPs for this email and save the new one
    await Otp.deleteMany({ email: canonicalEmail, purpose: 'register' });
    await Otp.create({
      email: canonicalEmail,
      purpose: 'register',
      codeHash,
      pendingSignup: {
        passwordHash,
        displayName: displayName?.trim() || '',
      },
    });

    await sendOtpEmail(canonicalEmail, otpCode, 'register');

    const response = {
      success: true,
      message: 'Verification code sent to your Gmail.',
    };

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_OTP === 'true') {
      response.debugOtp = otpCode;
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/register/verify
export async function verifyRegister(req, res, next) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP code are required.' });
    }

    const canonicalEmail = canonicalizeGmail(email);
    const otpDoc = await Otp.findOne({ email: canonicalEmail, purpose: 'register' });
    if (!otpDoc) {
      return res.status(400).json({
        message: 'Verification code has expired or is invalid. Please request a new one.',
      });
    }

    if (!verifyOtpCode(otp, otpDoc.codeHash)) {
      otpDoc.attempts += 1;
      if (otpDoc.attempts >= 5) {
        await Otp.deleteOne({ _id: otpDoc._id });
        return res.status(400).json({
          message: 'Too many incorrect attempts. Code invalidated. Please request a new code.',
        });
      }
      await otpDoc.save();
      const remaining = 5 - otpDoc.attempts;
      return res.status(400).json({
        message: `Incorrect code. ${remaining} attempt${remaining === 1 ? '' : 's'} remaining.`,
      });
    }

    // Code verified: create user account with encrypted DEK
    let user = await User.findOne({ email: canonicalEmail });
    if (!user) {
      const userId = new mongoose.Types.ObjectId();
      const rawDek = generateDek();
      const enc = encryptDek(rawDek, userId);
      user = await User.create({
        _id: userId,
        email: canonicalEmail,
        displayName: otpDoc.pendingSignup?.displayName || '',
        passwordHash: otpDoc.pendingSignup?.passwordHash,
        tokenVersion: 0,
        biometricEnabled: false,
        encDek: enc.encDek,
        dekIv: enc.dekIv,
        dekTag: enc.dekTag,
        keyVersion: enc.keyVersion,
      });
    }

    // Delete OTP document
    await Otp.deleteOne({ _id: otpDoc._id });

    // Issue 30-day session cookie
    const token = issueSessionCookie(res, user, false);

    res.status(201).json({
      success: true,
      token,
      user: {
        email: user.email,
        displayName: user.displayName,
        biometricEnabled: user.biometricEnabled,
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/register/resend
export async function resendRegisterOtp(req, res, next) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const canonicalEmail = canonicalizeGmail(email);
    const otpDoc = await Otp.findOne({ email: canonicalEmail, purpose: 'register' });
    if (!otpDoc) {
      return res.status(400).json({
        message: 'No pending registration found for this email. Please register again.',
      });
    }

    if (otpDoc.resendAvailableAt > new Date()) {
      const waitSec = Math.ceil((otpDoc.resendAvailableAt.getTime() - Date.now()) / 1000);
      return res.status(429).json({
        message: `Please wait ${waitSec}s before requesting a new code.`,
      });
    }

    const otpCode = generateOtpCode();
    otpDoc.codeHash = hashOtpCode(otpCode);
    otpDoc.attempts = 0;
    otpDoc.resendAvailableAt = new Date(Date.now() + 60 * 1000);
    otpDoc.createdAt = new Date();
    await otpDoc.save();

    await sendOtpEmail(canonicalEmail, otpCode, 'register');

    const response = {
      success: true,
      message: 'New verification code sent to your Gmail.',
    };

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_OTP === 'true') {
      response.debugOtp = otpCode;
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!isValidGmail(email)) {
      await bcrypt.compare(password || '', DUMMY_HASH);
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }

    const canonicalEmail = canonicalizeGmail(email);
    const user = await User.findOne({ email: canonicalEmail });

    // Dummy compare prevents timing attacks when user does not exist
    if (!user) {
      await bcrypt.compare(password || '', DUMMY_HASH);
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }

    // Check account temporary lock
    if (user.lockUntil && user.lockUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockUntil.getTime() - Date.now()) / 60000);
      return res.status(423).json({
        message: `Account is temporarily locked due to multiple failed login attempts. Try again in ${minutesLeft} minute${minutesLeft === 1 ? '' : 's'}.`,
      });
    }

    const match = await bcrypt.compare(password || '', user.passwordHash);
    if (!match) {
      user.failedLogins += 1;
      if (user.failedLogins >= 5) {
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min lock
        user.failedLogins = 0;
      }
      await user.save();
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }

    // Reset failed attempts on success
    user.failedLogins = 0;
    user.lockUntil = null;
    await user.save();

    // Issue 30-day session cookie (unlocked initially)
    const token = issueSessionCookie(res, user, false);

    res.json({
      success: true,
      token,
      user: {
        email: user.email,
        displayName: user.displayName,
        biometricEnabled: user.biometricEnabled,
      },
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/password/forgot
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const genericResponse = {
      success: true,
      message: 'If this email is registered, we sent a verification code.',
    };

    if (!isValidGmail(email)) {
      return res.json(genericResponse);
    }

    const canonicalEmail = canonicalizeGmail(email);
    const user = await User.findOne({ email: canonicalEmail });
    if (!user) {
      return res.json(genericResponse);
    }

    // Cooldown check (60s)
    const existingOtp = await Otp.findOne({ email: canonicalEmail, purpose: 'reset' });
    if (existingOtp && existingOtp.resendAvailableAt && existingOtp.resendAvailableAt > new Date()) {
      const waitSec = Math.ceil((existingOtp.resendAvailableAt.getTime() - Date.now()) / 1000);
      return res.status(429).json({
        message: `Please wait ${waitSec}s before requesting a new code.`,
      });
    }

    // Hourly rate limit (5 per hour)
    const oneHourAgo = new Date(Date.now() - 3600 * 1000);
    const count = await Otp.countDocuments({
      email: canonicalEmail,
      createdAt: { $gte: oneHourAgo },
    });
    if (count >= 5) {
      return res.status(429).json({
        message: 'Too many requests. Please try again in an hour.',
      });
    }

    const otpCode = generateOtpCode();
    await Otp.deleteMany({ email: canonicalEmail, purpose: 'reset' });
    await Otp.create({
      email: canonicalEmail,
      purpose: 'reset',
      codeHash: hashOtpCode(otpCode),
      resendAvailableAt: new Date(Date.now() + 60 * 1000),
      createdAt: new Date(),
    });

    await sendOtpEmail(canonicalEmail, otpCode, 'reset');

    if (process.env.NODE_ENV === 'development' && process.env.DEBUG_OTP === 'true') {
      genericResponse.debugOtp = otpCode;
    }

    res.json(genericResponse);
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/password/verify-otp
export async function verifyPasswordOtp(req, res, next) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP code are required.' });
    }

    const canonicalEmail = canonicalizeGmail(email);
    const otpDoc = await Otp.findOne({ email: canonicalEmail, purpose: 'reset' });
    if (!otpDoc) {
      return res.status(400).json({
        message: 'Verification code has expired or is invalid. Please request a new one.',
      });
    }

    if (!verifyOtpCode(otp, otpDoc.codeHash)) {
      otpDoc.attempts += 1;
      if (otpDoc.attempts >= 5) {
        await Otp.deleteOne({ _id: otpDoc._id });
        return res.status(400).json({
          message: 'Too many incorrect attempts. Code invalidated. Please request a new one.',
        });
      }
      await otpDoc.save();
      const rem = 5 - otpDoc.attempts;
      return res.status(400).json({
        message: `Incorrect code. ${rem} attempt${rem === 1 ? '' : 's'} remaining.`,
      });
    }

    const user = await User.findOne({ email: canonicalEmail });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Delete single-use OTP
    await Otp.deleteOne({ _id: otpDoc._id });

    // Generate 32-byte single-use resetToken
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    await ResetToken.deleteMany({ userId: user._id });
    await ResetToken.create({
      tokenHash,
      userId: user._id,
      email: canonicalEmail,
    });

    res.json({
      success: true,
      resetToken,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/password/reset
export async function resetPassword(req, res, next) {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({ message: 'Reset token and new password are required.' });
    }

    const tokenHash = crypto.createHash('sha256').update(String(resetToken).trim()).digest('hex');
    const tokenDoc = await ResetToken.findOne({ tokenHash });
    if (!tokenDoc) {
      return res.status(400).json({
        message: 'Invalid or expired reset token. Please request a new code.',
      });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const passCheck = validatePassword(newPassword, user.email);
    if (!passCheck.valid) {
      return res.status(400).json({ message: passCheck.message });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.tokenVersion += 1; // Invalidate all existing sessions / devices!
    user.failedLogins = 0;
    user.lockUntil = null;
    await user.save();

    // Delete single-use reset token
    await ResetToken.deleteOne({ _id: tokenDoc._id });

    res.json({
      success: true,
      message: 'Password reset successful. Please log in with your new password.',
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/logout
export async function logout(req, res) {
  res.clearCookie('token', getCookieOptions());
  res.json({ success: true, message: 'Logged out' });
}

// GET /api/auth/me
export async function getMe(req, res) {
  res.json({
    email: req.user.email,
    displayName: req.user.displayName,
    biometricEnabled: req.user.biometricEnabled,
    locked: Boolean(req.sessionLocked),
  });
}

// POST /api/auth/lock
export async function lockSession(req, res) {
  issueSessionCookie(res, req.user, true);
  res.json({ success: true, locked: true });
}

// POST /api/auth/unlock-with-password
export async function unlockWithPassword(req, res) {
  const { password } = req.body;
  const match = await bcrypt.compare(password || '', req.user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  issueSessionCookie(res, req.user, false);
  res.json({ success: true, locked: false });
}

// POST /api/auth/biometric/register/options
export async function getBiometricRegisterOptions(req, res, next) {
  try {
    const { rpID, rpName } = getRpConfig();
    const existingCreds = await Credential.find({ userId: req.user._id });

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userName: req.user.email,
      userID: new TextEncoder().encode(req.user._id.toString()),
      attestationType: 'none',
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred',
      },
      excludeCredentials: existingCreds.map((c) => ({
        id: c.credentialID,
        transports: c.transports,
      })),
    });

    await Challenge.create({
      challenge: options.challenge,
      userId: req.user._id,
      type: 'registration',
    });

    res.json(options);
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/biometric/register/verify
export async function verifyBiometricRegister(req, res, next) {
  try {
    const { rpID, origin } = getRpConfig();
    const challengeDoc = await Challenge.findOne({
      userId: req.user._id,
      type: 'registration',
    }).sort({ createdAt: -1 });

    if (!challengeDoc) {
      return res.status(400).json({ message: 'Challenge expired. Please try again.' });
    }

    const verification = await verifyRegistrationResponse({
      response: req.body,
      expectedChallenge: challengeDoc.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      requireUserVerification: true,
    });

    await Challenge.deleteOne({ _id: challengeDoc._id });

    if (!verification.verified || !verification.registrationInfo) {
      return res.status(400).json({ message: 'Biometric registration failed.' });
    }

    const { credential } = verification.registrationInfo;

    await Credential.create({
      userId: req.user._id,
      credentialID: credential.id,
      publicKey: Buffer.from(credential.publicKey),
      counter: credential.counter,
      transports: credential.transports || [],
      deviceType: verification.registrationInfo.deviceType,
      backedUp: verification.registrationInfo.credentialBackedUp,
    });

    req.user.biometricEnabled = true;
    await req.user.save();

    res.status(201).json({ success: true, biometricEnabled: true });
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/biometric/unlock/options
export async function getBiometricUnlockOptions(req, res, next) {
  try {
    const { rpID } = getRpConfig();
    const credentials = await Credential.find({ userId: req.user._id });

    if (credentials.length === 0) {
      return res.status(400).json({ message: 'No biometric credentials registered for this account.' });
    }

    const options = await generateAuthenticationOptions({
      rpID,
      userVerification: 'required',
      allowCredentials: credentials.map((c) => ({
        id: c.credentialID,
        transports: c.transports,
      })),
    });

    await Challenge.create({
      challenge: options.challenge,
      userId: req.user._id,
      type: 'authentication',
    });

    res.json(options);
  } catch (error) {
    next(error);
  }
}

// POST /api/auth/biometric/unlock/verify
export async function verifyBiometricUnlock(req, res, next) {
  try {
    const { rpID, origin } = getRpConfig();
    const cred = await Credential.findOne({
      userId: req.user._id,
      credentialID: req.body.id,
    });

    if (!cred) {
      return res.status(400).json({ message: 'Unrecognized passkey.' });
    }

    const challengeDoc = await Challenge.findOne({
      userId: req.user._id,
      type: 'authentication',
    }).sort({ createdAt: -1 });

    if (!challengeDoc) {
      return res.status(400).json({ message: 'Challenge expired. Please try again.' });
    }

    const verification = await verifyAuthenticationResponse({
      response: req.body,
      expectedChallenge: challengeDoc.challenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      credential: {
        id: cred.credentialID,
        publicKey: cred.publicKey,
        counter: cred.counter,
        transports: cred.transports,
      },
      requireUserVerification: true,
    });

    await Challenge.deleteOne({ _id: challengeDoc._id });

    if (!verification.verified) {
      return res.status(400).json({ message: 'Biometric verification failed.' });
    }

    await Credential.updateOne(
      { _id: cred._id },
      {
        counter: verification.authenticationInfo.newCounter,
        lastUsedAt: new Date(),
      }
    );

    // Reissue unlocked session cookie
    issueSessionCookie(res, req.user, false);

    res.json({ success: true, locked: false });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/auth/biometric
export async function disableBiometrics(req, res, next) {
  try {
    const { password } = req.body;
    const match = await bcrypt.compare(password || '', req.user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect password.' });
    }

    await Credential.deleteMany({ userId: req.user._id });
    req.user.biometricEnabled = false;
    await req.user.save();

    issueSessionCookie(res, req.user, false);
    res.json({ success: true, biometricEnabled: false });
  } catch (error) {
    next(error);
  }
}
