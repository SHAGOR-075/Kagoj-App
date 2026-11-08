import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    displayName: {
      type: String,
      trim: true,
      default: '',
    },
    passwordHash: {
      type: String,
      required: true,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    failedLogins: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
    biometricEnabled: {
      type: Boolean,
      default: false,
    },
    encDek: {
      type: String,
      default: null,
    },
    dekIv: {
      type: String,
      default: null,
    },
    dekTag: {
      type: String,
      default: null,
    },
    keyVersion: {
      type: Number,
      default: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  }
);

export const User = mongoose.model('User', UserSchema);

