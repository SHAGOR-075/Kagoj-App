import mongoose from 'mongoose';

const CredentialSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    credentialID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    publicKey: {
      type: Buffer,
      required: true,
    },
    counter: {
      type: Number,
      required: true,
      default: 0,
    },
    transports: {
      type: [String],
      default: [],
    },
    deviceType: {
      type: String,
      default: 'singleDevice',
    },
    backedUp: {
      type: Boolean,
      default: false,
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

export const Credential = mongoose.model('Credential', CredentialSchema);
