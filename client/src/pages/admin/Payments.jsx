import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiDollarSign, FiFilter, FiDownload } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { Helmet } from 'react-helmet-async'
import paymentService from '../../services/paymentService'
import LoadingSpinner from '../../components/LoadingSpinner'
import { format } from 'date-fns'

const AdminPayments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const response = await paymentService.getAllPayments()
      setPayments(response.data)
    } catch (error) {
      toast.error('Failed to load payments')
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-warning',
      completed: 'badge-success',
      failed: 'badge-danger',
      refunded: 'badge-info'
    }
    return `badge ${statusClasses[status] || 'badge-warning'} capitalize`
  }

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true
    return payment.status === filter
  })

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <>
      <Helmet>
        <title>Payments - Admin Dashboard</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-poppins mb-2">Payments</h1>
              <p className="text-gray-600">View and manage payment transactions</p>
            </div>
            <button className="btn-primary flex items-center">
              <FiDownload className="mr-2" />
              Export Report
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[
              { label: 'Total Revenue', value: `KES ${totalRevenue.toLocaleString()}`, color: 'green' },
              { label: 'Completed', value: payments.filter(p => p.status === 'completed').length, color: 'blue' },
              { label: 'Pending', value: payments.filter(p => p.status === 'pending').length, color: 'yellow' },
              { label: 'Failed', value: payments.filter(p => p.status === 'failed').length, color: 'red' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex items-center space-x-3">
              <FiFilter className="text-gray-400" />
              <div className="flex flex-wrap gap-3">
                {['all', 'completed', 'pending', 'failed', 'refunded'].map((status) => (
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
          </div>

          {/* Payments Table */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredPayments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No payments found</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Booking Ref
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment, index) => (
                      <motion.tr
                        key={payment._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-mono text-sm text-gray-900">
                            {payment.transactionReference || payment._id.substring(0, 12)}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-medium text-gray-900">{payment.user?.name}</p>
                          <p className="text-sm text-gray-500">{payment.user?.email}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-medium text-gray-900">
                            {payment.booking?.bookingReference}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="badge badge-info capitalize">
                            {payment.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FiDollarSign className="text-gray-400 mr-1" />
                            <p className="font-semibold text-gray-900">
                              {payment.amount.toLocaleString()}
                            </p>
                          </div>
                          <p className="text-xs text-gray-500">{payment.currency}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusBadge(payment.status)}>
                            {payment.status}
                          </span>
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

export default AdminPayments
