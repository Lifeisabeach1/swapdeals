// components/ImageUpload.js
"use client"
import { useState, useRef } from 'react';
import { Upload, X, AlertCircle } from 'lucide-react';
import { validateImageFiles } from '@/lib/utils/images';

export default function ImageUpload({ 
  onImagesChange, 
  maxImages = 2,
  initialImages = [] 
}) {
  const [images, setImages] = useState(initialImages);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setError('');
    
    // Validate files BEFORE adding them
    const validation = validateImageFiles(selectedFiles);
    
    if (!validation.isValid) {
      setError(validation.errors[0]); // Show first error
      return;
    }
    
    // Check if adding these would exceed maxImages
    if (images.length + selectedFiles.length > maxImages) {
      setError(`Maximum ${maxImages} images allowed`);
      return;
    }
    
    // Create preview objects
    const newImages = selectedFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }));
    
    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onImagesChange(updatedImages);
    
    // Reset file input
    e.target.value = '';
  };

  const removeImage = (id) => {
    const imageToRemove = images.find(img => img.id === id);
    if (imageToRemove?.url) {
      URL.revokeObjectURL(imageToRemove.url); // Clean up memory
    }
    
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImagesChange(updatedImages);
    setError('');
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div>
      <label className="block font-semibold mb-2">
        Bilder (upp till {maxImages})
        <span className="text-sm text-gray-500 font-normal ml-2">
          Max 10MB per bild
        </span>
      </label>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}
      
      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-600 font-medium">
            Klicka för att ladda upp ({images.length}/{maxImages})
          </p>
          <p className="text-gray-400 text-sm mt-1">
            JPEG, PNG eller WebP • Max 10MB
          </p>
        
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleImageSelect}
          />
        </div>
      )}

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {images.map(img => (
            <div 
              key={img.id} 
              className="relative bg-gray-100 rounded-lg overflow-hidden shadow-md"
            >
              <div className="h-48 flex items-center justify-center p-2">
                <img
                  src={img.url}
                  alt={img.name || "Upload"}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              
              {/* Image Info */}
              <div className="bg-white p-2 border-t">
                <p className="text-xs text-gray-600 truncate" title={img.name}>
                  {img.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(img.size)}
                </p>
              </div>
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow-lg z-10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper function - DEPRECATED: Use uploadImages from utils instead
export async function imagesToBase64(images) {
  console.warn('imagesToBase64 is deprecated. Use uploadImages from @/utils/imageUpload instead.');
  if (!images || images.length === 0) return [];
  
  const promises = images.map(img => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.readAsDataURL(img.file);
    });
  });
  
  return await Promise.all(promises);
}