import Gallery from '../models/Gallery.model.mjs';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @desc    Get all gallery images
// @route   GET /api/gallery
// @access  Public
export const getGalleryImages = async (req, res) => {
  try {
    const { category, featured, active = 'true', limit, page = 1 } = req.query;
    
    // Build query
    const query = {};
    if (category) query.category = category;
    if (featured) query.isFeatured = featured === 'true';
    if (active) query.isActive = active === 'true';

    // Build aggregation pipeline
    const pipeline = [
      { $match: query },
      { $sort: { order: 1, createdAt: -1 } }
    ];

    // Add pagination if limit is specified
    if (limit) {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: parseInt(limit) });
    }

    // Populate uploader info
    pipeline.push({
      $lookup: {
        from: 'users',
        localField: 'uploadedBy',
        foreignField: '_id',
        as: 'uploader',
        pipeline: [{ $project: { name: 1, email: 1 } }]
      }
    });

    const images = await Gallery.aggregate(pipeline);

    // Get total count for pagination
    const total = await Gallery.countDocuments(query);

    res.status(200).json({
      success: true,
      count: images.length,
      total,
      pagination: limit ? {
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      } : null,
      data: images
    });
  } catch (error) {
    console.error('❌ Get Gallery Images Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery images',
      error: error.message
    });
  }
};

// @desc    Get single gallery image
// @route   GET /api/gallery/:id
// @access  Public
export const getGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id).populate('uploadedBy', 'name email');

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    res.status(200).json({
      success: true,
      data: image
    });
  } catch (error) {
    console.error('❌ Get Gallery Image Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch image',
      error: error.message
    });
  }
};

// @desc    Upload new gallery image
// @route   POST /api/gallery
// @access  Private (Admin/Staff)
export const uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an image file'
      });
    }

    const { title, description, category, tags, isFeatured, order } = req.body;

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'okella-resort/gallery',
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    // Create gallery entry
    const image = await Gallery.create({
      title,
      description,
      imageUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      category: category || 'facilities',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isFeatured: isFeatured === 'true',
      order: order ? parseInt(order) : 0,
      uploadedBy: req.user.id,
      metadata: {
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        size: uploadResult.bytes
      }
    });

    await image.populate('uploadedBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Image uploaded successfully',
      data: image
    });
  } catch (error) {
    console.error('❌ Upload Gallery Image Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
};

// @desc    Update gallery image
// @route   PUT /api/gallery/:id
// @access  Private (Admin/Staff)
export const updateGalleryImage = async (req, res) => {
  try {
    const { title, description, category, tags, isFeatured, order, isActive } = req.body;

    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Update fields
    if (title !== undefined) image.title = title;
    if (description !== undefined) image.description = description;
    if (category !== undefined) image.category = category;
    if (tags !== undefined) image.tags = tags.split(',').map(tag => tag.trim());
    if (isFeatured !== undefined) image.isFeatured = isFeatured === 'true';
    if (order !== undefined) image.order = parseInt(order);
    if (isActive !== undefined) image.isActive = isActive === 'true';

    await image.save();
    await image.populate('uploadedBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Image updated successfully',
      data: image
    });
  } catch (error) {
    console.error('❌ Update Gallery Image Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update image',
      error: error.message
    });
  }
};

// @desc    Delete gallery image
// @route   DELETE /api/gallery/:id
// @access  Private (Admin/Staff)
export const deleteGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(image.cloudinaryId);
    } catch (cloudinaryError) {
      console.error('❌ Cloudinary deletion error:', cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await Gallery.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete Gallery Image Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete image',
      error: error.message
    });
  }
};

// @desc    Get gallery statistics
// @route   GET /api/gallery/stats
// @access  Private (Admin/Staff)
export const getGalleryStats = async (req, res) => {
  try {
    const stats = await Gallery.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          featured: { $sum: { $cond: ['$isFeatured', 1, 0] } },
          active: { $sum: { $cond: ['$isActive', 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const totalImages = await Gallery.countDocuments();
    const featuredImages = await Gallery.countDocuments({ isFeatured: true });
    const activeImages = await Gallery.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: {
        total: totalImages,
        featured: featuredImages,
        active: activeImages,
        byCategory: stats
      }
    });
  } catch (error) {
    console.error('❌ Get Gallery Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery statistics',
      error: error.message
    });
  }
};
