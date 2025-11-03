import Blog from '../models/Blog.model.mjs';
import { uploadImage, deleteImage } from '../utils/cloudinary.utils.mjs';

// @desc    Get all blogs
// @route   GET /api/blog
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { status: 'published' };

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.tag) {
      query.tags = req.query.tag;
    }

    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { excerpt: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: blogs
    });
  } catch (error) {
    console.error('❌ Get Blogs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blogs',
      error: error.message
    });
  }
};

// @desc    Get blog by slug
// @route   GET /api/blog/:slug
// @access  Public
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('author', 'name avatar email')
      .populate('comments.user', 'name avatar');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('❌ Get Blog Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get blog',
      error: error.message
    });
  }
};

// @desc    Create blog post
// @route   POST /api/blog
// @access  Private/Admin
export const createBlog = async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user.id
    };

    const blog = await Blog.create(blogData);
    await blog.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      data: blog
    });
  } catch (error) {
    console.error('❌ Create Blog Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create blog post',
      error: error.message
    });
  }
};

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Verify author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog post'
      });
    }

    blog = await Blog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    res.status(200).json({
      success: true,
      message: 'Blog post updated successfully',
      data: blog
    });
  } catch (error) {
    console.error('❌ Update Blog Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update blog post',
      error: error.message
    });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Verify author or admin
    if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog post'
      });
    }

    // Delete featured image from Cloudinary
    if (blog.featuredImage?.publicId) {
      try {
        await deleteImage(blog.featuredImage.publicId);
      } catch (err) {
        console.error('Failed to delete featured image:', err);
      }
    }

    // Delete additional images
    if (blog.images && blog.images.length > 0) {
      for (const image of blog.images) {
        if (image.publicId) {
          try {
            await deleteImage(image.publicId);
          } catch (err) {
            console.error('Failed to delete image:', err);
          }
        }
      }
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete Blog Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete blog post',
      error: error.message
    });
  }
};

// @desc    Like/Unlike blog post
// @route   PUT /api/blog/:id/like
// @access  Private
export const toggleLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    const likeIndex = blog.likes.indexOf(req.user.id);

    if (likeIndex > -1) {
      // Unlike
      blog.likes.splice(likeIndex, 1);
    } else {
      // Like
      blog.likes.push(req.user.id);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      liked: likeIndex === -1,
      likesCount: blog.likes.length,
      data: blog
    });
  } catch (error) {
    console.error('❌ Toggle Like Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like/unlike blog post',
      error: error.message
    });
  }
};

// @desc    Add comment to blog post
// @route   POST /api/blog/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    const comment = {
      user: req.user.id,
      comment: req.body.comment
    };

    blog.comments.push(comment);
    await blog.save();
    await blog.populate('comments.user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: blog.comments[blog.comments.length - 1]
    });
  } catch (error) {
    console.error('❌ Add Comment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message
    });
  }
};

// @desc    Delete comment from blog post
// @route   DELETE /api/blog/:id/comments/:commentId
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    const comment = blog.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Verify user owns comment or is admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    comment.deleteOne();
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete Comment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete comment',
      error: error.message
    });
  }
};

// @desc    Get featured blogs
// @route   GET /api/blog/featured
// @access  Public
export const getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({
      status: 'published',
      isFeatured: true
    })
      .populate('author', 'name avatar')
      .sort({ publishedAt: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    console.error('❌ Get Featured Blogs Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get featured blogs',
      error: error.message
    });
  }
};
