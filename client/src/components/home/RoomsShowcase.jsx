import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiUsers, FiWifi, FiCoffee, FiTv, FiArrowRight } from 'react-icons/fi';
import galleryService from '../../services/galleryService';

const RoomsShowcase = () => {
  const [roomImages, setRoomImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample room data - in a real app, this would come from your rooms API
  const roomTypes = [
    {
      id: 1,
      name: 'Scorpion Suite',
      description: 'Luxurious suite with panoramic views and premium amenities',
      price: 15000,
      capacity: 2,
      size: '45 sqm',
      amenities: ['King Bed', 'Private Balcony', 'Mini Bar', 'Smart TV'],
      features: [
        { icon: <FiUsers />, text: 'Up to 2 guests' },
        { icon: <FiWifi />, text: 'Free WiFi' },
        { icon: <FiCoffee />, text: 'Coffee Machine' },
        { icon: <FiTv />, text: 'Smart TV' }
      ]
    },
    {
      id: 2,
      name: 'Desert Oasis Room',
      description: 'Comfortable room with modern amenities and garden views',
      price: 8500,
      capacity: 2,
      size: '32 sqm',
      amenities: ['Queen Bed', 'Garden View', 'Work Desk', 'Air Conditioning'],
      features: [
        { icon: <FiUsers />, text: 'Up to 2 guests' },
        { icon: <FiWifi />, text: 'Free WiFi' },
        { icon: <FiCoffee />, text: 'Tea & Coffee' },
        { icon: <FiTv />, text: 'Cable TV' }
      ]
    },
    {
      id: 3,
      name: 'Family Villa',
      description: 'Spacious villa perfect for families with separate living area',
      price: 25000,
      capacity: 4,
      size: '75 sqm',
      amenities: ['2 Bedrooms', 'Living Room', 'Kitchenette', 'Private Terrace'],
      features: [
        { icon: <FiUsers />, text: 'Up to 4 guests' },
        { icon: <FiWifi />, text: 'Free WiFi' },
        { icon: <FiCoffee />, text: 'Full Kitchen' },
        { icon: <FiTv />, text: 'Multiple TVs' }
      ]
    }
  ];

  useEffect(() => {
    fetchRoomImages();
  }, []);

  const fetchRoomImages = async () => {
    try {
      const result = await galleryService.getRoomImages();
      if (result.success) {
        setRoomImages(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch room images:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRoomImage = (index) => {
    if (roomImages.length > 0) {
      return roomImages[index % roomImages.length];
    }
    // Fallback images
    const fallbackImages = [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80'
    ];
    return { imageUrl: fallbackImages[index % fallbackImages.length] };
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">
            Luxury{' '}
            <span className="bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-600 bg-clip-text text-transparent">
              Accommodations
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose from our carefully designed rooms and suites, each offering unique comfort 
            and style with breathtaking views of the surrounding landscape.
          </p>
        </motion.div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {roomTypes.map((room, index) => {
            const roomImage = getRoomImage(index);
            
            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group"
              >
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  {/* Room Image */}
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={roomImage.imageUrl.includes('cloudinary.com') 
                        ? galleryService.getOptimizedImageUrl(roomImage.imageUrl, {
                            width: 500,
                            height: 300,
                            quality: 'auto:good'
                          })
                        : roomImage.imageUrl
                      }
                      alt={room.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-primary-500 text-white px-4 py-2 rounded-full font-semibold">
                      KES {room.price.toLocaleString()}/night
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold font-poppins mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">
                      {room.name}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {room.description}
                    </p>

                    {/* Room Info */}
                    <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
                      <span>{room.size}</span>
                      <span>Up to {room.capacity} guests</span>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {room.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                          <span className="text-primary-500 mr-2">{feature.icon}</span>
                          {feature.text}
                        </div>
                      ))}
                    </div>

                    {/* Amenities */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map((amenity, amenityIndex) => (
                          <span
                            key={amenityIndex}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Book Button */}
                    <Link
                      to={`/rooms/${room.id}`}
                      className="group/btn w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center"
                    >
                      Book Now
                      <FiArrowRight className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Rooms CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            to="/rooms"
            className="inline-flex items-center bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
          >
            View All Rooms & Suites
            <FiArrowRight className="ml-2" />
          </Link>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Decorative Shapes */}
        <motion.div
          className="absolute top-1/4 right-0 w-64 h-64 bg-gradient-to-bl from-sky-100/30 to-cyan-200/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 left-0 w-48 h-48 bg-gradient-to-tr from-primary-100/30 to-teal-200/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 2 }}
        />
      </div>
    </section>
  );
};

export default RoomsShowcase;
