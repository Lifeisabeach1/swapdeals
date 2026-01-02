// src/utils/imageUpload.js

/**
 * Compress and resize an image file, converting to WebP format
 * @param {File} file - Original image file
 * @param {number} maxWidth - Maximum width in pixels (default: 1200)
 * @param {number} maxHeight - Maximum height in pixels (default: 1200)
 * @param {number} quality - WebP quality 0-1 (default: 0.80)
 * @returns {Promise<File>} Compressed WebP image file
 */
async function compressImage(file, maxWidth = 1200, maxHeight = 1200, quality = 0.80) {
  console.log(`🔄 Compressing image to WebP: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onerror = () => reject(new Error('Failed to load image'));
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          
          if (width > height) {
            width = maxWidth;
            height = width / aspectRatio;
          } else {
            height = maxHeight;
            width = height * aspectRatio;
          }
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to WebP blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            
            // Create new File object with .webp extension
            const originalName = file.name.replace(/\.(jpe?g|png|webp)$/i, '');
            const webpFileName = `${originalName}.webp`;
            
            const compressedFile = new File([blob], webpFileName, {
              type: 'image/webp',
              lastModified: Date.now()
            });
            
            const originalSizeMB = (file.size / (1024 * 1024)).toFixed(2);
            const newSizeMB = (compressedFile.size / (1024 * 1024)).toFixed(2);
            const reduction = (((file.size - compressedFile.size) / file.size) * 100).toFixed(1);
            
            console.log(`✅ Compressed to WebP: ${originalSizeMB}MB → ${newSizeMB}MB (${reduction}% reduction)`);
            
            resolve(compressedFile);
          },
          'image/webp',
          quality
        );
      };
      
      img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Upload multiple images to the server
 * @param {File[]} files - Array of image files to upload
 * @param {string} token - JWT authentication token
 * @param {number[]} rotations - Optional array of rotation values (0, 90, 180, 270)
 * @param {boolean} autoCompress - Automatically compress images (default: true)
 * @returns {Promise<Object>} Upload result with image data
 */
export async function uploadImages(files, token, rotations = [], autoCompress = true) {
  console.log('📤 Starting image upload process...');
  
  try {
    // Input validation
    if (!files || files.length === 0) {
      throw new Error('No files selected');
    }

    if (files.length > 2) {
      throw new Error('Maximum 2 images allowed');
    }

    if (!token) {
      throw new Error('Authentication required');
    }

    console.log(`Uploading ${files.length} file(s)...`);

    // Validate files before upload
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`Validating file ${i + 1}: ${file.name}`);
      
      // Check if it's actually a file
      if (!(file instanceof File)) {
        throw new Error(`Invalid file object at index ${i}`);
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type: ${file.name}. Only JPEG, PNG, and WebP allowed.`);
      }

      // Check file size BEFORE processing
      if (file.size > maxSize) {
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        throw new Error(`File too large: ${file.name} (${sizeMB}MB). Maximum 10MB allowed. Please choose a smaller image.`);
      }

      // Check if file is corrupted (size 0)
      if (file.size === 0) {
        throw new Error(`File appears to be empty: ${file.name}`);
      }
    }

    // Compress files after validation
    const processedFiles = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`Processing file ${i + 1}: ${file.name}`);
      
      // Compress all images automatically
      let processedFile = file;
      
      if (autoCompress) {
        try {
          processedFile = await compressImage(file);
        } catch (compressionError) {
          console.warn('⚠️ Compression failed, using original:', compressionError);
          processedFile = file;
        }
      }
      
      processedFiles.push(processedFile);
    }

    // Prepare form data
    const formData = new FormData();
    
    // Add files
    processedFiles.forEach((file, index) => {
      formData.append('images', file);
      console.log(`Added file ${index + 1}: ${file.name} (${file.type}, ${file.size} bytes)`);
    });

    // Add rotations if provided
    rotations.forEach((rotation, index) => {
      const validRotations = [0, 90, 180, 270];
      const rot = validRotations.includes(rotation) ? rotation : 0;
      formData.append('rotations', rot.toString());
      console.log(`Added rotation ${index + 1}: ${rot}°`);
    });

    // Ensure we have rotation values for all files
    while (formData.getAll('rotations').length < processedFiles.length) {
      formData.append('rotations', '0');
    }

    console.log('📡 Sending request to /api/images...');

    // Make the request
    const response = await fetch('/api/images', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    console.log(`📡 Response received: ${response.status} ${response.statusText}`);

    // Parse response
    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      console.error('❌ Failed to parse response JSON:', parseError);
      throw new Error('Server returned invalid response format');
    }

    // Check if request was successful
    if (!response.ok) {
      console.error('❌ Upload failed:', responseData);
      const errorMessage = responseData.message || responseData.error || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    if (!responseData.success) {
      console.error('❌ Upload unsuccessful:', responseData);
      throw new Error(responseData.message || 'Upload failed');
    }

    console.log('✅ Upload successful!', responseData);
    return responseData;

  } catch (error) {
    console.error('💥 Image upload error:', error);
    
    // Enhanced error messages for common issues
    if (error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your connection.');
    }
    
    if (error.message.includes('413')) {
      throw new Error('Files too large: Server rejected the upload. Try smaller images.');
    }
    
    if (error.message.includes('401')) {
      throw new Error('Authentication failed: Please log in again.');
    }
    
    if (error.message.includes('403')) {
      throw new Error('Access denied: You do not have permission to upload images.');
    }
    
    if (error.message.includes('500')) {
      throw new Error('Server error: Please try again later or contact support.');
    }
    
    // Re-throw the original error if we can't provide a better one
    throw error;
  }
}

