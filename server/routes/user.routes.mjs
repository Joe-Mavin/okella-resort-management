import express from 'express';
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAccount,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user.controller.mjs';
import { protect, authorize } from '../middleware/auth.middleware.mjs';

const router = express.Router();

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/avatar', protect, uploadAvatar);
router.delete('/account', protect, deleteAccount);

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;
