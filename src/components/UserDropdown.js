'use client';

import { MapPin, ArrowRight } from 'lucide-react';

// Individual Testimonial Card Component
const TestimonialCard = ({ testimonial }) => {
  const { name, location, text, avatar, bgColor } = testimonial;
  
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
          {"★★★★★".split("").map((star, i) => (
            <span key={i}>{star}</span>
          ))}
        </div>
        <span className="text-xs text-gray-600 ml-2">Verified trader</span>
      </div>
    </div>
  );
};

// Main Testimonials Section Component
export default function Testimonials({ testimonials = [] }) {
  // Default testimonials if none are provided
  const defaultTestimonials = [
    {
      name: "Emma L.",
      location: "Stockholm",
      text: "I traded my old camera for a professional tripod I really needed. Saved money and found exactly what I was looking for!",
      avatar: "👩‍🦰",
      bgColor: "from-pink-50 to-pink-100"
    },
    {
      name: "Anders K.",
      location: "Göteborg",
      text: "Great platform! I've completed 7 trades so far and each one has been smooth. The community is friendly and trustworthy.",
      avatar: "🧔",
      bgColor: "from-blue-50 to-blue-100"
    },
    {
      name: "Sofia M.",
      location: "Malmö",
      text: "As a student, this has been fantastic for upgrading my tech and furniture without spending money I don't have.",
      avatar: "👩",
      bgColor: "from-purple-50 to-purple-100"
    }
  ];

}