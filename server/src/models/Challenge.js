import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema(
  {
    challenge: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    type: {
      type: String,
      enum: ['registration', 'authentication'],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // 5 minutes TTL
      expires: 300,
    },
  },
  {
    versionKey: false,
  }
);

export const Challenge = mongoose.model('Challenge', ChallengeSchema);
