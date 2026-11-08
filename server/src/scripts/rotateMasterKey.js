import 'dotenv/config';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { decryptDek, encryptDek, getMasterKeyBuffer } from '../services/crypto.js';

async function runRotation() {
  const isConfirm = process.argv.includes('--confirm');
  console.log('=====================================================');
  console.log(`   Kagoj Master Key Rotation [${isConfirm ? 'EXECUTE MODE' : 'DRY RUN'}]`);
  console.log('=====================================================\n');

  const oldKey = process.env.NOTES_MASTER_KEY_OLD;
  const newKey = process.env.NOTES_MASTER_KEY;

  if (!oldKey || !newKey) {
    console.error('ERROR: Both NOTES_MASTER_KEY_OLD and NOTES_MASTER_KEY must be set in .env to perform rotation.');
    process.exit(1);
  }

  getMasterKeyBuffer(oldKey);
  getMasterKeyBuffer(newKey);

  await connectDB();

  const users = await User.find({ encDek: { $exists: true, $ne: null } });
  console.log(`Found ${users.length} users with encrypted DEKs.`);

  if (!isConfirm) {
    console.log('\n[DRY RUN COMPLETE] Verified ' + users.length + ' user DEKs can be rotated.');
    console.log('Run with --confirm to apply the new master key to all user DEKs.');
    process.exit(0);
  }

  console.log('\n[ROTATING USER DEKS...]');
  let rotated = 0;

  for (const user of users) {
    // Decrypt with OLD key
    const rawDek = decryptDek(user, oldKey);
    // Re-encrypt with NEW key
    const reEncrypted = encryptDek(rawDek, user._id, newKey);

    user.encDek = reEncrypted.encDek;
    user.dekIv = reEncrypted.dekIv;
    user.dekTag = reEncrypted.dekTag;
    user.keyVersion = (user.keyVersion || 1) + 1;
    await user.save();
    rotated += 1;
  }

  console.log(`\n✓ Successfully rotated master key for ${rotated} users!`);
  console.log('You can now safely retire NOTES_MASTER_KEY_OLD.');
  process.exit(0);
}

runRotation().catch((err) => {
  console.error('Rotation Error:', err);
  process.exit(1);
});

