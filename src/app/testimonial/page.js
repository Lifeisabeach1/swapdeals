'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, ArrowRight, X, Star, Sparkles, Users, Quote } from 'lucide-react';

// Individual Testimonial Card Component
const TestimonialCard = ({ testimonial }) => {
  const { name, location, text, avatar, bgColor, rating = 5, verified = true } = testimonial;
    
  return (
    <article className={`bg-gradient-to-br ${bgColor} backdrop-blur-sm rounded-2xl shadow-xl p-5 sm:p-6 border-2 border-white/60 transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl relative overflow-hidden group`}>
      {/* Decorative quote icon */}
      <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
        <Quote className="w-12 h-12 text-gray-700" strokeWidth={1.5} />
      </div>
      
      <div className="relative z-10">
        {/* User Info */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg mr-3 group-hover:scale-110 transition-transform duration-300">
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
        
        {/* Testimonial Text */}
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4 line-clamp-4">
          {text}
        </p>
        
        {/* Rating and Verification */}
        <div className="flex items-center justify-between pt-3 border-t border-white/40">
          <div className="flex text-yellow-500">
            {Array.from({ length: 5 }, (_, i) => (
              <Star 
                key={i}
                className={`w-4 h-4 sm:w-5 sm:h-5 ${i < rating ? 'fill-current' : 'text-gray-300'}`}
                strokeWidth={2}
              />
            ))}
          </div>
          {verified && (
            <span className="text-xs sm:text-sm text-green-700 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full font-semibold shadow-sm border border-green-200/50">
              ✓ Verifierad
            </span>
          )}
        </div>
      </div>
    </article>
  );
};

// Testimonial Form Modal Component
const TestimonialModal = ({ isOpen, onClose, onSubmit, containerRef }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    text: '',
    avatar: '😊',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const avatarOptions = [
    '😊', '👩', '🧑', '👨‍💼', '👩‍💼', '👍', '🌟', '💚',
    '👩‍🦰', '🧔', '👩‍🦳', '🎯'
  ];

  const bgColorOptions = [
    'from-pink-50/90 to-pink-100/80',
    'from-blue-50/90 to-blue-100/80',
    'from-purple-50/90 to-purple-100/80',
    'from-green-50/90 to-green-100/80',
    'from-yellow-50/90 to-yellow-100/80',
    'from-indigo-50/90 to-indigo-100/80',
    'from-red-50/90 to-red-100/80',
    'from-orange-50/90 to-orange-100/80'
  ];

  // Scroll to top of testimonials section when modal opens
  useEffect(() => {
    if (isOpen && containerRef.current) {
      containerRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, containerRef]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.location || !formData.text) {
      alert('Vänligen fyll i alla obligatoriska fält');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const testimonialData = {
        ...formData,
        bgColor: bgColorOptions[Math.floor(Math.random() * bgColorOptions.length)],
        verified: true
      };

      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
      });

      if (!response.ok) {
        throw new Error('Misslyckades att skicka omdöme');
      }

      const result = await response.json();
      onSubmit(result.testimonial);
      setFormData({ name: '', location: '', text: '', avatar: '😊', rating: 5 });
      onClose();
      
    } catch (error) {
      console.error('Fel vid inskickning av omdöme:', error);
      alert('Misslyckades att skicka omdöme. Försök igen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-50 to-emerald-50 backdrop-blur-lg flex justify-between items-center p-6 border-b-2 border-green-200/50 z-10">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <Star className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800">Dela Din Upplevelse</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-xl p-2 transition-all duration-200"
            disabled={isSubmitting}
            aria-label="Stäng formulär"
          >
            <X className="w-6 h-6" strokeWidth={2.5} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Ditt Namn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-base"
              placeholder="Ange ditt namn"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Location Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Din Stad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-base"
              placeholder="T.ex. Stockholm, Göteborg, Malmö"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Välj Din Avatar
            </label>
            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                  disabled={isSubmitting}
                  className={`w-12 h-12 sm:w-14 sm:h-14 text-xl sm:text-2xl rounded-2xl border-3 transition-all hover:scale-110 disabled:opacity-50 ${
                    formData.avatar === avatar 
                      ? 'border-green-500 bg-green-50 shadow-lg scale-110' 
                      : 'border-gray-200 hover:border-green-300 bg-white'
                  }`}
                  aria-label={`Välj avatar ${avatar}`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Betygsätt Din Upplevelse <span className="text-red-500">*</span>
            </label>
            <div className="flex space-x-2 justify-center sm:justify-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  disabled={isSubmitting}
                  className="transition-all hover:scale-125 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg p-1"
                  aria-label={`Ge ${star} stjärnor`}
                >
                  <Star 
                    className={`w-8 h-8 sm:w-10 sm:h-10 ${
                      star <= formData.rating 
                        ? 'text-yellow-500 fill-current drop-shadow-lg' 
                        : 'text-gray-300'
                    }`}
                    strokeWidth={2}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">
              {formData.rating === 5 ? '⭐ Fantastiskt!' : 
               formData.rating === 4 ? '👍 Bra!' : 
               formData.rating === 3 ? '👌 OK' : 
               formData.rating === 2 ? '😕 Kunde varit bättre' : 
               '😞 Inte bra'}
            </p>
          </div>

          {/* Testimonial Text */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Ditt Omdöme <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none text-base"
              rows="5"
              placeholder="Berätta om din upplevelse med SwapDeals... Vad gillade du mest? Hur många byten har du gjort?"
              disabled={isSubmitting}
              required
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1 text-right">
              {formData.text.length}/500 tecken
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-bold disabled:opacity-50 text-base"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:transform-none font-bold text-base"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Skickar...
                </span>
              ) : (
                '✓ Skicka Omdöme'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Testimonials Section Component
export default function Testimonials() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  // Default testimonials as fallback
  const defaultTestimonials = [
    {
      name: "Emma L.",
      location: "Stockholm",
      text: "Jag bytte min gamla kamera mot ett professionellt stativ som jag verkligen behövde. Sparade pengar och hittade precis vad jag letade efter!",
      avatar: "👩‍🦰",
      bgColor: "from-pink-50/90 to-pink-100/80",
      rating: 5,
      verified: true
    },
    {
      name: "Anders K.",
      location: "Göteborg", 
      text: "Fantastisk plattform! Jag har genomfört 7 byten hittills och varje ett har varit smidigt. Gemenskapen är vänlig och pålitlig.",
      avatar: "🧔",
      bgColor: "from-blue-50/90 to-blue-100/80",
      rating: 5,
      verified: true
    },
    {
      name: "Sofia M.",
      location: "Malmö",
      text: "Som student har detta varit fantastiskt för att uppgradera min teknik och möbler utan att spendera pengar jag inte har.",
      avatar: "👩",
      bgColor: "from-purple-50/90 to-purple-100/80", 
      rating: 5,
      verified: true
    }
  ];

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials?limit=3');
        if (!response.ok) {
          throw new Error('Misslyckades att hämta omdömen');
        }
        
        const data = await response.json();
        setTestimonials(data.testimonials);
      } catch (err) {
        console.error('Fel vid hämtning av omdömen:', err);
        setError('Kunde inte ladda omdömen från servern');
        // Fallback to default testimonials
        setTestimonials(defaultTestimonials);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddTestimonial = (newTestimonial) => {
    setTestimonials(prev => [newTestimonial, ...prev].slice(0, 3));
  };

  // Loading state
  if (loading) {
    return (
      <section className="py-6 sm:py-8" aria-label="Laddar användarrecensioner">
        <div className="bg-gradient-to-br from-white/90 via-gray-50/50 to-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 border-2 border-gray-200/50">
          <div className="animate-pulse">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl w-1/2 mb-6"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl h-48"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-8 relative" ref={containerRef} aria-labelledby="testimonials-heading">
      <div className="bg-gradient-to-br from-white/95 via-green-50/30 to-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border-2 border-green-200/50 relative overflow-hidden">
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"></div>
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-4 py-2 shadow-md mb-3">
              <Users className="w-5 h-5 text-green-600 mr-2" strokeWidth={2.5} />
              <span className="text-green-800 font-bold text-sm">Kundrecensioner</span>
            </div>
            <h2 id="testimonials-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent drop-shadow-sm">
              Vad Våra Användare Säger
            </h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-bold text-sm sm:text-base flex items-center justify-center"
              aria-label="Dela ditt omdöme om SwapDeals"
            >
              <Star className="w-5 h-5 mr-2" strokeWidth={2.5} />
              <span>Dela Ditt Omdöme</span>
            </button>
            <a 
              href="/alla-omdomen" 
              className="inline-flex items-center justify-center text-green-600 hover:text-green-700 font-bold text-sm sm:text-base transition-all duration-300 hover:bg-green-50 px-5 py-3 rounded-xl border-2 border-green-200/60 hover:border-green-300 group"
              aria-label="Se alla användarrecensioner"
            >
              <span>Se Alla Omdömen</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
            </a>
          </div>
        </header>
        
        {/* Error Message */}
        {error && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6 relative z-10">
            <p className="text-yellow-800 font-medium text-sm">{error}</p>
          </div>
        )}
        
        {/* Testimonials Grid - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard key={testimonial.id || index} testimonial={testimonial} />
          ))}
        </div>
      </div>

      {/* Modal */}
      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTestimonial}
        containerRef={containerRef}
      />
    </section>
  );
}
