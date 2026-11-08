import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    purpose: {
      type: String,
      enum: ['register', 'reset'],
      required: true,
    },
    codeHash: {
      type: String,
      required: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    resendAvailableAt: {
      type: Date,
      default: () => new Date(Date.now() + 60 * 1000), // 60s cooldown
    },
    pendingSignup: {
      passwordHash: { type: String },
      displayName: { type: String, default: '' },
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // 10 minutes TTL: MongoDB automatically purges document
      expires: 600,
    },
  },
  {
    versionKey: false,
  }
);

// Compound index for fast lookup
OtpSchema.index({ email: 1, purpose: 1 });

export const Otp = mongoose.model('Otp', OtpSchema);

