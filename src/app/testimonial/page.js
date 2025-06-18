//testimonial/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, ArrowRight, X, Star } from 'lucide-react';

// Individual Testimonial Card Component
const TestimonialCard = ({ testimonial }) => {
  const { name, location, text, avatar, bgColor, rating = 5 } = testimonial;
    
  return (
    <div className={`bg-gradient-to-br ${bgColor} rounded-lg shadow-md p-4 border border-white/50 transform hover:-translate-y-1 transition-all duration-300`}>
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg shadow-md mr-2">
          {avatar}
        </div>
        <div>
          <h4 className="font-bold text-gray-800 text-sm">{name}</h4>
          <div className="flex items-center text-xs text-gray-600">
            <MapPin className="w-3 h-3 mr-1" />
            {location}
          </div>
        </div>
      </div>
      <p className="text-gray-700 italic text-sm">{text}</p>
      <div className="mt-3 flex items-center">
        <div className="flex text-yellow-500 text-xs">
          {"★★★★★".split("").slice(0, rating).map((star, i) => (
            <span key={i}>{star}</span>
          ))}
        </div>
      </div>
    </div>
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
    '😊', '👩', '🧑', '👨‍💼', '👩‍💼','👍', '👎', '😢',
    '👩‍🦳','🤖'
  ];

  const bgColorOptions = [
    'from-pink-50 to-pink-100',
    'from-blue-50 to-blue-100',
    'from-purple-50 to-purple-100',
    'from-green-50 to-green-100',
    'from-yellow-50 to-yellow-100',
    'from-indigo-50 to-indigo-100',
    'from-red-50 to-red-100',
    'from-orange-50 to-orange-100'
  ];

  // Scroll to top of testimonials section when modal opens
  useEffect(() => {
    if (isOpen && containerRef.current) {
      containerRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
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
        bgColor: bgColorOptions[Math.floor(Math.random() * bgColorOptions.length)]
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
    <div className="absolute inset-0 bg-black/50 flex items-start justify-center z-50 p-4 pt-8">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">Dela din upplevelse</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ditt namn *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ange ditt namn"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plats *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Din stad"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Välj din avatar
            </label>
            <div className="grid grid-cols-10 gap-2">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, avatar }))}
                  disabled={isSubmitting}
                  className={`w-8 h-8 text-lg rounded-full border-2 transition-all hover:scale-110 disabled:opacity-50 ${
                    formData.avatar === avatar 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Betygsätt din upplevelse
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  disabled={isSubmitting}
                  className="text-2xl transition-colors hover:scale-110 disabled:opacity-50"
                >
                  <Star 
                    className={`w-6 h-6 ${
                      star <= formData.rating 
                        ? 'text-yellow-500 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ditt omdöme *
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
              placeholder="Berätta om din upplevelse med appen..."
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-md disabled:opacity-50 disabled:transform-none"
            >
              {isSubmitting ? 'Skickar...' : 'Skicka omdöme'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Testimonials Section Component with Database Integration
export default function Testimonials() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const containerRef = useRef(null);

  // Fetch testimonials from API
  useEffect(() => {
    fetchTestimonials();
  }, []);

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
      setError('Misslyckades att ladda omdömen');
      // Fallback to default testimonials (only 3)
      setTestimonials([
        {
          name: "Emma L.",
          location: "Stockholm",
          text: "Jag bytte min gamla kamera mot ett professionellt stativ som jag verkligen behövde. Sparade pengar och hittade precis vad jag letade efter!",
          avatar: "👩‍🦰",
          bgColor: "from-pink-50 to-pink-100",
          rating: 5
        },
        {
          name: "Anders K.",
          location: "Göteborg", 
          text: "Fantastisk plattform! Jag har genomfört 7 byten hittills och varje ett har varit smidigt. Gemenskapen är vänlig och pålitlig.",
          avatar: "🧔",
          bgColor: "from-blue-50 to-blue-100",
          rating: 5
        },
        {
          name: "Sofia M.",
          location: "Malmö",
          text: "Som student har detta varit fantastiskt för att uppgradera min teknik och möbler utan att spendera pengar jag inte har.",
          avatar: "👩",
          bgColor: "from-purple-50 to-purple-100", 
          rating: 5
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTestimonial = (newTestimonial) => {
    setTestimonials(prev => [newTestimonial, ...prev].slice(0, 3));
  };

  if (loading) {
    return (
      <section className="py-4">
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-4 border border-gray-200">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 relative" ref={containerRef}>
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
          <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent drop-shadow-sm">
            Vad våra användare säger
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-md text-sm font-medium"
            >
              Dela ditt omdöme
            </button>
            <a href="/alltestimonials" className="inline-flex items-center text-yellow-500 hover:text-blue-700 font-medium text-sm transition-colors">
              Se alla omdömen
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
        
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-yellow-800 text-sm">{error}</p>
          </div>
        )}
                  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <TestimonialCard key={testimonial.id || index} testimonial={testimonial} />
          ))}
        </div>
      </div>

      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTestimonial}
        containerRef={containerRef}
      />
    </section>
  );
}