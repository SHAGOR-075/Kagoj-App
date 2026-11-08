import mongoose from 'mongoose';

const VALID_COLORS = ['paper', 'sage', 'peach', 'lilac', 'sky', 'butter', 'rose'];

const EncryptedFieldSchema = new mongoose.Schema(
  {
    iv: { type: String, required: true },
    tag: { type: String, required: true },
    ciphertext: { type: String, required: true },
  },
  { _id: false }
);

const NoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    clientId: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: EncryptedFieldSchema,
      required: true,
    },
    content: {
      type: EncryptedFieldSchema,
      required: true,
    },
    color: {
      type: String,
      enum: {
        values: VALID_COLORS,
        message: '{VALUE} is not a valid note color',
      },
      default: 'paper',
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for idempotency and fast sorted retrieval
NoteSchema.index({ userId: 1, clientId: 1 }, { unique: true });
NoteSchema.index({ userId: 1, pinned: -1, updatedAt: -1 });

// DB layer validation: strictly reject plaintext notes
NoteSchema.pre('save', function (next) {
  if (typeof this.title === 'string' || typeof this.content === 'string') {
    return next(new Error('Plaintext title or content is forbidden at the database layer.'));
  }
  if (!this.title?.iv || !this.title?.tag || typeof this.title?.ciphertext !== 'string') {
    return next(new Error('Title must be encrypted with { iv, tag, ciphertext }.'));
  }
  if (!this.content?.iv || !this.content?.tag || typeof this.content?.ciphertext !== 'string') {
    return next(new Error('Content must be encrypted with { iv, tag, ciphertext }.'));
  }
  next();
});

NoteSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update) {
    if (typeof update.title === 'string' || typeof update.content === 'string') {
      return next(new Error('Plaintext title or content is forbidden at the database layer.'));
    }
  }
  next();
});

export const Note = mongoose.model('Note', NoteSchema);
