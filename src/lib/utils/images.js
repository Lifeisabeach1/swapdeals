// src/utils/imageUpload.js
export async function uploadImages(files, token) {
  try {
    if (!files || files.length === 0) {
      throw new Error('No files selected');
    }

    if (files.length > 2) {
      throw new Error('Maximum 2 images allowed');
    }

    if (!token) {
      throw new Error('Authentication required');
    }

    // Validate files before upload
    for (const file of files) {
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type: ${file.name}. Only JPEG, PNG, and WebP allowed.`);
      }

      // Check file size (5MB limit)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error(`File too large: ${file.name}. Maximum 5MB allowed.`);
      }
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const response = await fetch('/api/images', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const responseData = await response.json();

    if (!response.ok || !responseData.success) {
      throw new Error(responseData.message || 'Upload failed');
    }

    return responseData;

  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
}

// Helper function to delete an image
export async function deleteImage(imageId, token) {
  try {
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`/api/images?id=${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const responseData = await response.json();

    if (!response.ok || !responseData.success) {
      throw new Error(responseData.message || 'Delete failed');
    }

    return responseData;

  } catch (error) {
    console.error('Image delete error:', error);
    throw error;
  }
}

// Helper function to get images for a listing
export async function getImages(listingId) {
  try {
    const response = await fetch(`/api/images?listing_id=${listingId}`);
    const responseData = await response.json();

    if (!response.ok || !responseData.success) {
      throw new Error(responseData.message || 'Failed to fetch images');
    }

    return responseData.images;

  } catch (error) {
    console.error('Get images error:', error);
    throw error;
  }
}