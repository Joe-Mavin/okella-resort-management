import express from 'express';
import {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  addResponse,
  markHelpful
} from '../controllers/review.controller.mjs';
import { protect, authorize } from '../middleware/auth.middleware.mjs';

const router = express.Router();

// Public routes
router.get('/', getReviews);
router.get('/:id', getReviewById);

// Protected routes
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/helpful', protect, markHelpful);

// Admin routes
router.post('/:id/response', protect, authorize('admin', 'staff'), addResponse);

export default router;
