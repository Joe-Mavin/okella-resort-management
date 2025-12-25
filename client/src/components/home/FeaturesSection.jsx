import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiWifi, FiCoffee, FiMapPin, FiStar, FiShield, FiHeart } from 'react-icons/fi';
import galleryService from '../../services/galleryService';

const FeaturesSection = () => {
  const [facilityImages, setFacilityImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const features = [
    {
      icon: <FiDroplet className="text-3xl" />,
      title: 'Spacious Pool at the Heart',
      description:
        'Clean, inviting water for easy-going swims, pool games, and relaxed afternoons under the Bondo sun.',
      category: 'pool'
    },
    {
      icon: <FiHome className="text-3xl" />,
      title: 'Grass-Thatched Rest Houses',
      description:
        'Shaded huts facing the pool where families can relax, chat, or enjoy a quiet view of the water.',
      category: 'exterior'
    },
    {
      icon: <FiUsers className="text-3xl" />,
      title: 'Modern Changing Rooms',
      description:
        'Neat, private changing rooms with showers to keep your group comfortable before and after a swim.',
      category: 'facilities'
    },
    {
      icon: <FiCoffee className="text-3xl" />,
      title: 'Event-Friendly Kitchen',
      description:
        'A fully furnished kitchen that supports birthday meals, church teas, and catered gatherings on-site.',
      category: 'events'
    },
    {
      icon: <FiCalendar className="text-3xl" />,
      title: 'Host Your Gathering',
      description:
        'Space and seating for birthday parties, church meetings, get-togethers, and family catch-ups.',
      category: 'events'
    },
    {
      icon: <FiBriefcase className="text-3xl" />,
      title: 'Team & Community Days',
      description:
        'Plenty of room for team-building activities, games, and relaxed bonding sessions by the pool.',
      category: 'activities'
    }
  ];
    
  useEffect(() => {
    fetchFacilityImages();
  }, []);

  const fetchFacilityImages = async () => {
    try {
      const result = await galleryService.getFacilityImages();
      if (result.success) {
        setFacilityImages(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch facility images:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFeatureImage = (category) => {
    const categoryImages = facilityImages.filter(img => img.category === category);
    return categoryImages.length > 0 ? categoryImages[0] : null;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-sand-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">
            What makes Okella feel like home
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We keep things simple: a big clean pool, welcoming spaces, and helpful hosts who understand community events in Bondo, Siaya County.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const featureImage = getFeatureImage(feature.category);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  {/* Feature Image */}
                  {featureImage && (
                    <div className="mb-6 overflow-hidden rounded-xl">
                      <img
                        src={galleryService.getOptimizedImageUrl(featureImage.imageUrl, {
                          width: 400,
                          height: 200,
                          quality: 'auto:good'
                        })}
                        alt={featureImage.title}
                        className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center text-primary-600 group-hover:from-primary-500 group-hover:to-primary-600 group-hover:text-white transition-all duration-300">
                      {feature.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold font-poppins mb-4 text-gray-900 group-hover:text-primary-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary-200 transition-colors duration-300 pointer-events-none"></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-3xl p-8 md:p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
              Ready for a pool day in Bondo?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Tell us about your birthday, church gathering, or team plan and we’ll help you set it up.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/rooms"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                Check Availability
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all inline-flex items-center justify-center"
              >
                Talk to Us
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating Water Icons */}
        <motion.div
          className="absolute top-1/4 left-1/4 text-primary-100 text-4xl opacity-30"
          animate={{ 
            rotate: [0, 10, -10, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        >
          🌊
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-1/4 text-primary-100 text-3xl opacity-20"
          animate={{ 
            rotate: [0, -15, 15, 0],
            y: [0, 15, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        >
          🌊
        </motion.div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-200/20 to-cyan-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary-200/20 to-teal-300/20 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
};

export default FeaturesSection;
