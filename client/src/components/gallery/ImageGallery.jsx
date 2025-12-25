import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiZoomIn } from 'react-icons/fi';
import galleryService from '../../services/galleryService';

const ImageGallery = ({ 
  images = [], 
  columns = 3, 
  showTitles = true, 
  enableLightbox = true,
  className = '',
  category = null,
  limit = null
}) => {
  const [galleryImages, setGalleryImages] = useState(images);
  const [loading, setLoading] = useState(!images.length);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length) {
      setGalleryImages(images);
      setLoading(false);
    } else {
      fetchImages();
    }
  }, [images, category, limit]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      let result;

      if (category) {
        result = await galleryService.getImagesByCategory(category, limit);
      } else {
        const params = {};
        if (limit) {
          params.limit = limit;
        }
        result = await galleryService.getImages(params);
      }

      if (result.success) {
        setGalleryImages(result.data);
      } else {
        setGalleryImages([]);
      }
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
      setGalleryImages([]);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index) => {
    if (enableLightbox) {
      setCurrentImageIndex(index);
      setLightboxOpen(true);
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const getGridCols = () => {
    switch (columns) {
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  if (loading) {
    return (
      <div className={`grid ${getGridCols()} gap-6 ${className}`}>
        {Array.from({ length: limit || 6 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-300 rounded-xl aspect-[4/3]"></div>
            {showTitles && (
              <div className="mt-3 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (!galleryImages.length) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">No images found</div>
      </div>
    );
  }

  return (
    <>
      <div className={`grid ${getGridCols()} gap-6 ${className}`}>
        {galleryImages.map((image, index) => (
          <motion.div
            key={image._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => openLightbox(index)}
          >
            <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-gray-200">
              <img
                src={galleryService.getOptimizedImageUrl(image.imageUrl, {
                  width: 400,
                  height: 300,
                  quality: 'auto:good'
                })}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300">
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FiZoomIn className="text-white text-3xl" />
                </div>
              </div>

              {/* Category badge */}
              {image.category && (
                <div className="absolute top-3 left-3">
                  <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full capitalize">
                    {image.category}
                  </span>
                </div>
              )}

              {/* Featured badge */}
              {image.isFeatured && (
                <div className="absolute top-3 right-3">
                  <span className="bg-scorpion-500 text-white text-xs px-2 py-1 rounded-full">
                    Featured
                  </span>
                </div>
              )}
            </div>

            {showTitles && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {image.title}
                </h3>
                {image.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {image.description}
                  </p>
                )}
                {image.tags && image.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {image.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 text-white hover:text-gray-300 z-10"
            >
              <FiX size={32} />
            </button>

            {/* Navigation buttons */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-6 text-white hover:text-gray-300 z-10"
                >
                  <FiChevronLeft size={32} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-6 text-white hover:text-gray-300 z-10"
                >
                  <FiChevronRight size={32} />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={galleryService.getOptimizedImageUrl(
                  galleryImages[currentImageIndex]?.imageUrl,
                  { width: 1200, quality: 'auto:best' }
                )}
                alt={galleryImages[currentImageIndex]?.title}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Image info */}
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                  <h3 className="text-xl font-semibold mb-2">
                    {galleryImages[currentImageIndex]?.title}
                  </h3>
                  {galleryImages[currentImageIndex]?.description && (
                    <p className="text-gray-200">
                      {galleryImages[currentImageIndex].description}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3 text-sm text-gray-300">
                    <span className="capitalize">
                      {galleryImages[currentImageIndex]?.category}
                    </span>
                    <span>
                      {currentImageIndex + 1} of {galleryImages.length}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageGallery;
