import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import api from '../services/api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.post('/auth/forgot-password', { email })
      toast.success('Password reset link sent to your email')
      setSent(true)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password - Luxury Coastal Resort</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-sand-50 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl"
        >
          <Link
            to="/login"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <FiArrowLeft className="mr-2" />
            Back to Login
          </Link>

          <h2 className="text-3xl font-bold text-gray-900 font-poppins mb-2">
            Forgot Password?
          </h2>
          <p className="text-gray-600 mb-8">
            {sent
              ? 'Check your email for reset instructions'
              : 'Enter your email and we\'ll send you a reset link'}
          </p>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="text-primary-600" size={32} />
              </div>
              <p className="text-gray-600 mb-6">
                We've sent password reset instructions to <strong>{email}</strong>
              </p>
              <Link to="/login" className="btn-primary inline-block">
                Back to Login
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </>
  )
}

export default ForgotPassword
