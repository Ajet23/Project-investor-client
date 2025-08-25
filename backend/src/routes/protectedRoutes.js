import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { ROLES } from '../utils/constants.js';
import { me } from '../controllers/authController.js';

const router = Router();

router.get('/me', authenticate, me);
router.get('/mentor', authenticate, requireRole([ROLES.MENTOR]), (req, res) => {
  res.json({ message: `Welcome Mentor ${req.user.id}` });
});
router.get('/investor', authenticate, requireRole([ROLES.INVESTOR]), (req, res) => {
  res.json({ message: `Welcome Investor ${req.user.id}` });
});
router.get('/thinker', authenticate, requireRole([ROLES.THINKER]), (req, res) => {
  res.json({ message: `Welcome Thinker ${req.user.id}` });
});

export default router;
