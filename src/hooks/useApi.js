'use client';

import { useCallback, useContext } from 'react';
import { AuthContext } from './useAuth'; // Import the context directly

/**
 * Hook for making API requests with authentication and standard error handling
 */
const useApi = () => {
  // Try to get auth context, but don't throw error if not available
  const authContext = useContext(AuthContext);
  const token = authContext?.token || null;

  /**
   * Base function to make fetch requests
   */
  const fetchData = useCallback(async (url, options = {}) => {
    // Merge default headers with any provided headers
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    try {
      console.log('Making API request to:', url, 'with token:', !!token);
      
      // Make the request
      const response = await fetch(url, {
        ...options,
        headers
      });

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      // Parse the response body
      const data = isJson ? await response.json() : await response.text();

      console.log('API Response:', response.status, data);

      // Handle non-2xx responses
      if (!response.ok) {
        throw new Error(
          isJson && data.message ? data.message : `Server responded with status ${response.status}`
        );
      }

      return isJson ? data : { success: true, data };
    } catch (error) {
      console.error(`API Error (${url}):`, error);
      
      // Return standardized error response
      return {
        success: false,
        message: error.message || 'An unknown error occurred',
        error
      };
    }
  }, [token]);

  /**
   * GET request
   */
  const get = useCallback(async (url, queryParams = {}) => {
    // Build URL with query parameters if provided
    const queryString = Object.keys(queryParams).length > 0
      ? '?' + new URLSearchParams(queryParams).toString()
      : '';
    
    return fetchData(`${url}${queryString}`, { method: 'GET' });
  }, [fetchData]);

  /**
   * POST request
   */
  const post = useCallback(async (url, data = {}) => {
    // Ensure images field is properly formatted if it exists
    let processedData = { ...data };
    if (processedData.images) {
      if (typeof processedData.images === 'object' && !Array.isArray(processedData.images)) {
        // If images is an object (like file metadata), stringify it
        processedData.images = JSON.stringify(processedData.images);
      } else if (Array.isArray(processedData.images)) {
        // If images is an array, stringify it
        processedData.images = JSON.stringify(processedData.images);
      } else if (typeof processedData.images === 'string') {
        // If it's already a string, validate it's proper JSON
        try {
          JSON.parse(processedData.images);
          // It's valid JSON, keep as is
        } catch (e) {
          // Invalid JSON, wrap it in an array and stringify
          processedData.images = JSON.stringify([processedData.images]);
        }
      }
    }

    return fetchData(url, {
      method: 'POST',
      body: JSON.stringify(processedData)
    });
  }, [fetchData]);

  /**
   * PUT request
   */
  const put = useCallback(async (url, data = {}) => {
    // Process images field similar to POST
    let processedData = { ...data };
    if (processedData.images) {
      if (typeof processedData.images === 'object' && !Array.isArray(processedData.images)) {
        processedData.images = JSON.stringify(processedData.images);
      } else if (Array.isArray(processedData.images)) {
        processedData.images = JSON.stringify(processedData.images);
      } else if (typeof processedData.images === 'string') {
        try {
          JSON.parse(processedData.images);
        } catch (e) {
          processedData.images = JSON.stringify([processedData.images]);
        }
      }
    }

    return fetchData(url, {
      method: 'PUT',
      body: JSON.stringify(processedData)
    });
  }, [fetchData]);

  /**
   * PATCH request
   */
  const patch = useCallback(async (url, data = {}) => {
    // Process images field similar to POST
    let processedData = { ...data };
    if (processedData.images) {
      if (typeof processedData.images === 'object' && !Array.isArray(processedData.images)) {
        processedData.images = JSON.stringify(processedData.images);
      } else if (Array.isArray(processedData.images)) {
        processedData.images = JSON.stringify(processedData.images);
      } else if (typeof processedData.images === 'string') {
        try {
          JSON.parse(processedData.images);
        } catch (e) {
          processedData.images = JSON.stringify([processedData.images]);
        }
      }
    }

    return fetchData(url, {
      method: 'PATCH',
      body: JSON.stringify(processedData)
    });
  }, [fetchData]);

  /**
   * DELETE request
   */
  const del = useCallback(async (url) => {
    return fetchData(url, { method: 'DELETE' });
  }, [fetchData]);

  /**
   * Upload file(s) with proper FormData handling
   */
  const upload = useCallback(async (url, files, additionalData = {}) => {
    const formData = new FormData();
    
    // Append files to FormData
    if (Array.isArray(files)) {
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
        // Also append file metadata if needed
        formData.append(`fileData${index}`, JSON.stringify({
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified
        }));
      });
      // Set total file count
      formData.append('fileCount', files.length.toString());
    } else if (files) {
      formData.append('file', files);
      // Append file metadata
      formData.append('fileData', JSON.stringify({
        name: files.name,
        size: files.size,
        type: files.type,
        lastModified: files.lastModified
      }));
    }
    
    // Append additional data if provided
    Object.keys(additionalData).forEach(key => {
      if (key === 'images' && additionalData[key]) {
        // Special handling for images field
        if (typeof additionalData[key] === 'object') {
          formData.append(key, JSON.stringify(additionalData[key]));
        } else {
          formData.append(key, additionalData[key]);
        }
      } else {
        formData.append(key, 
          typeof additionalData[key] === 'object' 
            ? JSON.stringify(additionalData[key]) 
            : additionalData[key]
        );
      }
    });
    
    // For file uploads, don't set Content-Type (let browser set it with boundary)
    // but keep Authorization header
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return fetchData(url, {
      method: 'POST',
      headers,
      body: formData
    });
  }, [fetchData, token]);

  /**
   * Helper function to handle file uploads with base64 encoding
   */
  const uploadBase64 = useCallback(async (url, files, additionalData = {}) => {
    const processFiles = async (fileList) => {
      const filePromises = Array.from(fileList).map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              name: file.name,
              size: file.size,
              type: file.type,
              data: reader.result, // This includes the data:image/jpeg;base64, prefix
              lastModified: file.lastModified
            });
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
      
      return Promise.all(filePromises);
    };

    try {
      let processedFiles = [];
      
      if (Array.isArray(files)) {
        processedFiles = await processFiles(files);
      } else if (files) {
        processedFiles = await processFiles([files]);
      }

      const requestData = {
        ...additionalData,
        images: JSON.stringify(processedFiles)
      };

      return post(url, requestData);
    } catch (error) {
      console.error('Error processing files for base64 upload:', error);
      return {
        success: false,
        message: 'Failed to process files',
        error
      };
    }
  }, [post]);

  /**
   * Helper function to check if response was successful
   */
  const isSuccess = useCallback((response) => {
    return response && response.success !== false;
  }, []);

  /**
   * Helper function to extract error message from response
   */
  const getErrorMessage = useCallback((response) => {
    if (!response) return 'Unknown error occurred';
    return response.message || response.error?.message || 'An error occurred';
  }, []);

  return { 
    get, 
    post, 
    put, 
    patch, 
    delete: del,
    upload,
    uploadBase64,
    isSuccess,
    getErrorMessage,
    // Expose the base fetchData function for custom requests
    fetchData
  };
};

export default useApi;