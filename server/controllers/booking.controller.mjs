import Booking from '../models/Booking.model.mjs';
import Room from '../models/Room.model.mjs';
import User from '../models/User.model.mjs';

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, guests, specialRequests } = req.body;

    // Validate input
    if (!roomId || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Get room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    if (!room.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This room is not available for booking'
      });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkIn < today) {
      return res.status(400).json({
        success: false,
        message: 'Check-in date cannot be in the past'
      });
    }

    if (checkOut <= checkIn) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }

    // Calculate number of nights
    const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    // Check room availability
    const isAvailable = await Booking.checkAvailability(roomId, checkIn, checkOut);
    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Room is not available for selected dates'
      });
    }

    // Validate capacity
    if (guests.adults > room.capacity.adults || guests.children > room.capacity.children) {
      return res.status(400).json({
        success: false,
        message: 'Number of guests exceeds room capacity'
      });
    }

    // Calculate total amount
    const totalAmount = room.price * numberOfNights;

    // Get user details
    const user = await User.findById(req.user.id);

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      room: roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      numberOfNights,
      totalAmount,
      specialRequests,
      guestDetails: {
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

    // Populate room details
    await booking.populate('room');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('❌ Create Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.paymentStatus) {
      query.paymentStatus = req.query.paymentStatus;
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('room', 'title roomNumber roomType price images')
      .populate('payment')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      data: bookings
    });
  } catch (error) {
    console.error('❌ Get All Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings',
      error: error.message
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('room', 'title roomNumber roomType price images viewType')
      .populate('payment')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('❌ Get My Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings',
      error: error.message
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone avatar')
      .populate('room')
      .populate('payment');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify user owns this booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('❌ Get Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking',
      error: error.message
    });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify user owns this booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // Don't allow updates to confirmed or checked-in bookings
    if (['confirmed', 'checked-in', 'checked-out'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update booking in current status'
      });
    }

    const { checkInDate, checkOutDate, guests, specialRequests } = req.body;

    if (checkInDate || checkOutDate) {
      const checkIn = checkInDate ? new Date(checkInDate) : booking.checkInDate;
      const checkOut = checkOutDate ? new Date(checkOutDate) : booking.checkOutDate;

      // Validate dates
      if (checkOut <= checkIn) {
        return res.status(400).json({
          success: false,
          message: 'Check-out date must be after check-in date'
        });
      }

      // Check availability for new dates
      const isAvailable = await Booking.checkAvailability(
        booking.room,
        checkIn,
        checkOut,
        booking._id
      );

      if (!isAvailable) {
        return res.status(400).json({
          success: false,
          message: 'Room is not available for selected dates'
        });
      }

      // Recalculate
      const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const room = await Room.findById(booking.room);
      const totalAmount = room.price * numberOfNights;

      booking.checkInDate = checkIn;
      booking.checkOutDate = checkOut;
      booking.numberOfNights = numberOfNights;
      booking.totalAmount = totalAmount;
    }

    if (guests) {
      booking.guests = guests;
    }

    if (specialRequests !== undefined) {
      booking.specialRequests = specialRequests;
    }

    await booking.save();
    await booking.populate('room');

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('❌ Update Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
      error: error.message
    });
  }
};

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Verify user owns this booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Don't allow cancellation of checked-in or checked-out bookings
    if (['checked-in', 'checked-out'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking in current status'
      });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    booking.cancelledAt = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('❌ Cancel Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};

// @desc    Check-in booking
// @route   PUT /api/bookings/:id/checkin
// @access  Private/Admin/Staff
export const checkInBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Only confirmed bookings can be checked in'
      });
    }

    booking.status = 'checked-in';
    booking.checkInTime = new Date();
    await booking.save();

    // Update room status
    await Room.findByIdAndUpdate(booking.room, { status: 'booked' });

    res.status(200).json({
      success: true,
      message: 'Guest checked in successfully',
      data: booking
    });
  } catch (error) {
    console.error('❌ Check-in Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check in',
      error: error.message
    });
  }
};

// @desc    Check-out booking
// @route   PUT /api/bookings/:id/checkout
// @access  Private/Admin/Staff
export const checkOutBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'checked-in') {
      return res.status(400).json({
        success: false,
        message: 'Only checked-in guests can be checked out'
      });
    }

    booking.status = 'checked-out';
    booking.checkOutTime = new Date();
    await booking.save();

    // Update room status
    await Room.findByIdAndUpdate(booking.room, { status: 'available' });

    res.status(200).json({
      success: true,
      message: 'Guest checked out successfully',
      data: booking
    });
  } catch (error) {
    console.error('❌ Check-out Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check out',
      error: error.message
    });
  }
};

// @desc    Get booking statistics
// @route   GET /api/bookings/stats/overview
// @access  Private/Admin
export const getBookingStats = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const checkedInBookings = await Booking.countDocuments({ status: 'checked-in' });

    // Calculate total revenue
    const revenueData = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } }
    ]);

    const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // Monthly bookings
    const monthlyBookings = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBookings,
        confirmedBookings,
        pendingBookings,
        cancelledBookings,
        checkedInBookings,
        totalRevenue,
        monthlyBookings
      }
    });
  } catch (error) {
    console.error('❌ Get Booking Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking statistics',
      error: error.message
    });
  }
};
