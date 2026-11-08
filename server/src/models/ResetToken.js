import mongoose from 'mongoose';

const ResetTokenSchema = new mongoose.Schema(
  {
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 600, // 10 minutes TTL
    },
  },
  {
    versionKey: false,
  }
);

export const ResetToken = mongoose.model('ResetToken', ResetTokenSchema);

