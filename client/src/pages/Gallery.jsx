import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import ImageGallery from '../components/gallery/ImageGallery';

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Images' },
    { value: 'hero', label: 'Resort Views' },
    { value: 'rooms', label: 'Rooms & Suites' },
    { value: 'dining', label: 'Dining' },
    { value: 'activities', label: 'Activities' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'exterior', label: 'Exterior' },
    { value: 'views', label: 'Scenic Views' },
    { value: 'events', label: 'Events' }
  ];

  return (
    <>
      <Helmet>
        <title>Gallery - OKELLA RESORT | Experience Our Beauty</title>
        <meta name="description" content="Explore the stunning beauty of OKELLA RESORT through our comprehensive photo gallery. See our luxurious rooms, facilities, dining, and breathtaking views." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-sand-50 to-white">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold font-poppins mb-6">
                Gallery
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                Discover the beauty and luxury of{' '}
                <span className="text-amber-300 font-semibold">OKELLA RESORT</span>{' '}
                through our stunning visual journey
              </p>
            </motion.div>
          </div>

          {/* Background Scorpion */}
          <div className="absolute top-1/2 right-10 transform -translate-y-1/2 text-9xl opacity-10">
            🦂
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6 text-gray-900">
                Explore Our{' '}
                <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 bg-clip-text text-transparent">
                  Collection
                </span>
              </h2>
              
              {/* Category Tabs */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setActiveCategory(category.value)}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      activeCategory === category.value
                        ? 'bg-primary-500 text-white shadow-lg transform scale-105'
                        : 'bg-white text-gray-700 hover:bg-primary-50 hover:text-primary-600 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Gallery Grid */}
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ImageGallery 
                category={activeCategory === 'all' ? null : activeCategory}
                columns={3}
                showTitles={true}
                enableLightbox={true}
                className="mb-12"
              />
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-6">
                Ready to Experience This Beauty?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Book your stay at OKELLA RESORT and immerse yourself in luxury, 
                comfort, and the spirit of the scorpion.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/rooms"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center justify-center"
                >
                  Book Your Stay
                </motion.a>
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all inline-flex items-center justify-center"
                >
                  Contact Us
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Gallery;
