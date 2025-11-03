import api from './api'

export const roomService = {
  // Get all rooms with filters
  getRooms: async (params = {}) => {
    const response = await api.get('/rooms', { params })
    return response.data
  },

  // Get available rooms for specific dates
  getAvailableRooms: async (checkInDate, checkOutDate, guests = {}) => {
    const response = await api.get('/rooms/available', {
      params: { checkInDate, checkOutDate, ...guests }
    })
    return response.data
  },

  // Get room by ID
  getRoomById: async (id) => {
    const response = await api.get(`/rooms/${id}`)
    return response.data
  },

  // Check room availability
  checkAvailability: async (roomId, checkInDate, checkOutDate) => {
    const response = await api.get(`/rooms/${roomId}/availability`, {
      params: { checkInDate, checkOutDate }
    })
    return response.data
  },

  // Admin: Create room
  createRoom: async (roomData) => {
    const response = await api.post('/rooms', roomData)
    return response.data
  },

  // Admin: Update room
  updateRoom: async (id, roomData) => {
    const response = await api.put(`/rooms/${id}`, roomData)
    return response.data
  },

  // Admin: Delete room
  deleteRoom: async (id) => {
    const response = await api.delete(`/rooms/${id}`)
    return response.data
  },

  // Admin: Upload room images
  uploadImages: async (roomId, formData) => {
    const response = await api.post(`/rooms/${roomId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response.data
  }
}

export default roomService
