
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Compass, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';

export default function PopularTradeCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Swedish category styling map based on your ItemCategories
  const categoryStyles = {
    'hem': { 
      icon: '🏠',
      bgColor: 'from-slate-50/80 to-slate-100/80',
      accentColor: 'slate',
      subcategories: ['Inredning', 'Städning', 'Organisation', 'Underhåll', 'Säkerhet']
    },
    'mobler': { 
      icon: '🪑',
      bgColor: 'from-orange-50/80 to-orange-100/80',
      accentColor: 'orange',
      subcategories: ['Soffor', 'Bord', 'Stolar', 'Sängar', 'Förvaring']
    },
    'tradgard': { 
      icon: '🌱',
      bgColor: 'from-emerald-50/80 to-emerald-100/80',
      accentColor: 'emerald',
      subcategories: ['Växter', 'Frön', 'Verktyg', 'Krukor', 'Gödning']
    },
    'verktyg': { 
      icon: '🔧',
      bgColor: 'from-yellow-50/80 to-yellow-100/80',
      accentColor: 'yellow',
      subcategories: ['Handverktyg', 'Elverktyg', 'Hårdvara', 'Säkerhet', 'Förvaring']
    },
    'mode': { 
      icon: '👕',
      bgColor: 'from-purple-50/80 to-purple-100/80',
      accentColor: 'purple',
      subcategories: ['Skjortor', 'Byxor', 'Skor', 'Jackor', 'Accessoarer']
    },
    'skonhet': { 
      icon: '💄',
      bgColor: 'from-rose-50/80 to-rose-100/80',
      accentColor: 'rose',
      subcategories: ['Smink', 'Hudvård', 'Parfym', 'Hårvård', 'Verktyg']
    },
    'vintage': { 
      icon: '🕰️',
      bgColor: 'from-amber-50/80 to-amber-100/80',
      accentColor: 'amber',
      subcategories: ['Kläder', 'Möbler', 'Elektronik', 'Samlarobjekt', 'Inredning']
    },
    'teknik': { 
      icon: '📱',
      bgColor: 'from-cyan-50/80 to-cyan-100/80',
      accentColor: 'cyan',
      subcategories: ['Smartphones', 'Datorer', 'Programvara', 'Prylar', 'Smart Hem']
    },
    'fotografering': { 
      icon: '📷',
      bgColor: 'from-indigo-50/80 to-indigo-100/80',
      accentColor: 'indigo',
      subcategories: ['Kameror', 'Objektiv', 'Stativ', 'Belysning', 'Tillbehör']
    },
    'elektronik': { 
      icon: '🔌',
      bgColor: 'from-cyan-50/80 to-cyan-100/80',
      accentColor: 'cyan',
      subcategories: ['Smartphones', 'Laptops', 'Surfplattor', 'Komponenter', 'Tillbehör']
    },
    'spel': { 
      icon: '🎮',
      bgColor: 'from-violet-50/80 to-violet-100/80',
      accentColor: 'violet',
      subcategories: ['Konsoler', 'Spel', 'Tillbehör', 'PC Gaming', 'Samlarobjekt']
    },
    'musik': { 
      icon: '🎵',
      bgColor: 'from-purple-50/80 to-purple-100/80',
      accentColor: 'purple',
      subcategories: ['Instrument', 'Ljud', 'Skivor', 'Noter', 'Tillbehör']
    },
    'bocker': { 
      icon: '📚',
      bgColor: 'from-orange-50/80 to-orange-100/80',
      accentColor: 'orange',
      subcategories: ['Skönlitteratur', 'Facklitteratur', 'Läroböcker', 'Serier', 'Tidningar']
    },
    'konst': { 
      icon: '🎨',
      bgColor: 'from-pink-50/80 to-pink-100/80',
      accentColor: 'pink',
      subcategories: ['Målningar', 'Skulpturer', 'Digital Konst', 'Fotografier', 'Tryck']
    },
    'hantverk': { 
      icon: '✂️',
      bgColor: 'from-teal-50/80 to-teal-100/80',
      accentColor: 'teal',
      subcategories: ['Stickning', 'Sy', 'Pysssel', 'Material', 'Verktyg']
    },
    'pussel': { 
      icon: '🧩',
      bgColor: 'from-indigo-50/80 to-indigo-100/80',
      accentColor: 'indigo',
      subcategories: ['Pussel', 'Brädspel', 'Kortspel', 'Familj', 'Vuxen']
    },
    'filmer': { 
      icon: '🎬',
      bgColor: 'from-purple-50/80 to-purple-100/80',
      accentColor: 'purple',
      subcategories: ['DVD', 'Blu-ray', 'Streaming', 'Klassiker', 'Dokumentärer']
    },
    'sport': { 
      icon: '🚲',
      bgColor: 'from-blue-50/80 to-blue-100/80',
      accentColor: 'blue',
      subcategories: ['Fitness', 'Utomhus', 'Lagsport', 'Individuella', 'Utrustning']
    },
    'utomhus': { 
      icon: '🏕️',
      bgColor: 'from-green-50/80 to-green-100/80',
      accentColor: 'green',
      subcategories: ['Camping', 'Vandring', 'Fiske', 'Jakt', 'Utrustning']
    },
    'cykling': { 
      icon: '🚴',
      bgColor: 'from-blue-50/80 to-blue-100/80',
      accentColor: 'blue',
      subcategories: ['Cyklar', 'Hjälmar', 'Kläder', 'Reservdelar', 'Tillbehör']
    },
    'fiske': { 
      icon: '🎣',
      bgColor: 'from-blue-50/80 to-blue-100/80',
      accentColor: 'blue',
      subcategories: ['Spön', 'Rullar', 'Beten', 'Utrustning', 'Kläder']
    },
    'traning': { 
      icon: '💪',
      bgColor: 'from-red-50/80 to-red-100/80',
      accentColor: 'red',
      subcategories: ['Hemmagym', 'Vikter', 'Maskiner', 'Kläder', 'Tillbehör']
    },
    'leksaker': { 
      icon: '🧸',
      bgColor: 'from-pink-50/80 to-pink-100/80',
      accentColor: 'pink',
      subcategories: ['Figurer', 'Dockor', 'Byggset', 'Pedagogiska', 'Utomhus']
    },
    'barnklader': { 
      icon: '👕',
      bgColor: 'from-purple-50/80 to-purple-100/80',
      accentColor: 'purple',
      subcategories: ['Baby', 'Småbarn', 'Skolbarn', 'Tonår', 'Skor']
    },
    'barnvagnar': { 
      icon: '🍼',
      bgColor: 'from-amber-50/80 to-amber-100/80',
      accentColor: 'amber',
      subcategories: ['Barnvagnar', 'Bilstolar', 'Matning', 'Säkerhet', 'Leksaker']
    },
    'fordon': { 
      icon: '🚗',
      bgColor: 'from-slate-50/80 to-slate-100/80',
      accentColor: 'slate',
      subcategories: ['Bildelar', 'Motorcyklar', 'Verktyg', 'Tillbehör', 'Underhåll']
    },
    'transport': { 
      icon: '🚚',
      bgColor: 'from-gray-50/80 to-gray-100/80',
      accentColor: 'gray',
      subcategories: ['Frakt', 'Flytt', 'Lastbilar', 'Släpvagnar', 'Utrustning']
    },
    'halsa': { 
      icon: '💊',
      bgColor: 'from-teal-50/80 to-teal-100/80',
      accentColor: 'teal',
      subcategories: ['Kosttillskott', 'Utrustning', 'Mätare', 'Första hjälpen', 'Välmående']
    },
    'mat': { 
      icon: '🍎',
      bgColor: 'from-green-50/80 to-green-100/80',
      accentColor: 'green',
      subcategories: ['Färsk', 'Paketerad', 'Drycker', 'Snacks', 'Specialkost']
    },
    'husdjur': { 
      icon: '🐕',
      bgColor: 'from-amber-50/80 to-amber-100/80',
      accentColor: 'amber',
      subcategories: ['Mat', 'Leksaker', 'Tillbehör', 'Hälsovård', 'Träning']
    },
    'samlarobjekt': { 
      icon: '💎',
      bgColor: 'from-indigo-50/80 to-indigo-100/80',
      accentColor: 'indigo',
      subcategories: ['Mynt', 'Frimärken', 'Kort', 'Antik', 'Memorabilia']
    },
    'antik': { 
      icon: '🏺',
      bgColor: 'from-amber-50/80 to-amber-100/80',
      accentColor: 'amber',
      subcategories: ['Möbler', 'Konst', 'Smycken', 'Porslin', 'Textil']
    },
    'resor': { 
      icon: '✈️',
      bgColor: 'from-sky-50/80 to-sky-100/80',
      accentColor: 'sky',
      subcategories: ['Väskor', 'Tillbehör', 'Guider', 'Utrustning', 'Elektronik']
    },
    'kurser': { 
      icon: '🎓',
      bgColor: 'from-blue-50/80 to-blue-100/80',
      accentColor: 'blue',
      subcategories: ['Läroböcker', 'Material', 'Programvara', 'Kurser', 'Utbildning']
    },
    'sprak': { 
      icon: '🗣️',
      bgColor: 'from-green-50/80 to-green-100/80',
      accentColor: 'green',
      subcategories: ['Böcker', 'Ljud', 'Programvara', 'Ordböcker', 'Kurser']
    },
    'undervisning': { 
      icon: '👩‍🏫',
      bgColor: 'from-blue-50/80 to-blue-100/80',
      accentColor: 'blue',
      subcategories: ['Matematik', 'Språk', 'Musik', 'Sport', 'Hantverk']
    },
    'reparationer': { 
      icon: '🔧',
      bgColor: 'from-yellow-50/80 to-yellow-100/80',
      accentColor: 'yellow',
      subcategories: ['Elektronik', 'Möbler', 'Kläder', 'Skor', 'Smycken']
    },
    'stadning': { 
      icon: '🧽',
      bgColor: 'from-blue-50/80 to-blue-100/80',
      accentColor: 'blue',
      subcategories: ['Hem', 'Kontor', 'Fönster', 'Trädgård', 'Specialrengöring']
    },
    'vinter': { 
      icon: '❄️',
      bgColor: 'from-cyan-50/80 to-cyan-100/80',
      accentColor: 'cyan',
      subcategories: ['Kläder', 'Sport', 'Utrustning', 'Inredning', 'Värmesystem']
    },
    'sommar': { 
      icon: '☀️',
      bgColor: 'from-yellow-50/80 to-yellow-100/80',
      accentColor: 'yellow',
      subcategories: ['Badkläder', 'Utomhus', 'Festival', 'Trädgård', 'Semester']
    },
    'jul': { 
      icon: '🎄',
      bgColor: 'from-green-50/80 to-green-100/80',
      accentColor: 'green',
      subcategories: ['Julklappar', 'Dekoration', 'Mat', 'Kläder', 'Traditioner']
    },
    'fest': { 
      icon: '🎉',
      bgColor: 'from-purple-50/80 to-purple-100/80',
      accentColor: 'purple',
      subcategories: ['Dekoration', 'Kläder', 'Mat', 'Musik', 'Aktiviteter']
    },
    'brollop': { 
      icon: '💒',
      bgColor: 'from-pink-50/80 to-pink-100/80',
      accentColor: 'pink',
      subcategories: ['Klänningar', 'Kostymer', 'Dekoration', 'Smycken', 'Tillbehör']
    },
    'handgjort': { 
      icon: '🤲',
      bgColor: 'from-orange-50/80 to-orange-100/80',
      accentColor: 'orange',
      subcategories: ['Konst', 'Smycken', 'Textil', 'Träarbete', 'Keramik']
    },
    'lokalproducerat': { 
      icon: '🌾',
      bgColor: 'from-green-50/80 to-green-100/80',
      accentColor: 'green',
      subcategories: ['Mat', 'Hantverk', 'Konst', 'Musik', 'Tjänster']
    },
    'miljovanligt': { 
      icon: '♻️',
      bgColor: 'from-emerald-50/80 to-emerald-100/80',
      accentColor: 'emerald',
      subcategories: ['Återvinning', 'Ekologisk', 'Hållbar', 'Energispar', 'Naturlig']
    },
    'annat': { 
      icon: '📦',
      bgColor: 'from-gray-50/80 to-gray-100/80',
      accentColor: 'gray',
      subcategories: ['Diverse', 'Unika föremål', 'Specialprodukter', 'Övrigt', 'Blandat']
    }
  };

  // Default fallback for unknown categories
  const defaultCategoryStyle = {
    icon: '📦',
    bgColor: 'from-gray-50/80 to-gray-100/80',
    accentColor: 'gray',
    subcategories: []
  };

  useEffect(() => {
    fetchPopularCategories();
  }, []);

  const fetchPopularCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Frontend: Hämtar populära kategorier...');
      
      const response = await fetch('/api/categories/popular?limit=4&days=30');
      
      console.log('Frontend: Svarsstatus:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Frontend: Mottagen data:', data);
      
      if (!data.success) {
        throw new Error(data.message || 'API returnerade misslyckat svar');
      }
      
      if (!data.data || !Array.isArray(data.data.categories)) {
        throw new Error('Ogiltig datastruktur mottagen från API');
      }
      
      // Process categories from API
      const processedCategories = data.data.categories.map(apiCat => {
        const categoryKey = apiCat.name.toLowerCase();
        const style = categoryStyles[categoryKey] || defaultCategoryStyle;
        
        return {
          name: apiCat.name,
          totalViews: parseInt(apiCat.totalViews) || 0,
          listingCount: parseInt(apiCat.listingCount) || 0,
          uniqueSellers: parseInt(apiCat.uniqueSellers) || 0,
          avgViews: parseFloat(apiCat.avgViews) || 0,
          icon: style.icon,
          bgColor: style.bgColor,
          accentColor: style.accentColor,
          subcategories: style.subcategories
        };
      });
      
      // Sort by popularity (totalViews)
      processedCategories.sort((a, b) => b.totalViews - a.totalViews);
      
      // If we have less than 4 categories, fill with popular fallback categories
      if (processedCategories.length < 4) {
        const fallbackCategories = [
          { name: 'Elektronik', ...categoryStyles['elektronik'] },
          { name: 'Mode', ...categoryStyles['mode'] },
          { name: 'Möbler', ...categoryStyles['mobler'] },
          { name: 'Spel', ...categoryStyles['spel'] }
        ].filter(fallback => 
          !processedCategories.some(cat => 
            cat.name.toLowerCase() === fallback.name.toLowerCase()
          )
        );
        
        const needed = 4 - processedCategories.length;
        processedCategories.push(...fallbackCategories.slice(0, needed).map(cat => ({
          ...cat,
          totalViews: 0,
          listingCount: 0,
          uniqueSellers: 0,
          avgViews: 0
        })));
      }
      
      setCategories(processedCategories.slice(0, 4));
      
    } catch (err) {
      console.error('Fel vid hämtning av populära kategorier:', err);
      setError(err.message);
      
      // Use fallback categories if API fails
      const fallbackCategories = [
        { name: 'Elektronik', ...categoryStyles['elektronik'] },
        { name: 'Mode', ...categoryStyles['mode'] },
        { name: 'Möbler', ...categoryStyles['mobler'] },
        { name: 'Spel', ...categoryStyles['spel'] }
      ].map(cat => ({
        ...cat,
        totalViews: 0,
        listingCount: 0,
        uniqueSellers: 0,
        avgViews: 0
      }));
      
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryName) => {
    router.push(`/tradelistingpage?category=${encodeURIComponent(categoryName)}`);
  };

  const handleSubcategoryClick = (categoryName, subcategoryName) => {
    router.push(`/tradelistingpage?category=${encodeURIComponent(categoryName)}`);
  };

  if (loading) {
    return (
      <section className="py-8 relative">
        {/* Premium background with green tint similar to navbar */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent mb-2">
              Populära handelskategorier
            </h2>
            <p className="text-gray-600 font-medium">Upptäck trendiga varor på vår marknadsplats</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 animate-pulse border border-green-200/30 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mr-3"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-300 rounded-lg w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded-lg w-full"></div>
                  <div className="h-4 bg-gray-300 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded-lg w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 relative">
      {/* Premium background with green tint similar to navbar */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent mb-2">
            Populära handelskategorier
          </h2>
          <p className="text-gray-600 font-medium">Upptäck trendiga varor på vår marknadsplats</p>
          {!error && categories.some(cat => cat.totalViews > 0) && (
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-green-600 bg-green-50/50 rounded-full px-4 py-2 border border-green-200/50 inline-flex">
              <TrendingUp className="w-4 h-4" />
              Baserat på aktivitet de senaste 30 dagarna
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div 
              key={category.name}
              className={`bg-white/90 backdrop-blur-lg rounded-2xl hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2 border border-green-200/30 shadow-lg cursor-pointer relative`}
              onClick={() => handleCategoryClick(category.name)}
            >
              {/* Premium light effect overlay with green tint */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
              
              {/* Popularity indicator for top category */}
              {index === 0 && !error && category.totalViews > 0 && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg z-20 flex items-center gap-1">
                  <span className="text-xs">🏆</span>
                  #1 Populär
                </div>
              )}
              
              <div className="p-6 relative h-full flex flex-col">
                <div className="flex items-center mb-6 relative z-10">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl mr-4 group-hover:from-green-200 group-hover:to-green-300 transition-all duration-300 shadow-md">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800 capitalize group-hover:text-green-800 transition-colors duration-200">{category.name}</h3>
                    {category.totalViews > 0 && (
                      <p className="text-sm text-gray-600 font-medium">
                        {category.totalViews.toLocaleString()} visningar • {category.listingCount} annonser
                      </p>
                    )}
                    {category.uniqueSellers > 0 && (
                      <p className="text-xs text-green-600 font-medium">
                        {category.uniqueSellers} aktiva säljare
                      </p>
                    )}
                  </div>
                </div>
                
                {category.subcategories && category.subcategories.length > 0 && (
                  <ul className="space-y-2.5 text-sm relative z-10 mb-6 flex-grow">
                    {category.subcategories.slice(0, 4).map((subcategory) => (
                      <li key={subcategory}>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubcategoryClick(category.name, subcategory);
                          }}
                          className="text-gray-700 hover:text-green-600 transition-all duration-200 flex items-center w-full text-left group/item hover:bg-green-50/80 rounded-lg px-2 py-1.5"
                        >
                          <ChevronDown className="w-3 h-3 mr-2 text-green-500 transform -rotate-90 flex-shrink-0 group-hover/item:text-green-600" />
                          <span className="truncate font-medium">{subcategory}</span>
                        </button>
                      </li>
                    ))}
                   
                  </ul>
                )}
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryClick(category.name);
                  }}
                  className="inline-flex items-center text-green-600 hover:text-green-500 font-medium text-sm transition-all duration-200 relative z-10 hover:bg-green-50/80 rounded-lg px-3 py-2 -mx-1 group/btn mt-auto"
                >
                  <Compass className="w-4 h-4 mr-2 flex-shrink-0 group-hover/btn:scale-110 transition-transform duration-200" />
                  <span className="truncate">Se alla {category.name.toLowerCase()}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {error && (
          <div className="mt-6 p-4 bg-white/90 backdrop-blur-lg border border-amber-200/50 rounded-2xl flex items-center gap-3 shadow-lg">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">
                Using fallback categories
              </p>
              <p className="text-xs text-amber-600">
                API Error: {error}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}