/**
 * Delete an image from the server
 * @param {string|number} imageId - ID of the image to delete
 * @param {string} token - JWT authentication token
 * @returns {Promise<Object>} Delete result
 */
export async function deleteImage(imageId, token) {
  console.log('🗑️ Deleting image:', imageId);
  
  try {
    if (!imageId) {
      throw new Error('Image ID is required');
    }

    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`/api/images?id=${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      console.error('❌ Failed to parse delete response:', parseError);
      throw new Error('Server returned invalid response format');
    }

    if (!response.ok || !responseData.success) {
      console.error('❌ Delete failed:', responseData);
      throw new Error(responseData.message || 'Delete failed');
    }

    console.log('✅ Image deleted successfully');
    return responseData;

  } catch (error) {
    console.error('💥 Image delete error:', error);
    
    if (error.message.includes('404')) {
      throw new Error('Image not found or already deleted');
    }
    
    if (error.message.includes('401')) {
      throw new Error('Authentication failed: Please log in again');
    }
    
    if (error.message.includes('403')) {
      throw new Error('Access denied: You can only delete your own images');
    }
    
    throw error;
  }
}

/**
 * Get images for a listing or user
 * @param {string} listingId - Optional listing ID to filter by
 * @param {string} userId - Optional user ID to filter by
 * @returns {Promise<Array>} Array of image objects
 */
export async function getImages(listingId = null, userId = null) {
  console.log('📥 Fetching images...', { listingId, userId });
  
  try {
    if (!listingId && !userId) {
      throw new Error('Either listingId or userId must be provided');
    }

    const params = new URLSearchParams();
    if (listingId) params.append('listing_id', listingId);
    if (userId) params.append('user_id', userId);

    const response = await fetch(`/api/images?${params.toString()}`);
    
    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      console.error('❌ Failed to parse get images response:', parseError);
      throw new Error('Server returned invalid response format');
    }

    if (!response.ok || !responseData.success) {
      console.error('❌ Failed to fetch images:', responseData);
      throw new Error(responseData.message || 'Failed to fetch images');
    }

    console.log(`✅ Fetched ${responseData.images.length} images`);
    return responseData.images;

  } catch (error) {
    console.error('💥 Get images error:', error);
    throw error;
  }
}

/**
 * Validate image files before upload
 * @param {File[]} files - Array of files to validate
 * @returns {Object} Validation result with isValid and errors array
 */
export function validateImageFiles(files) {
  const errors = [];
  
  if (!files || files.length === 0) {
    errors.push('No files selected');
    return { isValid: false, errors };
  }

  if (files.length > 2) {
    errors.push('Maximum 2 images allowed');
  }

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  files.forEach((file, index) => {
    if (!(file instanceof File)) {
      errors.push(`Invalid file at position ${index + 1}`);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      errors.push(`File "${file.name}" has invalid type. Only JPEG, PNG, and WebP allowed.`);
    }

    if (file.size > maxSize) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      errors.push(`File "${file.name}" is too large (${sizeMB}MB). Maximum 10MB allowed.`);
    }

    if (file.size === 0) {
      errors.push(`File "${file.name}" appears to be empty`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Create a preview URL for a file (for displaying before upload)
 * @param {File} file - Image file
 * @returns {string} Object URL for preview
 */
export function createImagePreview(file) {
  if (!file || !(file instanceof File)) {
    throw new Error('Invalid file provided');
  }
  
  if (!file.type.startsWith('image/')) {
    throw new Error('File is not an image');
  }
  
  return URL.createObjectURL(file);
}

/**
 * Clean up preview URLs to prevent memory leaks
 * @param {string[]} urls - Array of object URLs to revoke
 */
export function cleanupPreviews(urls) {
  if (!Array.isArray(urls)) return;
  
  urls.forEach(url => {
    if (url && typeof url === 'string' && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
}