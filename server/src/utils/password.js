/**
 * Password strength policy and top 100 common passwords blacklist.
 */

const COMMON_PASSWORDS = new Set([
  '123456', 'password', '12345678', 'qwerty', '123456789', '12345', '1234', '111111',
  '1234567', 'dragon', '123123', 'baseball', 'football', 'monkey', 'letmein', 'shadow',
  'master', '666666', 'sunshine', '123321', '654321', 'welcome', 'princess', 'solo',
  'starwars', 'killer', 'superman', 'trustno1', 'iloveyou', 'chelsea', 'secret', 'admin',
  'jordan', 'arsenal', 'charlie', 'liverpool', 'donald', 'freedom', 'ranger', 'barcelona',
  'orange', 'harley', 'pass123', 'qwertyuiop', '000000', 'ashley', 'computer', 'server',
  'bullet', 'coffee', 'hockey', 'bailey', 'rookie', 'biteme', 'mercedes', 'batman',
  'matrix', 'ginger', 'buster', 'cheese', 'pepper', 'summer', 'hunter', 'cookie',
  'mustang', 'george', 'doggie', 'andrew', 'thomas', 'soccer', 'guitar', 'secret1',
  'jackson', 'butter', 'winner', 'hannah', 'diamond', 'magnum', 'cooper', 'dakota',
  'yellow', 'purple', 'flower', 'peanut', 'banana', 'william', 'cowboy', 'silver',
  'phoenix', 'tigger', 'sparky', 'snoopy', 'bubbles', 'whiskey', 'tiger', 'paris',
  'london', 'berlin', 'tokyo', 'sydney'
]);

export function validatePassword(password, email = '') {
  if (typeof password !== 'string') {
    return { valid: false, message: 'Password must be a valid string.' };
  }

  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }

  if (password.length > 72) {
    return { valid: false, message: 'Password cannot exceed 72 characters.' };
  }

  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain both letters and numbers.' };
  }

  const normalized = password.toLowerCase().trim();
  if (COMMON_PASSWORDS.has(normalized)) {
    return { valid: false, message: 'This password is too common. Please choose a stronger password.' };
  }

  if (email) {
    const rawLocal = email.split('@')[0]?.toLowerCase().trim();
    if (rawLocal && normalized === rawLocal) {
      return { valid: false, message: 'Password cannot be identical to your email username.' };
    }
  }

  return { valid: true };
}

