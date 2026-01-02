//component/AllTestimonial.js
'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { MapPin, Star, ChevronLeft, ChevronRight, ArrowLeft, Calendar, User, Award, TrendingUp, Users, Trophy } from 'lucide-react';

// Individual Testimonial Card Component (Enhanced)
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
    <div className={`bg-gradient-to-br ${bgColor} rounded-lg shadow-md p-6 border border-white/50 transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-md mr-3">
            {avatar}
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-base">{name}</h4>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {location}
            </div>
          </div>
        </div>
        {isVerified && (
          <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
            <Award className="w-4 h-4 text-green-600 mr-1" />
            <span className="text-xs font-medium text-green-700">Verifierad</span>
          </div>
        )}
      </div>

      <p className={`text-gray-700 italic mb-4 ${isExpanded ? 'text-base' : 'text-sm line-clamp-3'}`}>
        {text}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex text-yellow-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                className={`w-4 h-4 ${star <= rating ? 'fill-current' : ''}`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">
            ({rating}/5)
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          {formatDate(createdAt)}
        </div>
      </div>
    </div>
  );
};

// Filter and Sort Controls (Simplified)
const FilterControls = ({ 
  sortBy, 
  setSortBy, 
  filterRating, 
  setFilterRating,
  totalCount 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="text-sm text-gray-600">
          Visar {totalCount} omdömen
        </div>

        <div className="flex gap-4 items-center">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sortera efter:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">Nyaste först</option>
              <option value="oldest">Äldsta först</option>
              <option value="rating-high">Högsta betyg</option>
              <option value="rating-low">Lägsta betyg</option>
              <option value="name">Namn A-Ö</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Betyg:</label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Alla betyg</option>
              <option value="5">5 stjärnor</option>
              <option value="4">4+ stjärnor</option>
              <option value="3">3+ stjärnor</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Pagination Component
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
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Föregående
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Nästa
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  );
};

// Enhanced Community Stats Component (Smaller Version)
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
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: TrendingUp,
      value: averageRating.toFixed(1),
      label: 'Genomsnittligt betyg',
      color: 'from-amber-500 to-yellow-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      suffix: '/5'
    },
    {
      icon: Trophy,
      value: fiveStarCount.toLocaleString('sv-SE'),
      label: '5-stjärniga recensioner',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="mt-8">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">Samhällsinsikter</h3>
        <p className="text-gray-600 text-sm">Verklig feedback från vårt handelssamhälle</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div 
              key={index}
              className="group relative overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative p-4">
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${stat.bgColor} mb-3`}>
                  <IconComponent className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </span>
                    {stat.suffix && (
                      <span className="text-sm font-medium text-gray-600 ml-1">
                        {stat.suffix}
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-gray-600">
                    {stat.label}
                  </p>
                </div>
              </div>
              
              {/* Bottom accent line */}
              <div className={`h-1 bg-gradient-to-r ${stat.color}`}></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Main All Testimonials Component
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            <div className="bg-white rounded-lg p-4 mb-6">
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-1" />
              Tillbaka
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Alla omdömen</h1>
          </div>
          <p className="text-gray-600">
            Upptäck vad våra medlemmar säger om sina handelsupplevelser
          </p>
        </div>

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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* No Results */}
        {testimonials.length === 0 && !loading && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Inga omdömen hittades</h3>
            <p className="text-gray-600">Inga omdömen matchar dina nuvarande filterkriterier</p>
          </div>
        )}

        {/* Testimonials Grid */}
        {testimonials.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Enhanced Community Stats - Now Smaller */}
        <CommunityStats testimonials={testimonials} totalCount={totalCount} />
      </div>
    </div>
  );
}