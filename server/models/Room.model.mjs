import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide room title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide room description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  roomType: {
    type: String,
    required: [true, 'Please specify room type'],
    enum: ['Standard', 'Deluxe', 'Suite', 'Presidential', 'Villa', 'Cottage'],
    default: 'Standard'
  },
  price: {
    type: Number,
    required: [true, 'Please provide room price'],
    min: [0, 'Price cannot be negative']
  },
  capacity: {
    adults: {
      type: Number,
      required: true,
      default: 2,
      min: [1, 'Room must accommodate at least 1 adult']
    },
    children: {
      type: Number,
      default: 0,
      min: [0, 'Children capacity cannot be negative']
    }
  },
  bedType: {
    type: String,
    enum: ['Single', 'Double', 'Queen', 'King', 'Twin'],
    default: 'Queen'
  },
  size: {
    type: Number,
    required: [true, 'Please provide room size in square meters'],
    min: [10, 'Room size must be at least 10 sqm']
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    caption: String
  }],
  status: {
    type: String,
    enum: ['available', 'booked', 'maintenance'],
    default: 'available'
  },
  viewType: {
    type: String,
    enum: ['Ocean View', 'Garden View', 'Pool View', 'City View', 'Mountain View'],
    default: 'Garden View'
  },
  floor: {
    type: Number,
    min: [0, 'Floor number cannot be negative']
  },
  roomNumber: {
    type: String,
    required: [true, 'Please provide room number'],
    unique: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster searches
roomSchema.index({ roomType: 1, status: 1, price: 1 });
roomSchema.index({ averageRating: -1 });

// Virtual for bookings
roomSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'room',
  justOne: false
});

// Virtual for reviews
roomSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'room',
  justOne: false
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
