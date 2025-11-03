import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide an image title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  cloudinaryId: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['hero', 'rooms', 'dining', 'activities', 'facilities', 'exterior', 'views', 'events'],
    required: [true, 'Please specify image category'],
    default: 'facilities'
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metadata: {
    width: Number,
    height: Number,
    format: String,
    size: Number
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
gallerySchema.index({ category: 1, isActive: 1, order: 1 });
gallerySchema.index({ isFeatured: 1, isActive: 1 });
gallerySchema.index({ tags: 1 });

// Virtual for formatted file size
gallerySchema.virtual('formattedSize').get(function() {
  if (!this.metadata?.size) return 'Unknown';
  const size = this.metadata.size;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
});

const Gallery = mongoose.model('Gallery', gallerySchema);

export default Gallery;
