//components/ItemCategories.js

import React, { useState, useEffect, useRef } from 'react';

// Swedish categories organized with expandable main categories and subcategories
const itemCategories = [
  {
    id: 'hem-tradgard',
    label: 'Hem & Trädgård',
    emoji: '🏠',
    isMainCategory: true,
    subcategories: [
      { value: 'hem', label: 'Hem & Boende', emoji: '🏠' },
      { value: 'mobler', label: 'Möbler', emoji: '🪑' },
      { value: 'tradgard', label: 'Trädgård', emoji: '🌱' },
      { value: 'verktyg', label: 'Verktyg', emoji: '🔧' },
    ]
  },
  {
    id: 'mode-skonhet',
    label: 'Mode & Skönhet',
    emoji: '👕',
    isMainCategory: true,
    subcategories: [
      { value: 'mode', label: 'Mode & Kläder', emoji: '👕' },
      { value: 'skonhet', label: 'Skönhet & Vård', emoji: '💄' },
      { value: 'vintage', label: 'Vintage & Retro', emoji: '🕰️' },
    ]
  },
  {
    id: 'teknik-elektronik',
    label: 'Teknik & Elektronik',
    emoji: '📱',
    isMainCategory: true,
    subcategories: [
      { value: 'teknik', label: 'Teknik & Elektronik', emoji: '📱' },
      { value: 'fotografering', label: 'Fotografering', emoji: '📷' },
      { value: 'elektronik', label: 'Elektronik', emoji: '🔌' },
    ]
  },
  {
    id: 'hobby-underhallning',
    label: 'Hobby & Underhållning',
    emoji: '🎮',
    isMainCategory: true,
    subcategories: [
      { value: 'spel', label: 'Spel & Gaming', emoji: '🎮' },
      { value: 'musik', label: 'Musik & Instrument', emoji: '🎵' },
      { value: 'bocker', label: 'Böcker', emoji: '📚' },
      { value: 'konst', label: 'Konst & Hantverk', emoji: '🎨' },
      { value: 'hantverk', label: 'Hantverk & Stickning', emoji: '✂️' },
      { value: 'pussel', label: 'Pussel & Brädspel', emoji: '🧩' },
      { value: 'filmer', label: 'Filmer & Media', emoji: '🎬' },
    ]
  },
  {
    id: 'sport-utomhus',
    label: 'Sport & Utomhus',
    emoji: '🚲',
    isMainCategory: true,
    subcategories: [
      { value: 'sport', label: 'Sport & Motion', emoji: '🚲' },
      { value: 'utomhus', label: 'Utomhus & Camping', emoji: '🏕️' },
      { value: 'cykling', label: 'Cykling', emoji: '🚴' },
      { value: 'fiske', label: 'Fiske', emoji: '🎣' },
      { value: 'traning', label: 'Träning & Fitness', emoji: '💪' },
    ]
  },
  {
    id: 'barn-baby',
    label: 'Barn & Baby',
    emoji: '👶',
    isMainCategory: true,
    subcategories: [
      { value: 'leksaker', label: 'Leksaker', emoji: '🧸' },
      { value: 'barnklader', label: 'Barnkläder', emoji: '👕' },
      { value: 'barnvagnar', label: 'Barnvagnar & Utrustning', emoji: '🍼' },
    ]
  },
  {
    id: 'fordon-transport',
    label: 'Fordon & Transport',
    emoji: '🚗',
    isMainCategory: true,
    subcategories: [
      { value: 'fordon', label: 'Fordon & Bilar', emoji: '🚗' },
      { value: 'transport', label: 'Transport & Frakt', emoji: '🚚' },
    ]
  },
  {
    id: 'halsa-valmaende',
    label: 'Hälsa & Välmående',
    emoji: '💊',
    isMainCategory: true,
    subcategories: [
      { value: 'halsa', label: 'Hälsa & Medicin', emoji: '💊' },
      { value: 'mat', label: 'Mat & Dryck', emoji: '🍎' },
    ]
  },
  {
    id: 'djur',
    label: 'Djur',
    emoji: '🐕',
    isMainCategory: true,
    subcategories: [
      { value: 'husdjur', label: 'Djurtillbehör', emoji: '🐕' },
    ]
  },
  {
    id: 'samlarobjekt-antikt',
    label: 'Samlarobjekt & Antikt',
    emoji: '💎',
    isMainCategory: true,
    subcategories: [
      { value: 'samlarobjekt', label: 'Samlarobjekt', emoji: '💎' },
      { value: 'antik', label: 'Antik & Vintage', emoji: '🏺' },
    ]
  },
  {
    id: 'resor-upplevelser',
    label: 'Resor & Upplevelser',
    emoji: '✈️',
    isMainCategory: true,
    subcategories: [
      { value: 'resor', label: 'Resor & Resväskor', emoji: '✈️' },
      { value: 'kurser', label: 'Kurser & Utbildning', emoji: '🎓' },
      { value: 'sprak', label: 'Språk & Lärande', emoji: '🗣️' },
    ]
  },
  {
    id: 'tjanster',
    label: 'Tjänster',
    emoji: '🤝',
    isMainCategory: true,
    subcategories: [
      { value: 'undervisning', label: 'Undervisning', emoji: '👩‍🏫' },
      { value: 'reparationer', label: 'Reparationer', emoji: '🔧' },
      { value: 'stadning', label: 'Städning', emoji: '🧽' },
    ]
  },
  {
    id: 'sasong-event',
    label: 'Säsong & Event',
    emoji: '❄️',
    isMainCategory: true,
    subcategories: [
      { value: 'vinter', label: 'Vinter & Snö', emoji: '❄️' },
      { value: 'sommar', label: 'Sommar & Sol', emoji: '☀️' },
      { value: 'jul', label: 'Jul & Högtider', emoji: '🎄' },
      { value: 'fest', label: 'Fest & Party', emoji: '🎉' },
      { value: 'brollop', label: 'Bröllop & Fest', emoji: '💒' },
    ]
  },
  {
    id: 'specialkategorier',
    label: 'Specialkategorier',
    emoji: '🤲',
    isMainCategory: true,
    subcategories: [
      { value: 'handgjort', label: 'Handgjort & Lokalt', emoji: '🤲' },
      { value: 'lokalproducerat', label: 'Lokalproducerat', emoji: '🌾' },
      { value: 'miljovanligt', label: 'Miljövänligt', emoji: '♻️' },
    ]
  },
  {
    id: 'ovrigt',
    label: 'Övrigt',
    emoji: '📦',
    isMainCategory: true,
    subcategories: [
      { value: 'annat', label: 'Annat', emoji: '📦' },
    ]
  }
];

