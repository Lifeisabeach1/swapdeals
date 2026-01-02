"use client"
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Tag, Shuffle, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';

// Helper: Get category emoji and color
const CATEGORY_CONFIG = {
  tech: { emoji: '📱', color: 'from-blue-50/80 to-green-50/40' },
  electronics: { emoji: '🔌', color: 'from-purple-50/80 to-green-50/40' },
  fashion: { emoji: '👕', color: 'from-pink-50/80 to-green-50/40' },
  sports: { emoji: '🚲', color: 'from-emerald-50/80 to-green-50/60' },
  gaming: { emoji: '🎮', color: 'from-violet-50/80 to-green-50/40' },
  music: { emoji: '🎵', color: 'from-yellow-50/80 to-green-50/40' },
  books: { emoji: '📚', color: 'from-amber-50/80 to-green-50/40' },
  home: { emoji: '🏠', color: 'from-orange-50/80 to-green-50/40' },
  art: { emoji: '🎨', color: 'from-rose-50/80 to-green-50/40' },
  toys: { emoji: '🧸', color: 'from-red-50/80 to-green-50/40' },
  automotive: { emoji: '🚗', color: 'from-slate-50/80 to-green-50/40' },
  garden: { emoji: '🌱', color: 'from-lime-50/80 to-green-50/60' },
  pets: { emoji: '🐕', color: 'from-amber-50/80 to-green-50/40' }
};

const getCategoryInfo = (category) => {
  const key = Object.keys(CATEGORY_CONFIG).find(k => 
    category?.toLowerCase().includes(k)
  );
  return CATEGORY_CONFIG[key] || { emoji: '📦', color: 'from-green-50/50 to-white' };
};

