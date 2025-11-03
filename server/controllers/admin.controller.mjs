import User from '../models/User.model.mjs';
import Room from '../models/Room.model.mjs';
import Booking from '../models/Booking.model.mjs';
import Payment from '../models/Payment.model.mjs';
import Review from '../models/Review.model.mjs';
import Activity from '../models/Activity.model.mjs';

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Total counts
    const totalUsers = await User.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Booking stats
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const checkedInBookings = await Booking.countDocuments({ status: 'checked-in' });
    const completedBookings = await Booking.countDocuments({ status: 'checked-out' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });

    // Revenue stats
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: new Date(new Date().setDate(1)) }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Recent bookings
    const recentBookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('room', 'title roomNumber roomType')
      .sort({ createdAt: -1 })
      .limit(10);

    // Monthly trends
    const last6Months = new Date();
    last6Months.setMonth(last6Months.getMonth() - 6);

    const monthlyTrends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: last6Months }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Room occupancy
    const today = new Date();
    const occupiedRooms = await Booking.countDocuments({
      status: 'checked-in',
      checkInDate: { $lte: today },
      checkOutDate: { $gte: today }
    });
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms * 100).toFixed(2) : 0;

    // Payment stats
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const completedPayments = await Payment.countDocuments({ status: 'completed' });
    const failedPayments = await Payment.countDocuments({ status: 'failed' });

    // Top rated rooms
    const topRatedRooms = await Room.find({ averageRating: { $gt: 0 } })
      .sort({ averageRating: -1 })
      .limit(5)
      .select('title roomNumber roomType averageRating totalReviews images');

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalRooms,
          totalBookings,
          totalReviews,
          totalRevenue: totalRevenue[0]?.total || 0,
          monthlyRevenue: monthlyRevenue[0]?.total || 0,
          occupancyRate,
          occupiedRooms,
          availableRooms: totalRooms - occupiedRooms
        },
        bookings: {
          pending: pendingBookings,
          confirmed: confirmedBookings,
          checkedIn: checkedInBookings,
          completed: completedBookings,
          cancelled: cancelledBookings
        },
        payments: {
          pending: pendingPayments,
          completed: completedPayments,
          failed: failedPayments
        },
        recentBookings,
        monthlyTrends,
        topRatedRooms
      }
    });
  } catch (error) {
    console.error('❌ Get Dashboard Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get revenue analytics
// @route   GET /api/admin/analytics/revenue
// @access  Private/Admin
export const getRevenueAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

    let groupBy = {};
    if (period === 'day') {
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      };
    } else if (period === 'month') {
      groupBy = {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' }
      };
    } else if (period === 'year') {
      groupBy = {
        year: { $year: '$createdAt' }
      };
    }

    const revenueData = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: '$amount' },
          transactionCount: { $sum: 1 },
          avgTransaction: { $avg: '$amount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
      { $limit: 30 }
    ]);

    // Payment method breakdown
    const paymentMethodBreakdown = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        revenueData,
        paymentMethodBreakdown
      }
    });
  } catch (error) {
    console.error('❌ Get Revenue Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get revenue analytics',
      error: error.message
    });
  }
};

// @desc    Get booking analytics
// @route   GET /api/admin/analytics/bookings
// @access  Private/Admin
export const getBookingAnalytics = async (req, res) => {
  try {
    // Booking status distribution
    const statusDistribution = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Room type popularity
    const roomTypePopularity = await Booking.aggregate([
      {
        $lookup: {
          from: 'rooms',
          localField: 'room',
          foreignField: '_id',
          as: 'roomDetails'
        }
      },
      { $unwind: '$roomDetails' },
      {
        $group: {
          _id: '$roomDetails.roomType',
          bookings: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { bookings: -1 } }
    ]);

    // Average booking value
    const avgBookingValue = await Booking.aggregate([
      {
        $group: {
          _id: null,
          avgValue: { $avg: '$totalAmount' },
          avgNights: { $avg: '$numberOfNights' }
        }
      }
    ]);

    // Booking lead time
    const bookingLeadTime = await Booking.aggregate([
      {
        $project: {
          leadTime: {
            $divide: [
              { $subtract: ['$checkInDate', '$createdAt'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgLeadTime: { $avg: '$leadTime' }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        statusDistribution,
        roomTypePopularity,
        avgBookingValue: avgBookingValue[0] || { avgValue: 0, avgNights: 0 },
        avgLeadTime: bookingLeadTime[0]?.avgLeadTime || 0
      }
    });
  } catch (error) {
    console.error('❌ Get Booking Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get booking analytics',
      error: error.message
    });
  }
};

// @desc    Get user analytics
// @route   GET /api/admin/analytics/users
// @access  Private/Admin
export const getUserAnalytics = async (req, res) => {
  try {
    // User growth over time
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    // User role distribution
    const roleDistribution = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Top customers by bookings
    const topCustomers = await Booking.aggregate([
      {
        $group: {
          _id: '$user',
          totalBookings: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          name: '$userDetails.name',
          email: '$userDetails.email',
          totalBookings: 1,
          totalSpent: 1
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        userGrowth,
        roleDistribution,
        topCustomers
      }
    });
  } catch (error) {
    console.error('❌ Get User Analytics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user analytics',
      error: error.message
    });
  }
};

// @desc    Export data
// @route   GET /api/admin/export/:type
// @access  Private/Admin
export const exportData = async (req, res) => {
  try {
    const { type } = req.params;
    let data = [];

    switch (type) {
      case 'bookings':
        data = await Booking.find()
          .populate('user', 'name email phone')
          .populate('room', 'title roomNumber roomType')
          .lean();
        break;
      case 'users':
        data = await User.find().select('-password').lean();
        break;
      case 'payments':
        data = await Payment.find()
          .populate('user', 'name email')
          .populate('booking', 'bookingReference')
          .lean();
        break;
      case 'reviews':
        data = await Review.find()
          .populate('user', 'name email')
          .populate('room', 'title roomNumber')
          .lean();
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid export type'
        });
    }

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    console.error('❌ Export Data Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export data',
      error: error.message
    });
  }
};
