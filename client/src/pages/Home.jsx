import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCalendar, FiStar, FiMapPin, FiAward } from 'react-icons/fi'
import { Helmet } from 'react-helmet-async'
import HeroSection from '../components/home/HeroSection'
import FeaturesSection from '../components/home/FeaturesSection'
import RoomsShowcase from '../components/home/RoomsShowcase'
import ImageGallery from '../components/gallery/ImageGallery'

const Home = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <>
      <Helmet>
        <title>OKELLA RESORT - Spirit of the Scorpion | Luxury Coastal Paradise</title>
        <meta name="description" content="Experience the mystique of OKELLA RESORT - where the spirit of the scorpion meets luxury. Kenya's most unique coastal paradise awaits." />
      </Helmet>

      {/* Hero Section with Dynamic Images */}
      <HeroSection />

      {/* Main Content */}
      <div id="main-content">
        {/* Features Section */}
        <FeaturesSection />

        {/* Rooms Showcase */}
        <RoomsShowcase />

        {/* Gallery Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">
                A glimpse of Okella Resort
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Browse real moments from our poolside spaces, grass-thatched rest houses, and happy gatherings in Bondo, Siaya County.
              </p>
            </motion.div>

            {/* Featured Gallery */}
            <ImageGallery 
              category="facilities" 
              limit={6} 
              columns={3}
              showTitles={true}
              enableLightbox={true}
              className="mb-12"
            />

            {/* View More Gallery Button */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Link
                to="/gallery"
                className="inline-flex items-center bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                View Full Gallery
                <motion.span
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">
                Stories from our guests
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Neighbours, churches, and workplaces share why they keep returning to our pool in Bondo.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Millicent Odhiambo",
                  location: "Bondo, Kenya",
                  rating: 5,
                  comment: "Our children’s birthday party was easy to organise. The pool was clean, the kitchen helped with food, and staff supported us the whole day."
                },
                {
                  name: "Pastor Daniel Owino",
                  location: "Siaya Town",
                  rating: 5,
                  comment: "Perfect place for our church retreat. Plenty of seating under the rest houses and the team kept tea ready for everyone."
                },
                {
                  name: "Ruth Wanjiru",
                  location: "Kisumu, Kenya",
                  rating: 5,
                  comment: "We brought our office team for bonding. Everyone enjoyed the pool games and we used the kitchen for a shared lunch. We will be back."
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-gradient-to-br from-sand-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <FiStar key={i} className="text-primary-300 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold font-poppins mb-6">
                Plan your pool day at Okella
              </h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
                Tell us about your birthday, fellowship, or team outing. We’ll reserve the pool, rest houses, and kitchen to suit your group.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/rooms"
                  className="bg-white text-primary-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center justify-center"
                >
                  Check Availability
                </Link>
                <Link
                  to="/contact"
                  className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-primary-600 transition-all inline-flex items-center justify-center"
                >
                  Talk to Us
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Background Water Icon */}
          <div className="absolute top-1/2 right-10 transform -translate-y-1/2 text-9xl opacity-10">
            🌊
          </div>
        </section>
      </div>
    </>
  )
}

export default Home

