"use client"
import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Tag, Shuffle, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';

// SEO-optimized category configuration
const CATEGORY_CONFIG = {
  tech: { emoji: '📱', color: 'from-blue-50/90 to-cyan-50/60', label: 'Teknik & Elektronik' },
  electronics: { emoji: '🔌', color: 'from-purple-50/90 to-indigo-50/60', label: 'Elektronik' },
  fashion: { emoji: '👕', color: 'from-pink-50/90 to-rose-50/60', label: 'Mode & Kläder' },
  sports: { emoji: '🚲', color: 'from-emerald-50/90 to-teal-50/70', label: 'Sport & Fritid' },
  gaming: { emoji: '🎮', color: 'from-violet-50/90 to-purple-50/60', label: 'Spel & Gaming' },
  music: { emoji: '🎵', color: 'from-yellow-50/90 to-amber-50/60', label: 'Musik & Ljud' },
  books: { emoji: '📚', color: 'from-amber-50/90 to-orange-50/60', label: 'Böcker & Media' },
  home: { emoji: '🏠', color: 'from-orange-50/90 to-red-50/60', label: 'Hem & Inredning' },
  art: { emoji: '🎨', color: 'from-rose-50/90 to-pink-50/60', label: 'Konst & Design' },
  toys: { emoji: '🧸', color: 'from-red-50/90 to-rose-50/60', label: 'Leksaker & Barnprylar' },
  automotive: { emoji: '🚗', color: 'from-slate-50/90 to-gray-50/60', label: 'Fordon & Tillbehör' },
  garden: { emoji: '🌱', color: 'from-lime-50/90 to-green-50/70', label: 'Trädgård & Växter' },
  pets: { emoji: '🐕', color: 'from-amber-50/90 to-yellow-50/60', label: 'Husdjur & Tillbehör' }
};

const getCategoryInfo = (category) => {
  const key = Object.keys(CATEGORY_CONFIG).find(k => 
    category?.toLowerCase().includes(k)
  );
  return CATEGORY_CONFIG[key] || { 
    emoji: '📦', 
    color: 'from-green-50/70 to-emerald-50/50',
    label: 'Allmänt' 
  };
};

