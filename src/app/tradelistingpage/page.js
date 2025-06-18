'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Head from 'next/head';
import { ChevronRight, Package, X } from 'lucide-react';
import Link from 'next/link';
import TradeListingCard from '@/components/TradeListingCard';
import SearchAndFilterComponent from '@/components/SearchAndFilterComponent';
import { useSearchParams } from 'next/navigation';
import { ItemCategories } from '@/components/ItemCategories'; // Import the categories
import { swedishLandscapes } from '@/components/SwedishRegions'; // Import Swedish regions data

// Extract regions from Swedish data structure
const extractRegionsFromData = () => {
  const regions = [];
  
  // Add "All Regions" option
  regions.push({ id: 'all', name: 'Alla regioner', count: 0 });
  
  // Extract all cities from the swedishLandscapes structure
  Object.entries(swedishLandscapes).forEach(([landscape, regions_data]) => {
    Object.entries(regions_data).forEach(([region, cities]) => {
      cities.forEach(city => {
        // Avoid duplicates by checking if city already exists
        if (!regions.find(r => r.name === city)) {
          regions.push({
            id: normalizeString(city),
            name: city,
            originalName: city,
            landscape: landscape,
            region: region,
            count: 0
          });
        }
      });
    });
  });
  
  return regions.sort((a, b) => {
    if (a.id === 'all') return -1;
    if (b.id === 'all') return 1;
    return a.name.localeCompare(b.name);
  });
};

// Extract categories from ItemCategories structure
const extractCategoriesFromData = () => {
  const categories = [];
  
  // Add "All Categories" option
  categories.push({ id: 'all', name: 'Alla kategorier', count: 0 });
  
  // Extract all subcategories from ItemCategories
  ItemCategories.forEach(mainCategory => {
    if (mainCategory.subcategories && Array.isArray(mainCategory.subcategories)) {
      mainCategory.subcategories.forEach(subcategory => {
        categories.push({
          id: subcategory.value,
          name: subcategory.label,
          originalName: subcategory.label,
          icon: subcategory.emoji,
          mainCategory: mainCategory.label,
          count: 0
        });
      });
    }
  });
  
  return categories.sort((a, b) => {
    if (a.id === 'all') return -1;
    if (b.id === 'all') return 1;
    return a.name.localeCompare(b.name);
  });
};

// Utility functions
const normalizeString = (str) => {
  return str.toLowerCase().replace(/ä/g, 'a').replace(/ö/g, 'o').replace(/å/g, 'a');
};

