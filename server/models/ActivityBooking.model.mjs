import mongoose from 'mongoose';

const activityBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user']
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: [true, 'Please select an activity']
  },
  bookingDate: {
    type: Date,
    required: [true, 'Please provide booking date']
  },
  timeSlot: {
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    }
  },
  participants: {
    adults: {
      type: Number,
      required: true,
      min: [1, 'At least one adult is required']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Children count cannot be negative']
    }
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  bookingReference: {
    type: String,
    unique: true,
    required: true
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  cancellationReason: String,
  cancelledAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Pre-save hook to generate booking reference
activityBookingSchema.pre('save', async function(next) {
  if (!this.bookingReference) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    this.bookingReference = `ACT-${timestamp}-${random}`;
  }
  next();
});

// Index for faster searches
activityBookingSchema.index({ user: 1, status: 1 });
activityBookingSchema.index({ activity: 1, bookingDate: 1 });
activityBookingSchema.index({ bookingReference: 1 });

const ActivityBooking = mongoose.model('ActivityBooking', activityBookingSchema);

export default ActivityBooking;
