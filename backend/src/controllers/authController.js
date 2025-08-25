import User from '../models/User.js';
import { ROLES, EMAIL_TOKEN_TYPES } from '../utils/constants.js';
import { sendEmail } from '../services/emailService.js';
import { createUser, verifyPassword } from '../services/userService.js';
import { signAccessToken, createRefreshToken, verifyRefreshToken, revokeRefreshToken, createEmailToken, useEmailToken } from '../services/tokenService.js';

const cookieOptions = () => ({
  httpOnly: true,
  secure: (process.env.COOKIE_SECURE || 'false') === 'true',
  sameSite: 'lax',
  path: '/',
  maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS || 7) * 24 * 60 * 60 * 1000
});

export const register = async (req, res) => {
  const { name, email, password, role, roleInfo } = req.body;

  // Role-specific server-side validation (basic example)
  const roleFields = {
    [ROLES.THINKER]: ['industry', 'ideaStage'],
    [ROLES.INVESTOR]: ['firmName', 'investmentRange'],
    [ROLES.MENTOR]: ['expertise', 'yearsExperience']
  };
  const required = roleFields[role] || [];
  for (const f of required) {
    if (!roleInfo || typeof roleInfo[f] === 'undefined' || roleInfo[f] === '') {
      return res.status(400).json({ message: `Missing required roleInfo field: ${f}` });
    }
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const user = await createUser({ name, email, password, role, roleInfo });

  // Create email verification token
  const { token: verifyToken } = await createEmailToken(user, EMAIL_TOKEN_TYPES.VERIFY);

  const verifyLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verifyToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify your email',
    text: `Click the link to verify your email: ${verifyLink}`
  });

  const dev = (process.env.DEV_SEND_TOKENS || 'true') === 'true';
  return res.status(201).json({
    message: 'User registered. Please verify your email.',
    devVerifyToken: dev ? verifyToken : undefined
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await verifyPassword(user, password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  if (!user.isEmailVerified) {
    return res.status(403).json({ message: 'Email not verified' });
  }

  const accessToken = signAccessToken(user);
  const { token: refreshToken, doc } = await createRefreshToken(user, req.ip);
  res.cookie('refreshToken', refreshToken, cookieOptions());
  return res.json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
};

export const refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: 'Missing refresh token' });

  const userId = req.body.userId || null; // optional hint
  let rtDoc = null;

  if (userId) {
    rtDoc = await verifyRefreshToken(userId, token);
  } else {
    // brute search across users is not desired; client should pass userId or we decode another way
    // For MVP, we try each token doc (inefficient) - but we can optimize by storing a jti reference.
    // Here we simply fail without userId to keep it simple and secure.
    return res.status(400).json({ message: 'userId required for refresh' });
  }
  if (!rtDoc) return res.status(401).json({ message: 'Invalid refresh token' });

  const user = await User.findById(rtDoc.user);
  if (!user) return res.status(401).json({ message: 'User not found' });

  const accessToken = signAccessToken(user);
  return res.json({ accessToken });
};

export const logout = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token && req.body.userId) {
    const doc = await verifyRefreshToken(req.body.userId, token);
    if (doc) await revokeRefreshToken(doc, req.ip);
  }
  res.clearCookie('refreshToken', { path: '/' });
  return res.json({ message: 'Logged out' });
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  const tok = await useEmailToken('verify', token);
  if (!tok) return res.status(400).json({ message: 'Invalid or expired token' });
  const user = await User.findById(tok.user);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.isEmailVerified = true;
  await user.save();
  return res.json({ message: 'Email verified. You can log in now.' });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: 'If the email exists, reset instructions were sent.' });
  const { token } = await createEmailToken(user, 'reset');
  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset your password',
    text: `Click to reset: ${resetLink}`
  });
  const dev = (process.env.DEV_SEND_TOKENS || 'true') === 'true';
  return res.json({ message: 'If the email exists, reset instructions were sent.', devResetToken: dev ? token : undefined });
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  const tok = await useEmailToken('reset', token);
  if (!tok) return res.status(400).json({ message: 'Invalid or expired token' });
  const user = await User.findById(tok.user);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Update password
  user.passwordHash = undefined; // to satisfy linter
  const bcrypt = await import('bcryptjs');
  user.passwordHash = await bcrypt.default.hash(newPassword, 12);
  await user.save();
  return res.json({ message: 'Password updated. You can log in now.' });
};

export const me = async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'User not found' });
  return res.json({ user });
};
