import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { format } from 'date-fns'

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchPosts()
  }, [selectedCategory])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = selectedCategory ? { category: selectedCategory } : {}
      const response = await api.get('/blog', { params })
      setPosts(response.data.data)
    } catch (error) {
      toast.error('Failed to load blog posts')
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Travel Tips', 'Resort News', 'Local Attractions', 'Events', 'Wellness']

  return (
    <>
      <Helmet>
        <title>Blog - Luxury Coastal Resort</title>
        <meta name="description" content="Read our latest stories, travel tips, and resort news. Stay updated with events and local attractions." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-64 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-poppins mb-4">
              Resort Blog
            </h1>
            <p className="text-xl">
              Stories, tips, and inspiration for your coastal getaway
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Posts
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Blog Posts */}
          {loading ? (
            <LoadingSpinner />
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No blog posts found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Featured Image */}
                  <Link to={`/blog/${post.slug}`}>
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={post.featuredImage?.url || 'https://via.placeholder.com/400x300'}
                        alt={post.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="badge bg-white text-gray-800">
                          {post.category}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Post Content */}
                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center space-x-4 mb-3 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1" size={14} />
                        <span>{format(new Date(post.publishedAt || post.createdAt), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-1" size={14} />
                        <span>5 min read</span>
                      </div>
                    </div>

                    {/* Title */}
                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="text-xl font-bold font-poppins mb-2 hover:text-primary-600 transition-colors">
                        {post.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Author */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center">
                        <FiUser className="mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {post.author?.name || 'Resort Team'}
                        </span>
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Blog
