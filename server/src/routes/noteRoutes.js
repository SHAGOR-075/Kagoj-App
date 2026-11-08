import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from '../controllers/noteController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

router.use(requireAuth);

const createNoteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many notes created. Please wait a minute.' },
});

router.get('/', getNotes);
router.get('/:id', getNoteById);
router.post('/', createNoteLimiter, createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
