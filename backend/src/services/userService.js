import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const SALT_ROUNDS = 12;

export const createUser = async ({ name, email, password, role, roleInfo }) => {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, passwordHash, role, roleInfo });
  return user;
};

export const verifyPassword = async (user, password) => {
  return bcrypt.compare(password, user.passwordHash);
};
