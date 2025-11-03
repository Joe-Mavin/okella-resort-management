# OKELLA RESORT - Gallery & Image Management System

## Overview
This document provides setup instructions for the newly implemented image management system that allows admins to upload, manage, and display resort images throughout the website.

## Features Implemented

### 🖼️ Image Management System
- **Gallery Model**: MongoDB schema for storing image metadata
- **Cloudinary Integration**: Cloud-based image storage and optimization
- **Admin Interface**: Complete CRUD operations for gallery management
- **Image Categories**: Organized by hero, rooms, dining, activities, facilities, exterior, views, events
- **Featured Images**: Mark images as featured for special display
- **Image Optimization**: Automatic resizing and format optimization via Cloudinary

### 🎨 Frontend Components
- **Dynamic Hero Section**: Slideshow with gallery images
- **Image Gallery Component**: Reusable gallery with lightbox functionality
- **Features Section**: Dynamic content with facility images
- **Rooms Showcase**: Enhanced with room category images
- **Gallery Page**: Public gallery with category filtering
- **Admin Gallery Management**: Full admin interface for image management

### 🔧 Technical Implementation
- **Backend**: Express.js with Multer for file uploads
- **Database**: MongoDB with Mongoose ODM
- **Image Storage**: Cloudinary for cloud storage and CDN
- **Frontend**: React with Framer Motion animations
- **Image Optimization**: Dynamic URL transformations

## Setup Instructions

### 1. Environment Variables
Add the following to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2. Cloudinary Setup
1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add these credentials to your `.env` file

### 3. Install Dependencies
The following packages are already included in package.json:
- `cloudinary` - Cloudinary SDK
- `multer` - File upload middleware
- `framer-motion` - Animations (frontend)

### 4. Database Migration
The Gallery model will be automatically created when you first run the server. No manual migration needed.

### 5. Admin Access
1. Create an admin user using the script:
   ```bash
   cd server
   node scripts/create-admin.mjs
   ```
2. Login with admin credentials
3. Navigate to `/admin/gallery` to start managing images

## Usage Guide

### For Administrators

#### Uploading Images
1. Go to Admin Panel → Gallery
2. Click "Upload Image" button
3. Fill in the form:
   - **Image File**: Select image (JPG, PNG, WebP supported)
   - **Title**: Descriptive title for the image
   - **Description**: Optional description
   - **Category**: Choose appropriate category
   - **Tags**: Comma-separated tags for better organization
   - **Featured**: Mark as featured for special display
   - **Display Order**: Number for sorting (0 = first)

#### Managing Images
- **View**: Browse all uploaded images with filters
- **Edit**: Update image metadata (title, description, category, etc.)
- **Toggle Featured**: Mark/unmark images as featured
- **Toggle Active**: Show/hide images from public display
- **Delete**: Permanently remove images (also deletes from Cloudinary)

#### Image Categories
- **Hero**: Main slideshow images on homepage
- **Rooms**: Room and suite images
- **Dining**: Restaurant and food images
- **Activities**: Activity and recreation images
- **Facilities**: Resort facilities and amenities
- **Exterior**: Building and landscape images
- **Views**: Scenic views and surroundings
- **Events**: Event and conference images

### For Developers

#### Using the Gallery Service
```javascript
import galleryService from '../services/galleryService';

// Get images by category
const heroImages = await galleryService.getHeroImages();
const roomImages = await galleryService.getRoomImages();

// Get featured images
const featured = await galleryService.getFeaturedImages(6);

// Optimize image URLs
const optimizedUrl = galleryService.getOptimizedImageUrl(imageUrl, {
  width: 400,
  height: 300,
  quality: 'auto:good'
});
```

#### Using the ImageGallery Component
```jsx
import ImageGallery from '../components/gallery/ImageGallery';

// Basic usage
<ImageGallery 
  category="facilities" 
  limit={6} 
  columns={3}
  showTitles={true}
  enableLightbox={true}
/>

// With custom images
<ImageGallery 
  images={customImages}
  columns={4}
  showTitles={false}
/>
```

