import 'dotenv/config';

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';

// Envelope Encryption: Master Key Validation
if (!process.env.NOTES_MASTER_KEY) {
  throw new Error('FATAL: NOTES_MASTER_KEY environment variable is missing. Server refusing to start.');
}
const masterKeyBuf = Buffer.from(process.env.NOTES_MASTER_KEY, 'base64');
if (masterKeyBuf.length !== 32) {
  throw new Error(`FATAL: NOTES_MASTER_KEY must be exactly 32 bytes (got ${masterKeyBuf.length}).`);
}

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

// Security headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows inline styles on the deployment confirmation page
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration: exact client origin with credentials support for httpOnly cookies
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, direct address bar)
      if (!origin) return callback(null, true);

      // Exact CLIENT_URL origin match or localhost for local testing
      if (
        origin === CLIENT_URL ||
        origin === 'http://localhost:3000' ||
        origin === 'http://127.0.0.1:3000' ||
        (process.env.ORIGIN && origin === process.env.ORIGIN)
      ) {
        return callback(null, true);
      }

      // In production, also allow vercel.app preview deployments if origin matches pattern
      if (process.env.VERCEL && origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Request logger for development / debugging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// Middleware to ensure DB connection is ready on Vercel serverless cold-starts
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[DB Middleware Error]', err.message);
    next(err);
  }
});

// Root deployment verification endpoint (HTML in browser, JSON for API clients)
const renderDeploymentConfirmation = (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  const dbName = mongoose.connection.name || 'kagoj_notes';

  if (req.accepts('html')) {
    return res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Kagoj Quick Notes - Backend API</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              background-color: #FAF8F5;
              color: #1c1917;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              padding: 24px;
            }
            .card {
              background: #ffffff;
              max-width: 580px;
              width: 100%;
              border-radius: 16px;
              border: 1px solid #E7E3DC;
              padding: 36px 32px;
              box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
            }
            .badge {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              background: #ECFDF5;
              color: #065F46;
              padding: 6px 14px;
              border-radius: 9999px;
              font-size: 13px;
              font-weight: 600;
              margin-bottom: 20px;
              border: 1px solid #A7F3D0;
            }
            .dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #10B981;
              animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
            h1 { font-size: 26px; font-weight: 700; margin-bottom: 8px; color: #1c1917; }
            p.sub { font-size: 15px; color: #78716c; margin-bottom: 24px; line-height: 1.5; }
            .info-box {
              background: #FAF8F5;
              border-radius: 10px;
              border: 1px solid #EDE8E1;
              padding: 16px;
              margin-bottom: 24px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              font-size: 14px;
              padding: 6px 0;
            }
            .info-label { color: #78716c; }
            .info-val { font-weight: 600; font-family: monospace; }
            .links { display: flex; flex-direction: column; gap: 10px; }
            .link-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 16px;
              background: #fbfbfa;
              border: 1px solid #E7E3DC;
              border-radius: 8px;
              text-decoration: none;
              color: #1c1917;
              font-size: 14px;
              transition: all 0.15s ease;
            }
            .link-item:hover {
              border-color: #d6cfc5;
              background: #f5f3ef;
            }
            .endpoint { font-family: monospace; font-weight: 600; color: #0284c7; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">
              <span class="dot"></span> Deployment Successful
            </div>
            <h1>কাগজ (Kagoj) Quick Notes API</h1>
            <p class="sub">Your backend REST service is successfully running on Vercel with MongoDB Atlas connectivity and WebAuthn Biometric Security.</p>
            
            <div class="info-box">
              <div class="info-row">
                <span class="info-label">Platform:</span>
                <span class="info-val">Vercel Serverless</span>
              </div>
              <div class="info-row">
                <span class="info-label">Database:</span>
                <span class="info-val" style="color: ${isDbConnected ? '#059669' : '#dc2626'}">
                  ${isDbConnected ? 'Connected (' + dbName + ')' : 'Connecting...'}
                </span>
              </div>
              <div class="info-row">
                <span class="info-label">Security:</span>
                <span class="info-val" style="color: #0284c7">WebAuthn / Passkey Protected</span>
              </div>
            </div>

            <div class="links">
              <a href="/api/auth/status" class="link-item">
                <span>Auth Status</span>
                <span class="endpoint">GET /api/auth/status &rarr;</span>
              </a>
              <a href="/api/health" class="link-item">
                <span>Health Check</span>
                <span class="endpoint">GET /api/health &rarr;</span>
              </a>
            </div>
          </div>
        </body>
      </html>
    `);
  }

  // JSON Response for API clients
  return res.status(200).json({
    success: true,
    message: 'Kagoj Quick Notes Backend API is live and operational on Vercel!',
    platform: 'Vercel Serverless',
    database: {
      status: isDbConnected ? 'connected' : 'connecting',
      name: dbName,
    },
    security: 'WebAuthn Passkey + Mobile Biometrics',
    endpoints: {
      authStatus: '/api/auth/status',
      notes: '/api/notes',
      health: '/api/health',
    },
    timestamp: new Date().toISOString(),
  });
};

app.get('/', renderDeploymentConfirmation);
app.get('/api', renderDeploymentConfirmation);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Kagoj Quick Notes API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'connecting',
    timestamp: new Date().toISOString(),
  });
});

// Auth Routes (WebAuthn / Passkey)
app.use('/api/auth', authRoutes);

// Protected API Routes (Notes CRUD)
app.use('/api/notes', noteRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error]', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start local HTTP server if not running in Vercel serverless environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`  Kagoj Server running on http://localhost:${PORT}`);
    console.log(`  Health Check: http://localhost:${PORT}/api/health`);
    console.log(`  Auth Status:  http://localhost:${PORT}/api/auth/status`);
    console.log(`  Notes API:    http://localhost:${PORT}/api/notes (Protected)`);
    console.log(`===============================================`);
  });
}

export default app;
