// app/page.js
'use client';

import { useState } from 'react';
import {
  ArrowLeftRight, RefreshCw, Camera, Coffee, Shuffle, ArrowRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import NewTradesCarousel from './newtradescarousel/page';
import Hero from '@/components/Hero'
import Testimonials from './testimonial/page';
import Link from 'next/link';

export default function TradeSmart() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState({
    query: '',
    location: 'Hela Sverige',
    category: 'Alla Kategorier'
  });

  const handleSearch = (searchData) => {
    setSearchParams(searchData);
  };

  const navigateToTradeForm = () => {
    router.push('/createtradepage');
  };

  const navigateToGuide = () => {
    router.push('/swapdeals-guide');
  };

  const navigateToSustainableTrading = () => {
    router.push('/sustainable-trading');
  };

  const howItWorks = [
    { 
      title: "Ladda upp dina föremål",
      description: "Ta foton och lista föremål du inte längre behöver",
      icon: <Camera className="w-5 h-5 text-white" />,
      bgColor: "from-green-400 to-green-500",
      cardBg: "from-green-50 to-green-100",
      borderColor: "border-green-200/50"
    },
    { 
      title: "Bläddra & Matcha",
      description: "Hitta användare med föremål du vill ha och föreslå byten",
      icon: <Shuffle className="w-5 h-5 text-white" />,
      bgColor: "from-yellow-400 to-yellow-500",
      cardBg: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-200/50"
    },
    { 
      title: "Kom överens & Byt",
      description: "Slutför detaljer och genomför ditt byte",
      icon: <RefreshCw className="w-5 h-5 text-white" />,
      bgColor: "from-emerald-400 to-emerald-500",
      cardBg: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200/50"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50/30 via-gray-50 to-yellow-50/30">
      {/* WebSite structured data for search functionality */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SwapDeals",
            "url": "https://swapdeals.se",
            "description": "Sveriges ledande plattform för hållbar byteshandel",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://swapdeals.se/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      
      <div className="max-w-6xl mx-auto w-full px-3 sm:px-4 flex-1 py-3 sm:py-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl border border-green-200/30 p-3 sm:p-6 overflow-hidden relative">
          
          {/* Premium floating orbs with green/yellow theme - smaller on mobile */}
          <div className="absolute -top-12 sm:-top-24 -right-12 sm:-right-24 w-24 sm:w-48 h-24 sm:h-48 bg-gradient-to-br from-green-200/20 to-yellow-200/20 rounded-full blur-2xl sm:blur-3xl"></div>
          <div className="absolute -bottom-12 sm:-bottom-24 -left-12 sm:-left-24 w-24 sm:w-48 h-24 sm:h-48 bg-gradient-to-br from-yellow-200/20 to-green-200/20 rounded-full blur-2xl sm:blur-3xl"></div>
          
          {/* Combined Platform Data and New Trades section */}
          <section className="bg-gradient-to-br from-green-50/50 via-white/50 to-yellow-50/50 py-4 sm:py-8 rounded-lg sm:rounded-xl shadow-lg border border-green-200/30 relative overflow-hidden mb-4 sm:mb-6">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-0"></div>
            
            {/* Platform Data at the top */}
            <div className="mb-6 sm:mb-8 relative z-10">
              <Hero />
            </div>
            
            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-green-200/50 to-transparent mb-6 sm:mb-8"></div>
            
            {/* New Trades Carousel below */}
            <div className="relative z-10">
              <NewTradesCarousel />
            </div>
          </section>

          {/* Enhanced How It Works section - Mobile optimized */}
          <section className="py-3 sm:py-4 mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-green-50/50 via-white/50 to-yellow-50/50 rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 border border-green-200/30 relative overflow-hidden">
              {/* Subtle background pattern - smaller on mobile */}
              <div className="absolute top-0 right-0 w-16 sm:w-32 h-16 sm:h-32 bg-gradient-to-br from-green-100/30 to-yellow-100/30 rounded-full blur-xl sm:blur-2xl"></div>
              
              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-4 relative z-10">
                <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent drop-shadow-sm">
                  Så fungerar SwapDeals
                </h2>
                <button 
                  onClick={navigateToGuide}
                  className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-xs sm:text-sm transition-all duration-200 hover:bg-green-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg border border-green-200/50 hover:border-green-300 hover:shadow-md self-start"
                >
                  Se detaljerad guide
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                </button>
              </div>
              
              {/* Mobile: Stack vertically, Desktop: 3 columns */}
              <div className="flex flex-col space-y-3 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-4 relative z-10">
                {howItWorks.map((step, index) => (
                  <div key={index} className={`bg-gradient-to-br ${step.cardBg} rounded-lg shadow-md p-3 sm:p-4 border ${step.borderColor} transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg relative overflow-hidden`}>
                    {/* Card accent */}
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.bgColor}`}></div>
                    
                    <div className="flex items-start space-x-3 sm:block sm:space-x-0">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${step.bgColor} rounded-lg sm:rounded-xl mb-0 sm:mb-3 flex items-center justify-center shadow-lg flex-shrink-0`}>
                        {step.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-1 sm:mb-2">{step.title}</h3>
                        <p className="text-gray-700 text-xs sm:text-sm mb-2 sm:mb-3 leading-relaxed">{step.description}</p>
                        <div className="flex items-center">
                          <div className={`w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br ${step.bgColor} rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md`}>
                            {index + 1}
                          </div>
                          <div className="h-0.5 sm:h-1 bg-gradient-to-r from-green-200 to-yellow-200 flex-grow ml-2 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Enhanced Sustainable Trading section - Mobile optimized */}
          <section className="py-3 sm:py-4 mb-4 sm:mb-6">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 border border-green-200/30 relative">
              {/* Top accent strip */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-green-500"></div>
              
              {/* Mobile: Stack vertically, Desktop: Side by side */}
              <div className="flex flex-col md:flex-row-reverse">
                <div className="w-full md:w-1/2 bg-gradient-to-br from-green-50/50 to-yellow-50/50 flex items-center justify-center p-3 sm:p-4 relative order-2 md:order-1">
                  <div className="relative w-full h-32 sm:h-48">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-100/70 to-yellow-100/70 opacity-70 rounded-lg"></div>
                    <div className="absolute inset-2 sm:inset-4 border-2 border-green-400/40 border-dashed rounded-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                        <Shuffle className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                    </div>
                    {/* Floating elements */}
                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full opacity-60"></div>
                    <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-br from-green-300 to-green-400 rounded-full opacity-60"></div>
                  </div>
                </div>
                <div className="p-4 sm:p-6 w-full md:w-1/2 flex flex-col justify-center relative order-1 md:order-2">
                  <div className="relative z-10">
                    <div className="mb-2">
                      <span className="inline-block bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 text-xs font-medium px-2 sm:px-3 py-1 rounded-full mb-2 border border-green-200/50">
                        Miljövänligt
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent mb-2 sm:mb-3 drop-shadow-sm">
                      Hållbar Handel
                    </h2>
                    <p className="text-gray-700 mb-3 sm:mb-4 text-sm leading-relaxed">
                      Byt föremål du inte längre behöver mot saker du faktiskt vill ha. Bättre för din plånbok och planeten.
                    </p>
                    <div className="flex flex-col space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      <div className="flex items-start">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white mr-2 sm:mr-3 text-xs shadow-sm flex-shrink-0 mt-0.5">✓</div>
                        <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">Minska avfall genom att förlänga produkters livscykler</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white mr-2 sm:mr-3 text-xs shadow-sm flex-shrink-0 mt-0.5">✓</div>
                        <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">Spara pengar genom direkta byten</span>
                      </div>
                      <div className="flex items-start">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white mr-2 sm:mr-3 text-xs shadow-sm flex-shrink-0 mt-0.5">✓</div>
                        <span className="text-gray-700 text-xs sm:text-sm leading-relaxed">Bygg din community över hela Sverige</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:gap-3">
                      <Link href="/tradeform" className="flex-1">
                        <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center justify-center transform hover:-translate-y-1 text-sm">
                          <ArrowLeftRight className="w-4 h-4 mr-2" />
                          Swap
                        </button>
                      </Link>
                      <button 
                        onClick={navigateToSustainableTrading}
                        className="w-full sm:w-auto bg-white border border-green-300 hover:border-green-500 text-gray-800 hover:text-green-600 py-2.5 sm:py-3 px-4 sm:px-5 rounded-lg transition-all duration-300 font-medium flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-1 text-sm hover:bg-green-50/50"
                      >
                        <Coffee className="w-4 h-4 mr-2" />
                        Läs Mer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="mb-4 sm:mb-6">
            <Testimonials />
          </div>
        </div>
      </div>
    </div>
  );
}