import express from 'express';
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBookingById,
  updateBooking,
  cancelBooking,
  checkInBooking,
  checkOutBooking,
  getBookingStats
} from '../controllers/booking.controller.mjs';
import { protect, authorize } from '../middleware/auth.middleware.mjs';

const router = express.Router();

// Protected routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/stats/overview', protect, authorize('admin', 'staff'), getBookingStats);
router.get('/', protect, authorize('admin', 'staff'), getAllBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, cancelBooking);
router.put('/:id/checkin', protect, authorize('admin', 'staff'), checkInBooking);
router.put('/:id/checkout', protect, authorize('admin', 'staff'), checkOutBooking);

export default router;
