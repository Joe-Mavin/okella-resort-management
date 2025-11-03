import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FiCalendar, FiUsers, FiDollarSign } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import roomService from '../services/roomService'
import bookingService from '../services/bookingService'
import LoadingSpinner from '../components/LoadingSpinner'
import { differenceInDays, addDays } from 'date-fns'

const BookRoom = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    checkInDate: addDays(new Date(), 1),
    checkOutDate: addDays(new Date(), 3),
    adults: 1,
    children: 0,
    specialRequests: ''
  })

  useEffect(() => {
    fetchRoomDetails()
  }, [roomId])

  const fetchRoomDetails = async () => {
    try {
      setLoading(true)
      const response = await roomService.getRoomById(roomId)
      setRoom(response.data)
    } catch (error) {
      toast.error('Failed to load room details')
      navigate('/rooms')
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (field, date) => {
    setFormData(prev => ({
      ...prev,
      [field]: date
    }))
  }

  const handleGuestChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, value)
    }))
  }

  const calculateNights = () => {
    return differenceInDays(formData.checkOutDate, formData.checkInDate)
  }

  const calculateTotal = () => {
    const nights = calculateNights()
    return nights * (room?.price || 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.checkOutDate <= formData.checkInDate) {
      toast.error('Check-out date must be after check-in date')
      return
    }

    if (formData.adults + formData.children > room.capacity) {
      toast.error(`This room can accommodate maximum ${room.capacity} guests`)
      return
    }

    if (formData.adults === 0) {
      toast.error('At least one adult is required')
      return
    }

    setSubmitting(true)

    try {
      const bookingData = {
        room: roomId,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guests: {
          adults: formData.adults,
          children: formData.children
        },
        numberOfNights: calculateNights(),
        totalAmount: calculateTotal(),
        specialRequests: formData.specialRequests
      }

      const response = await bookingService.createBooking(bookingData)
      toast.success('Booking created successfully!')
      navigate(`/payment/${response.data._id}`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!room) {
    return null
  }

  const nights = calculateNights()
  const totalAmount = calculateTotal()

  return (
    <>
      <Helmet>
        <title>Book {room.title} - Luxury Coastal Resort</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold font-poppins mb-8">Complete Your Booking</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-xl shadow-md p-6 space-y-6"
              >
                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in Date
                    </label>
                    <DatePicker
                      selected={formData.checkInDate}
                      onChange={(date) => handleDateChange('checkInDate', date)}
                      minDate={new Date()}
                      className="input-field"
                      dateFormat="MMM dd, yyyy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out Date
                    </label>
                    <DatePicker
                      selected={formData.checkOutDate}
                      onChange={(date) => handleDateChange('checkOutDate', date)}
                      minDate={addDays(formData.checkInDate, 1)}
                      className="input-field"
                      dateFormat="MMM dd, yyyy"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Guests
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600">Adults</label>
                      <div className="flex items-center mt-2">
                        <button
                          type="button"
                          onClick={() => handleGuestChange('adults', formData.adults - 1)}
                          className="px-3 py-2 bg-gray-200 rounded-l-lg hover:bg-gray-300"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={formData.adults}
                          readOnly
                          className="w-16 text-center border-y border-gray-300 py-2"
                        />
                        <button
                          type="button"
                          onClick={() => handleGuestChange('adults', formData.adults + 1)}
                          className="px-3 py-2 bg-gray-200 rounded-r-lg hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Children</label>
                      <div className="flex items-center mt-2">
                        <button
                          type="button"
                          onClick={() => handleGuestChange('children', formData.children - 1)}
                          className="px-3 py-2 bg-gray-200 rounded-l-lg hover:bg-gray-300"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={formData.children}
                          readOnly
                          className="w-16 text-center border-y border-gray-300 py-2"
                        />
                        <button
                          type="button"
                          onClick={() => handleGuestChange('children', formData.children + 1)}
                          className="px-3 py-2 bg-gray-200 rounded-r-lg hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Maximum {room.capacity} guests allowed
                  </p>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    rows="4"
                    className="input-field"
                    placeholder="Any special requests or preferences..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {submitting ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </motion.form>
            </div>

            {/* Booking Summary */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl shadow-md p-6 sticky top-24"
              >
                <h3 className="text-xl font-semibold font-poppins mb-4">
                  Booking Summary
                </h3>

                {/* Room Image */}
                <img
                  src={room.images[0]?.url || 'https://via.placeholder.com/300x200'}
                  alt={room.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />

                <h4 className="font-semibold text-lg mb-4">{room.title}</h4>

                {/* Details */}
                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <FiCalendar className="mr-2" />
                      Check-in
                    </span>
                    <span className="font-medium">
                      {formData.checkInDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <FiCalendar className="mr-2" />
                      Check-out
                    </span>
                    <span className="font-medium">
                      {formData.checkOutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <FiUsers className="mr-2" />
                      Guests
                    </span>
                    <span className="font-medium">
                      {formData.adults + formData.children} ({formData.adults} Adults, {formData.children} Children)
                    </span>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>KES {room.price.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}</span>
                    <span>KES {totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary-600">
                      KES {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Policies */}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>✓ Free cancellation up to 24 hours before check-in</p>
                  <p>✓ Check-in: 2:00 PM - 11:00 PM</p>
                  <p>✓ Check-out: 11:00 AM</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BookRoom
