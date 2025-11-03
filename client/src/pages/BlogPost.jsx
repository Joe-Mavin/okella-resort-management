import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCalendar, FiUser, FiClock, FiArrowLeft } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import api from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import { format } from 'date-fns'

const BlogPost = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await api.get(`/blog/${slug}`)
      setPost(response.data.data)
    } catch (error) {
      toast.error('Failed to load blog post')
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner fullScreen />
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Post not found</p>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - Luxury Coastal Resort Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20">
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Back Button */}
          <Link
            to="/blog"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
          >
            <FiArrowLeft className="mr-2" />
            Back to Blog
          </Link>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative h-96 rounded-xl overflow-hidden mb-8"
          >
            <img
              src={post.featuredImage?.url || 'https://via.placeholder.com/1200x600'}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Post Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-2 mb-4">
              <span className="badge badge-primary">{post.category}</span>
              {post.tags.map((tag, index) => (
                <span key={index} className="badge bg-gray-200 text-gray-700">
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-poppins text-gray-900 mb-4">
              {post.title}
            </h1>

            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center">
                <FiUser className="mr-2" />
                <span>{post.author?.name || 'Resort Team'}</span>
              </div>
              <div className="flex items-center">
                <FiCalendar className="mr-2" />
                <span>{format(new Date(post.publishedAt || post.createdAt), 'MMMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center">
                <FiClock className="mr-2" />
                <span>5 min read</span>
              </div>
            </div>
          </motion.div>

          {/* Post Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg max-w-none bg-white rounded-xl shadow-md p-8 mb-8"
          >
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </motion.div>

          {/* Share Section */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h3 className="text-xl font-semibold font-poppins mb-4">
              Share this post
            </h3>
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Facebook
              </button>
              <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
                Twitter
              </button>
              <button className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">
                Instagram
              </button>
            </div>
          </div>
        </article>
      </div>
    </>
  )
}

export default BlogPost
