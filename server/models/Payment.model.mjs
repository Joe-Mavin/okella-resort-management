import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Payment must be linked to a booking']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Payment must be linked to a user']
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'KES',
    enum: ['KES', 'USD', 'EUR']
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    enum: ['mpesa', 'card', 'cash', 'bank-transfer'],
    default: 'mpesa'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  // M-PESA specific fields
  mpesa: {
    phoneNumber: String,
    merchantRequestID: String,
    checkoutRequestID: String,
    transactionID: String,
    transactionDate: Date,
    resultCode: String,
    resultDesc: String
  },
  // Card payment fields
  card: {
    last4: String,
    brand: String,
    transactionId: String
  },
  transactionReference: {
    type: String,
    unique: true,
    sparse: true
  },
  paidAt: Date,
  refundedAt: Date,
  refundReason: String,
  metadata: {
    type: Map,
    of: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save hook to generate transaction reference
paymentSchema.pre('save', async function(next) {
  if (!this.transactionReference && this.status === 'completed') {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    this.transactionReference = `TXN-${timestamp}-${random}`;
  }
  next();
});

// Index for faster searches
paymentSchema.index({ booking: 1, status: 1 });
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ 'mpesa.transactionID': 1 });
paymentSchema.index({ transactionReference: 1 });

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
