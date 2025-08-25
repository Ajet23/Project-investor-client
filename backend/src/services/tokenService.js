import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import RefreshToken from '../models/RefreshToken.js';
import EmailToken from '../models/EmailToken.js';
import { EMAIL_TOKEN_TYPES } from '../utils/constants.js';

const SALT_ROUNDS = 10;

export const signAccessToken = (user) => {
  const payload = { sub: user._id.toString(), role: user.role };
  const options = {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES || '15m',
    issuer: process.env.JWT_ISSUER || 'idea-platform'
  };
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, options);
};

export const generateRandomToken = (bytes = 40) => crypto.randomBytes(bytes).toString('hex');

export const hashToken = async (token) => bcrypt.hash(token, SALT_ROUNDS);

export const createRefreshToken = async (user, ip) => {
  const token = generateRandomToken();
  const tokenHash = await hashToken(token);
  const days = Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7);
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const rt = await RefreshToken.create({
    user: user._id,
    tokenHash,
    expiresAt,
    createdByIp: ip
  });
  return { token, doc: rt };
};

export const verifyRefreshToken = async (userId, token) => {
  const tokens = await RefreshToken.find({ user: userId, revokedAt: { $exists: false } });
  for (const t of tokens) {
    const match = await bcrypt.compare(token, t.tokenHash);
    if (match && t.expiresAt > new Date()) return t;
  }
  return null;
};

export const revokeRefreshToken = async (refreshDoc, ip) => {
  refreshDoc.revokedAt = new Date();
  refreshDoc.revokedByIp = ip;
  await refreshDoc.save();
};

export const createEmailToken = async (user, type) => {
  const token = generateRandomToken(32);
  const tokenHash = await hashToken(token);
  const expiresAt = new Date(Date.now() + (type === EMAIL_TOKEN_TYPES.VERIFY ? 24 : 1) * 60 * 60 * 1000);
  const doc = await EmailToken.create({ user: user._id, tokenHash, type, expiresAt });
  return { token, doc };
};

export const useEmailToken = async (type, token) => {
  const tokens = await EmailToken.find({ type, usedAt: { $exists: false }, expiresAt: { $gt: new Date() } });
  for (const t of tokens) {
    const ok = await bcrypt.compare(token, t.tokenHash);
    if (ok) {
      t.usedAt = new Date();
      await t.save();
      return t;
    }
  }
  return null;
};
