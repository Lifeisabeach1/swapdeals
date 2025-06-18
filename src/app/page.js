// Enhanced Homepage with Green/Yellow Theme Integration - Combined NewTradesCarousel and PlatformData
'use client';

import Head from 'next/head';
import { useState } from 'react';
import { Search, ChevronDown, MapPin, Bell, Heart, MessageSquare, User, Menu, 
  ArrowLeftRight, Package, RefreshCw, Zap, Send, Compass, BookOpen, 
  Gift, ShoppingBag, Camera, Coffee, Shuffle, Briefcase, ArrowRight, Tag, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import NewTradesCarousel from './newtradescarousel/page';
import PlatformData from './platformdata/page';
import PopularTradeCategories from './populartradescategories/page';
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
    router.push('/zwapit-guide');
  };

  const navigateToSustainableTrading = () => {
    router.push('/sustainable-trading');
  };

  const howItWorks = [
    { 
      title: "Ladda upp dina föremål",
      description: "Ta foton och lista föremål du inte längre behöver",
      icon: <Camera className="w-6 h-6 text-white" />,
      bgColor: "from-green-400 to-green-500",
      cardBg: "from-green-50 to-green-100",
      borderColor: "border-green-200/50"
    },
    { 
      title: "Bläddra & Matcha",
      description: "Hitta användare med föremål du vill ha och föreslå byten",
      icon: <Shuffle className="w-6 h-6 text-white" />,
      bgColor: "from-yellow-400 to-yellow-500",
      cardBg: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-200/50"
    },
    { 
      title: "Kom överens & Byt",
      description: "Slutför detaljer och genomför ditt byte",
      icon: <RefreshCw className="w-6 h-6 text-white" />,
      bgColor: "from-emerald-400 to-emerald-500",
      cardBg: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200/50"
    }
  ];

  return (
    <>
      <Head>
        <title>SwapDeals - Hållbar Handel och Bytesmarknad Online | Byt Grejer Gratis</title>
        <meta name="description" content="SwapDeals är din loppmarknad online för hållbar handel. Byt föremål du inte längre behöver mot saker du faktiskt vill ha. Miljövänligt, kostnadsfritt och enkelt att använda." />
        <meta name="keywords" content="loppmarknad online, bytesmarknad online, byt grejer gratis, hållbar handel, byta föremål, miljövänlig handel, svensk bytesmarknad, gratis byten, cirkulär ekonomi, återvinning" />
        <meta name="author" content="SwapDeals" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph tags for social media */}
        <meta property="og:title" content="SwapDeals - Hållbar Handel och Bytesmarknad Online" />
        <meta property="og:description" content="Byt föremål du inte längre behöver mot saker du faktiskt vill ha. Bättre för din plånbok och planeten." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://swapdeals.se" />
        <meta property="og:site_name" content="SwapDeals" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SwapDeals - Hållbar Handel och Bytesmarknad Online" />
        <meta name="twitter:description" content="Byt föremål du inte längre behöver mot saker du faktiskt vill ha. Miljövänligt och kostnadsfritt." />
        
        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <meta name="language" content="sv" />
        <meta name="geo.region" content="SE" />
        <meta name="geo.country" content="Sweden" />
        <link rel="canonical" href="https://swapdeals.se" />
      </Head>

      <div className="flex flex-col min-h-screen bg-gradient-to-br from-green-50/30 via-gray-50 to-yellow-50/30">
        <div className="max-w-6xl mx-auto w-full px-4 flex-1 py-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-green-200/30 p-6 overflow-hidden relative">
            {/* Enhanced top accent with green/yellow gradient */}
            
            
            {/* Premium floating orbs with green/yellow theme */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-green-200/20 to-yellow-200/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-yellow-200/20 to-green-200/20 rounded-full blur-3xl"></div>
            
            {/* Combined Platform Data and New Trades section */}
            <section className="bg-gradient-to-br from-green-50/50 via-white/50 to-yellow-50/50 py-8 rounded-xl shadow-lg border border-green-200/30 relative overflow-hidden mb-6">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none z-0"></div>
              
              {/* Platform Data at the top */}
              <div className="mb-8 relative z-10">
                <PlatformData />
              </div>
              
              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-green-200/50 to-transparent mb-8"></div>
              
              {/* New Trades Carousel below */}
              <div className="relative z-10">
                <NewTradesCarousel />
              </div>
            </section>

            {/* Enhanced How It Works section */}
            <section className="py-4 mb-6">
              <div className="bg-gradient-to-br from-green-50/50 via-white/50 to-yellow-50/50 rounded-xl shadow-lg p-4 border border-green-200/30 relative overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100/30 to-yellow-100/30 rounded-full blur-2xl"></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3 relative z-10">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent drop-shadow-sm">
                    Så fungerar SwapDeals
                  </h2>
                  <button 
                    onClick={navigateToGuide}
                    className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm transition-all duration-200 hover:bg-green-50 px-3 py-2 rounded-lg border border-green-200/50 hover:border-green-300 hover:shadow-md"
                  >
                    Se detaljerad guide
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                  {howItWorks.map((step, index) => (
                    <div key={index} className={`bg-gradient-to-br ${step.cardBg} rounded-lg shadow-md p-4 border ${step.borderColor} transform hover:-translate-y-1 transition-all duration-300 hover:shadow-lg relative overflow-hidden`}>
                      {/* Card accent */}
                      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.bgColor}`}></div>
                      
                      <div className={`w-12 h-12 bg-gradient-to-br ${step.bgColor} rounded-xl mb-3 flex items-center justify-center shadow-lg`}>
                        {step.icon}
                      </div>
                      <h3 className="text-base font-bold text-gray-800 mb-2">{step.title}</h3>
                      <p className="text-gray-700 text-sm mb-3">{step.description}</p>
                      <div className="flex items-center">
                        <div className={`w-7 h-7 bg-gradient-to-br ${step.bgColor} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                          {index + 1}
                        </div>
                        <div className="h-1 bg-gradient-to-r from-green-200 to-yellow-200 flex-grow ml-2 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="mb-6">
              <PopularTradeCategories />
            </div>
            
            {/* Enhanced Sustainable Trading section */}
            <section className="py-4 mb-6">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300 border border-green-200/30 relative">
                {/* Top accent strip */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-green-500"></div>
                
                <div className="md:flex flex-row-reverse">
                  <div className="md:w-1/2 bg-gradient-to-br from-green-50/50 to-yellow-50/50 flex items-center justify-center p-4 relative">
                    <div className="relative w-full h-48">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-100/70 to-yellow-100/70 opacity-70 rounded-lg"></div>
                      <div className="absolute inset-4 border-2 border-green-400/40 border-dashed rounded-lg flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                          <Shuffle className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      {/* Floating elements */}
                      <div className="absolute top-2 right-2 w-4 h-4 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full opacity-60"></div>
                      <div className="absolute bottom-2 left-2 w-3 h-3 bg-gradient-to-br from-green-300 to-green-400 rounded-full opacity-60"></div>
                    </div>
                  </div>
                  <div className="p-6 md:w-1/2 flex flex-col justify-center relative">
                    <div className="relative z-10">
                      <div className="mb-2">
                        <span className="inline-block bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full mb-2 border border-green-200/50">
                          Miljövänligt
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent mb-3 drop-shadow-sm">
                        Hållbar Handel
                      </h2>
                      <p className="text-gray-700 mb-4 text-sm">
                        Byt föremål du inte längre behöver mot saker du faktiskt vill ha. Bättre för din plånbok och planeten.
                      </p>
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white mr-3 text-xs shadow-sm">✓</div>
                          <span className="text-gray-700 text-sm">Minska avfall genom att förlänga produkters livscykler</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white mr-3 text-xs shadow-sm">✓</div>
                          <span className="text-gray-700 text-sm">Spara pengar genom direkta byten</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white mr-3 text-xs shadow-sm">✓</div>
                          <span className="text-gray-700 text-sm">Bygg din community över hela Sverige</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <Link href="/tradeform">
                          <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-5 rounded-lg transition-all duration-300 font-medium shadow-lg hover:shadow-xl flex items-center justify-center transform hover:-translate-y-1 text-sm">
                            <ArrowLeftRight className="w-4 h-4 mr-2" />
                           Swap nu
                          </button>
                        </Link>
                        <button 
                          onClick={navigateToSustainableTrading}
                          className="bg-white border border-green-300 hover:border-green-500 text-gray-800 hover:text-green-600 py-3 px-5 rounded-lg transition-all duration-300 font-medium flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-1 text-sm hover:bg-green-50/50"
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

            <div className="mb-6">
              <Testimonials />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}