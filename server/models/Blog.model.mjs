import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide blog title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide blog excerpt'],
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide blog content']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Blog must have an author']
  },
  featuredImage: {
    url: {
      type: String,
      required: [true, 'Please provide a featured image']
    },
    publicId: String,
    caption: String
  },
  images: [{
    url: String,
    publicId: String,
    caption: String
  }],
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: ['Travel Tips', 'Resort News', 'Local Attractions', 'Events', 'Wellness', 'Dining', 'Activities']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isFeature: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  publishedAt: Date,
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate slug from title
blogSchema.pre('save', async function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    // Ensure unique slug
    const existingBlog = await this.constructor.findOne({ slug: this.slug });
    if (existingBlog) {
      this.slug = `${this.slug}-${Date.now()}`;
    }
  }
  
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  next();
});

// Index for faster searches
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1, status: 1, publishedAt: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ status: 1, createdAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
