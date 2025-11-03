import { motion } from 'framer-motion'
import { FiAward, FiUsers, FiHeart, FiTrendingUp } from 'react-icons/fi'
import { Helmet } from 'react-helmet-async'

const About = () => {
  const stats = [
    { icon: <FiAward size={32} />, value: '10+', label: 'Years of Excellence' },
    { icon: <FiUsers size={32} />, value: '50K+', label: 'Happy Guests' },
    { icon: <FiHeart size={32} />, value: '98%', label: 'Satisfaction Rate' },
    { icon: <FiTrendingUp size={32} />, value: '4.9', label: 'Average Rating' }
  ]

  const values = [
    {
      title: 'Luxury & Comfort',
      description: 'We provide world-class accommodations designed for your ultimate comfort and relaxation.'
    },
    {
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices and preserving the natural beauty of our coastal paradise.'
    },
    {
      title: 'Exceptional Service',
      description: 'Our dedicated team ensures every guest receives personalized attention and care.'
    },
    {
      title: 'Local Culture',
      description: 'Experience authentic Kenyan hospitality and immerse yourself in local traditions.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>About Us - Luxury Coastal Resort</title>
        <meta name="description" content="Learn about Luxury Coastal Resort - Kenya's premier beachfront destination offering world-class hospitality and unforgettable experiences." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">
              About Our Resort
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Where luxury meets the beauty of Kenya's coastline
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold font-poppins text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Nestled along the pristine shores of Kenya's coast, Luxury Coastal Resort has been 
                  creating unforgettable memories for over a decade. Our journey began with a simple 
                  vision: to offer guests an unparalleled blend of luxury, comfort, and authentic 
                  Kenyan hospitality.
                </p>
                <p>
                  From our humble beginnings as a small beachfront property, we've grown into one of 
                  the region's most celebrated destinations. Each room, service, and experience has been 
                  carefully crafted to ensure that every moment of your stay is nothing short of extraordinary.
                </p>
                <p>
                  Today, we're proud to be recognized as a leader in luxury hospitality, while remaining 
                  committed to sustainable tourism and supporting our local community. Our success is measured 
                  not just in awards, but in the smiles of our guests and the lasting memories they take home.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
                alt="Resort View"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 gradient-sand">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-bold font-poppins text-gray-900 mb-2">
                  {stat.value}
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-poppins text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-2xl font-bold font-poppins text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold font-poppins mb-4">
              Experience the Difference
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied guests who have made Luxury Coastal Resort 
              their home away from home
            </p>
            <a
              href="/rooms"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-sand-100 transition-colors shadow-lg"
            >
              Book Your Stay
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default About
