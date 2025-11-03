import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUsers, FiMaximize2, FiCheck, FiCalendar } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import roomService from '../services/roomService'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../contexts/AuthContext'

const RoomDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    fetchRoomDetails()
  }, [id])

  const fetchRoomDetails = async () => {
    try {
      setLoading(true)
      const response = await roomService.getRoomById(id)
      setRoom(response.data)
    } catch (error) {
      toast.error('Failed to load room details')
      console.error('Error fetching room:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.info('Please login to book a room')
      navigate('/login', { state: { from: { pathname: `/book/${id}` } } })
      return
    }
    navigate(`/book/${id}`)
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Room not found</p>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{room.title} - Luxury Coastal Resort</title>
        <meta name="description" content={room.description} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Main Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative h-96 lg:h-[600px] rounded-xl overflow-hidden"
            >
              <img
                src={room.images[currentImageIndex]?.url || 'https://via.placeholder.com/800x600'}
                alt={room.title}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              {room.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {room.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Room Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <div className="mb-4">
                <span className="badge badge-primary capitalize mb-2">
                  {room.roomType}
                </span>
                <h1 className="text-3xl font-bold font-poppins text-gray-900">
                  {room.title}
                </h1>
              </div>

              <p className="text-gray-600 mb-6">
                {room.description}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
                <div className="flex items-center">
                  <FiUsers className="text-primary-600 mr-2" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Capacity</p>
                    <p className="font-semibold">{room.capacity} Guests</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiMaximize2 className="text-primary-600 mr-2" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Size</p>
                    <p className="font-semibold">{room.size} m²</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 pb-6 border-b">
                <p className="text-4xl font-bold text-primary-600">
                  KES {room.price.toLocaleString()}
                </p>
                <p className="text-gray-500">per night</p>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold font-poppins mb-3">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {room.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-start">
                      <FiCheck className="text-primary-600 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={handleBookNow}
                className="w-full btn-primary flex items-center justify-center"
                disabled={!room.isActive}
              >
                <FiCalendar className="mr-2" />
                {room.isActive ? 'Book Now' : 'Not Available'}
              </button>
            </motion.div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold font-poppins mb-3">
                Bed Type
              </h3>
              <p className="text-gray-600 capitalize">{room.bedType}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold font-poppins mb-3">
                View Type
              </h3>
              <p className="text-gray-600 capitalize">{room.viewType || 'Standard'}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold font-poppins mb-3">
                Floor
              </h3>
              <p className="text-gray-600">Floor {room.floor}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default RoomDetails
