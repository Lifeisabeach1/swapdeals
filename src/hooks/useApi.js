// hooks/useApi.js
'use client';

import { useContext, useCallback } from 'react';
import { AuthContext } from './useAuth';

const useApi = () => {
  const authContext = useContext(AuthContext);
  const token = authContext?.token || null;
  const baseURL = process.env.NEXT_PUBLIC_API_URL || '';

  const fetchData = useCallback(async (endpoint, options = {}) => {
    const url = `${baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });
      const contentType = response.headers.get('content-type');
      const data = contentType?.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new Error(data.message || data.error || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error.message);
      throw error;
    }
  }, [token, baseURL]);

  const get = useCallback((endpoint, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchData(`${endpoint}${query ? `?${query}` : ''}`, { method: 'GET' });
  }, [fetchData]);

  const post = useCallback((endpoint, data = {}) => {
    return fetchData(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }, [fetchData]);

  const put = useCallback((endpoint, data = {}) => {
    return fetchData(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }, [fetchData]);

  const patch = useCallback((endpoint, data = {}) => {
    return fetchData(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }, [fetchData]);

  const del = useCallback((endpoint) => {
    return fetchData(endpoint, { method: 'DELETE' });
  }, [fetchData]);

  const upload = useCallback(async (endpoint, files, additionalData = {}) => {
    const formData = new FormData();

    if (Array.isArray(files)) {
      files.forEach((file, idx) => formData.append(`file${idx}`, file));
      formData.append('fileCount', files.length);
    } else if (files) {
      formData.append('file', files);
    }

    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
    });

    const url = `${baseURL}${endpoint}`;
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');
      
      return data;
    } catch (error) {
      console.error('Upload error:', error.message);
      throw error;
    }
  }, [token, baseURL]);

  const uploadBase64 = useCallback(async (endpoint, files, additionalData = {}) => {
    const processFiles = (fileList) => {
      return Promise.all(
        Array.from(fileList).map(file => 
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve({
              name: file.name,
              size: file.size,
              type: file.type,
              data: reader.result,
              lastModified: file.lastModified,
            });
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
        )
      );
    };

    try {
      const processedFiles = await processFiles(Array.isArray(files) ? files : [files]);
      return post(endpoint, {
        ...additionalData,
        images: JSON.stringify(processedFiles),
      });
    } catch (error) {
      console.error('Base64 upload error:', error.message);
      throw error;
    }
  }, [post]);

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    uploadBase64,
    fetchData,
  };
};

export default useApi;
