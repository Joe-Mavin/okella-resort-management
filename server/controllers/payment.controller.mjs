import Payment from '../models/Payment.model.mjs';
import Booking from '../models/Booking.model.mjs';
import User from '../models/User.model.mjs';
import mpesaService from '../utils/mpesa.utils.mjs';
import emailService from '../utils/email.utils.mjs';

// @desc    Initiate M-PESA payment
// @route   POST /api/payments/mpesa/initiate
// @access  Private
export const initiateMpesaPayment = async (req, res) => {
  try {
    const { bookingId, phoneNumber, amount } = req.body;

    // Validate input
    if (!bookingId || !phoneNumber || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Please provide booking ID, phone number, and amount'
      });
    }

    // Get booking
    const booking = await Booking.findById(bookingId).populate('room');
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify booking belongs to user
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to pay for this booking'
      });
    }

    // Create payment record
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user.id,
      amount: amount,
      currency: 'KES',
      paymentMethod: 'mpesa',
      status: 'pending'
    });

    // Initiate M-PESA STK Push
    try {
      const mpesaResponse = await mpesaService.initiateSTKPush(
        phoneNumber,
        amount,
        booking.bookingReference,
        `Payment for ${booking.bookingReference}`
      );

      // Update payment with M-PESA details
      payment.mpesa = {
        phoneNumber: mpesaService.formatPhoneNumber(phoneNumber),
        merchantRequestID: mpesaResponse.data.MerchantRequestID,
        checkoutRequestID: mpesaResponse.data.CheckoutRequestID
      };
      payment.status = 'processing';
      await payment.save();

      res.status(200).json({
        success: true,
        message: 'M-PESA payment initiated. Please enter your PIN on your phone.',
        data: {
          paymentId: payment._id,
          checkoutRequestID: mpesaResponse.data.CheckoutRequestID,
          merchantRequestID: mpesaResponse.data.MerchantRequestID
        }
      });
    } catch (mpesaError) {
      payment.status = 'failed';
      await payment.save();

      return res.status(400).json({
        success: false,
        message: mpesaError.message
      });
    }
  } catch (error) {
    console.error('❌ Initiate M-PESA Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate M-PESA payment',
      error: error.message
    });
  }
};

// @desc    M-PESA callback
// @route   POST /api/payments/mpesa/callback
// @access  Public (Called by Safaricom)
export const mpesaCallback = async (req, res) => {
  try {
    console.log('📱 M-PESA Callback Received:', JSON.stringify(req.body, null, 2));

    const callbackData = mpesaService.validateCallback(req.body);

    // Find payment by checkoutRequestID
    const payment = await Payment.findOne({
      'mpesa.checkoutRequestID': callbackData.checkoutRequestID
    }).populate('booking user');

    if (!payment) {
      console.error('❌ Payment not found for checkoutRequestID:', callbackData.checkoutRequestID);
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Update payment with callback data
    payment.mpesa.merchantRequestID = callbackData.merchantRequestID;
    payment.mpesa.resultCode = callbackData.resultCode;
    payment.mpesa.resultDesc = callbackData.resultDesc;

    if (callbackData.isSuccess) {
      payment.mpesa.transactionID = callbackData.transactionID;
      payment.mpesa.transactionDate = callbackData.transactionDate;
      payment.status = 'completed';
      payment.paidAt = new Date();

      // Update booking status
      const booking = await Booking.findById(payment.booking);
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      booking.payment = payment._id;
      await booking.save();

      console.log('✅ Payment completed successfully:', callbackData.transactionID);

      // Send confirmation emails
      try {
        await emailService.sendPaymentConfirmation(payment, booking, payment.user);
        await emailService.sendBookingConfirmation(booking, payment.user);
      } catch (emailError) {
        console.error('❌ Email notification failed:', emailError);
      }
    } else {
      payment.status = 'failed';
      console.error('❌ M-PESA payment failed:', callbackData.resultDesc);
    }

    await payment.save();

    // Acknowledge callback
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: 'Success'
    });
  } catch (error) {
    console.error('❌ M-PESA Callback Error:', error);
    res.status(500).json({
      ResultCode: 1,
      ResultDesc: 'Internal Server Error'
    });
  }
};

// @desc    Check payment status
// @route   GET /api/payments/:id/status
// @access  Private
export const checkPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking')
      .populate('user', 'name email phone');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Verify user owns this payment
    if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    // If payment is still processing, query M-PESA
    if (payment.status === 'processing' && payment.mpesa?.checkoutRequestID) {
      try {
        const statusResponse = await mpesaService.queryStkPushStatus(payment.mpesa.checkoutRequestID);
        
        if (statusResponse.data.ResultCode === '0') {
          payment.status = 'completed';
          payment.paidAt = new Date();
          await payment.save();

          // Update booking
          const booking = await Booking.findById(payment.booking);
          booking.paymentStatus = 'paid';
          booking.status = 'confirmed';
          await booking.save();
        } else if (statusResponse.data.ResultCode !== '1032') {
          // 1032 means still pending
          payment.status = 'failed';
          await payment.save();
        }
      } catch (queryError) {
        console.error('❌ M-PESA Query Error:', queryError);
      }
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('❌ Check Payment Status Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check payment status',
      error: error.message
    });
  }
};

// @desc    Get all payments (admin)
// @route   GET /api/payments
// @access  Private/Admin
export const getPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.paymentMethod) {
      query.paymentMethod = req.query.paymentMethod;
    }

    const payments = await Payment.find(query)
      .populate('user', 'name email phone')
      .populate('booking', 'bookingReference checkInDate checkOutDate')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: payments.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: payments
    });
  } catch (error) {
    console.error('❌ Get Payments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payments',
      error: error.message
    });
  }
};

// @desc    Get user payments
// @route   GET /api/payments/my-payments
// @access  Private
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('booking', 'bookingReference checkInDate checkOutDate totalAmount')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    console.error('❌ Get My Payments Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payments',
      error: error.message
    });
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('booking');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Verify user owns this payment or is admin
    if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }

    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('❌ Get Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment',
      error: error.message
    });
  }
};

// @desc    Process refund
// @route   POST /api/payments/:id/refund
// @access  Private/Admin
export const processRefund = async (req, res) => {
  try {
    const { reason } = req.body;

    const payment = await Payment.findById(req.params.id)
      .populate('booking user');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed payments can be refunded'
      });
    }

    payment.status = 'refunded';
    payment.refundedAt = new Date();
    payment.refundReason = reason;
    await payment.save();

    // Update booking
    const booking = await Booking.findById(payment.booking);
    booking.paymentStatus = 'refunded';
    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      data: payment
    });
  } catch (error) {
    console.error('❌ Process Refund Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message
    });
  }
};
