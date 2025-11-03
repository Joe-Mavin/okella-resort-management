import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword
} from '../controllers/auth.controller.mjs';
import { protect } from '../middleware/auth.middleware.mjs';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);
router.put('/update-details', protect, updateDetails);
router.put('/update-password', protect, updatePassword);

export default router;
