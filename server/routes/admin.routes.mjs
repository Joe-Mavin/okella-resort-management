import express from 'express';
import {
  getDashboardStats,
  getRevenueAnalytics,
  getBookingAnalytics,
  getUserAnalytics,
  exportData
} from '../controllers/admin.controller.mjs';
import { protect, authorize } from '../middleware/auth.middleware.mjs';

const router = express.Router();

// All routes are admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/analytics/revenue', getRevenueAnalytics);
router.get('/analytics/bookings', getBookingAnalytics);
router.get('/analytics/users', getUserAnalytics);
router.get('/export/:type', exportData);

export default router;
