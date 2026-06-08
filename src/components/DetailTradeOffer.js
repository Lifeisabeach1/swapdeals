// components/DetailTradeOffer.js
import { useState } from 'react';
import { User, Calendar, Package, X, Check, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useApi from '../hooks/useApi';
import TradeConversation from './TradeConversation';
import ImageUpload from '@/components/ImageUpload';
import { uploadImages } from '@/lib/utils/images'; // USE COMPRESSION UTILITY

export default function DetailTradeOffer({ 
  onSubmitOffer, 
  onAcceptOffer,
  offers = [], 
  currentUser: propCurrentUser,
  canMakeOffers = true, 
  canAcceptOffers = false, 
  loading = false,
  acceptedOfferId = null,
  listing = null
}) {
  const { user: authUser, isAuthenticated, token } = useAuth();
  const api = useApi(token);
  const currentUser = propCurrentUser || authUser;

  // Modal states
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [offerMessage, setOfferMessage] = useState('');
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState('');
  
  // Conversation states
  const [isConversationOpen, setIsConversationOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState(null);

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated || !offerMessage.trim()) {
      alert('Vänligen skriv ett meddelande för ditt erbjudande.');
      return;
    }

    setSubmitting(true);
    setUploadError('');
    
    try {
      let uploadedImageUrls = [];

      // Upload images using compression utility if any images selected
      if (images.length > 0) {
        console.log('📸 Uploading and compressing offer images...');
        
        try {
          // Extract File objects from image state
          const imageFiles = images.map(img => img.file);
          
          // Upload with automatic compression to WebP
          const uploadResult = await uploadImages(imageFiles, token);
          
          if (uploadResult.success && uploadResult.images) {
            // Get the URLs from uploaded images
            uploadedImageUrls = uploadResult.images.map(img => img.url || img.image_url);
            console.log('✅ Offer images uploaded:', uploadedImageUrls);
          }
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          setUploadError(`Bilduppladdning misslyckades: ${uploadError.message}`);
          setSubmitting(false);
          return;
        }
      }

      const newOffer = {
        message: offerMessage.trim(),
        images: uploadedImageUrls.length > 0 ? uploadedImageUrls : null,
        listing_id: listing?.id,
        timestamp: new Date().toISOString(),
        user: currentUser?.username || currentUser?.name || 'Anonym användare',
        status: 'active'
      };

      if (onSubmitOffer) {
        await onSubmitOffer(newOffer);
      }
      
      setOfferMessage('');
      setImages([]);
      setUploadError('');
      setIsOfferModalOpen(false);
    } catch (error) {
      console.error('Submit offer error:', error);
      setUploadError(error.message || 'Misslyckades att skicka erbjudande.');
    } finally {
      setSubmitting(false);
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
    if (!selectedOffer) return;

    try {
      if (onAcceptOffer) {
        await onAcceptOffer(selectedOffer);
      }
    } catch (error) {
      alert('Misslyckades att acceptera erbjudande.');
    } finally {
      setIsConfirmModalOpen(false);
      setSelectedOffer(null);
    }
  };

  const handleContactUser = (offer) => {
    if (!isAuthenticated) {
      alert('Vänligen logga in för att kontakta användare.');
      return;
    }

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
      last_name: offer.last_name
    };

    setActiveConversation({
      trade: tradeRecord,
      otherUser: otherUser,
      listing: listing
    });
    
    setIsConversationOpen(true);
  };

  const getUserDisplayName = (offer) => {
    if (!offer) return 'Anonym användare';
    
    if (typeof offer.user === 'string') return offer.user;
    
    if (typeof offer.user === 'object' && offer.user !== null) {
      if (offer.user.name) return offer.user.name;
      if (offer.user.username) return offer.user.username;
      
      const fullName = `${offer.user.first_name || ''} ${offer.user.last_name || ''}`.trim();
      if (fullName) return fullName;
      
      return offer.user.email || 'Anonym användare';
    }
    
    const fullName = `${offer.first_name || ''} ${offer.last_name || ''}`.trim();
    return fullName || offer.username || 'Anonym användare';
  };

  const getUserInitial = (offer) => {
    const displayName = getUserDisplayName(offer);
    return displayName.charAt(0).toUpperCase();
  };

  if (loading) {
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

  return (
    <>
      {/* Trade Offers List */}
      {offers.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">
            Bytes erbjudanden ({offers.length})
          </h2>
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
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start flex-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold mr-3">
                      {getUserInitial(offer)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{getUserDisplayName(offer)}</h4>
                        {acceptedOfferId && offer.id === acceptedOfferId && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                            Accepterat
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(offer.timestamp || offer.created_at).toLocaleDateString('sv-SE')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  {canAcceptOffers && (
                    <>
                      {acceptedOfferId && offer.id === acceptedOfferId ? (
                        <button
                          onClick={() => handleContactUser(offer)}
                          className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Öppna chatt
                        </button>
                      ) : !acceptedOfferId ? (
                        <button
                          onClick={() => handleAcceptClick(offer)}
                          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Acceptera
                        </button>
                      ) : null}
                    </>
                  )}
                </div>
                
                <p className="text-gray-700 text-sm mb-3">
                  <strong>{offer.message || 'Inget meddelande angivet'}</strong>
                </p>

                {/* Display offer images */}
                {offer.images && offer.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {offer.images.map((image, idx) => (
                      <div key={idx} className="relative bg-gray-100 rounded-lg h-32 flex items-center justify-center p-2">
                        <img
                          src={image}
                          alt={`Erbjudande bild ${idx + 1}`}
                          className="max-w-full max-h-full object-contain rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Make Offer Button */}
      {acceptedOfferId ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center mb-4">
          <Check className="w-5 h-5 text-green-500 mx-auto mb-2" />
          <p className="text-blue-700 font-medium">Byte accepterat</p>
          <p className="text-blue-600 text-sm">Detta föremål är inte längre tillgängligt.</p>
        </div>
      ) : !isAuthenticated ? (
        <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center mb-4">
          <p className="text-gray-600">Vänligen logga in för att göra byteserbjudanden.</p>
        </div>
      ) : canMakeOffers ? (
        <button
          onClick={() => setIsOfferModalOpen(true)}
          className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-4 px-4 rounded-lg font-medium shadow-lg hover:shadow-xl flex items-center justify-center mb-4"
        >
          <Package className="w-5 h-5 mr-2" />
          Föreslå en deal
        </button>
      ) : null}

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

      {/* Offer Modal with Image Upload */}
      {isOfferModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Föreslå en deal</h3>
                <button
                  onClick={() => {
                    setIsOfferModalOpen(false);
                    setImages([]);
                    setOfferMessage('');
                    setUploadError('');
                  }}
                  className="text-gray-400 hover:text-red-500 p-2 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Upload Error */}
              {uploadError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {uploadError}
                </div>
              )}
              
              <form onSubmit={handleSubmitOffer}>
                {/* Message Input */}
                <div className="mb-6">
                  <label className="block font-semibold mb-2">
                    Ditt erbjudande <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="w-full p-4 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 resize-none"
                    rows="4"
                    placeholder="Beskriv vad du erbjuder i byte. Var specifik om skick, märke, modell, etc."
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    required
                  />
                </div>

                {/* Image Upload with Compression */}
                <div className="mb-6">
                  <ImageUpload 
                    onImagesChange={setImages}
                    maxImages={2}
                  />
                </div>

                {/* Info about compression */}
                {images.length > 0 && (
                  <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                    ℹ️ Dina bilder kommer automatiskt att komprimeras till WebP-format för snabbare uppladdning.
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOfferModalOpen(false);
                      setImages([]);
                      setOfferMessage('');
                      setUploadError('');
                    }}
                    className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-medium"
                  >
                    Avbryt
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-medium disabled:opacity-50"
                  >
                    {submitting ? 'Skickar och komprimerar...' : 'Skicka erbjudande'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && selectedOffer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Acceptera dealen</h3>
                <p className="text-sm text-gray-500">Denna åtgärd kan inte ångras</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Är du säker på att du vill acceptera denna deal från <span className="font-medium">{getUserDisplayName(selectedOffer)}</span>?
              </p>
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-600 italic">{selectedOffer.message}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setSelectedOffer(null);
                }}
                className="flex-1 py-3 border border-gray-300 rounded-md hover:bg-gray-50 font-medium"
              >
                Avbryt
              </button>
              <button
                onClick={handleConfirmAccept}
                className="flex-1 bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white py-3 rounded-md font-medium"
              >
                Ja, acceptera byte
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
