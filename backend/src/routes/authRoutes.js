import { Router } from 'express';
import { register, login, refresh, logout, verifyEmail, forgotPassword, resetPassword } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { registerValidation, loginValidation, refreshValidation, verifyEmailValidation, forgotPasswordValidation, resetPasswordValidation } from '../validations/authValidation.js';

const router = Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh', refreshValidation, validate, refresh);
router.post('/logout', logout);
router.get('/verify-email', verifyEmailValidation, validate, verifyEmail);
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidation, validate, resetPassword);

export default router;
