import express from 'express';
import {
  getGalleryImages,
  getGalleryImage,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  getGalleryStats,
  upload
} from '../controllers/gallery.controller.mjs';
import { protect, authorize } from '../middleware/auth.middleware.mjs';

const router = express.Router();

// Public routes
router.get('/', getGalleryImages);
router.get('/:id', getGalleryImage);

// Protected routes (Admin/Staff only)
router.use(protect);
router.use(authorize('admin', 'staff'));

router.post('/', upload.single('image'), uploadGalleryImage);
router.put('/:id', updateGalleryImage);
router.delete('/:id', deleteGalleryImage);
router.get('/admin/stats', getGalleryStats);

export default router;
