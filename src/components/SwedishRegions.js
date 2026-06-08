//components/SwedishRegions.js
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, MapPin } from 'lucide-react';

// Swedish regions organized by traditional landscapes (landskap)
export const swedishLandscapes = {
  "Götaland": {
    "Skåne": [
      "Malmö", "Helsingborg", "Lund", "Kristianstad", "Trelleborg", "Ängelholm", 
      "Hässleholm", "Eslöv", "Ystad", "Landskrona", "Höganäs", "Staffanstorp",
      "Vellinge", "Svedala", "Kävlinge", "Lomma", "Bjuv", "Åstorp", "Perstorp"
    ],
    "Halland": [
      "Halmstad", "Varberg", "Kungsbacka", "Falkenberg", "Laholm", "Hylte"
    ],
    "Blekinge": [
      "Karlskrona", "Karlshamn", "Ronneby", "Sölvesborg", "Olofström"
    ],
    "Småland": [
      "Växjö", "Kalmar", "Jönköping", "Västervik", "Oskarshamn", "Ljungby",
      "Almhult", "Markaryd", "Älmhult", "Tingsryd", "Lessebo", "Uppvidinge",
      "Emmaboda", "Nybro", "Mörbylånga", "Borgholm", "Hultsfred", "Vimmerby",
      "Eksjö", "Sävsjö", "Vetlanda", "Nässjö", "Tranås", "Aneby", "Gnosjö",
      "Gislaved", "Habo", "Mullsjö"
    ],
    "Östergötland": [
      "Linköping", "Norrköping", "Motala", "Mjölby", "Finspång", "Söderköping",
      "Vadstena", "Åtvidaberg", "Valdermarsvik", "Ydre", "Kinda", "Boxholm"
    ],
    "Västergötland": [
      "Göteborg", "Borås", "Trollhättan", "Skövde", "Uddevalla", "Partille",
      "Mölndal", "Kungälv", "Alingsås", "Lerum", "Vårgårda", "Herrljunga",
      "Vara", "Götene", "Tibro", "Töreboda", "Mariestad", "Lidköping",
      "Skara", "Vänersborg", "Åmål", "Säffle", "Grästorp", "Essunga",
      "Falköping", "Ulricehamn", "Tranemo", "Mark", "Svenljunga", "Bollebygd"
    ],
    "Dalsland": [
      "Åmål", "Bengtsfors", "Dals-Ed", "Färgelanda", "Mellerud"
    ],
    "Bohuslän": [
      "Göteborg", "Uddevalla", "Strömstad", "Lysekil", "Kungälv", "Stenungsund",
      "Tjörn", "Orust", "Sotenäs", "Munkedal", "Tanum"
    ],
    "Gotland": [
      "Visby", "Hemse", "Slite", "Klintehamn", "Burgsvik"
    ]
  },
  "Svealand": {
    "Stockholm": [
      "Stockholm", "Solna", "Lidingö", "Nacka", "Sundbyberg", "Danderyd",
      "Järfälla", "Ekerö", "Huddinge", "Botkyrka", "Salem", "Haninge",
      "Tyresö", "Upplands Väsby", "Vallentuna", "Österåker", "Värmdö",
      "Norrtälje", "Sigtuna", "Nynäshamn", "Håbo", "Märsta", "Arlanda"
    ],
    "Södermanland": [
      "Eskilstuna", "Södertälje", "Nyköping", "Katrineholm", "Strängnäs",
      "Mariefred", "Trosa", "Gnesta", "Oxelösund", "Flen"
    ],
    "Uppland": [
      "Uppsala", "Enköping", "Tierp", "Älvkarleby", "Östhammar", "Heby",
      "Håbo", "Knivsta"
    ],
    "Västmanland": [
      "Västerås", "Köping", "Arboga", "Kungsör", "Hallstahammar", "Surahammar",
      "Fagersta", "Norberg", "Skinnskatteberg", "Sala"
    ],
    "Närke": [
      "Örebro", "Kumla", "Hallsberg", "Degerfors", "Askersund", "Karlskoga",
      "Nora", "Lindesberg", "Ljusnarsberg", "Laxå", "Hällefors"
    ],
    "Värmland": [
      "Karlstad", "Kristinehamn", "Filipstad", "Hagfors", "Arvika", "Säffle",
      "Grums", "Årjäng", "Eda", "Torsby", "Storfors", "Hammarö", "Munkfors",
      "Forshaga", "Kil", "Sunne"
    ],
    "Dalarna": [
      "Borlänge", "Falun", "Sandviken", "Ludvika", "Avesta", "Hedemora",
      "Säter", "Mora", "Orsa", "Älvdalen", "Smedjebacken", "Leksand",
      "Rättvik", "Gagnef", "Vansbro", "Malung-Sälen"
    ]
  },
  "Norrland": {
    "Gävleborg": [
      "Gävle", "Sandviken", "Söderhamn", "Hudiksvall", "Bollnäs", "Ljusdal",
      "Ovanåker", "Nordanstig", "Hofors", "Ockelbo"
    ],
    "Hälsingland": [
      "Hudiksvall", "Söderhamn", "Bollnäs", "Ljusdal", "Ovanåker", "Nordanstig"
    ],
    "Medelpad": [
      "Sundsvall", "Timrå", "Härnösand", "Kramfors", "Sollefteå", "Ånge"
    ],
    "Härjedalen": [
      "Sveg", "Funäsdalen", "Ränea", "Linsell"
    ],
    "Jämtland": [
      "Östersund", "Krokom", "Ragunda", "Bräcke", "Åre", "Härjedalen", "Strömsund", "Berg"
    ],
    "Ångermanland": [
      "Härnösand", "Kramfors", "Sollefteå", "Örnsköldsvik", "Nordmaling"
    ],
    "Västerbotten": [
      "Umeå", "Skellefteå", "Lycksele", "Storuman", "Sorsele", "Malå",
      "Norsjö", "Vindeln", "Robertsfors", "Nordmaling", "Bjurholm",
      "Vännäs", "Vilhelmina", "Åsele", "Dorotea"
    ],
    "Norrbotten": [
      "Luleå", "Kiruna", "Piteå", "Boden", "Kalix", "Haparanda", "Arjeplog",
      "Arvidsjaur", "Jokkmokk", "Överkalix", "Övertorneå", "Pajala",
      "Gällivare"
    ],
    "Lappland": [
      "Kiruna", "Gällivare", "Jokkmokk", "Arjeplog", "Arvidsjaur", "Sorsele",
      "Storuman", "Vilhelmina", "Dorotea", "Åsele"
    ]
  }
};

