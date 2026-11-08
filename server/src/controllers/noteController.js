import mongoose from 'mongoose';
import { Note } from '../models/Note.js';
import { decryptField, encryptField, getUserDek } from '../services/crypto.js';

function decryptNote(noteDoc, dek, userId) {
  const aad = String(userId) + String(noteDoc._id);
  return {
    _id: noteDoc._id,
    userId: noteDoc.userId,
    clientId: noteDoc.clientId,
    title: decryptField(noteDoc.title, dek, aad),
    content: decryptField(noteDoc.content, dek, aad),
    color: noteDoc.color,
    pinned: noteDoc.pinned,
    createdAt: noteDoc.createdAt,
    updatedAt: noteDoc.updatedAt,
  };
}

export async function getNotes(req, res, next) {
  try {
    const dek = await getUserDek(req.user);
    const notes = await Note.find({ userId: req.user._id }).sort({ pinned: -1, updatedAt: -1 });
    const decrypted = notes.map((n) => decryptNote(n, dek, req.user._id));
    res.json(decrypted);
  } catch (error) {
    next(error);
  }
}

export async function getNoteById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Note not found' });
    const note = await Note.findOne({ _id: id, userId: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const dek = await getUserDek(req.user);
    res.json(decryptNote(note, dek, req.user._id));
  } catch (error) {
    next(error);
  }
}

export async function createNote(req, res, next) {
  try {
    const { title = '', content = '', color = 'paper', pinned = false, clientId } = req.body;
    const cleanTitle = String(title).trim();
    const cleanContent = String(content).trim();

    if (!cleanTitle && !cleanContent) {
      return res.status(400).json({ message: 'Cannot save an empty note.' });
    }
    if (String(title).length > 200) {
      return res.status(400).json({ message: 'Title cannot exceed 200 characters.' });
    }
    if (String(content).length > 50000) {
      return res.status(400).json({ message: 'Content cannot exceed 50,000 characters.' });
    }

    const noteCount = await Note.countDocuments({ userId: req.user._id });
    if (noteCount >= 5000) {
      return res.status(400).json({ message: 'Maximum limit of 5,000 notes reached.' });
    }

    const noteClientId = clientId || `client-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const dek = await getUserDek(req.user);

    // Idempotency: return existing note if clientId already recorded
    const existing = await Note.findOne({ userId: req.user._id, clientId: noteClientId });
    if (existing) {
      return res.status(200).json(decryptNote(existing, dek, req.user._id));
    }

    const noteId = new mongoose.Types.ObjectId();
    const aad = String(req.user._id) + String(noteId);
    const encTitle = encryptField(String(title), dek, aad);
    const encContent = encryptField(String(content), dek, aad);

    const note = await Note.create({
      _id: noteId,
      userId: req.user._id,
      clientId: noteClientId,
      title: encTitle,
      content: encContent,
      color,
      pinned: Boolean(pinned),
    });

    res.status(201).json(decryptNote(note, dek, req.user._id));
  } catch (error) {
    // Catch duplicate key race error and return existing note
    if (error.code === 11000 && req.body.clientId) {
      try {
        const dek = await getUserDek(req.user);
        const existing = await Note.findOne({ userId: req.user._id, clientId: req.body.clientId });
        if (existing) return res.status(200).json(decryptNote(existing, dek, req.user._id));
      } catch {}
    }
    next(error);
  }
}

export async function updateNote(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Note not found' });
    const note = await Note.findOne({ _id: id, userId: req.user._id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const { title, content, color, pinned } = req.body;

    // Emptied note auto-deletion
    if (title !== undefined && content !== undefined && !String(title).trim() && !String(content).trim()) {
      await Note.deleteOne({ _id: id, userId: req.user._id });
      return res.json({ deleted: true, _id: id });
    }

    if (title !== undefined && String(title).length > 200) {
      return res.status(400).json({ message: 'Title cannot exceed 200 characters.' });
    }
    if (content !== undefined && String(content).length > 50000) {
      return res.status(400).json({ message: 'Content cannot exceed 50,000 characters.' });
    }

    const dek = await getUserDek(req.user);
    const aad = String(req.user._id) + String(id);

    if (title !== undefined) note.title = encryptField(String(title), dek, aad);
    if (content !== undefined) note.content = encryptField(String(content), dek, aad);
    if (color !== undefined) note.color = color;
    if (pinned !== undefined) note.pinned = Boolean(pinned);

    await note.save();
    res.json(decryptNote(note, dek, req.user._id));
  } catch (error) {
    next(error);
  }
}

export async function deleteNote(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Note not found' });
    const result = await Note.deleteOne({ _id: id, userId: req.user._id });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Note not found' });
    res.json({ success: true, id });
  } catch (error) {
    next(error);
  }
}
