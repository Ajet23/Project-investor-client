// backend/scripts/adminResetPassword.js
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../src/models/User.js';
import RefreshToken from '../src/models/RefreshToken.js';

const usage = () => {
  console.log(`
Usage:
  node scripts/adminResetPassword.js --name "Exact Username" --password "NewPass!234"
  node scripts/adminResetPassword.js --email user@example.com --password "NewPass!234"

Notes:
- Prefer --email for uniqueness.
- This also revokes existing refresh tokens for the user.
`);
};

async function main() {
  const args = process.argv.slice(2);
  const getArg = (flag) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };

  const name = getArg('--name');
  const email = getArg('--email');
  const newPassword = getArg('--password');

  if ((!name && !email) || !newPassword) {
    usage();
    process.exit(1);
  }

  const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/idea_platform';
  await mongoose.connect(MONGO_URI);

  try {
    const query = email ? { email } : { name };
    const user = await User.findOne(query);
    if (!user) {
      console.error('❌ User not found for query:', query);
      process.exit(1);
    }

    // Hash the new password
    const SALT_ROUNDS = 12;
    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Ensure they can log in immediately
    if (!user.isEmailVerified) user.isEmailVerified = true;

    await user.save();

    // Revoke all existing refresh tokens
    await RefreshToken.deleteMany({ user: user._id });

    console.log(`✅ Password reset for ${user.email} (${user.name}).`);
    console.log('🔒 All refresh tokens revoked. Ask the user to log in with the new password.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

main();
