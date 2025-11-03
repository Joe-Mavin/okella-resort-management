import express from 'express';
import {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  bookActivity,
  getMyActivityBookings,
  cancelActivityBooking
} from '../controllers/activity.controller.mjs';
import { protect, authorize } from '../middleware/auth.middleware.mjs';

const router = express.Router();

// Public routes
router.get('/', getActivities);
router.get('/:id', getActivityById);

// Protected routes
router.post('/:id/book', protect, bookActivity);
router.get('/bookings/my-bookings', protect, getMyActivityBookings);
router.delete('/bookings/:id', protect, cancelActivityBooking);

// Admin routes
router.post('/', protect, authorize('admin'), createActivity);
router.put('/:id', protect, authorize('admin'), updateActivity);
router.delete('/:id', protect, authorize('admin'), deleteActivity);

export default router;
