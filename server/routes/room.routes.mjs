import express from 'express';
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  uploadRoomImages,
  checkRoomAvailability,
  getAvailableRooms
} from '../controllers/room.controller.mjs';
import { protect, authorize } from '../middleware/auth.middleware.mjs';

const router = express.Router();

router.get('/', getRooms);
router.get('/available', getAvailableRooms);
router.get('/:id', getRoomById);
router.get('/:id/availability', checkRoomAvailability);

// Protected routes
router.post('/', protect, authorize('admin'), createRoom);
router.put('/:id', protect, authorize('admin'), updateRoom);
router.delete('/:id', protect, authorize('admin'), deleteRoom);
router.post('/:id/images', protect, authorize('admin'), uploadRoomImages);

export default router;