// Category Selector Component
export function CategorySelector({ selectedCategory, onCategorySelect, onClose }) {
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleSubcategorySelect = (subcategory) => {
    onCategorySelect(subcategory.value);
    onClose();
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
    >
      <div className="p-2">
        {itemCategories.map((category) => (
          <div key={category.id} className="mb-1">
            {/* Main Category Button */}
            <button
              type="button"
              onClick={() => toggleCategory(category.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{category.emoji}</span>
                <span className="font-medium text-gray-900">{category.label}</span>
              </div>
              <svg
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  expandedCategories.has(category.id) ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Subcategories */}
            {expandedCategories.has(category.id) && (
              <div className="ml-6 mt-1 space-y-1">
                {category.subcategories.map((subcategory) => (
                  <button
                    key={subcategory.value}
                    type="button"
                    onClick={() => handleSubcategorySelect(subcategory)}
                    className={`w-full flex items-center space-x-2 px-3 py-2 text-left rounded-md transition-colors ${
                      selectedCategory === subcategory.value
                        ? 'bg-green-100 text-green-800'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="text-sm">{subcategory.emoji}</span>
                    <span className="text-sm">{subcategory.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Category Input Component
export function CategoryInput({ selectedCategory, onCategorySelect, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  
  const selectedCategoryData = itemCategories
    .flatMap(cat => cat.subcategories)
    .find(sub => sub.value === selectedCategory);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Kategori för din produkt *
      </label>
      
        
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-4 mt-3 border-2 border-blue-200 rounded-xl bg-white transition-colors ${
          error ? 'border-red-300' : 'hover:border-blue-300'
        }`}
      >
        <div className="flex items-center space-x-2">
          {selectedCategoryData ? (
            <>
              <span>{selectedCategoryData.emoji}</span>
              <span className="text-gray-900">{selectedCategoryData.label}</span>
            </>
          ) : (
            <span className="text-gray-500">Välj kategori...</span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <CategorySelector
          selectedCategory={selectedCategory}
          onCategorySelect={onCategorySelect}
          onClose={() => setIsOpen(false)}
        />
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

// Export the categories data as well
export const ItemCategories = itemCategories;

// Demo component showing how to use the CategoryInput (default export)
export default function CategorySelectorDemo() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [error, setError] = useState('');

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setError(''); // Clear error when category is selected
  };

  const handleSubmit = () => {
    if (!selectedCategory) {
      setError('Vänligen välj en kategori');
      return;
    }
    alert(`Vald kategori: ${selectedCategory}`);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Kategori Väljare</h1>
      
      <div className="space-y-4">
        <CategoryInput
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          error={error}
        />
        
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          Spara kategori
        </button>
      </div>

      {selectedCategory && (
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="font-medium text-gray-900 mb-2">Vald kategori:</h3>
          <p className="text-green-600">{selectedCategory}</p>
        </div>
      )}
    </div>
  );
}