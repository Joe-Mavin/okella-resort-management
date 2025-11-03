import api from './api'

export const bookingService = {
  // Create new booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData)
    return response.data
  },

  // Get user's bookings
  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings')
    return response.data
  },

  // Get booking by ID
  getBookingById: async (id) => {
    const response = await api.get(`/bookings/${id}`)
    return response.data
  },

  // Update booking
  updateBooking: async (id, updates) => {
    const response = await api.put(`/bookings/${id}`, updates)
    return response.data
  },

  // Cancel booking
  cancelBooking: async (id, reason) => {
    const response = await api.delete(`/bookings/${id}`, {
      data: { reason }
    })
    return response.data
  },

  // Admin: Get all bookings
  getAllBookings: async (params = {}) => {
    const response = await api.get('/bookings', { params })
    return response.data
  },

  // Admin: Check-in booking
  checkIn: async (id) => {
    const response = await api.put(`/bookings/${id}/checkin`)
    return response.data
  },

  // Admin: Check-out booking
  checkOut: async (id) => {
    const response = await api.put(`/bookings/${id}/checkout`)
    return response.data
  },

  // Admin: Get booking statistics
  getStats: async () => {
    const response = await api.get('/bookings/stats/overview')
    return response.data
  }
}

export default bookingService
