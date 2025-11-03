import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCalendar, FiUsers, FiClock, FiMapPin, FiDollarSign, FiArrowLeft, FiDownload, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import bookingService from '../../services/bookingService'
import LoadingSpinner from '../../components/LoadingSpinner'
import { format } from 'date-fns'

const BookingDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  useEffect(() => {
    fetchBookingDetails()
  }, [id])

  const fetchBookingDetails = async () => {
    try {
      setLoading(true)
      const response = await bookingService.getBookingById(id)
      setBooking(response.data)
    } catch (error) {
      toast.error('Failed to load booking details')
      console.error('Error fetching booking:', error)
      navigate('/my-bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async () => {
    if (!cancelReason.trim()) {
      toast.error('Please provide a cancellation reason')
      return
    }

    setCancelLoading(true)
    try {
      await bookingService.cancelBooking(id, cancelReason)
      toast.success('Booking cancelled successfully')
      setShowCancelModal(false)
      fetchBookingDetails()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setCancelLoading(false)
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

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!booking) {
    return null
  }

  return (
    <>
      <Helmet>
        <title>Booking Details - {booking.bookingReference}</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={() => navigate('/my-bookings')}
            className="flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <FiArrowLeft className="mr-2" />
            Back to My Bookings
          </button>

          {/* Header */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold font-poppins mb-2">
                  Booking Details
                </h1>
                <p className="text-gray-600">
                  Reference: <span className="font-semibold">{booking.bookingReference}</span>
                </p>
              </div>
              <div className="text-right">
                <span className={getStatusBadge(booking.status)}>
                  {booking.status}
                </span>
                <br />
                <span className={`mt-2 inline-block ${getPaymentBadge(booking.paymentStatus)}`}>
                  {booking.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Room Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <img
                  src={booking.room?.images[0]?.url || 'https://via.placeholder.com/800x400'}
                  alt={booking.room?.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-2xl font-bold font-poppins mb-4">
                    {booking.room?.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {booking.room?.description}
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <FiUsers className="mr-2 text-primary-600" />
                      <span>Capacity: {booking.room?.capacity} guests</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiMapPin className="mr-2 text-primary-600" />
                      <span>Floor {booking.room?.floor}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Guest Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h3 className="text-xl font-semibold font-poppins mb-4">
                  Guest Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Full Name</p>
                    <p className="font-medium">{booking.guestDetails?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium">{booking.guestDetails?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-medium">{booking.guestDetails?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Number of Guests</p>
                    <p className="font-medium">
                      {booking.guests.adults} Adults, {booking.guests.children} Children
                    </p>
                  </div>
                </div>
                {booking.specialRequests && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-500 mb-1">Special Requests</p>
                    <p className="text-gray-700">{booking.specialRequests}</p>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Booking Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h3 className="text-xl font-semibold font-poppins mb-4">
                  Booking Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <FiCalendar className="mr-3 text-primary-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Check-in</p>
                      <p className="font-medium">{format(new Date(booking.checkInDate), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiCalendar className="mr-3 text-primary-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Check-out</p>
                      <p className="font-medium">{format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FiClock className="mr-3 text-primary-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{booking.numberOfNights} Nights</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h3 className="text-xl font-semibold font-poppins mb-4">
                  Payment Summary
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Room Rate</span>
                    <span>KES {booking.room?.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Number of Nights</span>
                    <span>× {booking.numberOfNights}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary-600">
                      KES {booking.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                {booking.paymentStatus === 'pending' && booking.status !== 'cancelled' && (
                  <button className="w-full btn-primary mb-2">
                    Complete Payment
                  </button>
                )}
                
                <button className="w-full btn-outline flex items-center justify-center">
                  <FiDownload className="mr-2" />
                  Download Invoice
                </button>
              </motion.div>

              {/* Actions */}
              {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    Cancel Booking
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-poppins">Cancel Booking</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Please provide a reason for cancellation"
              className="input-field mb-4"
              rows="4"
            />
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 btn-outline"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelLoading}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {cancelLoading ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default BookingDetails
