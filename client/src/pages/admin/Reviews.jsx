import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiStar, FiFilter, FiTrash2, FiMessageSquare } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import api from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'
import { format } from 'date-fns'

const AdminReviews = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await api.get('/reviews')
      setReviews(response.data.data)
    } catch (error) {
      toast.error('Failed to load reviews')
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReview = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      await api.delete(`/reviews/${id}`)
      toast.success('Review deleted successfully')
      fetchReviews()
    } catch (error) {
      toast.error('Failed to delete review')
    }
  }

  const handleVerifyReview = async (id) => {
    try {
      await api.put(`/reviews/${id}`, { isVerified: true })
      toast.success('Review verified successfully')
      fetchReviews()
    } catch (error) {
      toast.error('Failed to verify review')
    }
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        size={16}
        className={index < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
      />
    ))
  }

  const filteredReviews = reviews.filter(review => {
    if (filter === 'all') return true
    if (filter === 'verified') return review.isVerified
    if (filter === 'unverified') return !review.isVerified
    return review.rating === parseInt(filter)
  })

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <>
      <Helmet>
        <title>Manage Reviews - Admin Dashboard</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-poppins mb-2">Manage Reviews</h1>
            <p className="text-gray-600">View and moderate guest reviews</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
              <p className="text-3xl font-bold text-gray-900">{reviews.length}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <p className="text-sm text-gray-600 mb-1">Average Rating</p>
              <div className="flex items-center">
                <p className="text-3xl font-bold text-gray-900 mr-2">{averageRating}</p>
                <div className="flex">{renderStars(Math.round(averageRating))}</div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <p className="text-sm text-gray-600 mb-1">Verified</p>
              <p className="text-3xl font-bold text-gray-900">
                {reviews.filter(r => r.isVerified).length}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6"
            >
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-gray-900">
                {reviews.filter(r => !r.isVerified).length}
              </p>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex items-center space-x-3">
              <FiFilter className="text-gray-400" />
              <div className="flex flex-wrap gap-3">
                {['all', 'verified', 'unverified', '5', '4', '3', '2', '1'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                      filter === f
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {f === 'all' || f === 'verified' || f === 'unverified' ? f : `${f} Stars`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredReviews.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No reviews found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-md p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start flex-1">
                      <img
                        src={review.user?.avatar || 'https://via.placeholder.com/50'}
                        alt={review.user?.name}
                        className="w-12 h-12 rounded-full object-cover mr-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{review.user?.name}</h3>
                          <div className="flex items-center space-x-2">
                            {!review.isVerified && (
                              <button
                                onClick={() => handleVerifyReview(review._id)}
                                className="text-sm text-green-600 hover:text-green-700 font-medium"
                              >
                                Verify
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          <div className="flex mr-3">{renderStars(review.rating)}</div>
                          <span className="text-sm text-gray-500">
                            {format(new Date(review.createdAt), 'MMM dd, yyyy')}
                          </span>
                          {review.isVerified && (
                            <span className="ml-2 badge badge-success text-xs">Verified</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Room: {review.room?.title}</p>
                        <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                        <p className="text-gray-700 mb-3">{review.comment}</p>

                        {/* Detailed Ratings */}
                        {review.detailedRatings && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3 p-3 bg-gray-50 rounded-lg">
                            {Object.entries(review.detailedRatings).map(([key, value]) => (
                              <div key={key} className="text-sm">
                                <span className="text-gray-600 capitalize">{key}: </span>
                                <span className="font-medium">{value}/5</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Pros and Cons */}
                        {(review.pros?.length > 0 || review.cons?.length > 0) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            {review.pros?.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-green-700 mb-1">Pros:</p>
                                <ul className="text-sm text-gray-600 list-disc list-inside">
                                  {review.pros.map((pro, idx) => (
                                    <li key={idx}>{pro}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {review.cons?.length > 0 && (
                              <div>
                                <p className="text-sm font-medium text-red-700 mb-1">Cons:</p>
                                <ul className="text-sm text-gray-600 list-disc list-inside">
                                  {review.cons.map((con, idx) => (
                                    <li key={idx}>{con}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Admin Response */}
                        {review.adminResponse && (
                          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mt-3">
                            <div className="flex items-center mb-1">
                              <FiMessageSquare className="text-blue-600 mr-2" size={16} />
                              <p className="text-sm font-medium text-blue-900">Resort Response</p>
                            </div>
                            <p className="text-sm text-blue-800">{review.adminResponse}</p>
                          </div>
                        )}
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

export default AdminReviews
