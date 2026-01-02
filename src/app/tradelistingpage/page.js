'use client';

import { useState, useEffect } from 'react';
import { Package, MapPin, Calendar, ArrowRightLeft, Search, X, Filter, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Helper function
const formatDate = (dateString) => {
  if (!dateString) return 'Nyligen';
  const days = Math.ceil((new Date() - new Date(dateString)) / (1000 * 60 * 60 * 24));
  if (days <= 1) return 'Idag';
  if (days <= 7) return `${days}d sedan`;
  if (days <= 30) return `${Math.ceil(days / 7)}v sedan`;
  return new Date(dateString).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
};

// Trade Card Component
function TradeCard({ listing }) {
  const imageUrl = listing.images?.[0]?.url || listing.imageUrl;
  
  // Better handling of itemsWanted
  let wantedItemText = 'Alla erbjudanden';
  if (listing.itemsWanted && listing.itemsWanted.length > 0) {
    const firstItem = listing.itemsWanted[0];
    if (typeof firstItem === 'string' && firstItem.trim()) {
      wantedItemText = firstItem;
    } else if (firstItem?.description && firstItem.description.trim()) {
      wantedItemText = firstItem.description;
    } else if (firstItem?.title && firstItem.title.trim()) {
      wantedItemText = firstItem.title;
    }
  }

  // Debug log - remove this after checking
  console.log('Listing itemsWanted:', listing.title, listing.itemsWanted);

  return (
    <Link 
      href={`/tradedetailpage/${listing.slug || listing.id}`}
      className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border-2 border-transparent hover:border-green-400"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        {imageUrl ? (
          <div className="h-56 bg-gray-100 overflow-hidden">
            <Image 
              src={imageUrl} 
              alt={`Bytesannons: ${listing.title} - begagnat till byteshandel`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              width={400}
              height={300}
            />
          </div>
        ) : (
          <div className="h-56 bg-gradient-to-br from-green-100 via-emerald-100 to-green-200 flex items-center justify-center">
            <Package className="w-20 h-20 text-green-600 group-hover:scale-110 transition-transform duration-300" />
          </div>
        )}
        
        {/* Category badge */}
        {listing.category && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-700 shadow-lg">
            {listing.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-600 transition-colors">
          {listing.title || 'Namnlös annons'}
        </h3>
        
        {/* Meta info */}
        <div className="flex flex-wrap gap-2 mb-4 text-sm">
          <span className="flex items-center bg-green-50 px-3 py-1.5 rounded-full text-green-700 font-semibold border border-green-200">
            <MapPin className="w-3.5 h-3.5 mr-1.5" />
            {listing.location}
          </span>
          <span className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full text-gray-700 font-medium">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {formatDate(listing.created_at)}
          </span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {listing.description || 'Ingen beskrivning'}
        </p>

        {/* Wanted */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-200/50 group-hover:border-amber-300 transition-colors">
          <div className="flex items-center text-xs font-bold text-amber-700 mb-2">
            <ArrowRightLeft className="w-4 h-4 mr-1.5" />
            Vill byta mot:
          </div>
          <p className="text-amber-900 text-sm font-semibold">
            {wantedItemText}
          </p>
        </div>
      </div>
    </Link>
  );
}

// Main Component
export default function TradeListingsPage() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch listings
  useEffect(() => {
    fetch('/api/trades')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setListings(data.data.listings || []);
          setFilteredListings(data.data.listings || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filter listings
  useEffect(() => {
    let filtered = [...listings];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(l => 
        l.title?.toLowerCase().includes(search) ||
        l.description?.toLowerCase().includes(search) ||
        l.location?.toLowerCase().includes(search)
      );
    }

    if (selectedRegion !== 'all') {
      filtered = filtered.filter(l => l.location === selectedRegion);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(l => l.category === selectedCategory);
    }

    setFilteredListings(filtered);
  }, [listings, searchTerm, selectedRegion, selectedCategory]);

  // Get unique regions and categories
  const regions = ['all', ...new Set(listings.map(l => l.location).filter(Boolean))];
  const categories = ['all', ...new Set(listings.map(l => l.category).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-200 border-t-green-600 mx-auto mb-6 shadow-lg"></div>
          <p className="text-gray-700 font-semibold text-lg">Laddar bytesannonser...</p>
          <p className="text-gray-500 text-sm mt-2">Hämtar begagnade varor tillgängliga för byteshandel</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100/30">
      {/* Animated background shapes */}
      <div className="fixed top-20 right-10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{animationDelay: '1s'}}></div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b-2 border-green-200/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg md:text-xl font-extrabold bg-gradient-to-r from-gray-900 via-green-700 to-gray-900 bg-clip-text text-transparent mb-1">
                Bytesannonser Byt Begagnat Gratis
              </h1>
              <p className="text-sm text-gray-600 font-medium">Upptäck second hand prylar redo för byteshandel i hela Sverige</p>
            </div>
            
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden bg-green-600 hover:bg-green-700 text-white p-3 rounded-xl shadow-lg"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className={`w-full lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {/* Filter Header */}
            <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl shadow-xl border-2 border-green-300/50 p-6">
              <div className="flex items-center gap-3 mb-2">
                <Filter className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Filtrera Annonser</h2>
              </div>
              <p className="text-sm text-gray-600">Hitta rätt begagnad bytesannons</p>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200/50 p-5 hover:border-green-300 transition-colors">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Search className="w-4 h-4 text-green-600" />
                Sök i Bytesannonser
              </h3>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Sök prylar att byta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all font-medium"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Region Filter */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200/50 p-5 hover:border-green-300 transition-colors">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                Plats i Sverige
              </h3>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium bg-white cursor-pointer hover:border-green-300 transition-colors"
              >
                <option value="all">Alla städer & regioner</option>
                {regions.filter(r => r !== 'all').map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200/50 p-5 hover:border-green-300 transition-colors">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-green-600" />
                Kategori
              </h3>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 font-medium bg-white cursor-pointer hover:border-green-300 transition-colors"
              >
                <option value="all">Alla kategorier</option>
                {categories.filter(c => c !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(searchTerm || selectedRegion !== 'all' || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRegion('all');
                  setSelectedCategory('all');
                }}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <X className="w-5 h-5 inline mr-2" />
                Rensa alla filter
              </button>
            )}

            {/* Stats Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6" />
                <h3 className="font-bold text-lg">Aktivitet</h3>
              </div>
              <p className="text-3xl font-extrabold mb-1">{listings.length}</p>
              <p className="text-green-100 text-sm font-medium">Aktiva bytesannonser just nu</p>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Count */}
            <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl shadow-xl border-2 border-green-300/50 p-6 mb-8">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                      {filteredListings.length} {filteredListings.length === 1 ? 'Bytesannons' : 'Bytesannonser'}
                    </h2>
                    <p className="text-gray-600 font-medium">Begagnade varor redo för gratis byteshandel</p>
                  </div>
                </div>
                
                {(searchTerm || selectedRegion !== 'all' || selectedCategory !== 'all') && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-semibold">
                      Filtrerade resultat
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Listings Grid */}
            {filteredListings.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filteredListings.map(listing => (
                  <TradeCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">Inga bytesannonser hittades</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Vi kunde inte hitta några begagnade prylar som matchar dina filter. Prova att justera sökningen eller ta bort några filter.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedRegion('all');
                      setSelectedCategory('all');
                    }}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    <X className="w-5 h-5 inline mr-2" />
                    Visa alla bytesannonser
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}