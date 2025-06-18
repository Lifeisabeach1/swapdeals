import { useState } from 'react';
import { User, Calendar, Package, X, Upload, Check, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useApi from '../hooks/useApi';
import TradeConversation from './TradeConversation';
import ImageHandler from './ImageUpload';

export default function DetailTradeOffer({ 
  onSubmitOffer, 
  onAcceptOffer, 
  onContactUser,
  offers = [], 
  currentUser: propCurrentUser,
  canMakeOffers = true, 
  canAcceptOffers = false, 
  loading = false,
  acceptedOfferId = null,
  listing = null
}) {
  // Auth and API hooks
  const { user: authUser, isAuthenticated, token } = useAuth();
  const { loading: apiLoading, error: apiError, request } = useApi();

  // Use auth user if no currentUser prop is provided
  const currentUser = propCurrentUser || authUser;

  // Modal states
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  
  // Form states
  const [offerMessage, setOfferMessage] = useState('');
  const [offerImages, setOfferImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  
  // Conversation states
  const [isConversationOpen, setIsConversationOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);

  // Upload images to server
  const uploadImagesToServer = async (files) => {
    if (!files || files.length === 0) return [];
    
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const result = await response.json();
      return result.images || [];
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  // Image handling functions
  const handleImageUpload = async (files) => {
    if (!isAuthenticated) {
      alert('Vänligen logga in för att ladda upp bilder.');
      return;
    }

    const newFiles = Array.from(files).slice(0, 2 - offerImages.length);
    
    if (newFiles.length === 0) return;

    // Validate file types and sizes
    for (const file of newFiles) {
      if (!file.type.startsWith('image/')) {
        alert('Endast bildfiler är tillåtna.');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('Bilden är för stor. Maximal storlek är 10MB.');
        return;
      }
    }

    setUploadLoading(true);
    
    try {
      const uploadedImages = await uploadImagesToServer(newFiles);
      
      // Add uploaded images to state
      setOfferImages(prev => [...prev, ...uploadedImages.map(img => ({
        id: img.id,
        filename: img.filename,
        url: img.url,
        originalName: img.originalName
      }))]);
      
    } catch (error) {
      alert('Misslyckades att ladda upp bild: ' + error.message);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const removeImage = async (imageId) => {
    try {
      // Delete from server
      const response = await fetch(`/api/images?id=${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove from state
        setOfferImages(prev => prev.filter(img => img.id !== imageId));
      } else {
        console.error('Failed to delete image from server');
        // Still remove from state for better UX
        setOfferImages(prev => prev.filter(img => img.id !== imageId));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      // Still remove from state for better UX
      setOfferImages(prev => prev.filter(img => img.id !== imageId));
    }
  };

  // Form submission handlers
  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Vänligen logga in för att göra ett erbjudande.');
      return;
    }

    if (!offerMessage.trim()) {
      alert('Vänligen skriv ett meddelande för ditt erbjudande.');
      return;
    }

    try {
      const newOffer = {
        id: Date.now(),
        message: offerMessage,
        images: offerImages, // Now contains server URLs
        timestamp: new Date().toISOString(),
        user: currentUser?.username || currentUser?.name || 'Anonym användare',
        status: 'active'
      };

      if (onSubmitOffer) {
        await onSubmitOffer(newOffer);
      } else {
        await request('/api/offers', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(newOffer)
        });
      }
      
      // Reset form
      setOfferMessage('');
      setOfferImages([]);
      setIsOfferModalOpen(false);
    } catch (error) {
      alert('Misslyckades att skicka erbjudande. Vänligen försök igen.');
    }
  };

  const handleAcceptClick = (offer) => {
    if (!isAuthenticated) {
      alert('Vänligen logga in för att acceptera erbjudanden.');
      return;
    }
    setSelectedOffer(offer);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmAccept = async () => {
    if (!selectedOffer || !isAuthenticated) {
      alert('Vänligen logga in för att acceptera erbjudanden.');
      return;
    }

    try {
      if (onAcceptOffer) {
        await onAcceptOffer(selectedOffer);
      } else {
        await request(`/api/offers/${selectedOffer.id}/accept`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      alert('Misslyckades att acceptera erbjudande. Vänligen försök igen.');
    } finally {
      setIsConfirmModalOpen(false);
      setSelectedOffer(null);
    }
  };

  const handleCancelAccept = () => {
    setIsConfirmModalOpen(false);
    setSelectedOffer(null);
  };

  // Contact user handler
  const handleContactUser = async (offer) => {
    if (!isAuthenticated) {
      alert('Vänligen logga in för att kontakta användare.');
      return;
    }

    try {
      const tradeRecord = {
        id: `trade-${offer.id}-${Date.now()}`,
        status: 'accepted',
        offer_id: offer.id,
        listing_id: listing?.id,
        created_at: new Date().toISOString()
      };

      const otherUser = typeof offer.user === 'object' ? offer.user : {
        id: offer.user_id || offer.id,
        username: offer.user || offer.username,
        first_name: offer.first_name,
        last_name: offer.last_name,
        email: offer.email,
        phone: offer.phone
      };

      setActiveConversation({
        trade: tradeRecord,
        otherUser: otherUser,
        listing: listing
      });
      
      setIsConversationOpen(true);

      if (onContactUser) {
        await onContactUser(offer);
      }
    } catch (error) {
      alert('Misslyckades att initiera kontakt. Vänligen försök igen.');
    }
  };

  // Helper functions
  const getUserDisplayName = (offer) => {
    if (!offer) return 'Anonym användare';
    
    if (typeof offer.user === 'string') {
      return offer.user;
    }
    
    if (typeof offer.user === 'object' && offer.user !== null) {
      const firstName = offer.user.first_name;
      const lastName = offer.user.last_name;
      if (firstName && lastName) {
        return `${firstName} ${lastName}`;
      } else if (firstName) {
        return firstName;
      } else if (lastName) {
        return lastName;
      }
      return offer.user.username || offer.user.name || offer.user.display_name || 'Anonym användare';
    }
    
    const firstName = offer.first_name;
    const lastName = offer.last_name;
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    } else if (firstName) {
      return firstName;
    } else if (lastName) {
      return lastName;
    }
    
    return offer.username || offer.name || offer.user_name || 'Anonym användare';
  };

  const getUserInitial = (offer) => {
    const displayName = getUserDisplayName(offer);
    return displayName && displayName.length > 0 ? displayName.charAt(0).toUpperCase() : 'A';
  };

  // Component sub-components
  const AcceptButton = ({ offer }) => {
    if (!canAcceptOffers) return null;
    
    if (acceptedOfferId && offer.id === acceptedOfferId) {
      return (
        <button
          onClick={() => handleContactUser(offer)}
          disabled={apiLoading}
          className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-2 rounded-md transition-all duration-300 font-medium shadow hover:shadow-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {apiLoading ? 'Öppnar chatt...' : 'Öppna chatt'}
        </button>
      );
    }
    
    if (acceptedOfferId && offer.id !== acceptedOfferId) {
      return null;
    }
    
    return (
      <button
        onClick={() => handleAcceptClick(offer)}
        disabled={apiLoading}
        className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-600 text-white px-4 py-2 rounded-md transition-all duration-300 font-medium shadow hover:shadow-md flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Check className="w-4 h-4 mr-2" />
        {apiLoading ? 'Accepterar...' : 'Acceptera byte'}
      </button>
    );
  };

  const MakeOfferButton = () => {
    if (acceptedOfferId) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mb-4">
          <Check className="w-5 h-5 text-green-500 mx-auto mb-2" />
          <p className="text-blue-700 font-medium">Byte accepterat</p>
          <p className="text-blue-600 text-sm">Detta föremål är inte längre tillgängligt för nya erbjudanden.</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center mb-4">
          <p className="text-gray-600">Vänligen logga in för att göra byteserbjudanden.</p>
        </div>
      );
    }
    
    if (canMakeOffers) {
      return (
        <button
          onClick={() => setIsOfferModalOpen(true)}
          disabled={apiLoading}
          className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-600 text-white py-3 px-4 rounded-lg transition-all duration-300 font-medium shadow hover:shadow-md flex items-center justify-center mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Package className="w-5 h-5 mr-2" />
          {apiLoading ? 'Laddar...' : 'Föreslå en deal'}
        </button>
      );
    }
    
    return null;
  };

  // Loading and error states
  const isLoading = loading || apiLoading;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <p className="text-red-700">Fel: {apiError}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Försök igen
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Trade Offers Section */}
      {offers.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Bytes erbjudanden ({offers.length})</h2>
          <div className="space-y-4">
            {offers.map((offer) => (
              <div 
                key={offer.id} 
                className={`border rounded-lg p-4 ${
                  acceptedOfferId && offer.id === acceptedOfferId 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      {getUserInitial(offer)}
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="font-medium text-sm">{getUserDisplayName(offer)}</h4>
                        {acceptedOfferId && offer.id === acceptedOfferId && (
                          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            Accepterat
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {offer.timestamp ? new Date(offer.timestamp).toLocaleDateString('sv-SE') : 
                         offer.created_at ? new Date(offer.created_at).toLocaleDateString('sv-SE') : 
                         'Okänt datum'}
                      </div>
                    </div>
                  </div>
                  <AcceptButton offer={offer} />
                </div>
                
                <p className="text-gray-700 mb-3 text-sm leading-relaxed">
                  <strong>{offer.message || 'Inget meddelande angivet'}</strong>
                </p>
                
                {/* Offer Images - Using ImageHandler with hideControls=true for read-only display */}
                {offer.images && Array.isArray(offer.images) && offer.images.length > 0 && (
                  <ImageHandler
                    images={offer.images}
                    onImagesChange={() => {}} // Read-only for viewing offers
                    onRemoveImage={() => {}} // Read-only for viewing offers
                    token={token}
                    maxImages={offer.images.length}
                    title={`Erbjudande från ${getUserDisplayName(offer)}`}
                    className="mt-4"
                    hideControls={true} // THIS IS THE KEY CHANGE - HIDE ALL CONTROLS
                    readOnly={true}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Make Offer Button */}
      <MakeOfferButton />

      {/* Trade Conversation Modal */}
      {isConversationOpen && activeConversation && (
        <TradeConversation
          isOpen={isConversationOpen}
          onClose={() => {
            setIsConversationOpen(false);
            setActiveConversation(null);
          }}
          trade={activeConversation.trade}
          otherUser={activeConversation.otherUser}
          listing={activeConversation.listing}
        />
      )}

      {/* Offer Modal */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-green-200/50">
            {/* Premium light effect overlay with green tint */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none rounded-2xl"></div>
            
            <div className="p-6 relative z-10">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-2 mr-3">
                    <span className="text-lg" role="img" aria-label="Trade Offer">🤝</span>
                  </div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent">
                    Föreslå en deal
                  </h3>
                </div>
                <button
                  onClick={() => setIsOfferModalOpen(false)}
                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all duration-200 transform hover:scale-110"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmitOffer}>
                {/* Message Input */}
                <div className="mb-6">
                  <textarea
                    className="w-full p-4 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-green-50/30 backdrop-blur-sm transition-all duration-200 placeholder-gray-500 resize-none"
                    rows="4"
                    placeholder="Beskriv vad du erbjuder i byte. Var specifik om skick, märke, modell, etc."
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    required
                  />
                </div>

                {/* Image Upload Section */}
                <div className="mb-6">
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <div className="flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-1.5 mr-2">
                      <span className="text-sm" role="img" aria-label="Photos">📷</span>
                    </div>
                    Bild på ditt föremål (Valfritt, max 2 bilder)
                  </label>
                  
                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 backdrop-blur-sm ${
                      dragActive 
                        ? 'border-green-400 bg-green-100/50 shadow-lg transform scale-[1.02]' 
                        : 'border-green-300 hover:border-green-400 bg-green-50/30 hover:bg-green-100/40'
                    } ${offerImages.length >= 2 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                      id="offer-images"
                      disabled={offerImages.length >= 2 || uploadLoading}
                    />
                    <label
                      htmlFor="offer-images"
                      className={`cursor-pointer block ${
                        offerImages.length >= 2 || uploadLoading ? 'cursor-not-allowed opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-gradient-to-br from-green-200 to-green-300 rounded-full p-4 shadow-lg">
                          {uploadLoading ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-700 border-t-transparent" />
                          ) : (
                            <Upload className="h-8 w-8 text-green-700" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2 font-medium">
                        {uploadLoading ? 'Laddar upp bilder...' : 
                         offerImages.length >= 2 ? 'Maximalt 2 bilder uppnått' : 
                         'Klicka för att ladda upp bilder'}
                      </p>
                      <p className="text-xs text-gray-500 bg-white/50 inline-block px-3 py-1 rounded-full">
                        PNG, JPG, GIF upp till 10MB vardera
                      </p>
                    </label>
                  </div>

                  {/* Image Handler Component - WITH CONTROLS for creating offers */}
                  {offerImages.length > 0 && (
                    <ImageHandler
                      images={offerImages}
                      onImagesChange={setOfferImages}
                      onRemoveImage={removeImage}
                      token={token}
                      maxImages={2}
                      title="Erbjudande bilder"
                      className="mt-6"
                      hideControls={false} // Allow controls when creating offers
                      readOnly={false}
                    />
                  )}
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4 border-t border-green-200/50">
                  <button
                    type="button"
                    onClick={() => setIsOfferModalOpen(false)}
                    className="flex-1 py-3 px-6 border border-green-200 rounded-xl hover:bg-green-50/80 transition-all duration-200 font-medium text-gray-700 hover:text-green-800 hover:border-green-300 backdrop-blur-sm"
                  >
                    <span className="flex items-center justify-center">
                      <span className="mr-2" role="img" aria-label="Cancel">❌</span>
                      Avbryt
                    </span>
                  </button>
                  <button
                    type="submit"
                    disabled={apiLoading || uploadLoading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-6 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <span className="flex items-center justify-center">
                      {apiLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Skickar...
                        </>
                      ) : (
                        <>
                          <span className="mr-2" role="img" aria-label="Submit">🚀</span>
                          Skicka erbjudande
                        </>
                      )}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal - Now positioned relative to viewport */}
      {isConfirmModalOpen && selectedOffer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" style={{ position: 'fixed', top: 0, left: 0 }}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform translate-y-0">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Acceptera dealen</h3>
                  <p className="text-sm text-gray-500">Denna åtgärd kan inte ångras</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  Är du säker på att du vill acceptera den här dealen från <span className="font-medium">{getUserDisplayName(selectedOffer)}</span>?
                </p>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-600 italic">{selectedOffer.message || 'Inget meddelande angivet'}</p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelAccept}
                  disabled={apiLoading}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Avbryt
                </button>
                <button
                  onClick={handleConfirmAccept}
                  disabled={apiLoading}
                  className="flex-1 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-600 text-white py-3 px-4 rounded-md transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {apiLoading ? 'Accepterar...' : 'Ja, acceptera byte'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}