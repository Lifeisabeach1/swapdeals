// src/components/TradeDetailContent.js 
"use client"
import { useMemo, useState } from 'react';
import DetailTradeOffer from './DetailTradeOffer';
import TradeDetailSidebar from './TradeDetailSidebar';
import TradeConversation from './TradeConversation';
import Alert from './Alert';
import RegisterForm from './RegisterForm';
import LoginForm from './LoginForm';
import Image from 'next/image';

export default function TradeDetailContent({ 
  // Core data
  listing,
  mounted,
  
  // Trade data
  tradeOffers,
  loadingOffers,
  activeTrade,
  showConversation,
  
  // Computed values
  computedValues,
  uniqueImages,
  processedItems,
  
  // Alert state
  alert,
  
  // User data
  user,
  isAuthenticated,
  
  // Handlers
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
  
  // New handlers for authentication
  onLoginSuccess,
  onAuthStateChange
}) {
  
  // Modal states for login/register forms
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  
  // Image slider state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle login/register success
  const handleLoginSuccess = () => {
    setShowLoginForm(false);
    setShowRegisterForm(false);
    // Call the parent's success handler if provided
    if (onLoginSuccess) {
      onLoginSuccess();
    }
    // Trigger auth state change if provided
    if (onAuthStateChange) {
      onAuthStateChange();
    }
  };

  // Handle switching between login and register forms
  const handleSwitchToLogin = () => {
    setShowRegisterForm(false);
    setShowLoginForm(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginForm(false);
    setShowRegisterForm(true);
  };

  // Image navigation functions
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === uniqueImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? uniqueImages.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Image Slider Component
  const ImageSlider = ({ images }) => {
    if (!images || images.length === 0) return null;

    return (
      <div className="relative group overflow-hidden rounded-2xl shadow-lg">
        {/* Main Image */}
        <div className="relative">
          <img
            src={images[currentImageIndex].url}
            alt={`${listing.title} - Bild ${currentImageIndex + 1}`}
            className="w-full h-96 object-cover transition-all duration-500"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Navigation arrows - only show if more than 1 image */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          
          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
        
        {/* Thumbnail navigation - only show if more than 1 image */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  index === currentImageIndex 
                    ? 'border-white shadow-lg scale-110' 
                    : 'border-white/50 hover:border-white/80 hover:scale-105'
                }`}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
        
        {/* Dot indicators as backup for many images */}
        {images.length > 6 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentImageIndex 
                    ? 'bg-white shadow-lg scale-125' 
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Enhanced Component for rendering item lists
  const ItemList = ({ items, type, title }) => {
    if (!items || items.length === 0) return null;

    const colorClasses = type === 'offering' 
      ? 'from-green-50/80 to-green-100/50 border-green-200/60 text-green-800 bg-gradient-to-br from-green-400 to-green-500'
      : 'from-yellow-50/80 to-yellow-100/50 border-yellow-200/60 text-yellow-800 bg-gradient-to-br from-yellow-400 to-yellow-500';
    
    const [bgFromClass, bgToClass, borderClass, textClass, badgeGradient] = colorClasses.split(' ');

    return (
      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className={`w-1 h-8 ${type === 'offering' ? 'bg-gradient-to-b from-green-400 to-green-600' : 'bg-gradient-to-b from-yellow-400 to-yellow-600'} rounded-full mr-4 shadow-sm`}></div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">
            {title}
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {items.map((item, index) => {
            // Create a truly unique key by combining multiple identifiers
            const uniqueKey = `${type}-${index}-${item.id || 'no-id'}-${typeof item === 'string' ? item.slice(0, 10) : (item.name || item.description || 'unknown').slice(0, 10)}`;
            
            return (
              <div key={uniqueKey} 
                   className={`relative overflow-hidden border rounded-2xl p-6 bg-gradient-to-br ${bgFromClass} ${bgToClass} ${borderClass} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 group`}>
                
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-2xl"></div>
                
                <div className={`absolute -top-1 -right-1 w-8 h-8 ${type === 'offering' ? 'bg-gradient-to-br from-green-300/40 to-green-400/40' : 'bg-gradient-to-br from-yellow-300/40 to-yellow-400/40'} rounded-full blur-sm`}></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-xl ${badgeGradient} shadow-md flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300`}>
                        <span className="text-white text-xl" role="img" aria-label="Item">
                          {type === 'offering' ? '📦' : '🔍'}
                        </span>
                      </div>
                      {typeof item === 'object' && item.category && (
                        <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${type === 'offering' ? 'bg-green-200/70 text-green-800' : 'bg-yellow-200/70 text-yellow-800'} border ${type === 'offering' ? 'border-green-300/60' : 'border-yellow-300/60'} shadow-sm`}>
                          {item.category}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col items-end">
                      <div className={`w-2.5 h-2.5 rounded-full ${type === 'offering' ? 'bg-green-500' : 'bg-yellow-500'} shadow-sm mb-1 pulse-dot`}></div>
                      <div className="text-right">
                        <div className={`text-xs font-semibold ${textClass.replace('800', '700')} opacity-80 tracking-wide`}>
                          {type === 'offering' ? 'FÖR BYTE' : 'SÖKER'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced title text */}
                  <h3 className={`font-bold text-base mb-3 ${textClass} group-hover:text-opacity-90 transition-colors leading-snug tracking-tight`}>
                    {typeof item === 'string' ? item : (item.name || item.description || 'Valfritt föremål i denna kategori')}
                  </h3>
                  
                  {/* Enhanced description text */}
                  {typeof item === 'object' && item.description && item.name && (
                    <div className="bg-white/30 rounded-lg p-3 mb-3 border border-white/40">
                      <p className="text-gray-800/90 text-sm leading-relaxed font-medium tracking-wide">
                        {item.description}
                      </p>
                    </div>
                  )}

                  {/* Additional item details if available */}
                  {typeof item === 'object' && (item.condition || item.brand || item.model) && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {item.condition && (
                        <span className="text-xs bg-white/40 text-gray-700 px-2 py-1 rounded-md font-medium border border-white/30">
                          Skick: {item.condition}
                        </span>
                      )}
                      {item.brand && (
                        <span className="text-xs bg-white/40 text-gray-700 px-2 py-1 rounded-md font-medium border border-white/30">
                          Märke: {item.brand}
                        </span>
                      )}
                      {item.model && (
                        <span className="text-xs bg-white/40 text-gray-700 px-2 py-1 rounded-md font-medium border border-white/30">
                          Modell: {item.model}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Enhanced hover effect */}
                <div className={`absolute inset-x-0 bottom-0 h-1 ${badgeGradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full`}></div>
                
                {/* Subtle shine effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Enhanced separator */}
        <div className="mt-8 flex items-center justify-center">
          <div className={`w-20 h-px ${type === 'offering' ? 'bg-gradient-to-r from-transparent via-green-400/60 to-transparent' : 'bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent'}`}></div>
          <div className={`mx-4 w-3 h-3 rounded-full ${type === 'offering' ? 'bg-green-400' : 'bg-yellow-400'} shadow-lg animate-pulse`}></div>
          <div className={`w-20 h-px ${type === 'offering' ? 'bg-gradient-to-r from-transparent via-green-400/60 to-transparent' : 'bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent'}`}></div>
        </div>
      </div>
    );
  };

  // Loading state
  if (!mounted || !listing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-green-200 border-t-green-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/Swapdealsemoji.png"
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

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30 relative">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1)_0%,transparent_50%)]"></div>
        
        <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
          {/* Active Trade Banner */}
          {activeTrade && activeTrade.status === 'accepted' && (
            <div className="mb-8 bg-gradient-to-r from-green-50/90 to-emerald-50/90 backdrop-blur-lg border border-green-200/60 rounded-2xl p-6 shadow-xl">
              <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-green-400 via-emerald-500 to-green-400 rounded-full"></div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-green-500 text-3xl mr-4 animate-pulse">🤝</div>
                  <div>
                    <h3 className="text-xl font-bold bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent">
                      Aktivt Byte Pågår
                    </h3>
                    <p className="text-green-600 font-medium mt-1">
                      Byter med {
                        activeTrade.user?.name || 
                        activeTrade.user?.username ||
                        (activeTrade.user_id === user?.id ? 'säljaren' : 'en annan användare')
                      }
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  {computedValues.isPartOfActiveTrade && activeTrade && (
                    <button
                      onClick={onShowConversation}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      💬 <span>Chatta</span>
                    </button>
                  )}
                  {computedValues.isOwner && (
                    <>
                      <button
                        onClick={onCompleteTrade}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        ✅ Slutför
                      </button>
                      <button
                        onClick={onCancelTrade}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        ❌ Avbryt
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Trade No Longer Available Notice */}
          {activeTrade && activeTrade.status === 'accepted' && !computedValues.isPartOfActiveTrade && (
            <div className="mb-8 bg-gradient-to-r from-amber-50/90 to-yellow-50/90 backdrop-blur-lg border border-amber-200/60 rounded-2xl p-6 shadow-xl">
              <div className="absolute top-0 left-6 right-6 h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 rounded-full"></div>
              
              <div className="flex items-center">
                <div className="text-amber-500 text-3xl mr-4">⚠️</div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-amber-800 to-yellow-700 bg-clip-text text-transparent">
                    Byte Pågår Redan
                  </h3>
                  <p className="text-amber-600 font-medium mt-1">
                    Detta föremål byts för närvarande med en annan användare, men du kan fortfarande se detaljerna.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Trade Header */}
          <div className="mb-8 bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200/50">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <span className="flex items-center bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2.5 rounded-full font-semibold text-gray-700 shadow-md">
                <span className="mr-2 text-lg">📍</span>
                {listing.location}
              </span>
              <span className="flex items-center bg-gradient-to-r from-yellow-100 to-yellow-200 px-4 py-2.5 rounded-full font-semibold text-green-700 shadow-md">
                <span className="mr-2 text-lg">📂</span>
                {listing.category}
              </span>
              <span className="flex items-center bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2.5 rounded-full font-semibold text-yellow-700 shadow-md">
                <span className="mr-2 text-lg">📅</span>
                {new Date(listing.created_at).toLocaleDateString('sv-SE')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Images Section - Now shows image slider */}
              {uniqueImages?.length > 0 ? (
                <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200/50">
                  <div className="flex items-center mb-6">
                    <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-green-600 rounded-full mr-4 shadow-sm"></div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-clip-text text-transparent">
                      Galleri
                    </h2>
                    {uniqueImages.length > 1 && (
                      <span className="ml-4 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {uniqueImages.length} bilder
                      </span>
                    )}
                  </div>
                  
                  <ImageSlider images={uniqueImages} />
                </div>
              ) : (
                <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-12 shadow-xl border border-gray-200/50 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-4xl text-gray-400">📷</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">Inga Bilder Tillgängliga</h3>
                  <p className="text-gray-500">Denna bytesannons har inga bilder än.</p>
                </div>
              )}

              {/* Items sections */}
              <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200/50">
                <ItemList 
                  items={processedItems.offering} 
                  type="offering" 
                  title="Bytes Objekt" 
                />
              </div>
              
              <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200/50">
                <ItemList 
                  items={processedItems.wanting} 
                  type="wanting" 
                  title="Söker Efter" 
                />
              </div>

              {/* Trade Offers Section */}
              <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200/50">
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
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-3xl">🔐</span>
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent mb-3">
                      Redo att börja byta?
                    </h3>
                    <p className="text-gray-600 mb-8 text-lg">Gå med i vår gemenskap för att göra bytes anbud och kontakta annonsörer.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                      <button 
                        onClick={() => setShowLoginForm(true)}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center group"
                      >
                        <span className="mr-3 text-xl group-hover:scale-110 transition-transform">🚀</span>
                        Logga in för att byta
                      </button>
                      
                      <button 
                        onClick={() => setShowRegisterForm(true)}
                        className="text-gray-700 hover:text-green-800 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 border-2 border-green-200 hover:border-green-300 hover:bg-green-50/80 backdrop-blur-sm flex items-center group"
                      >
                        <span className="mr-3 text-xl group-hover:scale-110 transition-transform">✨</span>
                        Ny Användare? Registrera
                      </button>
                    </div>
                    
                    <div className="mt-6">
                      <button 
                        onClick={() => onNavigation && onNavigation('/')}
                        className="text-gray-600 hover:text-gray-800 px-6 py-3 rounded-2xl font-medium transition-all duration-200 hover:bg-gray-50/80 backdrop-blur-sm flex items-center mx-auto group"
                      >
                        <span className="mr-2 text-lg group-hover:scale-110 transition-transform">🏠</span>
                        Tillbaka till Hem
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

      {/* Login and Register Form Modals */}
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

      {/* Enhanced Alert Component */}
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