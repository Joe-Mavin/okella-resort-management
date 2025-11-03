import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide activity title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide activity description'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Water Sports', 'Spa & Wellness', 'Tours', 'Entertainment', 'Dining', 'Adventure', 'Cultural', 'Family'],
    default: 'Entertainment'
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    caption: String
  }],
  price: {
    type: Number,
    required: [true, 'Please provide activity price'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number,
    required: [true, 'Please specify duration in minutes'],
    min: [15, 'Duration must be at least 15 minutes']
  },
  maxParticipants: {
    type: Number,
    required: [true, 'Please specify maximum participants'],
    min: [1, 'Must allow at least 1 participant']
  },
  minParticipants: {
    type: Number,
    default: 1,
    min: [1, 'Must require at least 1 participant']
  },
  ageRestriction: {
    minAge: {
      type: Number,
      default: 0
    },
    maxAge: {
      type: Number,
      default: 100
    }
  },
  location: {
    type: String,
    required: [true, 'Please provide activity location']
  },
  included: [{
    type: String,
    trim: true
  }],
  excluded: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  schedule: [{
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    availableSlots: {
      type: Number,
      required: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging', 'Extreme'],
    default: 'Easy'
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
  bookingCount: {
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
activitySchema.index({ category: 1, isActive: 1 });
activitySchema.index({ averageRating: -1 });

// Virtual for bookings
activitySchema.virtual('bookings', {
  ref: 'ActivityBooking',
  localField: '_id',
  foreignField: 'activity',
  justOne: false
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
