// app/alla-omdomen/AllTestimonialsClient.js
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Star, ChevronLeft, ChevronRight, ArrowLeft, Calendar, User, Award, TrendingUp, Users, Trophy, Filter, SortAsc } from 'lucide-react';

// Individual Testimonial Card Component (Enhanced & Mobile-First)
const TestimonialCard = ({ testimonial, isExpanded = false }) => {
  const { name, location, text, avatar, bgColor, rating = 5, isVerified, createdAt } = testimonial;
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Nyligen';
    const date = new Date(dateString);
    return date.toLocaleDateString('sv-SE', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <article className={`bg-gradient-to-br ${bgColor} backdrop-blur-sm rounded-2xl shadow-xl p-5 sm:p-6 border-2 border-white/60 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl relative overflow-hidden group`}>
      {/* Decorative background effect */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
      
      <div className="relative z-10">
        {/* User Info Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center flex-1 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg mr-3 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
              {avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-800 text-base sm:text-lg truncate">{name}</h4>
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1 flex-shrink-0 text-green-600" strokeWidth={2.5} />
                <span className="truncate">{location}</span>
              </div>
            </div>
          </div>
          {isVerified && (
            <div className="flex items-center bg-gradient-to-r from-green-100 to-emerald-100 px-2 sm:px-3 py-1 rounded-full shadow-sm border border-green-200/50 ml-2 flex-shrink-0">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 mr-1" strokeWidth={2.5} />
              <span className="text-xs font-bold text-green-700 hidden sm:inline">Verifierad</span>
              <span className="text-xs font-bold text-green-700 sm:hidden">✓</span>
            </div>
          )}
        </div>

        {/* Testimonial Text */}
        <p className={`text-gray-700 leading-relaxed mb-4 ${isExpanded ? 'text-sm sm:text-base' : 'text-sm line-clamp-3'}`}>
          {text}
        </p>

        {/* Rating and Date Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/40">
          <div className="flex items-center">
            <div className="flex text-yellow-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${star <= rating ? 'fill-current' : 'text-gray-300'}`}
                  strokeWidth={2}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm text-gray-600 ml-2 font-semibold">
              ({rating}/5)
            </span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" strokeWidth={2.5} />
            <span className="hidden sm:inline">{formatDate(createdAt)}</span>
            <span className="sm:hidden">{new Date(createdAt).toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

// Filter and Sort Controls (Mobile-First)
const FilterControls = ({ 
  sortBy, 
  setSortBy, 
  filterRating, 
  setFilterRating,
  totalCount 
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-gray-200/50">
      <div className="flex flex-col gap-4">
        {/* Results Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm sm:text-base text-gray-600 font-medium">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" strokeWidth={2.5} />
            <span>Visar <strong className="text-gray-800">{totalCount}</strong> omdömen</span>
          </div>
        </div>

        {/* Sort and Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Sort */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-bold text-gray-700 flex items-center">
              <SortAsc className="w-4 h-4 mr-1.5 text-green-600" strokeWidth={2.5} />
              Sortera efter:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm sm:text-base font-medium bg-white"
            >
              <option value="newest">Nyaste först</option>
              <option value="oldest">Äldsta först</option>
              <option value="rating-high">Högsta betyg</option>
              <option value="rating-low">Lägsta betyg</option>
              <option value="name">Namn A-Ö</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-xs sm:text-sm font-bold text-gray-700 flex items-center">
              <Star className="w-4 h-4 mr-1.5 text-yellow-500 fill-current" strokeWidth={2.5} />
              Filtrera betyg:
            </label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm sm:text-base font-medium bg-white"
            >
              <option value="all">Alla betyg</option>
              <option value="5">⭐⭐⭐⭐⭐ (5 stjärnor)</option>
              <option value="4">⭐⭐⭐⭐ (4+ stjärnor)</option>
              <option value="3">⭐⭐⭐ (3+ stjärnor)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pagination Component (Mobile-First)
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 sm:mt-12" aria-label="Sidnavigering">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-full sm:w-auto flex items-center justify-center px-4 py-3 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
        aria-label="Föregående sida"
      >
        <ChevronLeft className="w-4 h-4 mr-2" strokeWidth={2.5} />
        Föregående
      </button>
      
      <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
        {pages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`min-w-[44px] px-4 py-3 text-sm font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${
              currentPage === page
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-110'
                : 'text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
            aria-label={`Sida ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-full sm:w-auto flex items-center justify-center px-4 py-3 text-sm font-bold text-gray-700 bg-white border-2 border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
        aria-label="Nästa sida"
      >
        Nästa
        <ChevronRight className="w-4 h-4 ml-2" strokeWidth={2.5} />
      </button>
    </nav>
  );
};

// Enhanced Community Stats Component (Mobile-First)
const CommunityStats = ({ testimonials, totalCount }) => {
  const averageRating = testimonials.length > 0 
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length)
    : 0;
  
  const fiveStarCount = testimonials.filter(t => t.rating === 5).length;
  
  const stats = [
    {
      icon: Users,
      value: totalCount.toLocaleString('sv-SE'),
      label: 'Totalt antal recensioner',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50/90 to-blue-100/80',
      iconColor: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      value: averageRating.toFixed(1),
      label: 'Genomsnittligt betyg',
      color: 'from-amber-500 to-yellow-600',
      bgColor: 'from-amber-50/90 to-yellow-100/80',
      iconColor: 'text-amber-600',
      suffix: '/5'
    },
    {
      icon: Trophy,
      value: fiveStarCount.toLocaleString('sv-SE'),
      label: '5-stjärniga recensioner',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50/90 to-purple-100/80',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <section className="mt-8 sm:mt-12" aria-labelledby="community-stats-heading">
      <div className="text-center mb-6 sm:mb-8">
        <h3 id="community-stats-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Samhällsinsikter</h3>
        <p className="text-gray-600 text-sm sm:text-base">Verklig feedback från vårt handelssamhälle</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <article
              key={index}
              className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-200/50"
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative p-5 sm:p-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${stat.bgColor} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 ${stat.iconColor}`} strokeWidth={2.5} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                      {stat.value}
                    </span>
                    {stat.suffix && (
                      <span className="text-base sm:text-lg font-bold text-gray-600 ml-1">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-gray-600">
                    {stat.label}
                  </p>
                </div>
              </div>
              
              {/* Bottom accent bar */}
              <div className={`h-1.5 bg-gradient-to-r ${stat.color}`}></div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

// Main All Testimonials Component (Mobile-First)
export default function AllTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and sort states
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const itemsPerPage = 9;

  // Fetch testimonials from API
  const fetchTestimonials = useCallback(async (page, sort, rating) => {
    setLoading(true);
    try {
      const offset = (page - 1) * itemsPerPage;
      const response = await fetch(`/api/testimonials?limit=${itemsPerPage}&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error('Misslyckades att hämta omdömen');
      }
      
      const data = await response.json();
      let fetchedTestimonials = data.testimonials;
      
      // Apply rating filter
      if (rating !== 'all') {
        const minRating = parseInt(rating);
        fetchedTestimonials = fetchedTestimonials.filter(t => t.rating >= minRating);
      }
      
      // Apply sorting
      fetchedTestimonials.sort((a, b) => {
        switch (sort) {
          case 'newest':
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          case 'oldest':
            return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
          case 'rating-high':
            return b.rating - a.rating;
          case 'rating-low':
            return a.rating - b.rating;
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
      
      setTestimonials(fetchedTestimonials);
      setTotalCount(data.pagination.total);
      setHasMore(data.pagination.hasMore);
      setError(null);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Misslyckades att ladda omdömen');
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch testimonials when dependencies change
  useEffect(() => {
    fetchTestimonials(currentPage, sortBy, filterRating);
  }, [currentPage, sortBy, filterRating, fetchTestimonials]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortBy, filterRating]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50/30 py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 sm:h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/2 sm:w-1/3 mb-6 sm:mb-8"></div>
            <div className="bg-white rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 border-2 border-gray-200">
              <div className="h-16 sm:h-20 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl h-48 sm:h-56"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50/30 py-6 sm:py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Mobile First */}
        <header className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <button 
              onClick={() => window.history.back()}
              className="inline-flex items-center text-green-600 hover:text-green-700 font-bold transition-all duration-200 hover:bg-green-50 px-4 py-2 rounded-xl border-2 border-green-200/60 hover:border-green-300 self-start group"
              aria-label="Tillbaka till föregående sida"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
              Tillbaka
            </button>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent mb-3">
            Alla Omdömen
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Upptäck vad våra medlemmar säger om sina handelsupplevelser på SwapDeals
          </p>
        </header>

        {/* Filters */}
        <FilterControls
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterRating={filterRating}
          setFilterRating={setFilterRating}
          totalCount={testimonials.length}
        />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <p className="text-red-800 font-medium text-sm sm:text-base">{error}</p>
          </div>
        )}

        {/* No Results */}
        {testimonials.length === 0 && !loading && (
          <div className="text-center py-12 sm:py-16 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-2 border-gray-200/50">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" strokeWidth={2} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Inga omdömen hittades</h3>
            <p className="text-gray-600 text-sm sm:text-base">Inga omdömen matchar dina nuvarande filterkriterier</p>
          </div>
        )}

        {/* Testimonials Grid - Mobile First */}
        {testimonials.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard 
                  key={testimonial.id} 
                  testimonial={testimonial} 
                  isExpanded={true}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}

        {/* Enhanced Community Stats */}
        {testimonials.length > 0 && (
          <CommunityStats testimonials={testimonials} totalCount={totalCount} />
        )}
      </div>
    </div>
  );
}