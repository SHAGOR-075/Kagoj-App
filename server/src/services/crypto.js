import crypto from 'crypto';

export function getMasterKeyBuffer(customKey) {
  const keyBase64 = customKey || process.env.NOTES_MASTER_KEY;
  if (!keyBase64) {
    throw new Error('FATAL: NOTES_MASTER_KEY environment variable is missing.');
  }
  const buf = Buffer.from(keyBase64, 'base64');
  if (buf.length !== 32) {
    throw new Error(`FATAL: NOTES_MASTER_KEY must be exactly 32 bytes (got ${buf.length}).`);
  }
  return buf;
}

export function generateDek() {
  return crypto.randomBytes(32);
}

export function encryptDek(dekBuf, userIdStr, customMasterKey) {
  const masterKey = getMasterKeyBuffer(customMasterKey);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', masterKey, iv);
  cipher.setAAD(Buffer.from(String(userIdStr), 'utf8'));
  const encDek = Buffer.concat([cipher.update(dekBuf), cipher.final()]);
  const dekTag = cipher.getAuthTag();
  return {
    encDek: encDek.toString('base64'),
    dekIv: iv.toString('base64'),
    dekTag: dekTag.toString('base64'),
    keyVersion: 1,
  };
}

export function decryptDek(userDoc, customMasterKey) {
  const masterKey = getMasterKeyBuffer(customMasterKey);
  const iv = Buffer.from(userDoc.dekIv, 'base64');
  const tag = Buffer.from(userDoc.dekTag, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', masterKey, iv);
  decipher.setAAD(Buffer.from(String(userDoc._id), 'utf8'));
  decipher.setAuthTag(tag);
  return Buffer.concat([
    decipher.update(Buffer.from(userDoc.encDek, 'base64')),
    decipher.final(),
  ]);
}

export function encryptField(plaintext, dekBuf, aadStr) {
  const text = typeof plaintext === 'string' ? plaintext : '';
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', dekBuf, iv);
  cipher.setAAD(Buffer.from(String(aadStr), 'utf8'));
  const ciphertext = Buffer.concat([cipher.update(Buffer.from(text, 'utf8')), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString('base64'),
    tag: tag.toString('base64'),
    ciphertext: ciphertext.toString('base64'),
  };
}

export function decryptField(encField, dekBuf, aadStr) {
  if (!encField || typeof encField !== 'object' || !encField.iv || !encField.tag || !encField.ciphertext) {
    return '';
  }
  const iv = Buffer.from(encField.iv, 'base64');
  const tag = Buffer.from(encField.tag, 'base64');
  const decipher = crypto.createDecipheriv('aes-256-gcm', dekBuf, iv);
  decipher.setAAD(Buffer.from(String(aadStr), 'utf8'));
  decipher.setAuthTag(tag);
  return Buffer.concat([
    decipher.update(Buffer.from(encField.ciphertext, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}

export async function getUserDek(user) {
  if (!user.encDek || !user.dekIv || !user.dekTag) {
    const rawDek = generateDek();
    const enc = encryptDek(rawDek, user._id);
    user.encDek = enc.encDek;
    user.dekIv = enc.dekIv;
    user.dekTag = enc.dekTag;
    user.keyVersion = enc.keyVersion;
    await user.save();
    return rawDek;
  }
  return decryptDek(user);
}

