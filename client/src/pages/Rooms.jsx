import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUsers, FiMaximize2, FiEye, FiSearch } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import roomService from '../services/roomService'
import LoadingSpinner from '../components/LoadingSpinner'

const Rooms = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    roomType: '',
    minPrice: '',
    maxPrice: '',
    viewType: ''
  })

  useEffect(() => {
    fetchRooms()
  }, [filters])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const response = await roomService.getRooms(filters)
      setRooms(response.data)
    } catch (error) {
      toast.error('Failed to load rooms')
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const clearFilters = () => {
    setFilters({
      roomType: '',
      minPrice: '',
      maxPrice: '',
      viewType: ''
    })
  }

  return (
    <>
      <Helmet>
        <title>Rooms & Suites - Luxury Coastal Resort</title>
        <meta name="description" content="Browse our luxury rooms and suites with stunning ocean views. Book your perfect accommodation today." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">
              Rooms & Suites
            </h1>
            <p className="text-xl">
              Discover your perfect sanctuary by the sea
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold font-poppins flex items-center">
                <FiSearch className="mr-2" />
                Filter Rooms
              </h2>
              <button
                onClick={clearFilters}
                className="text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Clear Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type
                </label>
                <select
                  name="roomType"
                  value={filters.roomType}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">All Types</option>
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="suite">Suite</option>
                  <option value="presidential">Presidential</option>
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Min Price (KES)
                </label>
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="input-field"
                  placeholder="0"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Price (KES)
                </label>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="input-field"
                  placeholder="100000"
                />
              </div>

              {/* View Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  View Type
                </label>
                <select
                  name="viewType"
                  value={filters.viewType}
                  onChange={handleFilterChange}
                  className="input-field"
                >
                  <option value="">All Views</option>
                  <option value="ocean">Ocean View</option>
                  <option value="garden">Garden View</option>
                  <option value="pool">Pool View</option>
                  <option value="city">City View</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Rooms Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : rooms.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No rooms found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room, index) => (
                <motion.div
                  key={room._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Room Image */}
                  <div className="relative h-64 overflow-hidden group">
                    <img
                      src={room.images[0]?.url || 'https://via.placeholder.com/400x300'}
                      alt={room.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="badge badge-primary capitalize">
                        {room.roomType}
                      </span>
                    </div>
                    {room.viewType && (
                      <div className="absolute top-4 left-4">
                        <span className="badge bg-white text-gray-800 flex items-center">
                          <FiEye className="mr-1" size={14} />
                          {room.viewType}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Room Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-poppins mb-2">
                      {room.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {room.description}
                    </p>

                    {/* Room Stats */}
                    <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiUsers className="mr-1" />
                        <span>{room.capacity} Guests</span>
                      </div>
                      <div className="flex items-center">
                        <FiMaximize2 className="mr-1" />
                        <span>{room.size} m²</span>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{room.amenities.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-primary-600">
                          KES {room.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">per night</p>
                      </div>
                      <Link
                        to={`/rooms/${room._id}`}
                        className="btn-primary text-sm px-6"
                      >
                        View Details
                      </Link>
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

export default Rooms
