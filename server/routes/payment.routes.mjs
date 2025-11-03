import express from 'express';
import {
  initiateMpesaPayment,
  mpesaCallback,
  checkPaymentStatus,
  getPayments,
  getMyPayments,
  getPaymentById,
  processRefund
} from '../controllers/payment.controller.mjs';
import { protect, authorize } from '../middleware/auth.middleware.mjs';

const router = express.Router();

// Public routes (for M-PESA callback)
router.post('/mpesa/callback', mpesaCallback);

// Protected routes
router.post('/mpesa/initiate', protect, initiateMpesaPayment);
router.get('/my-payments', protect, getMyPayments);
router.get('/:id/status', protect, checkPaymentStatus);
router.get('/:id', protect, getPaymentById);

// Admin routes
router.get('/', protect, authorize('admin'), getPayments);
router.post('/:id/refund', protect, authorize('admin'), processRefund);

export default router;
