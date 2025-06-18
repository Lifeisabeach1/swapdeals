'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, MapPin, Package, ArrowRightLeft, LogIn, RefreshCw, CheckCircle, AlertCircle, RotateCw } from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import { useTradeApp } from '../contexts/trade-app-state';
import { useAuth } from '@/hooks/useAuth';
import Alert from '@/components/Alert';
import RegisterForm from '@/components/RegisterForm';
import LoginForm from '@/components/LoginForm';
import { CategoryInput } from '@/components/ItemCategories';
import SwedishRegions from '@/components/SwedishRegions';

export default function TradeForm() {
  const { isAuthenticated, user, token, isLoading: authLoading } = useAuth();
  
  const [location, setLocation] = useState('');
  const [itemToTrade, setItemToTrade] = useState({ name: '', description: '', category: '' });
  const [itemWanted, setItemWanted] = useState({ description: '' });
  const [images, setImages] = useState([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [isProcessingAuth, setIsProcessingAuth] = useState(false);
  
  const router = useRouter();
  const { addListing } = useTradeApp();
  const fileInputRef = useRef(null);

  const showAlert = (type, message, title = null) => {
    setAlert({ type, message, title, isVisible: true });
  };

  const hideAlert = () => {
    setAlert(null);
  };

 
const handleLoginSuccess = async (fromRegistration = false) => {
  setIsProcessingAuth(true);
  setShowLoginForm(false);
  setShowRegisterForm(false);
  
  // Wait a moment for the auth state to propagate
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Force a re-render by checking localStorage directly
  const token = localStorage.getItem('authToken');
  const userData = localStorage.getItem('userData');
  
  if (token && userData) {
    const message = fromRegistration 
      ? 'Registrering lyckades! Du är nu inloggad och kan skapa din bytesannons.'
      : 'Inloggning lyckades! Du kan nu skapa din bytesannons.';
    const title = fromRegistration ? 'Välkommen till SwapDeals!' : 'Välkommen!';
    
    showAlert('success', message, title);
  }
  
  setIsProcessingAuth(false);
};

// Also add this useEffect to listen for auth changes:
useEffect(() => {
  const handleAuthChange = () => {
    // Force component to re-evaluate auth state
    // This will trigger when login/register succeeds
    setIsProcessingAuth(false);
    setShowLoginForm(false);
    setShowRegisterForm(false);
  };

  // Listen for the custom auth change event
  window.addEventListener('authChange', handleAuthChange);
  
  return () => {
    window.removeEventListener('authChange', handleAuthChange);
  };
}, []);

  const handleSwitchToLogin = () => {
    setShowRegisterForm(false);
    setTimeout(() => {
      setShowLoginForm(true);
    }, 100);
  };

  const handleSwitchToRegister = () => {
    setShowLoginForm(false);
    setTimeout(() => {
      setShowRegisterForm(true);
    }, 100);
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      setShowLoginForm(false);
      setShowRegisterForm(false);
      setIsProcessingAuth(false);
    }
  }, [isAuthenticated, authLoading]);

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target.result;
        
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          if (width > height && width > 1200) {
            height = Math.round((height * 1200) / width);
            width = 1200;
          } else if (height > 1200) {
            width = Math.round((width * 1200) / height);
            height = 1200;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              const newFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(newFile);
            },
            'image/jpeg',
            0.7
          );
        };
      };
    });
  };

  const handleImageSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    const remainingSlots = 2 - images.length;
    const filesToProcess = files.slice(0, remainingSlots);
    
    if (files.length > remainingSlots) {
      showAlert('warning', `Du kan bara ladda upp ${remainingSlots} mer bilder. Endast de första ${remainingSlots} bilderna kommer att laddas upp.`, 'Begränsning av bilder');
    }

    const newImages = [];
    
    for (const file of filesToProcess) {
      const compressedImage = await compressImage(file);
      const newImage = {
        id: `temp-${Date.now()}-${Math.random()}`, 
        file: compressedImage,
        url: URL.createObjectURL(compressedImage),
        originalName: file.name,
        size: compressedImage.size,
        rotation: 0,
        isNew: true 
      };
      newImages.push(newImage);
    }

    setImages(prev => [...prev, ...newImages]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async (imageId) => {
    const imageToRemove = images.find(img => img.id === imageId);
    if (!imageToRemove) return;

    if (imageToRemove.isNew && imageToRemove.url) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleRotateImage = async (imageId) => {
    const imageToRotate = images.find(img => img.id === imageId);
    if (!imageToRotate || !imageToRotate.isNew) return;

    const newRotation = (imageToRotate.rotation + 90) % 360;
    
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, rotation: newRotation }
        : img
    ));
  };

  const updateItemToTrade = (field, value) => {
    setItemToTrade(prev => ({ ...prev, [field]: value }));
  };

  const updateItemWanted = (field, value) => {
    setItemWanted(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!location) errors.location = 'Vänligen välj din plats';
    if (!itemToTrade.name.trim()) errors.itemName = 'Föremålsnamn krävs';
    if (!itemToTrade.category) errors.itemCategory = 'Vänligen välj en kategori för ditt föremål';
    
    return errors;
  };

  const applyRotationToImage = (file, rotation) => {
    return new Promise((resolve) => {
      if (rotation === 0) {
        resolve(file);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new window.Image();
      
      img.onload = () => {
        if (rotation === 90 || rotation === 270) {
          canvas.width = img.height;
          canvas.height = img.width;
        } else {
          canvas.width = img.width;
          canvas.height = img.height;
        }

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        canvas.toBlob(
          (blob) => {
            const rotatedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(rotatedFile);
          },
          'image/jpeg',
          0.8
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      showAlert('error', 'Du måste vara inloggad för att skapa en bytesannons. Vänligen logga in och försök igen.', 'Autentisering krävs');
      return;
    }
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let uploadedImageIds = [];
      
      if (images.length > 0) {
        const newImages = images.filter(img => img.isNew);
        
        if (newImages.length > 0) {
          const formData = new FormData();
          
          for (const image of newImages) {
            const rotatedFile = await applyRotationToImage(image.file, image.rotation);
            formData.append('images', rotatedFile);
          }
          
          const uploadResponse = await fetch('/api/images', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData,
          });
          
          const uploadResult = await uploadResponse.json();
          
          if (uploadResult.success && uploadResult.images) {
            uploadedImageIds = uploadResult.images.map(img => img.id);
          } else {
            throw new Error(`Misslyckades med att ladda upp bilder: ${uploadResult.message || 'Okänt fel'}`);
          }
        }
      }
      
      const wantedItems = [];
      if (itemWanted.description && itemWanted.description.trim()) {
        wantedItems.push({
          description: itemWanted.description.trim()
        });
      } else {
        wantedItems.push({
          description: 'Öppen för förslag'
        });
      }
      
      const tradeData = {
        title: itemToTrade.name,
        category: itemToTrade.category,
        location,
        description: itemToTrade.description || `${itemToTrade.name} för byte`,
        itemsToTrade: [itemToTrade],
        itemsWanted: wantedItems, 
        imageIds: uploadedImageIds
      };
      
      const result = await addListing(tradeData);
      
      showAlert('success', 'Din bytesannons har skapats framgångsrikt och är nu live!', 'Annons skapad!');
      
      // Clean up image URLs
      images.forEach(image => {
        if (image.isNew && image.url) {
          URL.revokeObjectURL(image.url);
        }
      });
      
      // Reset form
      setLocation('');
      setItemToTrade({ name: '', description: '', category: '' });
      setItemWanted({ description: '' });
      setImages([]);
      setFormErrors({});
      
      setTimeout(() => {
        router.push('/tradelistingpage');
      }, 3000);
      
    } catch (error) {
      if (error.message.includes('token') || error.message.includes('auth') || error.message.includes('unauthorized')) {
        showAlert('error', 'Din session har gått ut. Vänligen logga in ingen och försök skapa din annons.', 'Session utgången');
      } else {
        showAlert('error', `Vi stötte på ett problem när vi skapade din bytesannons: ${error.message}. Vänligen försök igen.`, 'Uppladdning misslyckades');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.isNew && image.url) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, []);

  if (authLoading || isProcessingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
        
        <div className="text-center relative z-10">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600 mx-auto shadow-lg"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-100/50 to-green-200/50 animate-pulse"></div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 border border-green-200/50 shadow-lg">
            <p className="text-gray-700 font-medium">
              {isProcessingAuth ? 'Bearbetar inloggning...' : 'Kontrollerar autentisering...'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Vänligen vänta ett ögonblick</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-12">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
        
        <div className="container mx-auto px-4 max-w-md relative z-10">
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center border border-green-200/50">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-2xl shadow-xl flex items-center justify-center mx-auto transform hover:scale-105 transition-all duration-300">
                <LogIn className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-lg"></div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent">
              Autentisering krävs
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Skapa fantastiska bytes annonser och få kontakt med andra. 
              <span className="block mt-2 font-medium text-green-700">Gå med i SwapDeals-communityt idag!</span>
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  setShowRegisterForm(false);
                  setShowLoginForm(true);
                }}
                disabled={showLoginForm || showRegisterForm}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 px-6 rounded-2xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="mr-3 text-lg group-hover:scale-110 transition-transform">🚀</span>
                Kom igång - Logga in
              </button>
              
              <button
                onClick={() => {
                  setShowLoginForm(false);
                  setShowRegisterForm(true);
                }}
                disabled={showLoginForm || showRegisterForm}
                className="w-full text-gray-700 hover:text-green-800 py-4 px-6 rounded-2xl transition-all duration-300 font-medium border-2 border-green-200 hover:border-green-300 hover:bg-green-50/80 backdrop-blur-sm flex items-center justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="mr-3 text-lg group-hover:scale-110 transition-transform">✨</span>
                Ny användare? Registrera dig
              </button>
            </div>
          </div>
        </div>

        <RegisterForm 
          isOpen={showRegisterForm}
          onClose={() => setShowRegisterForm(false)}
          onSuccess={handleLoginSuccess}
          onSwitchToLogin={handleSwitchToLogin}
        />
        
        <LoginForm 
          isOpen={showLoginForm}
          onClose={() => setShowLoginForm(false)}
          onSuccess={handleLoginSuccess}
          onSwitchToRegister={handleSwitchToRegister}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
      
      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          title={alert.title}
          isVisible={alert.isVisible}
          onClose={hideAlert}
          duration={5000}
        />
      )}
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-green-200/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 via-green-600 to-green-500 p-8 text-white relative">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2 flex items-center">
                    <span className="mr-3 text-2xl">✨</span>
                    Skapa din bytes annons
                  </h1>
                  <p className="text-green-100 text-lg">
                    Dela vad du har och hitta vad du behöver
                  </p>
                </div>
                <div className="text-right">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/30">
                    <p className="font-semibold text-lg">{user?.username || user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Location Section */}
              <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-2xl p-6 border border-green-200/50">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-3 mr-4 shadow-lg">
                    <MapPin className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Din plats</h2>
                    <p className="text-gray-600 mt-1">Hjälp andra att hitta dig enkelt</p>
                  </div>
                </div>
                
                <SwedishRegions
                  selectedLocation={location}
                  onLocationSelect={setLocation}
                  error={formErrors.location}
                />
              </div>
              
              {/* Item to Trade Section */}
              <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl p-6 border border-blue-200/50">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-3 mr-4 shadow-lg">
                    <Package className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Föremål du har</h2>
                    <p className="text-gray-600 mt-1">Berätta vad du vill byta</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Föremål <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className={`w-full p-4 border-2 ${formErrors.itemName ? 'border-red-300 bg-red-50/50' : 'border-blue-200 bg-white'} rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-700 font-medium shadow-lg backdrop-blur-sm`}
                        placeholder="🎮 t.ex. Sony PlayStation 5"
                        value={itemToTrade.name}
                        onChange={(e) => updateItemToTrade('name', e.target.value)}
                      />
                      {formErrors.itemName && (
                        <div className="mt-3 flex items-center text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-200">
                          <AlertCircle className="w-4 h-4 mr-2" />
                          <p className="text-sm font-medium">{formErrors.itemName}</p>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <CategoryInput
                        selectedCategory={itemToTrade.category}
                        onCategorySelect={(category) => updateItemToTrade('category', category)}
                        error={formErrors.itemCategory}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Beskrivning (Valfritt)
                    </label>
                    <textarea
                      className="w-full p-4 border-2 border-blue-200 bg-white rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-700 font-medium shadow-lg backdrop-blur-sm resize-none"
                      rows="4"
                      placeholder="📝 Beskriv skicket, åldern och andra relevanta detaljer..."
                      value={itemToTrade.description}
                      onChange={(e) => updateItemToTrade('description', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              {/* Image Upload Section */}
              <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-2xl p-6 border border-purple-200/50">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-3 mr-4 shadow-lg">
                    <Camera className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Lägg till bilder</h2>
                    <p className="text-gray-600 mt-1">Upp till 2 bilder för att visa ditt föremål</p>
                  </div>
                </div>
                
                <p className="mb-6 text-sm text-gray-600 bg-white/60 rounded-lg p-3 border border-purple-200/50">
                  📸 Ladda upp högkvalitativa bilder av ditt föremål för att få ett större intresse. Du kan rotera och hantera bilderna efter uppladdning.
                </p>
                
                {/* Image Upload Button */}
                {images.length < 2 && (
                  <div className="mb-6">
                    <div 
                      className="w-full border-2 border-dashed border-purple-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-300 bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-xl group"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl p-4 mb-4 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-200">
                        <Upload className="w-10 h-10 text-purple-600" />
                      </div>
                      <span className="text-lg font-semibold text-gray-700 group-hover:text-purple-700 transition-colors mb-2">
                        Ladda upp bilder ({images.length}/2)
                      </span>
                      <span className="text-sm text-gray-500">Klicka för att bläddra eller dra och släpp</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageSelect}
                      />
                    </div>
                  </div>
                )}

                {/* Image Display Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg">
                        <div className="aspect-square relative overflow-hidden bg-gray-100">
                          <img
                            src={image.url}
                            alt={image.originalName}
                            className="w-full h-full object-cover transition-transform duration-300"
                            style={{
                              transform: `rotate(${image.rotation}deg)`
                            }}
                          />
                        </div>
                        
                        <div className="p-3 bg-white">
                          <p className="text-sm font-medium text-gray-700 truncate mb-2">
                            {image.originalName}
                          </p>
                          <p className="text-xs text-gray-500 mb-3">
                            {(image.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          
                          <div className="flex justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => handleRotateImage(image.id)}
                              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
                            >
                              <RotateCw className="w-4 h-4 mr-1" />
                              Rotera
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(image.id)}
                              className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center"
                            >
                              <X className="w-4 h-4 mr-1" />
                              Ta bort
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Item Wanted Section - This should only render once */}
              <div className="bg-gradient-to-r from-amber-50/50 to-orange-50/50 rounded-2xl p-6 border border-amber-200/50">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl p-3 mr-4 shadow-lg">
                    <ArrowRightLeft className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Vad du vill ha i utbyte</h2>
                    <p className="text-gray-600 mt-1">Låt andra veta vad du letar efter</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Beskrivning
                  </label>
                  <textarea
                    className="w-full p-4 border-2 border-amber-200 bg-white rounded-xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 text-gray-700 font-medium shadow-lg backdrop-blur-sm resize-none"
                    rows="4"
                    placeholder="💫 Beskriv vad du letar efter i utbyte... Var specifik eller öppen för förslag!"
                    value={itemWanted.description}
                    onChange={(e) => updateItemWanted('description', e.target.value)}
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="text-center pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-500 via-green-600 to-green-500 hover:from-green-600 hover:via-green-700 hover:to-green-600 text-white py-4 px-12 rounded-2xl transition-all duration-300 font-bold text-lg shadow-2xl hover:shadow-3xl disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-1 flex items-center justify-center mx-auto group min-w-[280px]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                      Skapar din annons...
                    </>
                  ) : (
                    <>
                      <span className="mr-3 text-xl group-hover:scale-110 transition-transform">🚀</span>
                      Publicera bytesannons
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

        <RegisterForm 
        isOpen={showRegisterForm}
        onClose={() => setShowRegisterForm(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToLogin={handleSwitchToLogin}
      />
      
      <LoginForm 
        isOpen={showLoginForm}
        onClose={() => setShowLoginForm(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />
    </div>
  );
}
 