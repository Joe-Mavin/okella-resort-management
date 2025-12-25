import { motion } from 'framer-motion'
import { FiAward, FiUsers, FiHeart, FiTrendingUp } from 'react-icons/fi'
import { Helmet } from 'react-helmet-async'

const About = () => {
  const stats = [
    { icon: <FiAward size={32} />, value: '6+', label: 'Years welcoming locals' },
    { icon: <FiUsers size={32} />, value: '8K+', label: 'Poolside visitors hosted' },
    { icon: <FiHeart size={32} />, value: '92%', label: 'Returning community groups' },
    { icon: <FiTrendingUp size={32} />, value: '4.6', label: 'Guest review score' }
  ]

  const values = [
    {
      title: 'Warm Kenyan hospitality',
      description: 'We welcome every guest like a neighbour and look after families, churches, and teams with care.'
    },
    {
      title: 'Clean & safe spaces',
      description: 'Our staff keeps the pool sparkling, the rest houses tidy, and the changing rooms ready all day.'
    },
    {
      title: 'Reliable event support',
      description: 'From planning to pack-down, we help you organise smooth celebrations and gatherings.'
    },
    {
      title: 'Community connection',
      description: 'We partner with local businesses in Bondo so your event supports the wider Siaya community.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>About Okella Resort - Poolside getaway in Bondo</title>
        <meta
          name="description"
          content="Discover how Okella Resort became a trusted poolside venue for families, churches, and teams in Bondo, Siaya County."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">
              About Okella Resort
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              A relaxed poolside space serving Bondo, Siaya County
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
                  Okella Resort started as a family idea: build a dependable swimming spot where friends and neighbours could cool off in Bondo.
                  We invested in a generous pool, planted trees for shade, and set up grass-thatched rest houses so guests could relax between swims.
                </p>
                <p>
                  Word spread across Siaya County. Families booked birthdays, churches planned fellowship days, and office teams chose us for bonding sessions.
                  Each season we reinvested in what matters—cleaner water, safer walkways, a furnished events kitchen, and attentive staff.
                </p>
                <p>
                  Today we still keep things honest and simple. We do not promise five-star glitz; we promise a clean pool, fair pricing, and friendly help for your gathering.
                  If you need a relaxed venue with reliable support, Okella is ready to host you.
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
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80"
                alt="Grass-thatched huts beside a swimming pool"
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
              What you can count on whenever you spend time with us
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
              Plan your pool day with us
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Reserve the pool, book our rest houses, or ask about catering options—our team will guide you through every detail.
            </p>
            <a
              href="/rooms"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-sand-100 transition-colors shadow-lg"
            >
              Check Dates & Rates
            </a>
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default About
