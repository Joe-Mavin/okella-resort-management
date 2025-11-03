import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import api from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'

const AdminActivities = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const response = await api.get('/activities')
      setActivities(response.data.data)
    } catch (error) {
      toast.error('Failed to load activities')
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteActivity = async (id) => {
    if (!confirm('Are you sure you want to delete this activity?')) return

    try {
      await api.delete(`/activities/${id}`)
      toast.success('Activity deleted successfully')
      fetchActivities()
    } catch (error) {
      toast.error('Failed to delete activity')
    }
  }

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true
    if (filter === 'active') return activity.isActive
    if (filter === 'inactive') return !activity.isActive
    return activity.category === filter
  })

  return (
    <>
      <Helmet>
        <title>Manage Activities - Admin Dashboard</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-poppins mb-2">Manage Activities</h1>
              <p className="text-gray-600">Create and manage resort activities</p>
            </div>
            <button className="btn-primary flex items-center">
              <FiPlus className="mr-2" />
              Add New Activity
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[
              { label: 'Total Activities', value: activities.length },
              { label: 'Active', value: activities.filter(a => a.isActive).length },
              { label: 'Total Bookings', value: activities.reduce((sum, a) => sum + (a.bookingCount || 0), 0) },
              { label: 'Average Rating', value: activities.length > 0 
                ? (activities.reduce((sum, a) => sum + (a.averageRating || 0), 0) / activities.length).toFixed(1)
                : '0.0'
              }
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
            <div className="flex flex-wrap gap-3">
              {['all', 'active', 'inactive', 'Water Sports', 'Adventure', 'Relaxation', 'Cultural', 'Family'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === f
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Activities Table */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredActivities.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No activities found</p>
              <button className="btn-primary">Create Your First Activity</button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bookings
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
                    {filteredActivities.map((activity, index) => (
                      <motion.tr
                        key={activity._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={activity.images[0]?.url || 'https://via.placeholder.com/60x60'}
                              alt={activity.title}
                              className="w-16 h-16 rounded-lg object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{activity.title}</p>
                              <p className="text-sm text-gray-500">{activity.location}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="badge badge-info">{activity.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-semibold text-gray-900">
                            KES {activity.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">per person</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {activity.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {activity.minParticipants}-{activity.maxParticipants}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-semibold text-gray-900">{activity.bookingCount || 0}</p>
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span className="text-sm">{activity.averageRating?.toFixed(1) || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${activity.isActive ? 'badge-success' : 'badge-danger'}`}>
                            {activity.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-900"
                              title="View"
                            >
                              <FiEye size={18} />
                            </button>
                            <button
                              className="text-primary-600 hover:text-primary-900"
                              title="Edit"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteActivity(activity._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
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

export default AdminActivities
