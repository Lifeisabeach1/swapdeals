"use client"
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Tag, Shuffle, MapPin, ArrowRight, Clock, Package } from 'lucide-react';

export default function NewTradesCarousel() {
  const [trades, setTrades] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch real trades from API
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true);
        // Fixed: Use the correct endpoint and parameters that your API supports
        const response = await fetch('/api/trades?limit=6');
        
        if (!response.ok) {
          throw new Error('Kunde inte hämta byteshandlar');
        }
        
        const data = await response.json();
        
        // Fixed: Use the correct response structure (data.listings, not data.trades)
        if (data.success && data.data && data.data.listings) {
          setTrades(data.data.listings);
        } else {
          throw new Error('Ogiltigt svarsformat');
        }
      } catch (err) {
        console.error('Error fetching trades:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
  }, []);

  // Helper function to get time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Nyligen';
    
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just nu';
    if (diffInHours < 24) return `${diffInHours} timme${diffInHours > 1 ? 'r' : ''} sedan`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} dag${diffInDays > 1 ? 'ar' : ''} sedan`;
    
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} månad${diffInMonths > 1 ? 'er' : ''} sedan`;
  };

  // Helper function to get primary image
  const getPrimaryImage = (trade) => {
    if (trade.images && Array.isArray(trade.images) && trade.images.length > 0) {
      return trade.images[0].url || trade.images[0].file_path;
    }
    if (trade.imageUrl) return trade.imageUrl;
    return null;
  };

  // Helper function to get wanted items
  const getWantedItems = (trade) => {
    // Check for items with type 'wanting'
    if (trade.items && Array.isArray(trade.items)) {
      const wantedItems = trade.items.filter(item => item.type === 'wanting');
      if (wantedItems.length > 0) {
        return wantedItems.map(item => item.name || item.description || item.category).filter(Boolean);
      }
    }
    
    // Check for itemsWanting array
    if (trade.itemsWanting && Array.isArray(trade.itemsWanting)) {
      return trade.itemsWanting.map(item => 
        typeof item === 'string' ? item : (item.name || item.description)
      ).filter(Boolean);
    }
    
    // Fallback - use items_wanted_count if available
    if (trade.items_wanted_count && trade.items_wanted_count > 0) {
      return [`${trade.items_wanted_count} föremål`];
    }
    
    // Final fallback
    return ['Alla erbjudanden'];
  };

  // Helper function to get category emoji
  const getCategoryEmoji = (category) => {
    if (!category) return '📦';
    
    const categoryLower = category.toLowerCase();
    const emojiMap = {
      'tech': '📱',
      'technology': '📱',
      'electronics': '🔌',
      'fashion': '👕',
      'clothing': '👕',
      'sports': '🚲',
      'gaming': '🎮',
      'games': '🎮',
      'photography': '📷',
      'camera': '📷',
      'music': '🎵',
      'musical': '🎵',
      'books': '📚',
      'home': '🏠',
      'furniture': '🪑',
      'art': '🎨',
      'collectibles': '💎',
      'toys': '🧸',
      'automotive': '🚗',
      'tools': '🔧',
      'garden': '🌱',
      'beauty': '💄',
      'health': '💊',
      'food': '🍎',
      'travel': '✈️',
      'outdoors': '🏕️',
      'pets': '🐕'
    };
    
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (categoryLower.includes(key)) {
        return emoji;
      }
    }
    
    return '📦';
  };

  // Helper function to get background color based on category - Updated with green accents
  const getCategoryBgColor = (category) => {
    if (!category) return 'from-green-50/50 to-white';
    
    const categoryLower = category.toLowerCase();
    const colorMap = {
      'tech': 'from-blue-50/80 to-green-50/40',
      'technology': 'from-blue-50/80 to-green-50/40',
      'electronics': 'from-purple-50/80 to-green-50/40',
      'fashion': 'from-pink-50/80 to-green-50/40',
      'clothing': 'from-pink-50/80 to-green-50/40',
      'sports': 'from-emerald-50/80 to-green-50/60',
      'gaming': 'from-violet-50/80 to-green-50/40',
      'games': 'from-violet-50/80 to-green-50/40',
      'photography': 'from-indigo-50/80 to-green-50/40',
      'camera': 'from-indigo-50/80 to-green-50/40',
      'music': 'from-yellow-50/80 to-green-50/40',
      'musical': 'from-yellow-50/80 to-green-50/40',
      'books': 'from-amber-50/80 to-green-50/40',
      'home': 'from-orange-50/80 to-green-50/40',
      'furniture': 'from-orange-50/80 to-green-50/40',
      'art': 'from-rose-50/80 to-green-50/40',
      'collectibles': 'from-emerald-50/80 to-green-50/60',
      'toys': 'from-red-50/80 to-green-50/40',
      'automotive': 'from-slate-50/80 to-green-50/40',
      'tools': 'from-zinc-50/80 to-green-50/40',
      'garden': 'from-lime-50/80 to-green-50/60',
      'beauty': 'from-fuchsia-50/80 to-green-50/40',
      'health': 'from-teal-50/80 to-green-50/40',
      'food': 'from-green-50/80 to-green-50/60',
      'travel': 'from-sky-50/80 to-green-50/40',
      'outdoors': 'from-emerald-50/80 to-green-50/60',
      'pets': 'from-amber-50/80 to-green-50/40'
    };
    
    for (const [key, color] of Object.entries(colorMap)) {
      if (categoryLower.includes(key)) {
        return color;
      }
    }
    
    return 'from-green-50/50 to-white';
  };

  const handleNext = () => {
    if (animating || trades.length === 0) return;
    
    setAnimating(true);
    setCurrentIndex(prevIndex => 
      prevIndex === trades.length - 1 ? 0 : prevIndex + 1
    );
    
    setTimeout(() => {
      setAnimating(false);
    }, 1000);
  };

  const handlePrev = () => {
    if (animating || trades.length === 0) return;
    
    setAnimating(true);
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? trades.length - 1 : prevIndex - 1
    );
    
    setTimeout(() => {
      setAnimating(false);
    }, 1000);
  };
  
  // Autoplay functionality - pause when hovered
  useEffect(() => {
    if (!isAutoplay || trades.length === 0 || isHovered) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoplay, trades.length, isHovered]);

  // Show loading state
  if (loading) {
    return (
      <section className="py-8 bg-gradient-to-b from-green-50/20 to-transparent">
        {/* Premium light effect overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/10 to-transparent pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-green-200/50 relative">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent drop-shadow-sm">
              Nya annonser
            </h2>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-2/3 flex flex-col justify-center">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-green-100/50">
                <div className="animate-pulse">
                  <div className="h-6 bg-gradient-to-r from-green-100 to-green-200 rounded w-3/4 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gradient-to-r from-green-100 to-green-200 rounded"></div>
                    <div className="h-4 bg-gradient-to-r from-green-100 to-green-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gradient-to-r from-green-100 to-green-200 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-green-100/50">
                <div className="animate-pulse">
                  <div className="h-80 bg-gradient-to-br from-green-100 to-green-200 rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="py-8 bg-gradient-to-b from-green-50/20 to-transparent">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-green-200/50">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent drop-shadow-sm">
              Nya Byteshandlar
            </h2>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center border border-green-100/50">
            <div className="text-red-500 mb-2 text-2xl">⚠️</div>
            <div className="text-gray-600 mb-4">Kunde inte ladda de senaste bytes annonserna: {error}</div>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Försök igen
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Show no trades state
  if (trades.length === 0) {
    return (
      <section className="py-8 bg-gradient-to-b from-green-50/20 to-transparent">
        <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-green-200/50">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent drop-shadow-sm">
              Nya byten
            </h2>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center border border-green-100/50">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-gray-600 font-medium mb-2">Inga byten tillgänglig just nu.</div>
            <div className="text-sm text-gray-500">Bli den första att ladda upp en annons i den kategorin!</div>
          </div>
        </div>
      </section>
    );
  }

  const currentTrade = trades[currentIndex];

  return (
    <section className="py-8 bg-gradient-to-b from-green-50/20 to-transparent relative">
      {/* Premium light effect overlay matching navbar */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/10 to-transparent pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-green-200/50 relative">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex items-center">
            {/* SwapDeals mini logo to match navbar */}
            <div className="mr-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-lg shadow-md flex items-center justify-center">
                <span className="text-lg">💎</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent drop-shadow-sm">
              Nya annonser
            </h2>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:h-[536px]">
          {/* Left side content - Enhanced with green accents and increased height */}
          <div className="lg:w-2/3 flex flex-col justify-center">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-green-100/50 h-full flex flex-col justify-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Senaste bytes annonser</h3>
              <div className="text-gray-600 mb-4">
                Bläddra igenom våra nyaste bytes annonser från användare runt om i Sverige. Varje föremål representerar en unik möjlighet att hitta det du letar efter, genom byteshandel istället för köp.
              </div>
              <div className="text-gray-600 mb-6">
                Oavsett om du vill byta teknik, mode, sportutrustning eller samlarobjekt, kopplar vår plattform dig till personer som värdesätter det du har att erbjuda.
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-sm">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Inga pengar utbyts</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-sm">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Hållbar konsumtion</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center shadow-sm">
                    <span className="text-green-600 font-bold">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">Bygg gemenskap med andra</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side carousel - Enhanced with glassmorphism and increased height */}
          <div className="lg:w-1/3">
            <div 
              className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-green-100/50 group h-full flex flex-col"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="mb-3 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-700 flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mr-2">
                    <span className="text-xs">🆕</span>
                  </div>
                  Nya Föremål
                </span>
                <div className="flex items-center bg-green-50/50 rounded-full p-1">
                  <button 
                    className="text-gray-700 hover:text-green-600 transition-colors p-1.5 rounded-full hover:bg-green-100/70 disabled:opacity-50"
                    onClick={handlePrev}
                    disabled={animating}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs text-gray-500 w-12 text-center font-medium">
                    {currentIndex + 1}/{trades.length}
                  </span>
                  <button 
                    className="text-gray-700 hover:text-green-600 transition-colors p-1.5 rounded-full hover:bg-green-100/70 disabled:opacity-50"
                    onClick={handleNext}
                    disabled={animating}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* HEIGHT UPDATE: Carousel container - Increased height from 380px to 420px (+40px) */}
              <div className="relative overflow-hidden rounded-xl shadow-lg border border-green-200/30 flex-1" style={{ height: "420px" }}>
                <div className="h-full w-full relative">
                  {trades.map((trade, index) => {
                    const wantedItems = getWantedItems(trade);
                    const primaryImage = getPrimaryImage(trade);
                    
                    return (
                      <div 
                        key={trade.id} 
                        className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out bg-gradient-to-br ${getCategoryBgColor(trade.category)} backdrop-blur-sm flex flex-col ${
                          index === currentIndex ? 'opacity-100 translate-x-0 z-10' : 
                          index < currentIndex ? 'opacity-0 -translate-x-full' : 'opacity-0 translate-x-full'
                        }`}
                        style={{
                          borderTop: '1px solid rgba(34, 197, 94, 0.2)',
                          borderLeft: '1px solid rgba(34, 197, 94, 0.1)'
                        }}
                      >
                        {/* Image or Icon */}
                        <div className="flex items-center justify-center p-3">
                          {primaryImage ? (
                            <div className="w-16 h-16 rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 border-2 border-white/50">
                              <img 
                                src={primaryImage} 
                                alt={trade.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hidden items-center justify-center border-2 border-white/50">
                                <span className="text-2xl">{getCategoryEmoji(trade.category)}</span>
                              </div>
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-300 border-2 border-white/50">
                              <span className="text-2xl">{getCategoryEmoji(trade.category)}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="p-3 flex flex-col justify-between flex-grow">
                          <div>
                            <div className="mb-2 flex items-center">
                              <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-2 py-1">
                                <Clock className="w-3 h-3 mr-1 text-green-600" />
                                <span className="text-xs text-gray-600 font-medium">{getTimeAgo(trade.created_at)}</span>
                              </div>
                            </div>
                            
                            <h3 className="text-base font-bold text-gray-800 mb-2 line-clamp-2 leading-tight">{trade.title}</h3>
                            
                            <div className="flex items-center mb-2 text-gray-600">
                              <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-2 py-1 mr-2">
                                <MapPin className="w-3 h-3 mr-1 text-green-600" />
                                <span className="text-xs capitalize font-medium">{trade.location || 'Okänd'}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center mb-3 text-gray-600">
                              <div className="flex items-center bg-white/60 backdrop-blur-sm rounded-full px-2 py-1">
                                <Tag className="w-3 h-3 mr-1 text-green-600" />
                                <span className="text-xs capitalize font-medium">{trade.category?.replace(/-/g, ' ') || 'Allmänt'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-white/30">
                            <div className="text-sm text-gray-700 font-bold mb-2 flex items-center">
                              <div className="w-4 h-4 bg-white/60 backdrop-blur-sm rounded-lg flex items-center justify-center mr-2">
                                <Shuffle className="w-3 h-3 text-green-600" />
                              </div>
                              Letar efter:
                            </div>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {wantedItems.slice(0, 2).map((item, idx) => (
                                <span 
                                  key={idx} 
                                  className="text-xs bg-white/80 backdrop-blur-sm hover:bg-white transition-colors duration-150 text-gray-700 px-2 py-1 rounded-full shadow-sm line-clamp-1 font-medium border border-white/50"
                                >
                                  {item}
                                </span>
                              ))}
                              {wantedItems.length > 2 && (
                                <span className="text-xs text-gray-600 font-medium bg-white/60 backdrop-blur-sm px-2 py-1 rounded-full">+{wantedItems.length - 2} till</span>
                              )}
                            </div>
                            
                            <a 
                              href={`/tradedetailpage/${trade.slug || trade.id}`}
                              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 px-3 rounded-xl transition-all duration-200 text-sm font-bold shadow-lg flex items-center justify-center transform hover:-translate-y-0.5 hover:shadow-xl"
                            >
                              Visa detaljer
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Side nav buttons - More transparent and hidden by default, visible on hover */}
                <button 
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-sm hover:bg-white/20 text-gray-800/50 hover:text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-white/20"
                  onClick={handlePrev}
                  disabled={animating}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/5 backdrop-blur-sm hover:bg-white/20 text-gray-800/50 hover:text-gray-900 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-white/20"
                  onClick={handleNext}
                  disabled={animating}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Pagination dots - Enhanced */}
              <div className="flex justify-center mt-4">
                {trades.map((_, index) => (
                  <button
                    key={index}
                    className={`mx-1 h-2 rounded-full transition-all duration-300 ${
                      currentIndex === index 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 w-6 shadow-md' 
                        : 'bg-gray-300 hover:bg-green-300 w-2'
                    }`}
                    onClick={() => {
                      if (!animating) {
                        setAnimating(true);
                        setCurrentIndex(index);
                        setTimeout(() => {
                          setAnimating(false);
                        }, 1000);
                      }
                    }}
                  />
                ))}
              </div>
              
              <div className="text-center mt-4">
                <a 
                  href="/tradelistingpage"
                  className="inline-flex items-center text-green-600 hover:text-green-500 text-sm font-bold bg-green-50/50 hover:bg-green-100/50 px-4 py-2 rounded-full transition-all duration-200 backdrop-blur-sm border border-green-200/50"
                >          
                  Visa alla tillgängliga annonser
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