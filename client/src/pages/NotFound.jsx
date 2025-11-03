import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHome } from 'react-icons/fi'
import { Helmet } from 'react-helmet-async'

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found</title>
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-sand-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-9xl font-bold text-primary-600 font-poppins">404</h1>
          <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for seems to have drifted away like a message in a bottle.
            Let's get you back to shore.
          </p>
          <Link
            to="/"
            className="inline-flex items-center btn-primary"
          >
            <FiHome className="mr-2" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </>
  )
}

export default NotFound
