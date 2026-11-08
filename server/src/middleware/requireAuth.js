import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

/**
 * Middleware: requireAuth
 * Verifies the 30-day JWT session cookie and validates the tokenVersion against MongoDB.
 * If the session is marked as locked, returns 401 { message: "Locked" }.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || req.headers['authorization'];
  const token =
    req.cookies?.token ||
    (authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null);

  if (!token) {
    return res.status(401).json({ message: 'Locked' });
  }

  const secret = process.env.JWT_SECRET || 'kagoj-super-secret-jwt-key-change-me';

  try {
    const decoded = jwt.verify(token, secret);

    // If session is locked by biometric app-lock, block notes access
    if (decoded.locked === true) {
      return res.status(401).json({ message: 'Locked' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.clearCookie('token');
      return res.status(401).json({ message: 'User account not found' });
    }

    // Token version check: logs out all sessions if password was reset
    if (user.tokenVersion !== decoded.tokenVersion) {
      res.clearCookie('token');
      return res.status(401).json({ message: 'Session expired or invalidated' });
    }

    req.user = user;
    req.sessionToken = token;
    next();
  } catch (err) {
    console.error('[requireAuth error]', err.message);
    return res.status(401).json({ message: 'Locked' });
  }
}

/**
 * Middleware: requireSession (allows locked sessions for the unlock endpoints)
 */
export async function requireSession(req, res, next) {
  const token =
    req.cookies?.token ||
    (req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null);

  if (!token) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  const secret = process.env.JWT_SECRET || 'kagoj-super-secret-jwt-key-change-me';

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId);
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      res.clearCookie('token');
      return res.status(401).json({ message: 'Session expired' });
    }

    req.user = user;
    req.sessionLocked = Boolean(decoded.locked);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid session' });
  }
}
