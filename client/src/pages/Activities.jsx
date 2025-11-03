import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiClock, FiUsers, FiMapPin } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const Activities = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchActivities()
  }, [selectedCategory])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const params = selectedCategory ? { category: selectedCategory } : {}
      const response = await api.get('/activities', { params })
      setActivities(response.data.data)
    } catch (error) {
      toast.error('Failed to load activities')
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Water Sports', 'Adventure', 'Relaxation', 'Cultural', 'Family']

  return (
    <>
      <Helmet>
        <title>Activities & Experiences - Luxury Coastal Resort</title>
        <meta name="description" content="Explore exciting activities and experiences at our resort. From water sports to cultural tours, create unforgettable memories." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">
              Activities & Experiences
            </h1>
            <p className="text-xl">
              Adventure awaits at every corner
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Activities
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Activities Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : activities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No activities found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Activity Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={activity.images[0]?.url || 'https://via.placeholder.com/400x300'}
                      alt={activity.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="badge bg-white text-gray-800 capitalize">
                        {activity.category}
                      </span>
                    </div>
                  </div>

                  {/* Activity Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-poppins mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {activity.description}
                    </p>

                    {/* Activity Stats */}
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiClock className="mr-2 text-primary-600" />
                        <span>{activity.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <FiUsers className="mr-2 text-primary-600" />
                        <span>{activity.minParticipants}-{activity.maxParticipants} participants</span>
                      </div>
                      <div className="flex items-center">
                        <FiMapPin className="mr-2 text-primary-600" />
                        <span>{activity.location}</span>
                      </div>
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <p className="text-2xl font-bold text-primary-600">
                          KES {activity.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">per person</p>
                      </div>
                      <button className="btn-primary text-sm px-6">
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Activities
