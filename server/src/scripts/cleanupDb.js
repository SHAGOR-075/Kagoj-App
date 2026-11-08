import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Note } from '../models/Note.js';
import { Otp } from '../models/Otp.js';
import { User } from '../models/User.js';

async function runCleanup() {
  const isConfirm = process.argv.includes('--confirm');
  console.log('=====================================================');
  console.log(`   Kagoj Database Cleanup Tool [${isConfirm ? 'EXECUTE MODE' : 'DRY RUN'}]`);
  console.log('=====================================================');
  console.log('IMPORTANT: Take a full MongoDB Atlas backup before running with --confirm!\n');

  await connectDB();

  const allUsers = await User.find({}).lean();
  const validUserIds = new Set(allUsers.map((u) => u._id.toString()));

  // 1. Notes without userId
  const notesWithoutUser = await Note.find({
    $or: [{ userId: { $exists: false } }, { userId: null }],
  }).lean();

  // 2. Notes whose userId has no matching user doc
  const allNotes = await Note.find({}).lean();
  const orphanedNotes = allNotes.filter(
    (n) => n.userId && !validUserIds.has(n.userId.toString())
  );

  // 3. Notes with empty title and content
  const emptyNotes = allNotes.filter((n) => {
    const isLegacyEmpty = typeof n.title === 'string' && typeof n.content === 'string' && !n.title.trim() && !n.content.trim();
    return isLegacyEmpty;
  });

  // 4. Duplicate notes (same user, title, content within 60s)
  const duplicateNoteIds = [];
  const noteMap = new Map();
  for (const n of allNotes) {
    const timeKey = Math.floor(new Date(n.createdAt).getTime() / 60000);
    const contentKey = typeof n.title === 'string' ? `${n.userId}_${n.title}_${n.content}_${timeKey}` : `${n.userId}_${n.title?.ciphertext}_${timeKey}`;
    if (noteMap.has(contentKey)) {
      duplicateNoteIds.push(n._id.toString());
    } else {
      noteMap.set(contentKey, n._id.toString());
    }
  }

  // 5. Test-looking users
  const testUserRegex = /test|example|user\.a\.|user\.b\.|kagoj\.test\./i;
  const testUsers = allUsers.filter((u) => testUserRegex.test(u.email));
  const testUserIds = new Set(testUsers.map((u) => u._id.toString()));
  const testNotes = allNotes.filter((n) => n.userId && testUserIds.has(n.userId.toString()));

  console.log('--- SCAN RESULTS ---');
  console.log(`1. Notes without userId:                ${notesWithoutUser.length}`);
  if (notesWithoutUser.length) console.log('   IDs:', notesWithoutUser.map((n) => n._id.toString()));

  console.log(`2. Orphaned notes (userId not in users): ${orphanedNotes.length}`);
  if (orphanedNotes.length) console.log('   IDs:', orphanedNotes.map((n) => n._id.toString()));

  console.log(`3. Empty notes (legacy empty string):   ${emptyNotes.length}`);
  if (emptyNotes.length) console.log('   IDs:', emptyNotes.map((n) => n._id.toString()));

  console.log(`4. Duplicate notes (within same minute): ${duplicateNoteIds.length}`);
  if (duplicateNoteIds.length) console.log('   IDs:', duplicateNoteIds);

  console.log(`5. Test-generated users:                ${testUsers.length}`);
  if (testUsers.length) console.log('   Emails:', testUsers.map((u) => u.email));

  console.log(`6. Notes belonging to test users:       ${testNotes.length}`);

  if (!isConfirm) {
    console.log('\n[DRY RUN COMPLETE] Zero records deleted. Run with --confirm to delete identified items.');
    process.exit(0);
  }

  console.log('\n[EXECUTING CLEANUP...]');
  const noteIdsToDelete = new Set([
    ...notesWithoutUser.map((n) => n._id.toString()),
    ...orphanedNotes.map((n) => n._id.toString()),
    ...emptyNotes.map((n) => n._id.toString()),
    ...duplicateNoteIds,
    ...testNotes.map((n) => n._id.toString()),
  ]);

  if (noteIdsToDelete.size > 0) {
    const delNotes = await Note.deleteMany({ _id: { $in: Array.from(noteIdsToDelete) } });
    console.log(`✓ Deleted ${delNotes.deletedCount} bad/test/orphaned notes.`);
  }

  if (testUsers.length > 0) {
    const delUsers = await User.deleteMany({ _id: { $in: Array.from(testUserIds) } });
    console.log(`✓ Deleted ${delUsers.deletedCount} test users.`);
  }

  // Clean expired OTPs
  const delOtps = await Otp.deleteMany({ createdAt: { $lt: new Date(Date.now() - 3600 * 1000) } });
  console.log(`✓ Cleaned ${delOtps.deletedCount} expired OTP documents.`);

  console.log('\n✓ Cleanup execution completed successfully.');
  process.exit(0);
}

runCleanup().catch((err) => {
  console.error('Cleanup Error:', err);
  process.exit(1);
});