const getTimeAgo = (dateString) => {
  if (!dateString) return 'Nyligen';
  const hours = Math.floor((Date.now() - new Date(dateString)) / 3600000);
  if (hours < 1) return 'Just nu';
  if (hours < 24) return `${hours}h sedan`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d sedan`;
  const months = Math.floor(days / 30);
  return `${months}mån sedan`;
};

const getWantedItems = (trade) => {
  const items = trade.items?.filter(i => i.type === 'wanting') || 
                trade.itemsWanting || [];
  
  if (items.length > 0) {
    return items.map(item => 
      typeof item === 'string' ? item : (item.name || item.description)
    ).filter(Boolean);
  }
  
  return trade.items_wanted_count > 0 
    ? [`${trade.items_wanted_count} olika föremål`] 
    : ['Öppet för förslag'];
};

const getPrimaryImage = (trade) => {
  return trade.images?.[0]?.url || 
         trade.images?.[0]?.file_path || 
         trade.imageUrl || 
         null;
};

export default function NewTradesCarousel() {
  const [trades, setTrades] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Fetch latest trade listings
  useEffect(() => {
    fetch('/api/trades?limit=6')
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch'))
      .then(data => {
        if (data.success && data.data?.listings) {
          setTrades(data.data.listings);
        }
      })
      .catch(err => setError(err.message || 'Kunde inte hämta bytesannonser'))
      .finally(() => setLoading(false));
  }, []);

  // Carousel navigation
  const navigate = useCallback((direction) => {
    setCurrentIndex(prev => {
      if (direction === 'next') return (prev + 1) % trades.length;
      return (prev - 1 + trades.length) % trades.length;
    });
  }, [trades.length]);

  // Touch/Swipe handlers for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      navigate('next');
    }
    if (touchStartX.current - touchEndX.current < -50) {
      navigate('prev');
    }
  };

  // Auto-advance carousel (pauses on hover/touch)
  useEffect(() => {
    if (trades.length === 0 || isHovered) return;
    const interval = setInterval(() => navigate('next'), 5000);
    return () => clearInterval(interval);
  }, [trades.length, isHovered, navigate]);

  // Loading state - mobile optimized
  if (loading) {
    return (
      <section 
        className="py-4 sm:py-6 lg:py-12 bg-gradient-to-b from-green-50/30 via-emerald-50/20 to-transparent"
        aria-label="Laddar nya bytesannonser"
      >
        <div className="px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-3 sm:p-6 lg:p-8 border border-green-100/60">
            <div className="animate-pulse space-y-4 sm:space-y-6">
              <div className="h-6 sm:h-8 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg w-3/4"></div>
              <div className="h-64 sm:h-80 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl sm:rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section 
        className="py-4 sm:py-6 lg:py-12 bg-gradient-to-b from-green-50/30 via-emerald-50/20 to-transparent"
        aria-label="Fel vid laddning av annonser"
      >
        <div className="px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-3 sm:p-6 lg:p-8 border border-red-100">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Senaste Bytesannonser</h2>
            <div className="bg-red-50/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl text-center border border-red-200/50">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">⚠️</div>
              <p className="text-sm sm:text-base text-gray-700 font-medium mb-4 sm:mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95"
                aria-label="Försök ladda annonser igen"
              >
                Försök igen
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (trades.length === 0) {
    return (
      <section 
        className="py-4 sm:py-6 lg:py-12 bg-gradient-to-b from-green-50/30 via-emerald-50/20 to-transparent"
        aria-label="Inga bytesannonser tillgängliga"
      >
        <div className="px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-3 sm:p-6 lg:p-8 border border-green-100/60">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Senaste Bytesannonser</h2>
            <div className="bg-gradient-to-br from-green-50/50 to-emerald-50/30 backdrop-blur-sm p-8 sm:p-12 rounded-xl sm:rounded-2xl text-center border border-green-200/50">
              <div className="text-5xl sm:text-7xl mb-4 sm:mb-6">📦</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Inga annonser just nu</h3>
              <p className="text-sm sm:text-base text-gray-600">Nya bytesannonser kommer snart!</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const currentTrade = trades[currentIndex];
  const { emoji, color, label } = getCategoryInfo(currentTrade.category);
  const wantedItems = getWantedItems(currentTrade);
  const primaryImage = getPrimaryImage(currentTrade);

  return (
    <section 
      className="py-4 sm:py-6 lg:py-12 bg-gradient-to-b from-green-50/30 via-emerald-50/20 to-transparent"
      aria-label="Senaste bytesannonser i Sverige"
    >
      <div className="px-3 sm:px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-3 sm:p-6 lg:p-8 border border-green-100/60">
          
          {/* Mobile-First Header */}
          <header className="mb-4 sm:mb-6 lg:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1 sm:mb-2">
              Senaste Bytesannonser
            </h2>
            <p className="text-xs sm:text-sm text-gray-500">Upptäck nya bytesmöjligheter</p>
          </header>

          {/* Mobile-First Layout: Card First, Then Info */}
          <div className="space-y-4 sm:space-y-6 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
            
            {/* PRIORITY 1: Trade Card (Mobile First) */}
            <div className="lg:col-span-1 lg:order-2">
              <div 
                className="bg-gradient-to-br from-white/90 to-green-50/30 backdrop-blur-sm p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-green-100/70 group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                role="region"
                aria-label="Bytesannons karusell"
              >
                
                {/* Card Header - Compact Mobile */}
                <div className="mb-3 sm:mb-4 flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-bold text-gray-700 flex items-center gap-1 sm:gap-2">
                    <span className="text-base sm:text-lg">🆕</span> 
                    <span>Nya annonser</span>
                  </span>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-green-50/80 backdrop-blur-sm rounded-full px-2.5 sm:px-3 py-1.5 sm:py-2 shadow-sm">
                    <button 
                      onClick={() => navigate('prev')}
                      className="p-1 sm:p-1.5 hover:bg-green-100 active:bg-green-200 rounded-full transition-colors duration-200 touch-manipulation"
                      aria-label="Föregående annons"
                    >
                      <ChevronLeft className="w-4 h-4 text-green-700" strokeWidth={2.5} />
                    </button>
                    <span className="text-xs font-semibold text-gray-600 min-w-[2rem] sm:min-w-[2.5rem] text-center">
                      {currentIndex + 1}/{trades.length}
                    </span>
                    <button 
                      onClick={() => navigate('next')}
                      className="p-1 sm:p-1.5 hover:bg-green-100 active:bg-green-200 rounded-full transition-colors duration-200 touch-manipulation"
                      aria-label="Nästa annons"
                    >
                      <ChevronRight className="w-4 h-4 text-green-700" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                {/* Trade Card - Touch Optimized */}
                <div className="relative rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden min-h-[300px] sm:min-h-[320px]">
                  <div className={`bg-gradient-to-br ${color} p-4 sm:p-5 h-full flex flex-col min-h-[300px] sm:min-h-[320px]`}>
                    
                    {/* Image - Larger on Mobile */}
                    <div className="flex justify-center mb-3 sm:mb-4">
                      <div className="relative w-32 h-32 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden border-2 sm:border-3 border-white/70 bg-white/30 backdrop-blur-sm">
                        {primaryImage ? (
                          <Image 
                            src={primaryImage} 
                            alt={`Bytesannons: ${currentTrade.title} i ${currentTrade.location || 'Sverige'}`}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover" 
                            loading="eager"
                            priority={currentIndex === 0}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-white/40 to-white/20">
                            <span className="text-4xl sm:text-5xl drop-shadow-lg">{emoji}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Trade Info - Mobile Optimized */}
                    <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-sm">
                          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 text-green-600" strokeWidth={2.5} />
                          <span className="text-xs font-medium text-gray-700">
                            {getTimeAgo(currentTrade.created_at)}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 leading-snug line-clamp-2 drop-shadow-sm">
                        {currentTrade.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-sm">
                          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 text-green-600" strokeWidth={2.5} />
                          <span className="text-xs font-medium text-gray-700 capitalize">
                            {currentTrade.location || 'Hela Sverige'}
                          </span>
                        </div>
                        <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 shadow-sm">
                          <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 text-green-600" strokeWidth={2.5} />
                          <span className="text-xs font-medium text-gray-700">
                            {label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Wanted Items - Compact Mobile */}
                    <div className="mt-auto pt-3 sm:pt-4 border-t border-white/40">
                      <div className="text-xs sm:text-sm font-bold mb-2 flex items-center text-gray-800">
                        <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-green-600" strokeWidth={2.5} />
                        <span>Söker:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {wantedItems.slice(0, 3).map((item, idx) => (
                          <span 
                            key={idx} 
                            className="text-xs bg-white/80 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium text-gray-700 shadow-sm border border-white/50 line-clamp-1"
                          >
                            {item}
                          </span>
                        ))}
                        {wantedItems.length > 3 && (
                          <span className="text-xs text-gray-700 bg-white/70 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-medium shadow-sm border border-white/50">
                            +{wantedItems.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pagination Dots - Touch Friendly */}
                <nav className="flex justify-center mt-4 sm:mt-5 gap-2" aria-label="Annons navigation">
                  {trades.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 touch-manipulation ${
                        currentIndex === index 
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 w-8 shadow-md' 
                          : 'bg-gray-300 w-2 active:bg-green-300'
                      }`}
                      aria-label={`Gå till annons ${index + 1}`}
                      aria-current={currentIndex === index ? 'true' : 'false'}
                    />
                  ))}
                </nav>

                {/* CTA - Full Width Mobile */}
                <div className="mt-4 sm:mt-5">
                  <a 
                    href="/tradelistingpage"
                    className="flex items-center justify-center w-full text-white font-bold text-sm sm:text-base bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 active:scale-95 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-400/30"
                    aria-label="Visa alla bytesannonser i Sverige"
                  >
                    <span>Visa alla annonser</span>
                    <ChevronRight className="w-4 h-4 ml-2" strokeWidth={2.5} />
                  </a>
                </div>
              </div>
            </div>

            {/* PRIORITY 2: Info Section (Below Card on Mobile) */}
            <div className="lg:col-span-2 lg:order-1">
              <article className="bg-gradient-to-br from-white/90 to-green-50/30 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-green-100/70">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center">
                  <span className="mr-2 sm:mr-3 text-xl sm:text-2xl">🔄</span>
                  <span>Byt istället för att köpa eller skänk bort</span>
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">
                  Upptäck hållbara bytesmöjligheter från användare över hela Sverige. 
                  Varje annons är en chans att hitta precis det du söker samtidigt 
                  som du ger dina saker nytt liv.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { icon: '💰', title: 'Helt gratis', desc: 'Inga pengar behövs' },
                    { icon: '🌍', title: 'Hållbart', desc: 'Minska konsumtion' },
                    { icon: '🤝', title: 'Gemenskap', desc: 'Möt nya människor' },
                    { icon: '♻️', title: 'Cirkulärt', desc: 'Ge saker nytt liv' }
                  ].map((item, i) => (
                    <div 
                      key={i} 
                      className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-white/60 backdrop-blur-sm rounded-lg sm:rounded-xl border border-green-100/50 hover:bg-white/80 active:scale-95 transition-all duration-300"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-xl sm:text-2xl">{item.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm sm:text-base text-gray-800 mb-0.5 sm:mb-1">{item.title}</h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
