"use client"
import { useState, useEffect } from 'react';
import { RotateCw, RotateCcw, X, AlertCircle, Eye } from 'lucide-react';

export default function ImageHandler({ 
  images = [], 
  onImagesChange, 
  onRemoveImage,
  token,
  maxImages = 2,
  className = "",
  title = "Image Viewer",
  readOnly = false, // New prop to control interactivity
  hideControls = false, // New prop to hide all controls and show only images
  hideControlsAfterUpload = false // New prop to hide controls after upload
}) {
  const [rotatingImageId, setRotatingImageId] = useState(null);
  const [uploadingRotation, setUploadingRotation] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);
  const [modalIsLoading, setModalIsLoading] = useState(true);

  // Determine if controls should be hidden
  const shouldHideControls = hideControls || (hideControlsAfterUpload && images.length > 0);

  // Apply rotation to image on server
  const applyRotation = async (imageId, rotationDegrees) => {
    if (!token || readOnly || shouldHideControls) {
      if (!readOnly && !shouldHideControls) {
        alert('Autentisering krävs för att rotera bilder.');
      }
      return false;
    }

    setRotatingImageId(imageId);
    setUploadingRotation(true);

    try {
      const currentImage = images.find(img => img.id === imageId);
      if (!currentImage) {
        throw new Error('Bild hittades inte');
      }

      const currentRotation = currentImage.rotation || 0;
      const newRotation = (currentRotation + rotationDegrees) % 360;

      const response = await fetch(`/api/images/${imageId}/rotate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          rotation: newRotation 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Misslyckades att rotera bilden');
      }

      const result = await response.json();
      
      const updatedImages = images.map(img => 
        img.id === imageId 
          ? { 
              ...img, 
              rotation: newRotation,
              url: result.url || img.url,
              width: result.width || img.width,
              height: result.height || img.height
            }
          : img
      );

      if (onImagesChange) {
        onImagesChange(updatedImages);
      }

      return true;
    } catch (error) {
      console.error('Rotation error:', error);
      alert(`Misslyckades att rotera bild: ${error.message}`);
      return false;
    } finally {
      setRotatingImageId(null);
      setUploadingRotation(false);
    }
  };

  const rotateClockwise = (imageId) => {
    applyRotation(imageId, 90);
  };

  const rotateCounterClockwise = (imageId) => {
    applyRotation(imageId, -90);
  };

  const getRotationStyle = (rotation) => {
    if (!rotation || rotation === 0) return {};
    return {
      transform: `rotate(${rotation}deg)`,
      transition: 'transform 0.3s ease-in-out'
    };
  };

  const getRotationClass = (rotation) => {
    if (rotation === 90 || rotation === 270) {
      return 'aspect-[4/3]';
    }
    return 'aspect-square';
  };

  const handleRemoveImage = async (imageId) => {
    if (onRemoveImage && !readOnly && !shouldHideControls) {
      await onRemoveImage(imageId);
    }
  };

  const openModal = (index) => {
    if (readOnly || shouldHideControls) return; // Prevent modal opening when controls are hidden
    setModalCurrentIndex(index);
    setModalOpen(true);
    setModalIsLoading(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Modal navigation functions
  const goToNext = () => {
    setModalCurrentIndex((prev) => (prev + 1) % images.length);
    setModalIsLoading(true);
  };

  const goToPrevious = () => {
    setModalCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setModalIsLoading(true);
  };

  const handleImageLoad = () => {
    setModalIsLoading(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Handle keyboard navigation for modal
  useEffect(() => {
    if (!modalOpen || readOnly || shouldHideControls) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [modalOpen, modalCurrentIndex, readOnly, shouldHideControls]);

  if (!images || images.length === 0) {
    return null;
  }

  const currentModalImage = images[modalCurrentIndex];

  return (
    <>
      <div className={`space-y-4 ${className}`}>
        {/* Only show header and count when not in readOnly mode or when controls are not hidden */}
        {!readOnly && !shouldHideControls && (
          <div className="flex items-center mb-3">
            <div className="flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-1.5 mr-2">
              <span className="text-sm" role="img" aria-label="Rotate">🔄</span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              Bildförhandsvisning ({images.length}/{maxImages})
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={image.id || index} className="relative group">
              <div className={`relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-md ${readOnly || shouldHideControls ? '' : 'hover:shadow-xl'} transition-all duration-300 border border-gray-200/50 ${getRotationClass(image.rotation)}`}>
                {/* Loading Overlay - only show when not readOnly and controls are not hidden */}
                {!readOnly && !shouldHideControls && rotatingImageId === image.id && (
                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full p-3 shadow-lg">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                    </div>
                  </div>
                )}

                {/* Image */}
                <div 
                  className={`w-full h-full flex items-center justify-center overflow-hidden ${readOnly || shouldHideControls ? '' : 'cursor-pointer'}`}
                  onClick={() => !readOnly && !shouldHideControls && openModal(index)}
                >
                  <img
                    src={image.url}
                    alt={`Förhandsvisning ${image.originalName || index + 1}`}
                    className={`max-w-full max-h-full object-contain transition-all duration-300 ${readOnly || shouldHideControls ? '' : 'group-hover:scale-105'}`}
                    style={getRotationStyle(image.rotation)}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentNode.innerHTML = `
                        <div class="flex items-center justify-center bg-gray-100 w-full h-full">
                          <div class="text-center text-gray-400">
                            <svg class="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <p class="text-xs">Kunde ej ladda bild</p>
                          </div>
                        </div>
                      `;
                    }}
                  />
                </div>

                {/* Image Controls Overlay - only show when not readOnly and controls are not hidden */}
                {!readOnly && !shouldHideControls && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    {/* Top Controls */}
                    <div className="absolute top-2 right-2 flex space-x-2">
                      {/* View Button */}
                     
                      
                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(image.id);
                        }}
                        disabled={uploadingRotation}
                        className="bg-red-500/90 hover:bg-red-600/90 text-white rounded-full p-2 transition-all duration-200 transform hover:scale-110 shadow-lg border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Ta bort bild"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Bottom Controls - Rotation Buttons */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-2 border border-white/20">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            rotateCounterClockwise(image.id);
                          }}
                          disabled={rotatingImageId === image.id || uploadingRotation}
                          className="text-white hover:text-blue-300 transition-colors duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                          title="Rotera moturs"
                        >
                          
                        </button>

                        <div className="text-white text-xs font-medium px-2 py-1 bg-white/10 rounded-full min-w-[3rem] text-center">
                          {image.rotation || 0}°
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            rotateClockwise(image.id);
                          }}
                          disabled={rotatingImageId === image.id || uploadingRotation}
                          className="text-white hover:text-blue-300 transition-colors duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed p-1"
                          title="Rotera medurs"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Image Info - only show when not readOnly and controls are not hidden */}
              {!readOnly && !shouldHideControls && (
                <div className="mt-2 text-center">
                  <p className="text-xs text-gray-600 truncate" title={image.originalName || `Bild ${index + 1}`}>
                    {image.originalName || `Bild ${index + 1}`}
                  </p>
                  {image.rotation && image.rotation !== 0 && (
                    <div className="flex items-center justify-center mt-1">
                      <div className="flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        <RotateCw className="w-3 h-3 mr-1" />
                        {image.rotation}° roterad
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Help Text - only show when not readOnly and controls are not hidden */}
        {!readOnly && !shouldHideControls && images.length > 0 && (
          <div>
         
          </div>
        )}

        {/* Status Messages - only show when not readOnly and controls are not hidden */}
        {!readOnly && !shouldHideControls && uploadingRotation && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-yellow-600 border-t-transparent mr-3"></div>
            <p className="text-yellow-800 text-sm font-medium">Roterar bild...</p>
          </div>
        )}
      </div>

      {/* Modal - only show when not readOnly and controls are not hidden */}
      {!readOnly && !shouldHideControls && modalOpen && images.length > 0 && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-bold z-10 bg-black/20 hover:bg-black/40 rounded-full w-12 h-12 flex items-center justify-center transition-all duration-200"
            aria-label="Close modal"
          >
            ×
          </button>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg text-sm font-medium">
              {modalCurrentIndex + 1} / {images.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white text-4xl font-bold bg-black/20 hover:bg-black/40 rounded-full w-14 h-14 flex items-center justify-center transition-all duration-200"
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white text-4xl font-bold bg-black/20 hover:bg-black/40 rounded-full w-14 h-14 flex items-center justify-center transition-all duration-200"
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          {/* Loading Spinner */}
          {modalIsLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white"></div>
            </div>
          )}

          {/* Main Image */}
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            <img
              src={currentModalImage.url}
              alt={currentModalImage.alt || `${title} - Image ${modalCurrentIndex + 1}`}
              className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                modalIsLoading ? 'opacity-0' : 'opacity-100'
              }`}
              style={getRotationStyle(currentModalImage.rotation)}
              onLoad={handleImageLoad}
              onError={() => setModalIsLoading(false)}
            />
          </div>

          {/* Image Info */}
          {currentModalImage.caption && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-lg max-w-lg text-center">
              <p className="text-sm">{currentModalImage.caption}</p>
            </div>
          )}

          {/* Thumbnail Navigation */}
          {images.length > 1 && images.length <= 10 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
              {images.map((image, index) => (
                <button
                  key={image.id || index}
                  onClick={() => {
                    setModalCurrentIndex(index);
                    setModalIsLoading(true);
                  }}
                  className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                    index === modalCurrentIndex 
                      ? 'border-white scale-110' 
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={getRotationStyle(image.rotation)}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Keyboard Hints */}
          <div className="absolute bottom-4 right-4 text-white/60 text-xs bg-black/30 px-3 py-2 rounded-lg">
            <div>ESC to close</div>
            {images.length > 1 && <div>← → to navigate</div>}
          </div>
        </div>
      )}
    </>
  );
}