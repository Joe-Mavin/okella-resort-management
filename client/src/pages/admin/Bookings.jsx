import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiUser, FiDollarSign, FiFilter } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import bookingService from '../../services/bookingService'
import LoadingSpinner from '../../components/LoadingSpinner'
import { format } from 'date-fns'

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await bookingService.getAllBookings()
      setBookings(response.data)
    } catch (error) {
      toast.error('Failed to load bookings')
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (id, status) => {
    try {
      await bookingService.updateBooking(id, { status })
      toast.success(`Booking ${status} successfully`)
      fetchBookings()
    } catch (error) {
      toast.error('Failed to update booking status')
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-warning',
      confirmed: 'badge-success',
      cancelled: 'badge-danger',
      completed: 'badge-info'
    }
    return `badge ${statusClasses[status] || 'badge-info'} capitalize`
  }

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    return booking.status === filter
  })

  return (
    <>
      <Helmet>
        <title>Manage Bookings - Admin Dashboard</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-poppins mb-2">Manage Bookings</h1>
            <p className="text-gray-600">View and manage all guest reservations</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[
              { label: 'Total Bookings', value: bookings.length, color: 'blue' },
              { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'yellow' },
              { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'green' },
              { label: 'Completed', value: bookings.filter(b => b.status === 'completed').length, color: 'purple' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex items-center space-x-3">
              <FiFilter className="text-gray-400" />
              <div className="flex flex-wrap gap-3">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                      filter === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No bookings found</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Guest
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check-in
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nights
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBookings.map((booking, index) => (
                      <motion.tr
                        key={booking._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-medium text-gray-900">{booking.bookingReference}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiUser className="text-gray-400 mr-2" />
                            <div>
                              <p className="font-medium text-gray-900">{booking.user?.name}</p>
                              <p className="text-sm text-gray-500">{booking.user?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-medium text-gray-900">{booking.room?.title}</p>
                          <p className="text-sm text-gray-500">Room #{booking.room?.roomNumber}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiCalendar className="text-gray-400 mr-2" />
                            <p className="text-gray-900">
                              {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {booking.numberOfNights}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiDollarSign className="text-gray-400 mr-1" />
                            <p className="font-semibold text-gray-900">
                              {booking.totalAmount.toLocaleString()}
                            </p>
                          </div>
                          <p className={`text-sm ${
                            booking.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {booking.paymentStatus}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(booking.status)}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <select
                            value={booking.status}
                            onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                            className="input-field text-sm py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminBookings
