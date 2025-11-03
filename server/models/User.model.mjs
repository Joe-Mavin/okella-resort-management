import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    validate: {
      validator: function(v) {
        // Accept both formats: 254XXXXXXXXX or 07XXXXXXXX or +254XXXXXXXXX
        return /^(\+?254[0-9]{9}|0[7-9][0-9]{8})$/.test(v);
      },
      message: 'Please provide a valid Kenyan phone number (254XXXXXXXXX or 07XXXXXXXX)'
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['guest', 'staff', 'admin'],
    default: 'guest'
  },
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/demo/image/upload/avatar-default.png'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Normalize phone number format before saving
userSchema.pre('save', function(next) {
  if (this.isModified('phone')) {
    // Convert 07XXXXXXXX to 254XXXXXXXXX
    if (this.phone.startsWith('07') || this.phone.startsWith('08') || this.phone.startsWith('09')) {
      this.phone = '254' + this.phone.substring(1);
    }
    // Remove + if present
    if (this.phone.startsWith('+254')) {
      this.phone = this.phone.substring(1);
    }
  }
  next();
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual for bookings
userSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

// Virtual for reviews
userSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

const User = mongoose.model('User', userSchema);

export default User;
