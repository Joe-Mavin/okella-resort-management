import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import roomService from '../../services/roomService'
import LoadingSpinner from '../../components/LoadingSpinner'

const AdminRooms = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const response = await roomService.getRooms()
      setRooms(response.data)
    } catch (error) {
      toast.error('Failed to load rooms')
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteRoom = async (id) => {
    if (!confirm('Are you sure you want to delete this room?')) return

    try {
      await roomService.deleteRoom(id)
      toast.success('Room deleted successfully')
      fetchRooms()
    } catch (error) {
      toast.error('Failed to delete room')
    }
  }

  const filteredRooms = rooms.filter(room => {
    if (filter === 'all') return true
    if (filter === 'active') return room.isActive
    if (filter === 'inactive') return !room.isActive
    return room.roomType === filter
  })

  return (
    <>
      <Helmet>
        <title>Manage Rooms - Admin Dashboard</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-poppins mb-2">Manage Rooms</h1>
              <p className="text-gray-600">Add, edit, or remove rooms from your resort</p>
            </div>
            <button className="btn-primary flex items-center">
              <FiPlus className="mr-2" />
              Add New Room
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-3">
              {['all', 'active', 'inactive', 'standard', 'deluxe', 'suite', 'presidential'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    filter === type
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms Table */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredRooms.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No rooms found</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Room
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRooms.map((room, index) => (
                      <motion.tr
                        key={room._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={room.images[0]?.url || 'https://via.placeholder.com/60x60'}
                              alt={room.title}
                              className="w-12 h-12 rounded-lg object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{room.title}</p>
                              <p className="text-sm text-gray-500">Room #{room.roomNumber}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="badge badge-primary capitalize">
                            {room.roomType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-semibold text-gray-900">
                            KES {room.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">per night</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {room.capacity} guests
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${room.isActive ? 'badge-success' : 'badge-danger'}`}>
                            {room.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span className="font-medium">{room.averageRating?.toFixed(1) || 'N/A'}</span>
                            <span className="text-sm text-gray-500 ml-1">
                              ({room.totalReviews || 0})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => window.open(`/rooms/${room._id}`, '_blank')}
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
                              onClick={() => handleDeleteRoom(room._id)}
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

export default AdminRooms
