import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Note } from '../models/Note.js';
import { User } from '../models/User.js';
import { encryptField, getUserDek } from '../services/crypto.js';

async function runEncryption() {
  const isConfirm = process.argv.includes('--confirm');
  console.log('=====================================================');
  console.log(`   Kagoj Note Encryption Migration [${isConfirm ? 'EXECUTE MODE' : 'DRY RUN'}]`);
  console.log('=====================================================\n');

  await connectDB();

  // Find all raw notes directly from collection (bypassing mongoose model schema casting)
  const rawNotes = await mongoose.connection.db.collection('notes').find({}).toArray();
  const unencrypted = rawNotes.filter((n) => typeof n.title === 'string' || !n.title?.ciphertext);

  console.log(`Total notes found:       ${rawNotes.length}`);
  console.log(`Unencrypted notes found: ${unencrypted.length}`);
  console.log(`Already encrypted notes: ${rawNotes.length - unencrypted.length}`);

  if (unencrypted.length === 0) {
    console.log('\n✓ All notes in the database are already encrypted with AES-256-GCM!');
    process.exit(0);
  }

  if (!isConfirm) {
    console.log('\n[DRY RUN COMPLETE] Found ' + unencrypted.length + ' plaintext notes to encrypt.');
    console.log('Run with --confirm to encrypt existing notes in-place.');
    process.exit(0);
  }

  console.log('\n[EXECUTING ENCRYPTION...]');
  let migratedCount = 0;

  for (const rawNote of unencrypted) {
    const user = await User.findById(rawNote.userId);
    if (!user) {
      console.warn(`Skipping note ${rawNote._id} (User ${rawNote.userId} not found)`);
      continue;
    }

    const dek = await getUserDek(user);
    const aad = String(user._id) + String(rawNote._id);
    const encTitle = encryptField(rawNote.title || '', dek, aad);
    const encContent = encryptField(rawNote.content || '', dek, aad);
    const clientId = rawNote.clientId || `legacy-${rawNote._id}`;

    await mongoose.connection.db.collection('notes').updateOne(
      { _id: rawNote._id },
      {
        $set: {
          title: encTitle,
          content: encContent,
          clientId,
          color: rawNote.color || 'paper',
          pinned: Boolean(rawNote.pinned),
        },
      }
    );
    migratedCount += 1;
  }

  console.log(`\n✓ Successfully encrypted ${migratedCount} notes with per-user AES-256-GCM envelope encryption!`);
  process.exit(0);
}

runEncryption().catch((err) => {
  console.error('Migration Error:', err);
  process.exit(1);
});

