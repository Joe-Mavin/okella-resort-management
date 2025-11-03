import api from './api'

class GalleryService {
  // Get all gallery images with optional filters
  async getImages(params = {}) {
    try {
      const response = await api.get('/gallery', { params })
      return {
        success: true,
        data: response.data.data,
        total: response.data.total,
        pagination: response.data.pagination
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch images'
      }
    }
  }

  // Get images by category
  async getImagesByCategory(category, limit = null) {
    return this.getImages({ category, active: 'true', limit })
  }

  // Get featured images
  async getFeaturedImages(limit = null) {
    return this.getImages({ featured: 'true', active: 'true', limit })
  }

  // Get hero images
  async getHeroImages() {
    return this.getImagesByCategory('hero', 10)
  }

  // Get room images
  async getRoomImages() {
    return this.getImagesByCategory('rooms', 20)
  }

  // Get dining images
  async getDiningImages() {
    return this.getImagesByCategory('dining', 15)
  }

  // Get activity images
  async getActivityImages() {
    return this.getImagesByCategory('activities', 15)
  }

  // Get facility images
  async getFacilityImages() {
    return this.getImagesByCategory('facilities', 20)
  }

  // Get exterior/view images
  async getExteriorImages() {
    return this.getImagesByCategory('exterior', 15)
  }

  // Get view images
  async getViewImages() {
    return this.getImagesByCategory('views', 15)
  }

  // Get single image
  async getImage(id) {
    try {
      const response = await api.get(`/gallery/${id}`)
      return {
        success: true,
        data: response.data.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch image'
      }
    }
  }

  // Upload new image (Admin/Staff only)
  async uploadImage(formData) {
    try {
      const response = await api.post('/gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to upload image'
      }
    }
  }

  // Update image (Admin/Staff only)
  async updateImage(id, data) {
    try {
      const response = await api.put(`/gallery/${id}`, data)
      return {
        success: true,
        data: response.data.data,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update image'
      }
    }
  }

  // Delete image (Admin/Staff only)
  async deleteImage(id) {
    try {
      const response = await api.delete(`/gallery/${id}`)
      return {
        success: true,
        message: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete image'
      }
    }
  }

  // Get gallery statistics (Admin/Staff only)
  async getStats() {
    try {
      const response = await api.get('/gallery/admin/stats')
      return {
        success: true,
        data: response.data.data
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch statistics'
      }
    }
  }

  // Helper function to create form data for upload
  createFormData(file, data) {
    const formData = new FormData()
    formData.append('image', file)
    
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key])
      }
    })
    
    return formData
  }

  // Get optimized image URL with transformations
  getOptimizedImageUrl(imageUrl, options = {}) {
    if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
      return imageUrl
    }

    const {
      width,
      height,
      quality = 'auto:good',
      format = 'auto',
      crop = 'fill',
      gravity = 'auto'
    } = options

    // Build transformation string
    let transformation = `q_${quality},f_${format}`
    
    if (width && height) {
      transformation += `,w_${width},h_${height},c_${crop},g_${gravity}`
    } else if (width) {
      transformation += `,w_${width}`
    } else if (height) {
      transformation += `,h_${height}`
    }

    // Insert transformation into Cloudinary URL
    return imageUrl.replace('/upload/', `/upload/${transformation}/`)
  }
}

export default new GalleryService()
