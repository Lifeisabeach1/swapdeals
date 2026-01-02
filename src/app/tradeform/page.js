// components/TradeForm.js
'use client';

import { useState } from 'react';
import { LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTradeApp } from '../contexts/trade-app-state';
import { useAuth } from '@/hooks/useAuth';
import { CategoryInput } from '@/components/ItemCategories';
import SwedishRegions from '@/components/SwedishRegions';
import ImageUpload from '@/components/ImageUpload';
import { uploadImages } from '@/lib/utils/images'; 

export default function TradeForm() {
  const { isAuthenticated, user, token, isLoading: authLoading } = useAuth();
  const { addListing } = useTradeApp();
  const router = useRouter();

  const [formData, setFormData] = useState({
    location: '',
    itemName: '',
    itemCategory: '',
    itemDescription: '',
    wantedDescription: ''
  });
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('Du måste vara inloggad');
      return;
    }

    if (!formData.location || !formData.itemName || !formData.itemCategory) {
      setError('Vänligen fyll i alla obligatoriska fält');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      let imageIds = [];
      
      // USE THE NEW COMPRESSION UTILITY
      if (images.length > 0) {
        console.log('📸 Uploading and compressing images...');
        
        // Extract File objects from image state
        const imageFiles = images.map(img => img.file);
        
        try {
          // This will automatically compress images to WebP
          const uploadResult = await uploadImages(imageFiles, token);
          
          if (uploadResult.success && uploadResult.images) {
            imageIds = uploadResult.images.map(img => img.id);
            console.log('✅ Images uploaded:', imageIds);
          }
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          setError(`Bilduppladdning misslyckades: ${uploadError.message}`);
          setIsSubmitting(false);
          return;
        }
      }

      // Create listing
      const tradeData = {
        title: formData.itemName,
        category: formData.itemCategory,
        location: formData.location,
        description: formData.itemDescription || formData.itemName,
        itemsToTrade: [{
          name: formData.itemName,
          description: formData.itemDescription,
          category: formData.itemCategory
        }],
        itemsWanted: [{
          description: formData.wantedDescription || 'Öppen för förslag'
        }],
        imageIds
      };

      await addListing(tradeData);
      
      setSuccess('Annons skapad!');
      setTimeout(() => router.push('/tradelistingpage'), 2000);
      
    } catch (err) {
      setError(err.message || 'Något gick fel');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Logga in först</h1>
          <p className="text-gray-600">Du måste vara inloggad för att skapa en annons.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-green-600 p-6 text-white">
            <h1 className="text-2xl font-bold mb-2">Skapa bytesannons</h1>
            <p className="text-green-100">Inloggad som {user?.username || user?.email}</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Location */}
            <div>
              <label className="block font-semibold mb-2">
                Plats <span className="text-red-500">*</span>
              </label>
              <SwedishRegions
                selectedLocation={formData.location}
                onLocationSelect={(val) => updateField('location', val)}
              />
            </div>

            {/* Item Name */}
            <div>
              <label className="block font-semibold mb-2">
                Föremål <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                placeholder="t.ex. PlayStation 5"
                value={formData.itemName}
                onChange={(e) => updateField('itemName', e.target.value)}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <CategoryInput
                selectedCategory={formData.itemCategory}
                onCategorySelect={(val) => updateField('itemCategory', val)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold mb-2">
                Beskrivning (valfritt)
              </label>
              <textarea
                className="w-full p-3 border rounded-lg"
                rows="3"
                placeholder="Beskriv ditt föremål..."
                value={formData.itemDescription}
                onChange={(e) => updateField('itemDescription', e.target.value)}
              />
            </div>

            {/* Image Upload - Now with automatic compression */}
            <ImageUpload 
              onImagesChange={setImages}
              maxImages={2}
            />

            {/* Wanted */}
            <div>
              <label className="block font-semibold mb-2">
                Vad söker du? (valfritt)
              </label>
              <textarea
                className="w-full p-3 border rounded-lg"
                rows="3"
                placeholder="Vad vill du ha i utbyte?"
                value={formData.wantedDescription}
                onChange={(e) => updateField('wantedDescription', e.target.value)}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Laddar upp och komprimerar...' : 'Publicera annons'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}