// SEO Meta Tags Component
function SEOMetaTags() {
  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>Bytes annonser - Köp, Sälj & Byt begagnat i Sverige | Gratis annonsmarknad</title>
      <meta name="title" content="Bytes annonser - Köp, Sälj & Byt begagnat i Sverige | Gratis annonsmarknad" />
      <meta name="description" content="Sveriges ledande bytesplattform! Köp, sälj och byt begagnade prylar, elektronik, mode och mer. Gratis annonser över hela Sverige. Upptäck fantastiska fynd idag!" />
      <meta name="keywords" content="bytes, byt, köp, sälj, begagnat, second hand, prylar, annonser, sverige, byteshandel, marketplace, trade, exchange, gratis annonser, loppis, cirkulär ekonomi, hållbart, återvinning" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://swapdeals.se/trades" />
      <meta property="og:title" content="Bytes annonser - Köp, Sälj & Byt begagnat i Sverige" />
      <meta property="og:description" content="Sveriges ledande bytesplattform! Köp, sälj och byt begagnade prylar, elektronik, mode och mer. Gratis annonser över hela Sverige." />
      <meta property="og:image" content="https://swapdeals.se/og-image.jpg" />
      <meta property="og:image:alt" content="Bytes annonser - Svensk bytesplattform" />
      <meta property="og:site_name" content="SwapDeals" />
      <meta property="og:locale" content="sv_SE" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://swapdeals.se/trades" />
      <meta property="twitter:title" content="Bytes annonser - Köp, Sälj & Byt begagnat i Sverige" />
      <meta property="twitter:description" content="Sveriges ledande bytesplattform! Köp, sälj och byt begagnade prylar, elektronik, mode och mer. Gratis annonser över hela Sverige." />
      <meta property="twitter:image" content="https://swapdeals.se/twitter-image.jpg" />
      <meta property="twitter:image:alt" content="Bytes annonser - Svensk bytesplattform" />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Swedish" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="SwapDeals" />
      <meta name="copyright" content="SwapDeals" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* Geo Meta Tags */}
      <meta name="geo.region" content="SE" />
      <meta name="geo.country" content="Sweden" />
      <meta name="geo.placename" content="Sverige" />
      <meta name="ICBM" content="62.0,15.0" />

      {/* Canonical URL */}
      <link rel="canonical" href="https://swapdeals.se/trades" />

      {/* Alternate Languages */}
      <link rel="alternate" hreflang="sv-SE" href="https://swapdeals.se/trades" />
      <link rel="alternate" hreflang="en-SE" href="https://swapdeals.se/en/trades" />

      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="format-detection" content="telephone=no" />

      {/* Performance Hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />

      {/* Favicons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Theme Color */}
      <meta name="theme-color" content="#16a34a" />
      <meta name="msapplication-TileColor" content="#16a34a" />

      {/* Additional Meta Tags for Better Indexing */}
      <meta name="classification" content="Marketplace, Handel, Bytes" />
      <meta name="category" content="E-commerce, Second Hand, Sustainability" />
      <meta name="coverage" content="Worldwide" />
      <meta name="target" content="Swedish consumers, Sustainable shoppers, Bargain hunters" />
      <meta name="HandheldFriendly" content="True" />
      <meta name="MobileOptimized" content="320" />

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SwapDeals",
            "alternateName": "Bytes annonser",
            "description": "Sveriges ledande bytesplattform för köp, sälj och bytes av begagnade produkter",
            "url": "https://swapdeals.se",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://swapdeals.se/trades?search={search_term_string}",
              "query-input": "required name=search_term_string"
            },
            "publisher": {
              "@type": "Organization",
              "name": "SwapDeals",
              "logo": {
                "@type": "ImageObject",
                "url": "https://swapdeals.se/logo.png"
              }
            },
            "inLanguage": "sv-SE",
            "audience": {
              "@type": "Audience",
              "geographicArea": {
                "@type": "Country",
                "name": "Sweden"
              }
            }
          })
        }}
      />

      {/* Local Business Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "SwapDeals",
            "description": "Gratis bytesplattform för köp, sälj och bytes av begagnade produkter i Sverige",
            "url": "https://swapdeals.se",
            "telephone": "+46-XXX-XXX-XX",
            "email": "info@swapdeals.se",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "SE",
              "addressLocality": "Sverige"
            },
            "openingHours": "Mo-Su 00:00-23:59",
            "priceRange": "Gratis",
            "paymentAccepted": "Bytes, Kontant",
            "currenciesAccepted": "SEK"
          })
        }}
      />

      {/* Marketplace Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "SwapDeals Marketplace",
            "description": "Online marketplace för byteshandel i Sverige",
            "brand": {
              "@type": "Brand",
              "name": "SwapDeals"
            },
            "category": "Marketplace",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "SEK",
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "SwapDeals"
              }
            }
          })
        }}
      />
    </Head>
  );
}

// Main component that uses useSearchParams
function TradeListingsContent() {
  const searchParams = useSearchParams();
  
  // State management
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredResults, setFilteredResults] = useState({
    filteredListings: [],
    filters: {
      searchTerm: '',
      selectedRegion: 'all',
      selectedCategory: 'all'
    },
    activeFiltersCount: 0
  });
  const [swedishRegions, setSwedishRegions] = useState(extractRegionsFromData());
  const [categoriesData, setCategoriesData] = useState(extractCategoriesFromData());

  // Initialize filters from URL parameters
  const getInitialFilters = () => {
    const categoryParam = searchParams.get('category');
    const locationParam = searchParams.get('location');
    
    let selectedCategory = 'all';
    let selectedRegion = 'all';
    
    if (categoryParam) {
      const matchingCategory = categoriesData.find(cat => 
        cat.originalName === categoryParam || 
        cat.name === categoryParam ||
        cat.id === categoryParam.toLowerCase()
      );
      
      if (matchingCategory) {
        selectedCategory = matchingCategory.id;
      }
    }
    
    if (locationParam) {
      const matchingRegion = swedishRegions.find(region => 
        region.originalName === locationParam || 
        region.name === locationParam ||
        region.id === normalizeString(locationParam)
      );
      
      if (matchingRegion) {
        selectedRegion = matchingRegion.id;
      }
    }
    
    return {
      searchTerm: '',
      selectedRegion,
      selectedCategory
    };
  };

  // API functions
  const fetchAllListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/trades');
      
      if (!response.ok) {
        throw new Error('Misslyckades att hämta annonser');
      }
      
      const data = await response.json();
      
      if (data.success) {
        const fetchedListings = data.data.listings || [];
        setListings(fetchedListings);
      } else {
        throw new Error(data.message || 'Misslyckades att hämta annonser');
      }
    } catch (err) {
      setError(err.message);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Load listings on mount
  useEffect(() => {
    fetchAllListings();
  }, []);

  // Update counts based on current listings
  useEffect(() => {
    if (listings && listings.length > 0) {
      // Update regions counts
      const newRegions = swedishRegions.map(region => {
        if (region.id === 'all') {
          return { ...region, count: listings.length };
        } else {
          const count = listings.filter(listing => {
            return listing.location === region.originalName || 
                   listing.location === region.name ||
                   listing.location?.toLowerCase() === region.name.toLowerCase();
          }).length;
          return { ...region, count };
        }
      });
      setSwedishRegions(newRegions);

      // Update categories counts
      const newCategories = categoriesData.map(category => {
        if (category.id === 'all') {
          return { ...category, count: listings.length };
        } else {
          const count = listings.filter(listing => {
            return listing.category === category.originalName ||
                   listing.category === category.name ||
                   listing.category?.toLowerCase() === category.id ||
                   listing.category?.toLowerCase() === category.name.toLowerCase();
          }).length;
          return { ...category, count };
        }
      });
      setCategoriesData(newCategories);
    } else {
      setSwedishRegions(prev => prev.map(region => ({ ...region, count: 0 })));
      setCategoriesData(prev => prev.map(category => ({ ...category, count: 0 })));
    }
  }, [listings]);

  // Handle filtered results from SearchAndFilterComponent
  const handleFilteredResults = (results) => {
    setFilteredResults(results);
  };

  // Get filter display text
  const getFilterDisplayText = () => {
    const { filters } = filteredResults;
    const parts = [];
    
    if (filters.searchTerm) {
      parts.push(`"${filters.searchTerm}"`);
    }
    
    if (filters.selectedRegion !== 'all') {
      const region = swedishRegions.find(r => r.id === filters.selectedRegion);
      if (region) parts.push(region.name);
    }
    
    if (filters.selectedCategory !== 'all') {
      const category = categoriesData.find(c => c.id === filters.selectedCategory);
      if (category) parts.push(category.name);
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'Alla annonser';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-green-200 border-t-green-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Laddar annonser...</p>
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
      <SEOMetaTags />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30 relative overflow-hidden">
        {/* Premium background effects */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-40 left-20 w-96 h-96 bg-green-200/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-40 right-20 w-80 h-80 bg-emerald-200/15 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-green-100/5 to-emerald-100/5 rounded-full blur-3xl"></div>
        </div>

        {/* Enhanced Header */}
        <header className="bg-white/90 backdrop-blur-lg shadow-xl border-b border-green-200/30 sticky top-0 z-40 relative">
          {/* Premium light effect overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-sm"></div>
                </div>
                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent">
                    SwapDeals
                  </h1>
                  <p className="text-sm text-gray-500 font-medium -mt-1">Upptäck fantastiska fynd</p>
                </div>
                
                <div className="hidden md:flex items-center">
                  <ChevronRight className="w-5 h-5 text-green-400 mx-2" />
                  <div className="bg-green-100/50 px-4 py-2 rounded-full border border-green-200/50">
                    <span className="text-green-700 font-medium text-sm">Bläddra efter region & kategori</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* SearchAndFilterComponent */}
            <div className="lg:w-80">
              <SearchAndFilterComponent
                listings={listings}
                regions={swedishRegions}
                categories={categoriesData}
                onFilteredResults={handleFilteredResults}
                initialFilters={getInitialFilters()}
              />
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Error Display */}
              {error && (
                <div className="bg-red-50/80 backdrop-blur-lg border border-red-200/50 rounded-2xl p-6 mb-6 shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="bg-red-100 rounded-full p-2">
                      <span className="text-red-600 text-lg">⚠️</span>
                    </div>
                    <div>
                      <p className="text-red-700 font-medium">Oj! Något gick fel</p>
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  </div>
                  <button 
                    onClick={fetchAllListings} 
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md"
                  >
                    Försök igen
                  </button>
                </div>
              )}

              {/* Enhanced Results Header */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-green-200/30">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-3">
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {filteredResults.filteredListings.length} {filteredResults.filteredListings.length === 1 ? 'Annons' : 'Annonser'}
                      </h2>
                      <p className="text-green-600 font-medium">Redo för bud</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-50/80 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200/50">
                      <div className="flex items-center space-x-2 text-sm text-green-700">
                        <span className="font-medium">
                          {getFilterDisplayText()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Listings Grid */}
              <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                {filteredResults.filteredListings.map(listing => (
                  <TradeListingCard 
                    key={listing.id || Math.random().toString(36).substr(2, 9)} 
                    listing={listing} 
                  />
                ))}
              </div>

              {/* Enhanced No Results */}
              {filteredResults.filteredListings.length === 0 && !loading && (
                <div className="text-center py-16">
                  <div className="relative mb-8">
                    <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full w-32 h-32 mx-auto flex items-center justify-center shadow-xl">
                      <Package className="w-16 h-16 text-green-600" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg">?</span>
                    </div>
                  </div>
                  
                  <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-green-200/30 max-w-md mx-auto">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Inga annonser hittades</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      Vi kunde inte hitta några annonser som matchar dina kriterier. Prova att justera dina filter eller söktermer för att upptäcka fantastiska erbjudanden.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button 
                        onClick={fetchAllListings}
                        className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-800 px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300 transform hover:-translate-y-1 transition-all duration-200"
                      >
                        <span className="text-lg">🔄</span>
                        <span>Uppdatera</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50/30 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-4 border-green-200 border-t-green-600 mx-auto"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Package className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        <p className="mt-6 text-gray-600 font-medium">Laddar sidan...</p>
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

// Main exported component with Suspense boundary
export default function TradeListingsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <TradeListingsContent />
    </Suspense>
  );
}