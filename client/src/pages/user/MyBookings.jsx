import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiEye } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import bookingService from '../../services/bookingService'
import LoadingSpinner from '../../components/LoadingSpinner'
import { format } from 'date-fns'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await bookingService.getMyBookings()
      setBookings(response.data)
    } catch (error) {
      toast.error('Failed to load bookings')
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
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

  const getPaymentBadge = (status) => {
    const statusClasses = {
      pending: 'badge-warning',
      paid: 'badge-success',
      failed: 'badge-danger',
      refunded: 'badge-info'
    }
    return `badge ${statusClasses[status] || 'badge-warning'} capitalize`
  }

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    return booking.status === filter
  })

  return (
    <>
      <Helmet>
        <title>My Bookings - Luxury Coastal Resort</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold font-poppins">My Bookings</h1>
            
            {/* Filter */}
            <div className="flex space-x-2">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    filter === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No bookings found</p>
              <Link to="/rooms" className="btn-primary inline-block">
                Browse Rooms
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredBookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="md:flex">
                    {/* Room Image */}
                    <div className="md:w-1/3">
                      <img
                        src={booking.room?.images[0]?.url || 'https://via.placeholder.com/400x300'}
                        alt={booking.room?.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>

                    {/* Booking Details */}
                    <div className="md:w-2/3 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold font-poppins mb-2">
                            {booking.room?.title}
                          </h3>
                          <p className="text-gray-600">
                            Booking Reference: <span className="font-semibold">{booking.bookingReference}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={getStatusBadge(booking.status)}>
                            {booking.status}
                          </span>
                          <br />
                          <span className={getPaymentBadge(booking.paymentStatus)}>
                            {booking.paymentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center text-gray-600">
                          <FiCalendar className="mr-2 text-primary-600" />
                          <span>Check-in: {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FiCalendar className="mr-2 text-primary-600" />
                          <span>Check-out: {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FiClock className="mr-2 text-primary-600" />
                          <span>{booking.numberOfNights} {booking.numberOfNights === 1 ? 'Night' : 'Nights'}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FiUsers className="mr-2 text-primary-600" />
                          <span>{booking.guests.adults + booking.guests.children} Guests</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-3xl font-bold text-primary-600">
                            KES {booking.totalAmount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">Total Amount</p>
                        </div>
                        <Link
                          to={`/bookings/${booking._id}`}
                          className="btn-primary flex items-center"
                        >
                          <FiEye className="mr-2" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default MyBookings
