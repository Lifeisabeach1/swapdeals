// components/TradeForm.js
'use client';

import { useState } from 'react';
import { LogIn, Package, MapPin, Tag, FileText, Image as ImageIcon, Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTradeApp } from '../contexts/trade-app-state';
import { useAuth } from '@/hooks/useAuth';
import { CategoryInput } from '@/components/ItemCategories';
import SwedishRegions from '@/components/SwedishRegions';
import ImageUpload from '@/components/ImageUpload';
import { uploadImages } from '@/lib/utils/images';
import Image from 'next/image';

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
      
      if (images.length > 0) {
        console.log('📸 Uploading and compressing images...');
        
        const imageFiles = images.map(img => img.file);
        
        try {
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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6">
            <div className="animate-spin rounded-full w-full h-full border-4 border-green-200 border-t-green-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image src="/Swapdealsemoji.webp" alt="Logo" width={32} height={32} className="opacity-70" />
            </div>
          </div>
          <p className="text-gray-600 font-medium text-base sm:text-lg">Laddar...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center max-w-md w-full border border-green-100">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <LogIn className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Logga in först
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mb-6">
            Du måste vara inloggad för att skapa en bytesannons.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] text-base sm:text-lg"
          >
            Gå till startsidan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 py-6 sm:py-8 lg:py-12 px-3 sm:px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
            
            <div className="relative z-10 flex items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 shadow-lg">
                <Package className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">
                  Skapa bytesannons
                </h1>
                <p className="text-green-100 text-sm sm:text-base">
                  Inloggad som <span className="font-semibold">{user?.username || user?.email}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div className="m-4 sm:m-6 p-4 sm:p-5 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 text-sm sm:text-base shadow-sm">
              <div className="flex items-start">
                <span className="text-xl mr-3">⚠️</span>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Fel uppstod</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {success && (
            <div className="m-4 sm:m-6 p-4 sm:p-5 bg-green-50 border-l-4 border-green-500 rounded-lg text-green-700 text-sm sm:text-base shadow-sm">
              <div className="flex items-start">
                <span className="text-xl mr-3">✅</span>
                <div className="flex-1">
                  <p className="font-semibold mb-1">Klart!</p>
                  <p>{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-6">
            
            {/* Location Field */}
            <div className="group">
              <div className="flex items-center mb-3">
                <div className="w-11 h-11 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <MapPin className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                </div>
                <label className="block font-semibold text-gray-900 text-base sm:text-lg">
                  Plats <span className="text-red-500">*</span>
                </label>
              </div>
              <div className="transition-all">
                <SwedishRegions
                  selectedLocation={formData.location}
                  onLocationSelect={(val) => updateField('location', val)}
                />
              </div>
            </div>

            {/* Item Name Field */}
            <div className="group">
              <div className="flex items-center mb-3">
                <div className="w-11 h-11 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <Package className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                </div>
                <label className="block font-semibold text-gray-900 text-base sm:text-lg">
                  Föremål <span className="text-red-500">*</span>
                </label>
              </div>
              <input
                type="text"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base sm:text-lg hover:border-gray-300"
                placeholder="t.ex. PlayStation 5, Soffa, iPhone..."
                value={formData.itemName}
                onChange={(e) => updateField('itemName', e.target.value)}
              />
            </div>

            {/* Category Field */}
            <div className="group">
              <div className="flex items-center mb-3">
                <div className="w-11 h-11 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <Tag className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                </div>
                <label className="block font-semibold text-gray-900 text-base sm:text-lg">
                  Kategori <span className="text-red-500">*</span>
                </label>
              </div>
              <CategoryInput
                selectedCategory={formData.itemCategory}
                onCategorySelect={(val) => updateField('itemCategory', val)}
              />
            </div>

            {/* Description Field */}
            <div className="group">
              <div className="flex items-center mb-3">
                <div className="w-11 h-11 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <FileText className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                </div>
                <label className="block font-semibold text-gray-900 text-base sm:text-lg">
                  Beskrivning <span className="text-gray-500 text-sm sm:text-base font-normal">(valfritt)</span>
                </label>
              </div>
              <textarea
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base sm:text-lg resize-none hover:border-gray-300"
                rows="4"
                placeholder="Beskriv ditt föremål... skick, ålder, varför du vill byta det..."
                value={formData.itemDescription}
                onChange={(e) => updateField('itemDescription', e.target.value)}
              />
            </div>

            {/* Image Upload */}
            <div className="group">
              <div className="flex items-center mb-3">
                <div className="w-11 h-11 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <ImageIcon className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                </div>
                <label className="block font-semibold text-gray-900 text-base sm:text-lg">
                  Bilder <span className="text-gray-500 text-sm sm:text-base font-normal">(max 2 st)</span>
                </label>
              </div>
              <ImageUpload 
                onImagesChange={setImages}
                maxImages={2}
              />
            </div>

            {/* Wanted Field */}
            <div className="group">
              <div className="flex items-center mb-3">
                <div className="w-11 h-11 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mr-3 shadow-sm group-hover:shadow-md transition-shadow">
                  <Gift className="w-5 h-5 text-green-600" strokeWidth={2.5} />
                </div>
                <label className="block font-semibold text-gray-900 text-base sm:text-lg">
                  Vad söker du? <span className="text-gray-500 text-sm sm:text-base font-normal">(valfritt)</span>
                </label>
              </div>
              <textarea
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all text-base sm:text-lg resize-none hover:border-gray-300"
                rows="4"
                placeholder="Vad vill du ha i utbyte? Beskriv vad du letar efter..."
                value={formData.wantedDescription}
                onChange={(e) => updateField('wantedDescription', e.target.value)}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-5 sm:py-6 px-6 rounded-xl font-semibold text-lg sm:text-xl disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] min-h-[64px] touch-manipulation"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent mr-3"></div>
                    Laddar upp och komprimerar...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Package className="w-6 h-6 mr-3" strokeWidth={2.5} />
                    Publicera bytesannons
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
