import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCheckCircle, FiCalendar, FiMapPin, FiMail, FiDownload } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import bookingService from '../services/bookingService'
import LoadingSpinner from '../components/LoadingSpinner'
import { format } from 'date-fns'

const BookingSuccess = () => {
  const { bookingId } = useParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookingDetails()
  }, [bookingId])

  const fetchBookingDetails = async () => {
    try {
      setLoading(true)
      const response = await bookingService.getBookingById(bookingId)
      setBooking(response.data)
    } catch (error) {
      toast.error('Failed to load booking details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Booking not found</p>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>Booking Confirmed - Luxury Coastal Resort</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-8 text-center mb-8"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiCheckCircle className="text-green-600" size={48} />
            </div>
            
            <h1 className="text-3xl font-bold font-poppins text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 mb-6">
              Your reservation has been successfully confirmed. We've sent a confirmation email to your inbox.
            </p>
            
            <div className="inline-block bg-primary-50 px-6 py-3 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Booking Reference</p>
              <p className="text-2xl font-bold text-primary-600">
                {booking.bookingReference}
              </p>
            </div>
          </motion.div>

          {/* Booking Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md p-6 mb-8"
          >
            <h2 className="text-2xl font-bold font-poppins mb-6">Booking Details</h2>

            {/* Room Info */}
            <div className="flex items-start mb-6 pb-6 border-b">
              <img
                src={booking.room?.images[0]?.url || 'https://via.placeholder.com/150x100'}
                alt={booking.room?.title}
                className="w-32 h-24 object-cover rounded-lg mr-4"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{booking.room?.title}</h3>
                <p className="text-gray-600 text-sm">{booking.room?.description}</p>
              </div>
            </div>

            {/* Stay Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <div className="flex items-center text-gray-600 mb-4">
                  <FiCalendar className="mr-3 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500">Check-in</p>
                    <p className="font-semibold">
                      {format(new Date(booking.checkInDate), 'EEEE, MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-gray-500">After 2:00 PM</p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiCalendar className="mr-3 text-primary-600" />
                  <div>
                    <p className="text-sm text-gray-500">Check-out</p>
                    <p className="font-semibold">
                      {format(new Date(booking.checkOutDate), 'EEEE, MMM dd, yyyy')}
                    </p>
                    <p className="text-sm text-gray-500">Before 11:00 AM</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Total Duration</p>
                  <p className="text-2xl font-bold text-gray-900 mb-4">
                    {booking.numberOfNights} {booking.numberOfNights === 1 ? 'Night' : 'Nights'}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">Total Amount Paid</p>
                  <p className="text-3xl font-bold text-primary-600">
                    KES {booking.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Guest Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-2">Guest Information</h4>
              <p className="text-gray-700">
                {booking.guests.adults} Adult{booking.guests.adults !== 1 ? 's' : ''}, {booking.guests.children} Child{booking.guests.children !== 1 ? 'ren' : ''}
              </p>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-md p-6 mb-8"
          >
            <h2 className="text-xl font-bold font-poppins mb-4">What's Next?</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <FiMail className="mr-3 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Check Your Email</p>
                  <p className="text-sm text-gray-600">
                    We've sent a confirmation email with all the details of your booking.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FiMapPin className="mr-3 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Location & Directions</p>
                  <p className="text-sm text-gray-600">
                    Paradise Beach, Mombasa, Kenya. We'll send you detailed directions closer to your check-in date.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FiDownload className="mr-3 text-primary-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Download Confirmation</p>
                  <button className="text-sm text-primary-600 hover:text-primary-700 underline">
                    Download PDF Confirmation
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/my-bookings"
              className="flex-1 btn-primary text-center"
            >
              View My Bookings
            </Link>
            <Link
              to="/"
              className="flex-1 btn-outline text-center"
            >
              Return to Home
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 text-center text-sm text-gray-600"
          >
            <p>
              Need to make changes? Contact us at{' '}
              <a href="mailto:reservations@luxuryresort.com" className="text-primary-600 hover:underline">
                reservations@luxuryresort.com
              </a>
              {' '}or call{' '}
              <a href="tel:+254700000000" className="text-primary-600 hover:underline">
                +254 700 000 000
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}

export default BookingSuccess
