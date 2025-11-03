import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
export const uploadImage = async (filePath, folder = 'resort') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `luxury-resort/${folder}`,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto:best' },
        { fetch_format: 'auto' }
      ]
    });

    // Delete local file after upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('❌ Cloudinary Upload Error:', error);
    
    // Delete local file if upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    throw new Error('Failed to upload image');
  }
};

// Upload multiple images
export const uploadMultipleImages = async (files, folder = 'resort') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file.path, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('❌ Multiple Upload Error:', error);
    throw new Error('Failed to upload images');
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('✅ Image deleted from Cloudinary:', publicId);
    return result;
  } catch (error) {
    console.error('❌ Cloudinary Delete Error:', error);
    throw new Error('Failed to delete image');
  }
};

// Delete multiple images
export const deleteMultipleImages = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(id => deleteImage(id));
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    console.error('❌ Multiple Delete Error:', error);
    throw new Error('Failed to delete images');
  }
};

export default cloudinary;
