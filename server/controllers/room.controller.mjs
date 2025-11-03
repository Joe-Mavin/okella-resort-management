import Room from '../models/Room.model.mjs';
import Booking from '../models/Booking.model.mjs';
import { uploadImage, deleteImage, uploadMultipleImages } from '../utils/cloudinary.utils.mjs';

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
export const getRooms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    // Filter by room type
    if (req.query.roomType) {
      query.roomType = req.query.roomType;
    }

    // Filter by view type
    if (req.query.viewType) {
      query.viewType = req.query.viewType;
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }

    // Filter by capacity
    if (req.query.adults) {
      query['capacity.adults'] = { $gte: parseInt(req.query.adults) };
    }

    // Sort options
    let sort = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sort = { price: 1 };
    if (req.query.sort === 'price-desc') sort = { price: -1 };
    if (req.query.sort === 'rating') sort = { averageRating: -1 };

    const rooms = await Room.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Room.countDocuments(query);

    res.status(200).json({
      success: true,
      count: rooms.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: rooms
    });
  } catch (error) {
    console.error('❌ Get Rooms Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get rooms',
      error: error.message
    });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: { path: 'user', select: 'name avatar' },
        options: { sort: { createdAt: -1 }, limit: 10 }
      });

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('❌ Get Room Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get room',
      error: error.message
    });
  }
};

// @desc    Create room
// @route   POST /api/rooms
// @access  Private/Admin
export const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    console.error('❌ Create Room Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create room',
      error: error.message
    });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: room
    });
  } catch (error) {
    console.error('❌ Update Room Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update room',
      error: error.message
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if room has active bookings
    const activeBookings = await Booking.countDocuments({
      room: req.params.id,
      status: { $in: ['pending', 'confirmed', 'checked-in'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with active bookings'
      });
    }

    // Delete images from Cloudinary
    if (room.images && room.images.length > 0) {
      for (const image of room.images) {
        if (image.publicId) {
          try {
            await deleteImage(image.publicId);
          } catch (err) {
            console.error('Failed to delete image:', err);
          }
        }
      }
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete Room Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete room',
      error: error.message
    });
  }
};

// @desc    Upload room images
// @route   POST /api/rooms/:id/images
// @access  Private/Admin
export const uploadRoomImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const uploadedImages = await uploadMultipleImages(req.files, 'rooms');

    // Add to room images
    room.images.push(...uploadedImages.map(img => ({
      url: img.url,
      publicId: img.publicId,
      caption: req.body.caption || ''
    })));

    await room.save();

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: room
    });
  } catch (error) {
    console.error('❌ Upload Images Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
};

// @desc    Check room availability
// @route   GET /api/rooms/:id/availability
// @access  Public
export const checkRoomAvailability = async (req, res) => {
  try {
    const { checkInDate, checkOutDate } = req.query;

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide check-in and check-out dates'
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const isAvailable = await Booking.checkAvailability(
      req.params.id,
      checkIn,
      checkOut
    );

    res.status(200).json({
      success: true,
      available: isAvailable,
      checkInDate: checkIn,
      checkOutDate: checkOut
    });
  } catch (error) {
    console.error('❌ Check Availability Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check availability',
      error: error.message
    });
  }
};

// @desc    Get available rooms for dates
// @route   GET /api/rooms/available
// @access  Public
export const getAvailableRooms = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, adults, children } = req.query;

    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide check-in and check-out dates'
      });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Get all active rooms
    const query = { isActive: true };
    
    if (adults) {
      query['capacity.adults'] = { $gte: parseInt(adults) };
    }
    
    if (children) {
      query['capacity.children'] = { $gte: parseInt(children) };
    }

    const allRooms = await Room.find(query);

    // Filter out booked rooms
    const availableRooms = [];
    for (const room of allRooms) {
      const isAvailable = await Booking.checkAvailability(room._id, checkIn, checkOut);
      if (isAvailable) {
        availableRooms.push(room);
      }
    }

    res.status(200).json({
      success: true,
      count: availableRooms.length,
      data: availableRooms
    });
  } catch (error) {
    console.error('❌ Get Available Rooms Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get available rooms',
      error: error.message
    });
  }
};
