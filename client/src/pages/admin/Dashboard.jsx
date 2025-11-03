import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUsers, FiHome, FiDollarSign, FiCalendar, FiTrendingUp, FiArrowUp, FiArrowDown } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import api from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/stats')
      setStats(response.data.data)
    } catch (error) {
      toast.error('Failed to load dashboard statistics')
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      change: '+12%',
      positive: true,
      icon: <FiCalendar size={24} />,
      color: 'blue',
      link: '/admin/bookings'
    },
    {
      title: 'Total Revenue',
      value: `KES ${(stats?.totalRevenue || 0).toLocaleString()}`,
      change: '+18%',
      positive: true,
      icon: <FiDollarSign size={24} />,
      color: 'green',
      link: '/admin/payments'
    },
    {
      title: 'Active Rooms',
      value: stats?.activeRooms || 0,
      change: '+2',
      positive: true,
      icon: <FiHome size={24} />,
      color: 'purple',
      link: '/admin/rooms'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: '+5%',
      positive: true,
      icon: <FiUsers size={24} />,
      color: 'orange',
      link: '/admin/users'
    }
  ]

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Luxury Coastal Resort</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-poppins mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={stat.link}
                  className="block bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[stat.color]}`}>
                      {stat.icon}
                    </div>
                    <div className={`flex items-center text-sm font-medium ${
                      stat.positive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.positive ? <FiArrowUp className="mr-1" /> : <FiArrowDown className="mr-1" />}
                      {stat.change}
                    </div>
                  </div>
                  <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-poppins">Recent Bookings</h2>
                <Link to="/admin/bookings" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {stats?.recentBookings?.slice(0, 5).map((booking, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">{booking.bookingReference}</p>
                      <p className="text-sm text-gray-600">{booking.room?.title}</p>
                    </div>
                    <span className={`badge ${
                      booking.status === 'confirmed' ? 'badge-success' :
                      booking.status === 'pending' ? 'badge-warning' :
                      'badge-info'
                    } capitalize`}>
                      {booking.status}
                    </span>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-8">No recent bookings</p>
                )}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <h2 className="text-xl font-bold font-poppins mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link
                  to="/admin/rooms"
                  className="flex flex-col items-center justify-center p-6 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <FiHome className="text-primary-600 mb-2" size={32} />
                  <span className="text-sm font-medium text-gray-900">Manage Rooms</span>
                </Link>
                <Link
                  to="/admin/bookings"
                  className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <FiCalendar className="text-green-600 mb-2" size={32} />
                  <span className="text-sm font-medium text-gray-900">View Bookings</span>
                </Link>
                <Link
                  to="/admin/users"
                  className="flex flex-col items-center justify-center p-6 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  <FiUsers className="text-orange-600 mb-2" size={32} />
                  <span className="text-sm font-medium text-gray-900">Manage Users</span>
                </Link>
                <Link
                  to="/admin/payments"
                  className="flex flex-col items-center justify-center p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <FiDollarSign className="text-purple-600 mb-2" size={32} />
                  <span className="text-sm font-medium text-gray-900">View Payments</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Revenue Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-white rounded-xl shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold font-poppins">Revenue Overview</h2>
              <div className="flex items-center text-green-600">
                <FiTrendingUp className="mr-2" />
                <span className="text-sm font-medium">+18% from last month</span>
              </div>
            </div>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500">Chart visualization will be displayed here</p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default Dashboard
