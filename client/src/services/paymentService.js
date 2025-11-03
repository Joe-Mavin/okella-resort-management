import api from './api'

export const paymentService = {
  // Initiate M-PESA payment
  initiateMpesaPayment: async (bookingId, phoneNumber, amount) => {
    const response = await api.post('/payments/mpesa/initiate', {
      bookingId,
      phoneNumber,
      amount
    })
    return response.data
  },

  // Check payment status
  checkPaymentStatus: async (paymentId) => {
    const response = await api.get(`/payments/${paymentId}/status`)
    return response.data
  },

  // Get user's payments
  getMyPayments: async () => {
    const response = await api.get('/payments/my-payments')
    return response.data
  },

  // Get payment by ID
  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`)
    return response.data
  },

  // Admin: Get all payments
  getAllPayments: async (params = {}) => {
    const response = await api.get('/payments', { params })
    return response.data
  },

  // Admin: Process refund
  processRefund: async (paymentId, reason) => {
    const response = await api.post(`/payments/${paymentId}/refund`, { reason })
    return response.data
  }
}

export default paymentService
