import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Note } from '../models/Note.js';
import { User } from '../models/User.js';
import { canonicalizeGmail } from '../utils/gmail.js';

async function runMigration() {
  const targetEmail = process.argv[2];

  if (!targetEmail) {
    console.error('Usage: node src/scripts/migrateNotes.js <target-gmail-address>');
    process.exit(1);
  }

  let canonical;
  try {
    canonical = canonicalizeGmail(targetEmail);
  } catch (err) {
    console.error(`Invalid email error: ${err.message}`);
    process.exit(1);
  }

  await connectDB();

  const user = await User.findOne({ email: canonical });
  if (!user) {
    console.error(`Error: User with email "${canonical}" does not exist. Please register the account first.`);
    await mongoose.disconnect();
    process.exit(1);
  }

  // Find all notes without a valid userId
  const filter = { $or: [{ userId: { $exists: false } }, { userId: null }] };
  const count = await Note.countDocuments(filter);

  if (count === 0) {
    console.log('No unassigned notes found. Database is already clean.');
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log(`Found ${count} unassigned notes. Assigning to ${user.email} (${user._id})...`);
  const result = await Note.updateMany(filter, { $set: { userId: user._id } });

  console.log(`Migration complete! Successfully assigned ${result.modifiedCount} notes to ${user.email}.`);
  await mongoose.disconnect();
  process.exit(0);
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});

