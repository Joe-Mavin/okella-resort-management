import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCreditCard, FiPhone, FiCheck } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import bookingService from '../services/bookingService'
import paymentService from '../services/paymentService'
import LoadingSpinner from '../components/LoadingSpinner'
import { format } from 'date-fns'

const Payment = () => {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('mpesa')
  const [phoneNumber, setPhoneNumber] = useState('')

  useEffect(() => {
    fetchBookingDetails()
  }, [bookingId])

  const fetchBookingDetails = async () => {
    try {
      setLoading(true)
      const response = await bookingService.getBookingById(bookingId)
      setBooking(response.data)
      
      // If already paid, redirect to success
      if (response.data.paymentStatus === 'paid') {
        navigate(`/booking-success/${bookingId}`)
      }
    } catch (error) {
      toast.error('Failed to load booking details')
      navigate('/my-bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleMpesaPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number')
      return
    }

    setProcessing(true)

    try {
      const response = await paymentService.initiateMpesaPayment(
        bookingId,
        phoneNumber,
        booking.totalAmount
      )

      toast.success('Payment request sent! Please check your phone to complete the payment.')
      
      // Poll for payment status
      const paymentId = response.data._id
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await paymentService.checkPaymentStatus(paymentId)
          
          if (statusResponse.data.status === 'completed') {
            clearInterval(pollInterval)
            toast.success('Payment successful!')
            navigate(`/booking-success/${bookingId}`)
          } else if (statusResponse.data.status === 'failed') {
            clearInterval(pollInterval)
            toast.error('Payment failed. Please try again.')
            setProcessing(false)
          }
        } catch (error) {
          console.error('Error checking payment status:', error)
        }
      }, 3000)

      // Stop polling after 2 minutes
      setTimeout(() => {
        clearInterval(pollInterval)
        setProcessing(false)
      }, 120000)

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment')
      setProcessing(false)
    }
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
        <title>Payment - Booking {booking.bookingReference}</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold font-poppins mb-8">Complete Payment</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <h2 className="text-xl font-semibold font-poppins mb-6">
                  Select Payment Method
                </h2>

                {/* Payment Method Options */}
                <div className="space-y-4 mb-6">
                  <button
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-colors ${
                      paymentMethod === 'mpesa'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <FiPhone className="text-2xl text-primary-600 mr-3" />
                      <div className="text-left">
                        <p className="font-semibold">M-PESA</p>
                        <p className="text-sm text-gray-600">Pay with M-PESA mobile money</p>
                      </div>
                    </div>
                    {paymentMethod === 'mpesa' && (
                      <FiCheck className="text-primary-600" size={24} />
                    )}
                  </button>

                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-colors opacity-50 cursor-not-allowed ${
                      paymentMethod === 'card'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                    disabled
                  >
                    <div className="flex items-center">
                      <FiCreditCard className="text-2xl text-gray-400 mr-3" />
                      <div className="text-left">
                        <p className="font-semibold text-gray-600">Credit/Debit Card</p>
                        <p className="text-sm text-gray-400">Coming Soon</p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* M-PESA Payment Form */}
                {paymentMethod === 'mpesa' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        M-PESA Phone Number
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="254712345678"
                        className="input-field"
                        disabled={processing}
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Enter the M-PESA registered phone number
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900 mb-2">How it works:</h4>
                      <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                        <li>Click "Pay with M-PESA" button</li>
                        <li>You'll receive a prompt on your phone</li>
                        <li>Enter your M-PESA PIN to confirm</li>
                        <li>Payment will be processed automatically</li>
                      </ol>
                    </div>

                    <button
                      onClick={handleMpesaPayment}
                      disabled={processing}
                      className="w-full btn-primary disabled:opacity-50 flex items-center justify-center"
                    >
                      {processing ? (
                        <>
                          <div className="spinner w-5 h-5 mr-2"></div>
                          Waiting for payment...
                        </>
                      ) : (
                        <>
                          <FiPhone className="mr-2" />
                          Pay KES {booking.totalAmount.toLocaleString()} with M-PESA
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </motion.div>
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

                <div className="space-y-3 mb-6 pb-6 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Room</p>
                    <p className="font-medium">{booking.room?.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-in</p>
                    <p className="font-medium">
                      {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Check-out</p>
                    <p className="font-medium">
                      {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Guests</p>
                    <p className="font-medium">
                      {booking.guests.adults} Adults, {booking.guests.children} Children
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{booking.numberOfNights} Nights</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Room Rate</span>
                    <span>KES {booking.room?.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Number of Nights</span>
                    <span>× {booking.numberOfNights}</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary-600">
                      KES {booking.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Payment
