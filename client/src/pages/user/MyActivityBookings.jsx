import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiCalendar, FiClock, FiMapPin, FiUsers } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import api from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'
import { format } from 'date-fns'

const MyActivityBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivityBookings()
  }, [])

  const fetchActivityBookings = async () => {
    try {
      setLoading(true)
      const response = await api.get('/activities/my-bookings')
      setBookings(response.data.data)
    } catch (error) {
      toast.error('Failed to load activity bookings')
      console.error('Error fetching activity bookings:', error)
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

  return (
    <>
      <Helmet>
        <title>My Activity Bookings - Luxury Coastal Resort</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold font-poppins mb-8">My Activity Bookings</h1>

          {loading ? (
            <LoadingSpinner />
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No activity bookings found</p>
              <a href="/activities" className="btn-primary inline-block">
                Browse Activities
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Activity Image */}
                  <div className="relative h-48">
                    <img
                      src={booking.activity?.images[0]?.url || 'https://via.placeholder.com/400x300'}
                      alt={booking.activity?.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={getStatusBadge(booking.status)}>
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-poppins mb-3">
                      {booking.activity?.title}
                    </h3>

                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiCalendar className="mr-2 text-primary-600" />
                        <span>{format(new Date(booking.bookingDate), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-2 text-primary-600" />
                        <span>{booking.timeSlot}</span>
                      </div>
                      <div className="flex items-center">
                        <FiUsers className="mr-2 text-primary-600" />
                        <span>{booking.participants} Participants</span>
                      </div>
                      <div className="flex items-center">
                        <FiMapPin className="mr-2 text-primary-600" />
                        <span>{booking.activity?.location}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-primary-600">
                            KES {booking.totalAmount.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">Total Amount</p>
                        </div>
                        <span className={`badge ${booking.paymentStatus === 'paid' ? 'badge-success' : 'badge-warning'}`}>
                          {booking.paymentStatus}
                        </span>
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

export default MyActivityBookings
