import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPlus, FiEdit, FiTrash2, FiEye } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import api from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'
import { format } from 'date-fns'

const AdminBlog = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/blog')
      setPosts(response.data.data)
    } catch (error) {
      toast.error('Failed to load blog posts')
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (id) => {
    if (!confirm('Are you sure you want to delete this post?')) return

    try {
      await api.delete(`/blog/${id}`)
      toast.success('Post deleted successfully')
      fetchPosts()
    } catch (error) {
      toast.error('Failed to delete post')
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      published: 'badge-success',
      draft: 'badge-warning',
      archived: 'badge-info'
    }
    return `badge ${statusClasses[status] || 'badge-warning'} capitalize`
  }

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true
    return post.status === filter
  })

  return (
    <>
      <Helmet>
        <title>Manage Blog - Admin Dashboard</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-poppins mb-2">Manage Blog</h1>
              <p className="text-gray-600">Create and manage blog posts</p>
            </div>
            <button className="btn-primary flex items-center">
              <FiPlus className="mr-2" />
              Create New Post
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[
              { label: 'Total Posts', value: posts.length },
              { label: 'Published', value: posts.filter(p => p.status === 'published').length },
              { label: 'Drafts', value: posts.filter(p => p.status === 'draft').length },
              { label: 'Total Views', value: posts.reduce((sum, p) => sum + (p.views || 0), 0) }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-3">
              {['all', 'published', 'draft', 'archived'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    filter === status
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Table */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No blog posts found</p>
              <button className="btn-primary">Create Your First Post</button>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Post
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Published
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Views
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPosts.map((post, index) => (
                      <motion.tr
                        key={post._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={post.featuredImage?.url || 'https://via.placeholder.com/60x60'}
                              alt={post.title}
                              className="w-16 h-16 rounded-lg object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium text-gray-900 line-clamp-1">{post.title}</p>
                              <p className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="badge badge-info">{post.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {post.author?.name || 'Admin'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {post.publishedAt 
                            ? format(new Date(post.publishedAt), 'MMM dd, yyyy')
                            : 'Not published'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {post.views || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(post.status)}>
                            {post.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => window.open(`/blog/${post.slug}`, '_blank')}
                              className="text-blue-600 hover:text-blue-900"
                              title="View"
                            >
                              <FiEye size={18} />
                            </button>
                            <button
                              className="text-primary-600 hover:text-primary-900"
                              title="Edit"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <FiTrash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminBlog
