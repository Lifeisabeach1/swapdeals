// src/app/traderoom/[tradeId]/page.js
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import TradeConversation from '@/components/TradeConversation';
import Alert from '@/components/Alert';

export default function TradePage() {
  const [trade, setTrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConversation, setShowConversation] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Alert states
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    type: 'info',
    title: null
  });
  
  // Confirmation states
  const [confirmation, setConfirmation] = useState({
    show: false,
    message: '',
    title: '',
    type: 'warning',
    onConfirm: null
  });

  const router = useRouter();
  const params = useParams();
  const tradeId = params.tradeId;
  
  const { user, isAuthenticated, token } = useAuth();

  // Mount effect
  useEffect(() => {
    setMounted(true);
  }, []);

  // Alert helper functions
  const showAlert = (message, type = 'info', title = null) => {
    setAlert({
      show: true,
      message,
      type,
      title
    });
  };

  const showConfirmation = (message, title, onConfirm) => {
    setConfirmation({
      show: true,
      message,
      title,
      type: 'warning',
      onConfirm
    });
  };

  const hideAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

  const hideConfirmation = () => {
    setConfirmation(prev => ({ ...prev, show: false }));
  };

  // Utility Functions
  const getAllTradeImages = (tradeData) => {
    if (!tradeData) return [];
    
    const allImages = [];
    const seenUrls = new Set();
    
    const imageSources = [
      { key: 'listing_images', source: 'listing', type: 'listing_image' },
      { key: 'offer_images', source: 'offer', type: 'offer_image' },
      { key: 'images', source: 'combined', type: 'additional_image' },
      { key: 'all_images', source: 'all_images', type: 'fallback_image' }
    ];

    imageSources.forEach(({ key, source, type }) => {
      if (tradeData[key] && Array.isArray(tradeData[key])) {
        tradeData[key].forEach((img, index) => {
          // Handle different image formats
          let imageUrl = null;
          let imageData = null;

          if (typeof img === 'string') {
            // Image is a plain string (URL or base64)
            imageUrl = img;
            imageData = { url: img, id: `${key}-${index}` };
          } else if (img && typeof img === 'object' && img.url) {
            // Image is an object with url property
            imageUrl = img.url;
            imageData = img;
          }

          // Add to results if we have a valid URL and haven't seen it before
          if (imageUrl && !seenUrls.has(imageUrl)) {
            seenUrls.add(imageUrl);
            allImages.push({ 
              ...imageData, 
              source, 
              type,
              // Ensure id exists
              id: imageData.id || `${key}-${index}`
            });
          }
        });
      }
    });
    
    console.log('All trade images:', allImages);
    return allImages;
  };

  const tradeImages = useMemo(() => getAllTradeImages(trade), [trade]);

  // FIXED: Data Loading - using fetch directly instead of api
  const loadTrade = useCallback(async () => {
    if (!tradeId || !token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/traderoom/${tradeId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch trade');
      }
      
      const data = await response.json();
      
      if (data.success) {
        console.log('Trade data loaded:', data.data);
        setTrade(data.data);
      } else {
        setError(data.message || 'Kunde inte ladda handeln');
      }
    } catch (error) {
      console.error('Failed to load trade:', error);
      setError('Kunde inte ladda handels detaljer');
    } finally {
      setLoading(false);
    }
  }, [tradeId, token]);

  useEffect(() => {
    if (tradeId && token) {
      loadTrade();
    }
  }, [tradeId, token, loadTrade]);

  // FIXED: Trade Actions - using fetch directly
  const handleTradeAction = async (action, endpoint, successMessage) => {
    if (!trade || !token) return;

    try {
      const response = await fetch(`/api/traderoom/${trade.id}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to perform action');
      }
      
      const data = await response.json();
      
      if (data.success) {
        if (action === 'complete') {
          setTrade(prev => ({ ...prev, status: 'completed' }));
          showAlert(successMessage, 'success', '✅ Handel Slutförd!');
          setTimeout(() => router.push('/my-trades'), 3000);
        } else if (action === 'cancel') {
          setTrade(prev => ({ ...prev, status: 'cancelled' }));
          showAlert(successMessage, 'success', '✅ Handel Avbruten');
          setTimeout(() => router.push('/'), 3000);
        }
      } else {
        throw new Error(data.message || `Kunde inte ${action === 'complete' ? 'slutföra' : 'avbryta'} bytet`);
      }
    } catch (error) {
      showAlert(`Kunde inte ${action === 'complete' ? 'slutföra' : 'avbryta'} bytet: ${error.message}`, 'error', '❌ Åtgärd Misslyckades');
    }
  };

  const handleCompleteTrade = () => {
    showConfirmation(
      'Är du säker på att du vill markera denna handel som slutförd? Denna åtgärd kan inte ångras.',
      '🤝 Slutför Bytet',
      () => {
        hideConfirmation();
        handleTradeAction(
          'complete',
          'complete',
          'Bytet markerad som slutförd! Tack för att du använder vår plattform.'
        );
      }
    );
  };

  const handleCancelTrade = () => {
    showConfirmation(
      'Är du säker på att du vill avbryta denna handel? Denna åtgärd kan inte ångras.',
      '❌ Avbryt Bytet',
      () => {
        hideConfirmation();
        handleTradeAction(
          'cancel',
          'cancel',
          'Bytet avbruten framgångsrikt.'
        );
      }
    );
  };

  // Helper Functions
  const getOtherUser = () => {
    if (!trade || !user) return null;
    return trade.buyer_id === user.id 
      ? { 
          id: trade.seller_id, 
          username: trade.seller_username, 
          name: trade.seller_first_name || trade.seller_username 
        }
      : { 
          id: trade.buyer_id, 
          username: trade.buyer_username, 
          name: trade.buyer_first_name || trade.buyer_username 
        };
  };

  const getStatusColor = (status) => {
    const colors = {
      accepted: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md',
      completed: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md',
      cancelled: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md',
      default: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md'
    };
    return colors[status] || colors.default;
  };

  const getStatusLabel = (status) => {
    const labels = {
      accepted: 'Pågår',
      completed: 'Slutförd',
      cancelled: 'Avbruten'
    };
    return labels[status] || status;
  };

  // Loading state
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-32 h-32 mx-auto">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-green-200 border-t-green-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/Swapdealsemoji.webp"
                alt="SwapDeals Logo"
                width={40}
                height={40}
                className="object-contain opacity-70"
              />
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Laddar bytesinformation...</p>
          <div className="mt-2 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-red-200 transform hover:scale-105 transition-all duration-300">
            <div className="text-7xl mb-6 animate-pulse">⚠️</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Fel vid Laddning av Bytet
            </h1>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">{error}</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              🏠 Tillbaka Hem
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No Trade Found
  if (!trade) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-200 transform hover:scale-105 transition-all duration-300">
            <div className="text-7xl mb-6 animate-bounce">🔍</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Bytet ej hittad
            </h1>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Bytet du letar efter finns inte eller så har du inte tillgång till den.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              🏠 Tillbaka Hem
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Access Control
  const isUserPartOfTrade = user && (trade.buyer_id === user.id || trade.seller_id === user.id);
  
  if (!isUserPartOfTrade) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-yellow-200 transform hover:scale-105 transition-all duration-300">
            <div className="text-7xl mb-6 animate-pulse">🔒</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Åtkomst Nekad
            </h1>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Du har inte behörighet att visa denna handel.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-full font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              🏠 Tillbaka Hem
            </button>
          </div>
        </div>
      </div>
    );
  }

  const otherUser = getOtherUser();
  const isOwner = trade.seller_id === user.id;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            
            {/* Original Listing */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 transform hover:scale-[1.02] transition-all duration-300">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  📦 Vad som byts
                </h2>
                <h3 className="text-xl text-gray-700 font-semibold">{trade.listing_title}</h3>
              </div>
              
              {/* Listing Description */}
              {trade.listing_description && (
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    📝 Beskrivning
                  </h4>
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200 shadow-sm">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {trade.listing_description}
                    </p>
                  </div>
                </div>
              )}

              {/* Listing Images */}
              {tradeImages.filter(img => img.source === 'listing').length > 0 ? (
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    📸 Foton 
                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      {tradeImages.filter(img => img.source === 'listing').length}
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tradeImages.filter(img => img.source === 'listing').map((image, index) => (
                      <div key={image.id || `listing-${index}`} className="relative overflow-hidden rounded-2xl shadow-lg border border-gray-200 h-64">
                        <Image
                          src={image.url}
                          alt={`${trade.listing_title} - Bild ${index + 1}`}
                          fill
                          className="object-contain bg-gray-50"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-16 border-2 border-dashed border-gray-300 rounded-2xl text-center bg-gray-50">
                  <div className="text-gray-400 text-8xl mb-4 animate-pulse">📷</div>
                  <p className="text-gray-500 text-lg font-medium">Inga foton tillgängliga</p>
                </div>
              )}
            </div>

            {/* Trade Offer */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 transform hover:scale-[1.02] transition-all duration-300">
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                  🎯 Vad Som Erbjuds
                </h2>
              </div>
              
              {/* Offer Message */}
              {trade.offer_message && (
                <div className="mb-8">
                  <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    💬 Meddelande
                  </h4>
                  <div className="bg-green-50 p-6 rounded-2xl border border-green-200 shadow-sm">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {trade.offer_message}
                    </p>
                  </div>
                </div>
              )}

              {/* Offer Images */}
              {tradeImages.filter(img => img.source === 'offer').length > 0 ? (
                <div>
                  <h4 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                    📸 Foton 
                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      {tradeImages.filter(img => img.source === 'offer').length}
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tradeImages.filter(img => img.source === 'offer').map((image, index) => (
                      <div key={image.id || `offer-${index}`} className="relative overflow-hidden rounded-2xl shadow-lg border border-gray-200 h-64">
                        <Image
                          src={image.url}
                          alt={`Handelserbjudande - Bild ${index + 1}`}
                          fill
                          className="object-contain bg-gray-50"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-16 border-2 border-dashed border-gray-300 rounded-2xl text-center bg-gray-50">
                  <div className="text-gray-400 text-8xl mb-4 animate-pulse">🎯</div>
                  <p className="text-gray-500 text-lg font-medium">Inga foton av erbjudna föremål</p>
                </div>
              )}
            </div>

            {/* Additional Notes */}
            {(trade.meeting_location || trade.seller_response || trade.buyer_notes) && (
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 transform hover:scale-[1.02] transition-all duration-300">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">
                  Ytterligare Information
                </h2>
                
                <div className="space-y-6">
                  {trade.meeting_location && (
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-2xl shadow-sm transform hover:scale-105 transition-all duration-300">
                      <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2 text-lg">
                        📍 Mötesplats
                      </h3>
                      <p className="text-purple-800 leading-relaxed font-medium">{trade.meeting_location}</p>
                    </div>
                  )}

                  {trade.seller_response && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-2xl shadow-sm transform hover:scale-105 transition-all duration-300">
                      <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2 text-lg">
                        💼 arens Anteckningar
                      </h3>
                      <p className="text-blue-800 leading-relaxed font-medium">{trade.seller_response}</p>
                    </div>
                  )}

                  {trade.buyer_notes && (
                    <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-2xl shadow-sm transform hover:scale-105 transition-all duration-300">
                      <h3 className="font-bold text-orange-900 mb-3 flex items-center gap-2 text-lg">
                        🛒 Köparens Anteckningar
                      </h3>
                      <p className="text-orange-800 leading-relaxed font-medium">{trade.buyer_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1">
            <div className="sticky top-8 space-y-6">
              
              {/* Quick Info */}
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 transform hover:scale-105 transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Snabbinfo
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-semibold">Status</span>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(trade.status)} transform hover:scale-110 transition-all duration-200`}>
                      {getStatusLabel(trade.status)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-semibold">Startad</span>
                    <span className="font-bold text-gray-900">{new Date(trade.created_at).toLocaleDateString('sv-SE')}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600 font-semibold">Foton</span>
                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      {tradeImages.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {trade.status === 'accepted' && (
                <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 transform hover:scale-105 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">
                    Åtgärder
                  </h3>
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowConversation(true)}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-full font-bold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                    >
                      💬 Starta Chatt
                    </button>
                    
                    {isOwner && (
                      <button
                        onClick={handleCompleteTrade}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-full font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
                      >
                        ✅ Slutfört Byte
                      </button>
                    )}
                    
                    <button
                      onClick={handleCancelTrade}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-full font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
                    >
                      ❌ Avbryt Bytet
                    </button>
                  </div>
                </div>
              )}

              {/* Back Button */}
              <button
                onClick={() => router.push('/my-trades')}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-4 rounded-full font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                ← Tillbaka Till Mina Byten
              </button>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {trade.status === 'completed' && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-3xl p-8 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <h3 className="text-3xl font-bold text-green-800 mb-4 flex items-center gap-3">
              ✅ Bytet Slutfört Framgångsrikt!
            </h3>
            <p className="text-green-700 text-xl font-semibold">Detta Bytet Slutfördes Framgångsrikt.</p>
            {trade.completed_at && (
              <p className="text-green-600 mt-3 font-medium">
                Slutförd: {new Date(trade.completed_at).toLocaleString('sv-SE')}
              </p>
            )}
          </div>
        )}

        {trade.status === 'cancelled' && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-3xl p-8 shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <h3 className="text-3xl font-bold text-red-800 mb-4 flex items-center gap-3">
              ❌ Bytet Avbruten
            </h3>
            <p className="text-red-700 text-xl font-semibold">Detta bytet har avbrutits.</p>
            {trade.cancelled_at && (
              <p className="text-red-600 mt-3 font-medium">
                Avbruten: {new Date(trade.cancelled_at).toLocaleString('sv-SE')}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Conversation Modal */}
      {showConversation && (
        <TradeConversation
          isOpen={showConversation}
          onClose={() => setShowConversation(false)}
          trade={trade}
          otherUser={otherUser}
          listing={{ title: trade.listing_title }}
        />
      )}

      {/* Custom Alert */}
      {alert.show && (
        <Alert
          message={alert.message}
          type={alert.type}
          title={alert.title}
          isVisible={alert.show}
          onClose={hideAlert}
          duration={5000}
        />
      )}

      {/* Custom Confirmation Dialog */}
      {confirmation.show && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform border border-gray-200">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-full mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {confirmation.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {confirmation.message}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={hideConfirmation}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200"
                >
                  Avbryt
                </button>
                <button
                  onClick={() => {
                    confirmation.onConfirm?.();
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg transition-all duration-200"
                >
                  Acceptera
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}