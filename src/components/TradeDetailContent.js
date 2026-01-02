import { useState, useEffect } from 'react';
import DetailTradeOffer from './DetailTradeOffer';
import TradeDetailSidebar from './TradeDetailSidebar';
import TradeConversation from './TradeConversation';
import ProductChat from './ProductChat';
import Alert from './Alert';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import Image from 'next/image';

// Image Slider - FIXED with aspect ratio detection
const ImageSlider = ({ images, currentIndex, onNext, onPrev, onGoTo }) => {
  const [imageHeight, setImageHeight] = useState('h-96');

  useEffect(() => {
    if (!images?.length) return;
    
    const currentImage = images[currentIndex];
    if (!currentImage?.url) return;

    // Load image to detect aspect ratio
    const img = new window.Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      
      // Set height based on aspect ratio
      if (ratio > 2) {
        // Ultra wide (21:9, etc)
        setImageHeight('h-64 md:h-80');
      } else if (ratio > 1.6) {
        // Wide (16:9, 16:10)
        setImageHeight('h-80 md:h-96');
      } else if (ratio > 1.2) {
        // Standard (4:3, 3:2)
        setImageHeight('h-96 md:h-[28rem]');
      } else if (ratio > 0.9) {
        // Square (1:1)
        setImageHeight('h-96 md:h-[32rem]');
      } else {
        // Portrait (9:16, 3:4)
        setImageHeight('h-[28rem] md:h-[36rem]');
      }
    };
    
    img.src = currentImage.url;
  }, [images, currentIndex]);

  if (!images?.length) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="relative group overflow-hidden rounded-xl shadow-lg">
      <div className={`w-full ${imageHeight} bg-gray-100 flex items-center justify-center transition-all duration-300`}>
        <Image
          src={currentImage.url}
          alt={currentImage.original_name || `Bild ${currentIndex + 1}`}
          width={800}
          height={600}
          className="w-full h-full object-contain"
          priority={currentIndex === 0}
        />
      </div>
      
      {images.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={onPrev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 md:p-3 shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-all z-10"
          >
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={onNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-2 md:p-3 shadow-lg md:opacity-0 md:group-hover:opacity-100 transition-all z-10"
          >
            <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Counter */}
          <div className="absolute top-2 md:top-4 right-2 md:right-4 bg-black/70 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm z-10">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Dots */}
          <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => onGoTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Item List
const ItemList = ({ items, type, title }) => {
  if (!items?.length) return null;

  const isOffering = type === 'offering';
  const colorClass = isOffering ? 'green' : 'yellow';
  const emoji = isOffering ? '📦' : '🔍';

  return (
    <div className="mb-6 md:mb-8">
      <div className="flex items-center mb-4 md:mb-6">
        <div className={`w-1 h-6 md:h-8 bg-gradient-to-b from-${colorClass}-400 to-${colorClass}-600 rounded-full mr-3`}></div>
        <h2 className="text-lg md:text-2xl font-bold text-gray-800">{title}</h2>
      </div>

      <div className="grid gap-3 md:gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {items.map((item, index) => (
          <div key={`${type}-${index}`} 
               className={`border rounded-xl p-4 md:p-6 bg-gradient-to-br from-${colorClass}-50 to-${colorClass}-100/50 border-${colorClass}-200 hover:shadow-xl transition-all`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-${colorClass}-400 to-${colorClass}-500 flex items-center justify-center`}>
                  <span className="text-white text-base md:text-xl">{emoji}</span>
                </div>
                {item.category && (
                  <span className={`text-xs px-2 py-1 rounded-full bg-${colorClass}-200 text-${colorClass}-800 font-semibold`}>
                    {item.category}
                  </span>
                )}
              </div>
              <div className={`text-xs font-semibold text-${colorClass}-700`}>
                {isOffering ? 'FÖR BYTE' : 'SÖKER'}
              </div>
            </div>

            <h3 className={`font-bold text-sm md:text-base mb-2 text-${colorClass}-800`}>
              {typeof item === 'string' ? item : (item.name || item.description || 'Valfritt föremål')}
            </h3>
            
            {typeof item === 'object' && item.description && item.name && (
              <div className="bg-white/30 rounded-lg p-2 md:p-3 mb-2">
                <p className="text-gray-800 text-xs md:text-sm">{item.description}</p>
              </div>
            )}

            {typeof item === 'object' && (item.condition || item.brand || item.model) && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {item.condition && (
                  <span className="text-xs bg-white/40 text-gray-700 px-2 py-1 rounded-md">
                    Skick: {item.condition}
                  </span>
                )}
                {item.brand && (
                  <span className="text-xs bg-white/40 text-gray-700 px-2 py-1 rounded-md">
                    Märke: {item.brand}
                  </span>
                )}
                {item.model && (
                  <span className="text-xs bg-white/40 text-gray-700 px-2 py-1 rounded-md">
                    Modell: {item.model}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default function TradeDetailContent({ 
  listing,
  mounted,
  tradeOffers,
  loadingOffers,
  activeTrade,
  showConversation,
  computedValues,
  uniqueImages,
  processedItems,
  alert,
  user,
  token,
  isAuthenticated,
  onSubmitOffer,
  onAcceptOffer,
  onCompleteTrade,
  onCancelTrade,
  onDeleteListing,
  onShowConversation,
  onCloseConversation,
  onShowAlert,
  onCloseAlert,
  onNavigation,
  onLoginSuccess,
  onAuthStateChange
}) {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showProductChat, setShowProductChat] = useState(false);

  const handleLoginSuccess = () => {
    setShowLoginForm(false);
    setShowRegisterForm(false);
    onLoginSuccess?.();
    onAuthStateChange?.();
  };

  const nextImage = () => {
    setCurrentImageIndex(prev => prev === uniqueImages.length - 1 ? 0 : prev + 1);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => prev === 0 ? uniqueImages.length - 1 : prev - 1);
  };

  if (!mounted || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar bytesinformation...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-8">
          {/* Active Trade Banner */}
          {activeTrade?.status === 'accepted' && (
            <div className="mb-4 md:mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 md:p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center">
                  <div className="text-2xl md:text-3xl mr-3">🤝</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-green-800">
                      Aktivt Byte Pågår
                    </h3>
                    <p className="text-green-600 text-sm md:text-base">
                      Byter med {activeTrade.user?.name || activeTrade.user?.username || 'en annan användare'}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {computedValues.isPartOfActiveTrade && (
                    <button
                      onClick={onShowConversation}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-4 md:px-6 py-2.5 rounded-lg font-bold"
                    >
                      💬 Chatta
                    </button>
                  )}
                  {computedValues.isOwner && (
                    <>
                      <button
                        onClick={onCompleteTrade}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 md:px-6 py-2.5 rounded-lg font-bold"
                      >
                        ✅ Slutför
                      </button>
                      <button
                        onClick={onCancelTrade}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 md:px-6 py-2.5 rounded-lg font-bold"
                      >
                        ❌ Avbryt
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Trade Info */}
          <div className="mb-4 md:mb-8 bg-white/60 rounded-xl p-4 md:p-8 shadow-xl border border-gray-200">
            <div className="flex flex-col gap-3 md:flex-row md:gap-6 text-sm">
              <span className="flex items-center bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-2 rounded-full font-semibold text-gray-700">
                <span className="mr-2">📍</span>
                {listing.location}
              </span>
              <span className="flex items-center bg-gradient-to-r from-yellow-100 to-yellow-200 px-3 py-2 rounded-full font-semibold text-green-700">
                <span className="mr-2">📂</span>
                {listing.category}
              </span>
              <span className="flex items-center bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-2 rounded-full font-semibold text-yellow-700">
                <span className="mr-2">📅</span>
                {new Date(listing.created_at).toLocaleDateString('sv-SE')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 md:space-y-8">
              {/* Images */}
              {uniqueImages?.length > 0 ? (
                <div className="bg-white/60 rounded-xl p-4 md:p-8 shadow-xl border border-gray-200">
                  <div className="flex items-center mb-4 md:mb-6">
                    <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full mr-3"></div>
                    <h2 className="text-lg md:text-2xl font-bold text-gray-800">Galleri</h2>
                    {uniqueImages.length > 1 && (
                      <span className="ml-3 text-xs md:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {uniqueImages.length} bilder
                      </span>
                    )}
                  </div>
                  
                  <ImageSlider 
                    images={uniqueImages}
                    currentIndex={currentImageIndex}
                    onNext={nextImage}
                    onPrev={prevImage}
                    onGoTo={setCurrentImageIndex}
                  />
                </div>
              ) : (
                <div className="bg-white/60 rounded-xl p-6 md:p-12 shadow-xl border border-gray-200 text-center">
                  <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl md:text-4xl text-gray-400">📷</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-700 mb-2">Inga Bilder</h3>
                  <p className="text-gray-500 text-sm md:text-base">Denna annons har inga bilder.</p>
                </div>
              )}

              {/* Items */}
              <div className="bg-white/60 rounded-xl p-4 md:p-8 shadow-xl border border-gray-200">
                <ItemList items={processedItems.offering} type="offering" title="Bytes Objekt" />
              </div>
              
              <div className="bg-white/60 rounded-xl p-4 md:p-8 shadow-xl border border-gray-200">
                <ItemList items={processedItems.wanting} type="wanting" title="Söker Efter" />
              </div>

              {/* Product Questions Section */}
              <div className="bg-white/60 rounded-xl p-4 md:p-8 shadow-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="flex items-center">
                    <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full mr-3"></div>
                    <h2 className="text-lg md:text-2xl font-bold text-gray-800">Frågor om produkten</h2>
                  </div>
                  <button
                    onClick={() => setShowProductChat(true)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 md:px-6 py-2 rounded-lg font-bold flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="hidden sm:inline">Ställ en fråga</span>
                  </button>
                </div>
                
                <div className="text-center py-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl">
                  <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">💭</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Har du frågor om denna produkt? Klicka på knappen ovan för att chatta med säljaren!
                  </p>
                </div>
              </div>

              {/* Trade Offers */}
              <div className="bg-white/60 rounded-xl p-4 md:p-8 shadow-xl border border-gray-200">
                {isAuthenticated ? (
                  <DetailTradeOffer
                    offers={tradeOffers}
                    onSubmitOffer={onSubmitOffer}
                    onAcceptOffer={onAcceptOffer}
                    currentUser={user}
                    listingId={listing.id}
                    canMakeOffers={computedValues.canMakeOffers}
                    canAcceptOffers={computedValues.canAcceptOffers}
                    loading={loadingOffers}
                    activeTrade={activeTrade}
                    acceptedOfferId={activeTrade?.id}
                    listing={listing}
                  />
                ) : (
                  <div className="text-center py-8 md:py-12">
                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                      <span className="text-2xl md:text-3xl">🔐</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-green-800 mb-2">Redo att börja byta?</h3>
                    <p className="text-gray-600 mb-6 text-base md:text-lg">Gå med för att göra bytes anbud.</p>
                    
                    <div className="flex flex-col gap-3 px-4">
                      <button 
                        onClick={() => setShowLoginForm(true)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-bold"
                      >
                        🚀 Logga in för att byta
                      </button>
                      
                      <button 
                        onClick={() => setShowRegisterForm(true)}
                        className="text-gray-700 hover:text-green-800 px-8 py-3 rounded-xl font-bold border-2 border-green-200 hover:border-green-300"
                      >
                        ✨ Ny? Registrera
                      </button>

                      <button 
                        onClick={() => onNavigation?.('/')}
                        className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-xl"
                      >
                        🏠 Tillbaka till Hem
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <TradeDetailSidebar
                listing={listing}
                tradeOffers={tradeOffers}
                uniqueImages={uniqueImages}
                activeTrade={activeTrade}
                currentUser={{ ...user, token: user?.token }}
                onDelete={onDeleteListing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Product Chat Modal */}
      <ProductChat
        isOpen={showProductChat}
        onClose={() => setShowProductChat(false)}
        listing={listing}
        currentUser={user}
        token={token}
        isAuthenticated={isAuthenticated}
      />

      {/* Conversation Modal */}
      {showConversation && computedValues.isPartOfActiveTrade && (
        <TradeConversation
          isOpen={showConversation}
          onClose={onCloseConversation}
          trade={activeTrade}
          otherUser={computedValues.otherUser}
          listing={listing}
        />
      )}

      {/* Forms */}
      <RegisterForm 
        isOpen={showRegisterForm}
        onClose={() => setShowRegisterForm(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToLogin={() => {
          setShowRegisterForm(false);
          setShowLoginForm(true);
        }}
      />
      
      <LoginForm 
        isOpen={showLoginForm}
        onClose={() => setShowLoginForm(false)}
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={() => {
          setShowLoginForm(false);
          setShowRegisterForm(true);
        }}
      />

      {/* Alert */}
      {alert.show && (
        <Alert
          message={alert.message}
          type={alert.type}
          title={alert.title}
          isVisible={alert.show}
          onClose={onCloseAlert}
          duration={4000}
        />
      )}
    </>   
  );
}
// Add this temporarily to your TradeDetailContent or TradeDetailSlugPage
// to see what data you're actually working with

export function ListingDebugger({ listing }) {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4 max-w-md shadow-xl z-50">
      <h3 className="font-bold text-yellow-800 mb-2">🔍 Listing Debug Info</h3>
      <div className="text-xs space-y-1 text-gray-700">
        <div><strong>ID:</strong> {listing?.id || 'N/A'}</div>
        <div><strong>Slug:</strong> {listing?.slug || 'N/A'}</div>
        <div><strong>Title:</strong> {listing?.title || 'N/A'}</div>
        <div><strong>User ID:</strong> {listing?.user_id || 'N/A'}</div>
        <div><strong>Created:</strong> {listing?.created_at || 'N/A'}</div>
      </div>
      <div className="mt-2 p-2 bg-white rounded text-xs">
        <pre className="overflow-auto max-h-32">
          {JSON.stringify(listing, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// Usage in TradeDetailContent:
// <ListingDebugger listing={listing} />