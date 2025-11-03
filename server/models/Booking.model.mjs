import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user']
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Please select a room']
  },
  checkInDate: {
    type: Date,
    required: [true, 'Please provide check-in date']
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Please provide check-out date']
  },
  guests: {
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
  numberOfNights: {
    type: Number,
    required: true,
    min: [1, 'Booking must be for at least one night']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  specialRequests: {
    type: String,
    maxlength: [500, 'Special requests cannot exceed 500 characters']
  },
  guestDetails: {
    name: String,
    email: String,
    phone: String
  },
  bookingReference: {
    type: String,
    unique: true,
    required: true
  },
  checkInTime: Date,
  checkOutTime: Date,
  cancellationReason: String,
  cancelledAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Pre-save hook to generate booking reference
bookingSchema.pre('save', async function(next) {
  if (!this.bookingReference) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5).toUpperCase();
    this.bookingReference = `RES-${timestamp}-${random}`;
  }
  next();
});

// Index for faster searches
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ room: 1, checkInDate: 1, checkOutDate: 1 });
bookingSchema.index({ bookingReference: 1 });

// Method to check if dates overlap with existing bookings
bookingSchema.statics.checkAvailability = async function(roomId, checkIn, checkOut, excludeBookingId = null) {
  const query = {
    room: roomId,
    status: { $nin: ['cancelled'] },
    $or: [
      {
        checkInDate: { $lte: checkOut },
        checkOutDate: { $gte: checkIn }
      }
    ]
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflictingBookings = await this.find(query);
  return conflictingBookings.length === 0;
};

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
