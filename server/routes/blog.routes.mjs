import express from 'express';
import {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
  deleteComment,
  getFeaturedBlogs
} from '../controllers/blog.controller.mjs';
import { protect, authorize } from '../middleware/auth.middleware.mjs';

const router = express.Router();

// Public routes
router.get('/', getBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/:slug', getBlogBySlug);

// Protected routes
router.post('/', protect, authorize('admin', 'staff'), createBlog);
router.put('/:id', protect, authorize('admin', 'staff'), updateBlog);
router.delete('/:id', protect, authorize('admin', 'staff'), deleteBlog);
router.put('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

export default router;