// Helper: Time ago
const getTimeAgo = (dateString) => {
  if (!dateString) return 'Nyligen';
  const hours = Math.floor((Date.now() - new Date(dateString)) / 3600000);
  if (hours < 1) return 'Just nu';
  if (hours < 24) return `${hours} timma${hours > 1 ? 'r' : ''} sedan`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} dag${days > 1 ? 'ar' : ''} sedan`;
  const months = Math.floor(days / 30);
  return `${months} månad${months > 1 ? 'er' : ''} sedan`;
};

// Helper: Get wanted items
const getWantedItems = (trade) => {
  const items = trade.items?.filter(i => i.type === 'wanting') || 
                trade.itemsWanting || [];
  
  if (items.length > 0) {
    return items.map(item => 
      typeof item === 'string' ? item : (item.name || item.description)
    ).filter(Boolean);
  }
  
  return trade.items_wanted_count > 0 
    ? [`${trade.items_wanted_count} föremål`] 
    : ['Alla erbjudanden'];
};

// Helper: Get primary image
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

  // Fetch trades
  useEffect(() => {
    fetch('/api/trades?limit=6')
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch'))
      .then(data => {
        if (data.success && data.data?.listings) {
          setTrades(data.data.listings);
        }
      })
      .catch(err => setError(err.message || 'Kunde inte hämta byteshandlar'))
      .finally(() => setLoading(false));
  }, []);

  // Navigation (now wrapped in useCallback to fix the dependency warning)
  const navigate = useCallback((direction) => {
    setCurrentIndex(prev => {
      if (direction === 'next') return (prev + 1) % trades.length;
      return (prev - 1 + trades.length) % trades.length;
    });
  }, [trades.length]);

  // Autoplay (pause on hover)
  useEffect(() => {
    if (trades.length === 0 || isHovered) return;
    const interval = setInterval(() => navigate('next'), 5000);
    return () => clearInterval(interval);
  }, [trades.length, isHovered, navigate]); // Added navigate to dependencies

  // Loading state
  if (loading) {
    return (
      <section className="py-4 sm:py-6 lg:py-8 bg-gradient-to-b from-green-50/20 to-transparent">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-6 border border-green-200/50">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Nya annonser</h2>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-green-100 rounded w-3/4"></div>
            <div className="h-4 bg-green-100 rounded"></div>
            <div className="h-4 bg-green-100 rounded w-5/6"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="py-4 sm:py-6 lg:py-8 bg-gradient-to-b from-green-50/20 to-transparent">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-6 border border-green-200/50">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Nya annonser</h2>
          <div className="bg-white/80 p-6 rounded-xl text-center">
            <div className="text-red-500 mb-2 text-2xl">⚠️</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium"
            >
              Försök igen
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (trades.length === 0) {
    return (
      <section className="py-4 sm:py-6 lg:py-8 bg-gradient-to-b from-green-50/20 to-transparent">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-6 border border-green-200/50">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Nya annonser</h2>
          <div className="bg-white/80 p-6 rounded-xl text-center">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-600 font-medium">Inga byten tillgänglig just nu.</p>
          </div>
        </div>
      </section>
    );
  }

  const currentTrade = trades[currentIndex];
  const { emoji, color } = getCategoryInfo(currentTrade.category);
  const wantedItems = getWantedItems(currentTrade);
  const primaryImage = getPrimaryImage(currentTrade);

  return (
    <section className="py-4 sm:py-6 lg:py-8 bg-gradient-to-b from-green-50/20 to-transparent">
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-3 sm:p-4 lg:p-6 border border-green-200/50">
        
        {/* Header */}
        <div className="flex items-center justify-center sm:justify-start mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg shadow-md flex items-center justify-center mr-3">
            <span className="text-lg">💎</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Nya annonser</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left: Info */}
          <div className="lg:w-2/3 order-2 lg:order-1">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-green-100/50">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Senaste bytes annonser</h3>
              <p className="text-gray-600 mb-4">
                Bläddra igenom våra nyaste bytes annonser från användare runt om i Sverige. 
                Varje föremål representerar en unik möjlighet att hitta det du letar efter.
              </p>
              <div className="space-y-3">
                {['Inga pengar utbyts', 'Hållbar konsumtion', 'Bygg gemenskap'].map((text, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Carousel */}
          <div className="lg:w-1/3 order-1 lg:order-2">
            <div 
              className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-green-100/50 group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              
              {/* Header */}
              <div className="mb-3 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700 flex items-center">
                  <span className="mr-2">🆕</span> Nya Föremål
                </span>
                <div className="flex items-center gap-1 bg-green-50 rounded-full p-1">
                  <button 
                    onClick={() => navigate('prev')}
                    className="p-1 hover:bg-green-100 rounded-full"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-500 w-12 text-center">
                    {currentIndex + 1}/{trades.length}
                  </span>
                  <button 
                    onClick={() => navigate('next')}
                    className="p-1 hover:bg-green-100 rounded-full"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Card */}
              <div className="relative rounded-xl shadow-lg overflow-hidden" style={{ minHeight: "280px" }}>
                <div className={`bg-gradient-to-br ${color} p-4 h-full flex flex-col`}>
                  
                  {/* Image */}
                  <div className="flex justify-center mb-3">
                    <div className="w-24 h-24 rounded-2xl shadow-lg overflow-hidden border-2 border-white/50 bg-white/20">
                      {primaryImage ? (
                        <Image 
                          src={primaryImage} 
                          alt={currentTrade.title} 
                          width={96}
                          height={96}
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-3xl">{emoji}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center bg-white/60 rounded-full px-2 py-1 w-fit">
                      <Clock className="w-3 h-3 mr-1 text-green-600" />
                      <span className="text-xs text-gray-600 font-medium">{getTimeAgo(currentTrade.created_at)}</span>
                    </div>

                    <h3 className="text-base font-bold text-gray-800 line-clamp-2">{currentTrade.title}</h3>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-white/60 rounded-full px-2 py-1">
                        <MapPin className="w-3 h-3 mr-1 text-green-600" />
                        <span className="text-xs capitalize">{currentTrade.location || 'Okänd'}</span>
                      </div>
                      <div className="flex items-center bg-white/60 rounded-full px-2 py-1">
                        <Tag className="w-3 h-3 mr-1 text-green-600" />
                        <span className="text-xs capitalize">{currentTrade.category || 'Allmänt'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Wanted items */}
                  <div className="mt-auto pt-3 border-t border-white/30">
                    <div className="text-sm font-bold mb-2 flex items-center text-gray-700">
                      <Shuffle className="w-4 h-4 mr-2 text-green-600" />
                      Letar efter:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {wantedItems.slice(0, 2).map((item, idx) => (
                        <span key={idx} className="text-xs bg-white/80 px-2 py-1 rounded-full">
                          {item}
                        </span>
                      ))}
                      {wantedItems.length > 2 && (
                        <span className="text-xs text-gray-600 bg-white/60 px-2 py-1 rounded-full">
                          +{wantedItems.length - 2} till
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Side navigation */}
                <button 
                  onClick={() => navigate('prev')}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => navigate('next')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Dots */}
              <div className="flex justify-center mt-4 gap-1">
                {trades.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentIndex === index 
                        ? 'bg-green-600 w-6' 
                        : 'bg-gray-300 w-2 hover:bg-green-300'
                    }`}
                  />
                ))}
              </div>

              {/* Link */}
              <div className="text-center mt-4">
                <a 
                  href="/tradelistingpage"
                  className="inline-flex items-center text-green-600 hover:text-green-500 text-sm font-bold bg-green-50 hover:bg-green-100 px-4 py-2 rounded-full"
                >
                  Visa alla annonser
                  <ChevronRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}