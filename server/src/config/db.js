import dns from 'dns';
import mongoose from 'mongoose';

// Fix for Windows/local ISP DNS servers failing SRV lookups (querySrv ECONNREFUSED) with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Fallback if environment restricts setting custom DNS
}

// Pool and timeout configuration designed to survive idle periods & serverless cold-starts
const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1, // Keep warm connection active in pool
  maxIdleTimeMS: 30000, // Recycle idle connections before cloud firewalls drop them
};

/**
 * Global cache to prevent multiple connections on Vercel serverless cold-starts.
 */
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

let keepAliveInterval = null;

function startKeepAlive() {
  if (keepAliveInterval || process.env.VERCEL) return;

  const PING_INTERVAL_MS = 4 * 60 * 1000;
  keepAliveInterval = setInterval(async () => {
    try {
      if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
      } else if (mongoose.connection.readyState === 0) {
        console.warn('[MongoDB Keep-Alive] Socket idle or closed. Reconnecting...');
        connectDB();
      }
    } catch (err) {
      console.warn(`[MongoDB Keep-Alive] Ping failed: ${err.message}. Reconnecting...`);
      connectDB();
    }
  }, PING_INTERVAL_MS);

  if (keepAliveInterval.unref) {
    keepAliveInterval.unref();
  }
}

/**
 * Connect to MongoDB with connection caching for Vercel serverless + auto-retry.
 */
export async function connectDB(customUri) {
  let uri = customUri;
  const isTest = process.env.NODE_ENV === 'test' || process.env.IS_TEST === 'true';

  if (!uri) {
    if (isTest) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('FATAL: Tests are forbidden from running in production environment.');
      }
      uri = process.env.MONGODB_URI_TEST;
      if (!uri) {
        const baseUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kagoj_notes';
        uri = baseUri.includes('?') ? baseUri.replace(/\/[^/?]+(\?)/, '/kagoj_notes_test$1') : `${baseUri}_test`;
      }
    } else {
      uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/kagoj_notes';
    }
  }

  if (isTest && uri === process.env.MONGODB_URI && !uri.includes('_test')) {
    throw new Error('FATAL: Test execution refused. Target URI matches the production database without _test suffix.');
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, MONGO_OPTIONS)
      .then((m) => {
        console.log(`[MongoDB] Connected successfully to database: ${m.connection.name}`);
        startKeepAlive();
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.error(`[MongoDB] Connection error: ${err.message}`);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Event listeners
mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from MongoDB.');
  cached.conn = null;
  cached.promise = null;
});

mongoose.connection.on('reconnected', () => {
  console.log('[MongoDB] Reconnected to MongoDB.');
});

mongoose.connection.on('error', (err) => {
  console.error(`[MongoDB] Runtime error: ${err.message}`);
});