## API Endpoints

### Public Endpoints
- `GET /api/gallery` - Get all active images (with filters)
- `GET /api/gallery/:id` - Get single image

### Admin Endpoints (Protected)
- `POST /api/gallery` - Upload new image
- `PUT /api/gallery/:id` - Update image metadata
- `DELETE /api/gallery/:id` - Delete image
- `GET /api/gallery/admin/stats` - Get gallery statistics

### Query Parameters
- `category` - Filter by category
- `featured` - Filter featured images (true/false)
- `active` - Filter active images (true/false)
- `limit` - Limit number of results
- `page` - Pagination

## File Structure

```
server/
├── models/
│   └── Gallery.model.mjs          # Gallery MongoDB schema
├── controllers/
│   └── gallery.controller.mjs     # Gallery CRUD operations
├── routes/
│   └── gallery.routes.mjs         # Gallery API routes
└── middleware/
    └── upload.middleware.mjs      # Multer configuration

client/
├── src/
│   ├── components/
│   │   ├── gallery/
│   │   │   └── ImageGallery.jsx   # Reusable gallery component
│   │   ├── home/
│   │   │   ├── HeroSection.jsx    # Dynamic hero with images
│   │   │   ├── FeaturesSection.jsx # Features with images
│   │   │   └── RoomsShowcase.jsx  # Rooms with images
│   │   └── admin/
│   │       └── AdminNavigation.jsx # Admin sidebar
│   ├── pages/
│   │   ├── Gallery.jsx            # Public gallery page
│   │   ├── Home.jsx               # Updated homepage
│   │   └── admin/
│   │       └── GalleryManagement.jsx # Admin gallery interface
│   ├── services/
│   │   └── galleryService.js      # Gallery API service
│   └── layouts/
│       └── AdminLayout.jsx        # Admin layout with navigation
```

## Troubleshooting

### Common Issues

1. **Images not uploading**
   - Check Cloudinary credentials in `.env`
   - Verify file size limits (default: 10MB)
   - Ensure proper file formats (JPG, PNG, WebP)

2. **Images not displaying**
   - Check if images are marked as active
   - Verify category filters
   - Check browser console for errors

3. **Admin access issues**
   - Ensure user has admin role
   - Check authentication middleware
   - Verify JWT token validity

### Performance Tips

1. **Image Optimization**
   - Use appropriate image sizes for different contexts
   - Enable Cloudinary auto-format and auto-quality
   - Implement lazy loading for large galleries

2. **Caching**
   - Cloudinary provides automatic CDN caching
   - Consider implementing browser caching headers
   - Use React.memo for gallery components when appropriate

## Future Enhancements

### Planned Features
- [ ] Bulk image upload
- [ ] Image cropping and editing
- [ ] Advanced search and filtering
- [ ] Image analytics and usage tracking
- [ ] Automated image tagging with AI
- [ ] Integration with social media platforms
- [ ] Image watermarking options
- [ ] Advanced gallery layouts (masonry, carousel)

### Technical Improvements
- [ ] Progressive image loading
- [ ] WebP format optimization
- [ ] Image compression before upload
- [ ] Backup and restore functionality
- [ ] Image version control
- [ ] Advanced caching strategies

## Support

For technical support or questions about the image management system:
1. Check this documentation first
2. Review the code comments in the relevant files
3. Test with sample images to isolate issues
4. Check server logs for detailed error messages

## Security Considerations

1. **File Upload Security**
   - File type validation implemented
   - File size limits enforced
   - Malicious file detection via Multer

2. **Access Control**
   - Admin-only upload and management
   - JWT-based authentication
   - Role-based permissions

3. **Image Storage**
   - Cloudinary handles secure storage
   - Automatic backup and redundancy
   - CDN delivery for performance

---

**Last Updated**: October 2024
**Version**: 1.0.0
**Author**: OKELLA RESORT Development Team