const SwedishRegionsSelector = ({ 
  selectedLocation, 
  onLocationSelect, 
  error = null,
  placeholder = "🏙️ Välj din region"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedRegions, setExpandedRegions] = useState({});
  const [expandedLandscapes, setExpandedLandscapes] = useState({});
  const containerRef = useRef(null);

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

  const toggleLandscape = (landscape) => {
    setExpandedLandscapes(prev => ({
      ...prev,
      [landscape]: !prev[landscape]
    }));
  };

  const toggleRegion = (region) => {
    setExpandedRegions(prev => ({
      ...prev,
      [region]: !prev[region]
    }));
  };

  const handleLocationSelect = (location, region, landscape) => {
    onLocationSelect(location);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (!selectedLocation) return placeholder;
    
    // Find which region and landscape the selected location belongs to
    for (const [landscape, regions] of Object.entries(swedishLandscapes)) {
      for (const [region, cities] of Object.entries(regions)) {
        if (cities.includes(selectedLocation)) {
          return `📍 ${selectedLocation} (${region}, ${landscape})`;
        }
      }
    }
    return `📍 ${selectedLocation}`;
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        Vart i Sverige är du? <span className="text-red-500">*</span>
      </label>
      
      {/* Custom Select Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-4 border-2 ${
          error 
            ? 'border-red-300 bg-red-50/50' 
            : 'border-green-200 bg-white hover:border-green-300'
        } rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-200 text-left font-medium shadow-lg backdrop-blur-sm flex items-center justify-between`}
      >
        <span className={selectedLocation ? 'text-gray-700' : 'text-gray-500'}>
          {getDisplayText()}
        </span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-green-200 rounded-xl shadow-2xl max-h-96 overflow-y-auto">
          <div className="p-2">
            {Object.entries(swedishLandscapes).map(([landscape, regions]) => (
              <div key={landscape} className="mb-2">
                {/* Landscape Header */}
                <button
                  type="button"
                  onClick={() => toggleLandscape(landscape)}
                  className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg border border-green-200/50 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center mr-3">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-gray-800 text-lg">{landscape}</span>
                  </div>
                  {expandedLandscapes[landscape] ? (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  )}
                </button>

                {/* Regions within Landscape */}
                {expandedLandscapes[landscape] && (
                  <div className="mt-2 ml-4 space-y-1">
                    {Object.entries(regions).map(([region, cities]) => (
                      <div key={region}>
                        {/* Region Header */}
                        <button
                          type="button"
                          onClick={() => toggleRegion(`${landscape}-${region}`)}
                          className="w-full flex items-center justify-between p-2 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200/50 transition-all duration-200"
                        >
                          <span className="font-semibold text-gray-700 text-left">{region}</span>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-2">
                              {cities.length} cities
                            </span>
                            {expandedRegions[`${landscape}-${region}`] ? (
                              <ChevronUp className="w-3 h-3 text-gray-500" />
                            ) : (
                              <ChevronDown className="w-3 h-3 text-gray-500" />
                            )}
                          </div>
                        </button>

                        {/* Cities within Region */}
                        {expandedRegions[`${landscape}-${region}`] && (
                          <div className="mt-1 ml-4 grid grid-cols-1 gap-1">
                            {cities.map((city) => (
                              <button
                                key={city}
                                type="button"
                                onClick={() => handleLocationSelect(city, region, landscape)}
                                className={`text-left p-2 rounded-lg transition-all duration-200 ${
                                  selectedLocation === city
                                    ? 'bg-green-100 text-green-800 border border-green-300'
                                    : 'hover:bg-gray-50 text-gray-600 hover:text-gray-800'
                                }`}
                              >
                                <span className="text-sm">
                                  {selectedLocation === city ? '✓ ' : '• '}
                                  {city}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 flex items-center text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-200">
          <div className="w-4 h-4 mr-2 text-red-500">⚠️</div>
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SwedishRegionsSelector;
