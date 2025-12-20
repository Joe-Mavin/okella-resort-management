import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUpload, FiEdit, FiTrash2, FiEye, FiEyeOff, FiStar, 
  FiImage, FiFilter, FiSearch, FiPlus, FiX 
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import galleryService from '../../services/galleryService';

const GalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    featured: '',
    active: 'true',
    search: ''
  });
  const [stats, setStats] = useState(null);

  const categories = [
    { value: 'hero', label: 'Hero Images' },
    { value: 'rooms', label: 'Rooms' },
    { value: 'dining', label: 'Dining' },
    { value: 'activities', label: 'Activities' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'exterior', label: 'Exterior' },
    { value: 'views', label: 'Views' },
    { value: 'events', label: 'Events' }
  ];

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    category: 'facilities',
    tags: '',
    isFeatured: false,
    order: 0,
    file: null
  });

  useEffect(() => {
    fetchImages();
    fetchStats();
  }, [filters]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.featured) params.featured = filters.featured;
      if (filters.active) params.active = filters.active;

      const result = await galleryService.getImages(params);
      if (result.success) {
        let filteredImages = result.data;
        
        // Apply search filter
        if (filters.search) {
          filteredImages = filteredImages.filter(img => 
            img.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            img.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
            img.tags?.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
          );
        }
        
        setImages(filteredImages);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await galleryService.getStats();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      const formData = galleryService.createFormData(uploadForm.file, {
        title: uploadForm.title,
        description: uploadForm.description,
        category: uploadForm.category,
        tags: uploadForm.tags,
        isFeatured: uploadForm.isFeatured,
        order: uploadForm.order
      });

      const result = await galleryService.uploadImage(formData);
      if (result.success) {
        toast.success('Image uploaded successfully!');
        setShowUploadModal(false);
        setUploadForm({
          title: '',
          description: '',
          category: 'facilities',
          tags: '',
          isFeatured: false,
          order: 0,
          file: null
        });
        fetchImages();
        fetchStats();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      const result = await galleryService.updateImage(id, data);
      if (result.success) {
        toast.success('Image updated successfully!');
        fetchImages();
        fetchStats();
        setEditingImage(null);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to update image');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const result = await galleryService.deleteImage(id);
      if (result.success) {
        toast.success('Image deleted successfully!');
        fetchImages();
        fetchStats();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const toggleFeatured = async (image) => {
    await handleUpdate(image._id, { isFeatured: !image.isFeatured });
  };

  const toggleActive = async (image) => {
    await handleUpdate(image._id, { isActive: !image.isActive });
  };

  return (
    <>
      <Helmet>
        <title>Gallery Management - OKELLA RESORT Admin</title>
      </Helmet>

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gallery Management</h1>
            <p className="text-gray-600 mt-2">Manage resort images and media content</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
          >
            <FiPlus />
            Upload Image
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Images</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FiImage className="text-3xl text-primary-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Featured</p>
                  <p className="text-2xl font-bold text-primary-600">{stats.featured}</p>
                </div>
                <FiStar className="text-3xl text-primary-500" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div>
                <p className="text-gray-600 text-sm">Active Images</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div>
                <p className="text-gray-600 text-sm">Categories</p>
                <p className="text-2xl font-bold text-blue-600">{stats.byCategory?.length || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search images..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>

            {/* Featured Filter */}
            <select
              value={filters.featured}
              onChange={(e) => setFilters({ ...filters, featured: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Images</option>
              <option value="true">Featured Only</option>
              <option value="false">Non-Featured</option>
            </select>

            {/* Active Filter */}
            <select
              value={filters.active}
              onChange={(e) => setFilters({ ...filters, active: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="true">Active Only</option>
              <option value="false">Inactive Only</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => setFilters({ category: '', featured: '', active: 'true', search: '' })}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Images Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 rounded-xl aspect-[4/3] mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <FiImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No images found</h3>
            <p className="text-gray-500 mb-6">Upload your first image to get started</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Upload Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <motion.div
                key={image._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-sm border overflow-hidden group"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={galleryService.getOptimizedImageUrl(image.imageUrl, {
                      width: 300,
                      height: 225,
                      quality: 'auto:good'
                    })}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Overlay with Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                    <button
                      onClick={() => toggleFeatured(image)}
                      className={`p-2 rounded-full ${image.isFeatured ? 'bg-primary-500 text-white' : 'bg-white text-gray-700'} hover:scale-110 transition-transform`}
                      title={image.isFeatured ? 'Remove from featured' : 'Add to featured'}
                    >
                      <FiStar className={image.isFeatured ? 'fill-current' : ''} />
                    </button>
                    <button
                      onClick={() => toggleActive(image)}
                      className={`p-2 rounded-full ${image.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'} hover:scale-110 transition-transform`}
                      title={image.isActive ? 'Make inactive' : 'Make active'}
                    >
                      {image.isActive ? <FiEye /> : <FiEyeOff />}
                    </button>
                    <button
                      onClick={() => setEditingImage(image)}
                      className="p-2 rounded-full bg-blue-500 text-white hover:scale-110 transition-transform"
                      title="Edit image"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="p-2 rounded-full bg-red-500 text-white hover:scale-110 transition-transform"
                      title="Delete image"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  {/* Status Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {image.isFeatured && (
                      <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                    {!image.isActive && (
                      <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-2 right-2">
                    <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full capitalize">
                      {image.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {image.title}
                  </h3>
                  {image.description && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {image.description}
                    </p>
                  )}
                  
                  {/* Tags */}
                  {image.tags && image.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {image.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {image.tags.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{image.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="text-xs text-gray-500 space-y-1">
                    <div>Order: {image.order}</div>
                    {image.metadata && (
                      <div>{image.metadata.width}Ã—{image.metadata.height}</div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowUploadModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Upload New Image</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FiX size={24} />
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-4">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image File *
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={uploadForm.category}
                      onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                      placeholder="luxury, pool, sunset"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {/* Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={uploadForm.order}
                      onChange={(e) => setUploadForm({ ...uploadForm, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  {/* Featured */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={uploadForm.isFeatured}
                      onChange={(e) => setUploadForm({ ...uploadForm, isFeatured: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                      Mark as featured
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                    >
                      {uploading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FiUpload />
                          Upload Image
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default GalleryManagement;

