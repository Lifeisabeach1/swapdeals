//components/ImageViewer
"use client"
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function ImageViewer({ images = [] }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = (index) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const goToNext = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const goToPrevious = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  // Keyboard navigation
  useEffect(() => {
    if (!modalOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setModalOpen(false);
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [modalOpen, images.length]);

  if (!images || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <>
      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div 
            key={image.id || index}
            onClick={() => openModal(index)}
            className="relative bg-gray-100 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer h-64 sm:h-80 flex items-center justify-center"
          >
            <img
              src={image.url}
              alt={`Bild ${index + 1}`}
              className="max-w-full max-h-full object-contain"
              style={image.rotation ? { transform: `rotate(${image.rotation}deg)` } : {}}
            />
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-white bg-black/40 hover:bg-black/60 rounded-full w-12 h-12 flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          {images.length > 1 && (
            <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* Navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/40 hover:bg-black/60 rounded-full w-14 h-14 flex items-center justify-center"
              >
                ‹
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl bg-black/40 hover:bg-black/60 rounded-full w-14 h-14 flex items-center justify-center"
              >
                ›
              </button>
            </>
          )}

          {/* Image */}
          <img
            src={currentImage.url}
            alt={`Bild ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
            style={currentImage.rotation ? { transform: `rotate(${currentImage.rotation}deg)` } : {}}
          />

          {/* Keyboard Hints */}
          <div className="absolute bottom-4 right-4 text-white/60 text-xs bg-black/40 px-3 py-2 rounded-lg">
            <div>ESC stäng • ← → navigera</div>
          </div>
        </div>
      )}
    </>
  );
}