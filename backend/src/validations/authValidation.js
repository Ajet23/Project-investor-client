import { body, query } from 'express-validator';
import { ROLES } from '../utils/constants.js';

export const registerValidation = [
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isString().isLength({ min: 8 }).withMessage('Password min 8 chars'),
  body('role').isIn(Object.values(ROLES)).withMessage('Invalid role'),
  body('roleInfo').optional().isObject().withMessage('roleInfo must be object')
];

export const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isString().notEmpty()
];

export const refreshValidation = [];

export const verifyEmailValidation = [
  query('token').isString().notEmpty()
];

export const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail()
];

export const resetPasswordValidation = [
  body('token').isString().notEmpty(),
  body('newPassword').isString().isLength({ min: 8 })
];
