"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Clock, ArrowRight, Calendar, Leaf, Recycle } from 'lucide-react';

// Constants moved outside component for better performance
const BLOG_POSTS = [
  {
    id: 1,
    title: "Hållbarhet är viktigare än någonsin",
    excerpt: "En djupgående guide om klimatkrisen, cirkulär ekonomi och hur varje individ kan bidra till en hållbar framtid. Upptäck konkreta tips för ett mer miljövänligt liv och varför att agera hållbart är avgörande för vår planets framtid.",
    category: "Hållbarhet",
    tags: ["hållbarhet", "klimat", "miljö", "cirkulär ekonomi", "återvinning", "energibesparing"],
    readTime: "15 min",
    date: "2026-01-03",
    image: "/hallbarhet.webp",
    icon: Leaf,
    featured: true,  
    link: "/hallbarhet"
  },
  {
    id: 2,
    title: "Second Hand - Den ultimata guiden till begagnat",
    excerpt: "Upptäck fördelarna med second hand shopping - från miljövinster och enorma besparingar till hur du hittar unika fynd. Lär dig inspektera kvalitet, känna igen värdefulla märken och shoppa smart begagnat.",
    category: "Second Hand",
    tags: ["second hand", "begagnat", "loppis", "återanvändning", "cirkulär ekonomi", "vintage", "besparingar"],
    readTime: "12 min",
    date: "2026-01-05",
    image: "/second-hand.webp",
    icon: Recycle,
    featured: true,  
    link: "/second-hand"
  }
];

// Background component - simplified for better performance
const BackgroundElements = () => (
  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50" />
);

// Optimized date formatting with memoization
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('sv-SE', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Blog Card Component - optimized structure
const BlogCard = ({ post, featured = false, onTagClick }) => {
  const IconComponent = post.icon;
  
  const handleTagClick = (e, tag) => {
    e.preventDefault();
    e.stopPropagation();
    onTagClick(tag);
  };
  
  return (
    <article 
      className={`group bg-white/90 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:scale-[1.02] ${
        featured ? 'border-2 border-green-200/50' : 'border border-gray-200/50'
      }`}
    >
      {/* Image or Icon Header */}
      <div className={`relative ${featured ? 'h-48 sm:h-64' : 'h-32 sm:h-40'} bg-gradient-to-br from-green-50 to-emerald-100`}>
        {post.image ? (
          <img
            src={post.image} 
            alt={post.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-full shadow-lg">
              <IconComponent className={`${featured ? 'w-12 h-12' : 'w-8 h-8'} text-green-600`} />
            </div>
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-white/90 backdrop-blur-sm text-green-800 px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            {post.category}
          </span>
        </div>
        
        {featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-gradient-to-r from-emerald-400 to-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              Populär
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-4 ${featured ? 'sm:p-6' : 'sm:p-5'}`}>
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{post.readTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
          </div>
        </div>
        
        <h3 
          className={`font-bold text-gray-900 mb-3 ${featured ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'} leading-tight group-hover:text-green-700 transition-colors`}
        >
          {post.title}
        </h3>
        
        <p className={`text-gray-600 mb-4 ${featured ? 'text-sm sm:text-base' : 'text-sm'} leading-relaxed line-clamp-3`}>
          {post.excerpt}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map(tag => (
            <button
              key={tag}
              type="button"
              className="bg-green-50/80 text-green-700 px-2 py-1 rounded-md text-xs font-medium hover:bg-green-100/80 transition-colors cursor-pointer"
              onClick={(e) => handleTagClick(e, tag)}
              aria-label={`Filtrera på ${tag}`}
            >
              {tag}
            </button>
          ))}
        </div>
        
        {/* Read more button */}
        <a
          href={post.link}
          className="group/btn w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          <span>Läs mer</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </a>
      </div>
    </article>
  );
};

// Main Component
export default function BlogClient() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('alla');
  const [selectedTag, setSelectedTag] = useState('alla');

  // Memoize blog posts
  const blogPosts = useMemo(() => BLOG_POSTS, []);

  // Memoize categories and tags
  const categories = useMemo(() => 
    ['alla', ...new Set(blogPosts.map(post => post.category))],
    [blogPosts]
  );
  
  const allTags = useMemo(() => 
    ['alla', ...new Set(blogPosts.flatMap(post => post.tags))],
    [blogPosts]
  );

  // Memoize filtered posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'alla' || post.category === selectedCategory;
      const matchesTag = selectedTag === 'alla' || post.tags.includes(selectedTag);
      
      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [blogPosts, searchTerm, selectedCategory, selectedTag]);

  const handleTagClick = (tag) => {
    setSelectedTag(tag);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('alla');
    setSelectedTag('alla');
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-green-50 via-emerald-50 to-blue-50">
      <BackgroundElements />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 pt-20">
        {/* Page Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Hållbarhet & Att Leva Klimatsmart
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Tips och inspiration för ett mer hållbart liv genom cirkulär ekonomi
          </p>
        </header>

        {/* All Blog Posts */}
        {filteredPosts.length > 0 && (
          <section aria-labelledby="articles-heading">
            <h2 id="articles-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 tracking-tight flex items-center gap-3">
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 w-1 h-8 rounded-full" aria-hidden="true"></span>
              Våra artiklar
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPosts.map(post => (
                <BlogCard 
                  key={post.id} 
                  post={post} 
                  featured={post.featured}
                  onTagClick={handleTagClick}
                />
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 sm:p-12 max-w-md mx-auto">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Inga resultat hittades
              </h3>
              <p className="text-gray-600 mb-4">
                Prova att ändra dina sökkriterier eller filter
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Rensa filter
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
