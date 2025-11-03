import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUsers, FiFilter, FiEdit, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import api from '../../services/api'
import LoadingSpinner from '../../components/LoadingSpinner'
import { format } from 'date-fns'

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/users')
      setUsers(response.data.data)
    } catch (error) {
      toast.error('Failed to load users')
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole })
      toast.success('User role updated successfully')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to update user role')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      await api.delete(`/admin/users/${userId}`)
      toast.success('User deleted successfully')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  const getRoleBadge = (role) => {
    const roleClasses = {
      admin: 'badge-danger',
      staff: 'badge-warning',
      guest: 'badge-info'
    }
    return `badge ${roleClasses[role] || 'badge-info'} capitalize`
  }

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true
    return user.role === filter
  })

  return (
    <>
      <Helmet>
        <title>Manage Users - Admin Dashboard</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-poppins mb-2">Manage Users</h1>
            <p className="text-gray-600">View and manage user accounts</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[
              { label: 'Total Users', value: users.length, icon: <FiUsers size={24} />, color: 'blue' },
              { label: 'Admins', value: users.filter(u => u.role === 'admin').length, color: 'red' },
              { label: 'Staff', value: users.filter(u => u.role === 'staff').length, color: 'yellow' },
              { label: 'Guests', value: users.filter(u => u.role === 'guest').length, color: 'green' }
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
            <div className="flex items-center space-x-3">
              <FiFilter className="text-gray-400" />
              <div className="flex flex-wrap gap-3">
                {['all', 'admin', 'staff', 'guest'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setFilter(role)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                      filter === role
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Users Table */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No users found</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
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
                    {filteredUsers.map((user, index) => (
                      <motion.tr
                        key={user._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={user.avatar || 'https://via.placeholder.com/40'}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover mr-3"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">ID: {user._id.substring(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-gray-900">{user.email}</p>
                          <p className="text-sm text-gray-500">{user.phone}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.role}
                            onChange={(e) => handleRoleUpdate(user._id, e.target.value)}
                            className="input-field text-sm py-1"
                          >
                            <option value="guest">Guest</option>
                            <option value="staff">Staff</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {format(new Date(user.createdAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`badge ${user.isVerified ? 'badge-success' : 'badge-warning'}`}>
                            {user.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              className="text-primary-600 hover:text-primary-900"
                              title="Edit"
                            >
                              <FiEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
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

export default AdminUsers
