import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Search, X, Filter, MapPin, Tag, Package } from 'lucide-react';

const SearchAndFilterComponent = ({
  listings = [],
  regions = [],
  categories = [],
  onFilteredResults,
  initialFilters = {
    searchTerm: '',
    selectedRegion: 'all',
    selectedCategory: 'all'
  }
}) => {
  // State management
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm || '');
  const [selectedRegion, setSelectedRegion] = useState(initialFilters.selectedRegion || 'all');
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.selectedCategory || 'all');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  // Use ref to store the latest onFilteredResults callback
  const onFilteredResultsRef = useRef(onFilteredResults);
  
  // Update ref when callback changes
  useEffect(() => {
    onFilteredResultsRef.current = onFilteredResults;
  }, [onFilteredResults]);

  // Deduplicate regions to fix the key error
  const uniqueRegions = useMemo(() => {
    const regionMap = new Map();
    regions.forEach(region => {
      if (!regionMap.has(region.id)) {
        regionMap.set(region.id, region);
      } else {
        // If duplicate found, merge counts
        const existing = regionMap.get(region.id);
        existing.count = (existing.count || 0) + (region.count || 0);
      }
    });
    return Array.from(regionMap.values());
  }, [regions]);

  // Deduplicate categories as well (preventive measure)
  const uniqueCategories = useMemo(() => {
    const categoryMap = new Map();
    categories.forEach(category => {
      if (!categoryMap.has(category.id)) {
        categoryMap.set(category.id, category);
      } else {
        // If duplicate found, merge counts
        const existing = categoryMap.get(category.id);
        existing.count = (existing.count || 0) + (category.count || 0);
      }
    });
    return Array.from(categoryMap.values());
  }, [categories]);

  // Debounce search term to avoid excessive filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filtering logic
  const getFilteredResults = useCallback(() => {
    let filteredListings = [...listings];
    
    // Apply search term filtering
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase().trim();
      filteredListings = filteredListings.filter(listing => {
        return listing.title?.toLowerCase().includes(searchLower) ||
               listing.description?.toLowerCase().includes(searchLower) ||
               listing.location?.toLowerCase().includes(searchLower) ||
               listing.category?.toLowerCase().includes(searchLower) ||
               listing.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
               listing.wantedItems?.some(item => item.toLowerCase().includes(searchLower));
      });
    }
    
    // Apply region filter
    if (selectedRegion !== 'all') {
      const selectedRegionData = uniqueRegions.find(r => r.id === selectedRegion);
      if (selectedRegionData) {
        filteredListings = filteredListings.filter(listing => 
          listing.location === selectedRegionData.originalName ||
          listing.location === selectedRegionData.name ||
          listing.location?.toLowerCase() === selectedRegionData.name.toLowerCase()
        );
      }
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      const selectedCategoryData = uniqueCategories.find(c => c.id === selectedCategory);
      if (selectedCategoryData) {
        filteredListings = filteredListings.filter(listing => 
          listing.category === selectedCategoryData.originalName ||
          listing.category === selectedCategoryData.name ||
          listing.category?.toLowerCase() === selectedCategory
        );
      }
    }
    
    return filteredListings;
  }, [listings, debouncedSearchTerm, selectedRegion, selectedCategory, uniqueRegions, uniqueCategories]);

  // Update parent component with filtered results whenever filters change
  useEffect(() => {
    const filteredResults = getFilteredResults();
    const filterData = {
      filteredListings: filteredResults,
      filters: {
        searchTerm: debouncedSearchTerm,
        selectedRegion,
        selectedCategory
      },
      activeFiltersCount: [
        debouncedSearchTerm.trim() !== '',
        selectedRegion !== 'all',
        selectedCategory !== 'all'
      ].filter(Boolean).length
    };
    
    // Use the ref to call the callback to avoid dependency issues
    onFilteredResultsRef.current(filterData);
  }, [getFilteredResults, debouncedSearchTerm, selectedRegion, selectedCategory]);

  // Event handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRegionChange = (regionId) => {
    setSelectedRegion(regionId);
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSelectedRegion('all');
    setSelectedCategory('all');
  };

  const hasActiveFilters = debouncedSearchTerm.trim() !== '' || selectedRegion !== 'all' || selectedCategory !== 'all';

  return (
    <div className="space-y-6">
      {/* Enhanced Search Bar */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-green-200/30 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center mb-4">
          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-2.5 mr-3">
            <Search className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Sök</h3>
            <p className="text-xs text-gray-500">Hitta specifika föremål</p>
          </div>
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Sök titel, plats, kategori..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-4 py-3 pl-12 pr-12 bg-white/80 backdrop-blur-sm border border-green-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 shadow-lg transition-all duration-200 text-gray-700 placeholder-gray-500"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-1">
              <Search className="w-4 h-4 text-green-600" />
            </div>
          </div>
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {/* Search suggestions/hints */}
        {searchTerm.length > 0 && searchTerm.length < 3 && (
          <div className="mt-2 text-xs text-gray-500">
            Fortsätt skriva för att söka... (minst 3 tecken rekommenderas)
          </div>
        )}
      </div>

      {/* Region Filter */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-green-200/30 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-2.5 mr-3">
            <MapPin className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Plats</h3>
            <p className="text-xs text-gray-500">Filtrera efter region</p>
          </div>
        </div>
        
        <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
          {uniqueRegions.map(region => (
            <button
              key={region.id}
              onClick={() => handleRegionChange(region.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                selectedRegion === region.id
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105'
                  : 'hover:bg-green-50/80 text-gray-700 hover:text-green-800 border border-transparent hover:border-green-200/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className={`mr-3 text-lg ${selectedRegion === region.id ? '' : 'opacity-70'}`}>
                    {region.id === 'all' ? '🌍' : '📍'}
                  </span>
                  <span className="font-medium">{region.name}</span>
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  selectedRegion === region.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-green-100 text-green-600 group-hover:bg-green-200'
                }`}>
                  {region.count || 0}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-green-200/30 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center mb-6">
          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-2.5 mr-3">
            <Tag className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Kategori</h3>
            <p className="text-xs text-gray-500">Bläddra efter typ</p>
          </div>
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
          {uniqueCategories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-105'
                  : 'hover:bg-green-50/80 text-gray-700 hover:text-green-800 border border-transparent hover:border-green-200/50'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="mr-3 text-lg">
                    {category.icon || (category.id === 'all' ? '📦' : '🏷️')}
                  </span>
                  <span className="font-medium">{category.name}</span>
                </div>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  selectedCategory === category.id 
                    ? 'bg-white/20 text-white' 
                    : 'bg-green-100 text-green-600 group-hover:bg-green-200'
                }`}>
                  {category.count || 0}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={clearAllFilters}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <X className="w-5 h-5" />
          <span>Rensa alla filter</span>
        </button>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="bg-green-50/80 backdrop-blur-sm rounded-xl p-4 border border-green-200/50">
          <div className="flex items-center space-x-2 text-sm text-green-700">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Aktiva filter:</span>
            <div className="flex flex-wrap gap-2">
              {debouncedSearchTerm && (
                <span className="bg-green-200/50 px-2 py-1 rounded-full text-xs">
                  Sök: {debouncedSearchTerm}
                </span>
              )}
              {selectedRegion !== 'all' && (
                <span className="bg-green-200/50 px-2 py-1 rounded-full text-xs">
                  Plats: {uniqueRegions.find(r => r.id === selectedRegion)?.name}
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="bg-green-200/50 px-2 py-1 rounded-full text-xs">
                  Kategori: {uniqueCategories.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilterComponent;