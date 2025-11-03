import Activity from '../models/Activity.model.mjs';
import ActivityBooking from '../models/ActivityBooking.model.mjs';

// @desc    Get all activities
// @route   GET /api/activities
// @access  Public
export const getActivities = async (req, res) => {
  try {
    const query = { isActive: true };

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.difficulty) {
      query.difficulty = req.query.difficulty;
    }

    const activities = await Activity.find(query).sort({ averageRating: -1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities
    });
  } catch (error) {
    console.error('❌ Get Activities Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get activities',
      error: error.message
    });
  }
};

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Public
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('❌ Get Activity Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get activity',
      error: error.message
    });
  }
};

// @desc    Create activity
// @route   POST /api/activities
// @access  Private/Admin
export const createActivity = async (req, res) => {
  try {
    const activity = await Activity.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Activity created successfully',
      data: activity
    });
  } catch (error) {
    console.error('❌ Create Activity Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create activity',
      error: error.message
    });
  }
};

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private/Admin
export const updateActivity = async (req, res) => {
  try {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Activity updated successfully',
      data: activity
    });
  } catch (error) {
    console.error('❌ Update Activity Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update activity',
      error: error.message
    });
  }
};

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private/Admin
export const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    await activity.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete Activity Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete activity',
      error: error.message
    });
  }
};

// @desc    Book activity
// @route   POST /api/activities/:id/book
// @access  Private
export const bookActivity = async (req, res) => {
  try {
    const { bookingDate, timeSlot, participants } = req.body;

    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity not found'
      });
    }

    if (!activity.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This activity is not available for booking'
      });
    }

    const totalParticipants = participants.adults + participants.children;
    if (totalParticipants < activity.minParticipants) {
      return res.status(400).json({
        success: false,
        message: `Minimum ${activity.minParticipants} participants required`
      });
    }

    if (totalParticipants > activity.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: `Maximum ${activity.maxParticipants} participants allowed`
      });
    }

    const totalAmount = activity.price * totalParticipants;

    const booking = await ActivityBooking.create({
      user: req.user.id,
      activity: req.params.id,
      bookingDate,
      timeSlot,
      participants,
      totalAmount
    });

    await booking.populate('activity');

    res.status(201).json({
      success: true,
      message: 'Activity booked successfully',
      data: booking
    });
  } catch (error) {
    console.error('❌ Book Activity Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book activity',
      error: error.message
    });
  }
};

// @desc    Get activity bookings
// @route   GET /api/activities/bookings/my-bookings
// @access  Private
export const getMyActivityBookings = async (req, res) => {
  try {
    const bookings = await ActivityBooking.find({ user: req.user.id })
      .populate('activity')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('❌ Get Activity Bookings Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get activity bookings',
      error: error.message
    });
  }
};

// @desc    Cancel activity booking
// @route   DELETE /api/activities/bookings/:id
// @access  Private
export const cancelActivityBooking = async (req, res) => {
  try {
    const booking = await ActivityBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    if (booking.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel completed booking'
      });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Activity booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('❌ Cancel Activity Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message
    });
  }
};
