"use client";

import React, { useMemo } from 'react';
import { 
  ArrowLeftRight, 
  BookOpen, 
  Camera, 
  Shuffle, 
  RefreshCw, 
  Coffee,
  ArrowRight,
  Sparkles,
  Shield,
  Leaf
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import NewTradesCarousel from '../newtradescarousel/page';
import Testimonials from '../testimonial/page';

// Constants - moved outside component for better performance
const HOW_IT_WORKS_STEPS = [
  { 
    title: "Ladda upp dina föremål",
    description: "Ta foton och lista föremål du inte längre behöver i Linköping",
    icon: Camera,
    bgColor: "from-green-400 to-green-500",
    cardBg: "from-green-50/90 to-green-100/80",
    borderColor: "border-green-200/60"
  },
  { 
    title: "Bläddra & Matcha",
    description: "Hitta linköpingsbor med föremål du vill ha och föreslå byten",
    icon: Shuffle,
    bgColor: "from-yellow-400 to-yellow-500",
    cardBg: "from-yellow-50/90 to-yellow-100/80",
    borderColor: "border-yellow-200/60"
  },
  { 
    title: "Kom överens & Byt",
    description: "Träffas lokalt i Linköping och genomför ditt byte",
    icon: RefreshCw,
    bgColor: "from-emerald-400 to-emerald-500",
    cardBg: "from-emerald-50/90 to-emerald-100/80",
    borderColor: "border-emerald-200/60"
  }
];

// Background component - simplified for performance
const BackgroundElements = () => (
  <>
    <div className="absolute inset-0 bg-gradient-to-b from-green-100/30 to-transparent pointer-events-none" aria-hidden="true"></div>
    <div className="absolute top-20 right-10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl animate-pulse" aria-hidden="true"></div>
    <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} aria-hidden="true"></div>
  </>
);

// Hero Section - optimized structure
const HeroSection = () => {
  return (
    <section className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 sm:mb-16 lg:mb-20 relative" aria-labelledby="hero-heading">
      
      {/* Left Column - Content */}
      <div className="space-y-6 order-1 lg:order-1">
        <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-4 py-2 shadow-md mb-4">
          <Sparkles className="w-5 h-5 text-green-600 mr-2" strokeWidth={2.5} aria-hidden="true" />
          <span className="text-green-800 font-bold text-sm">Linköpings Smartaste Bytesplattform</span>
        </div>

        <h2 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
          <span className="bg-gradient-to-r from-gray-900 via-green-600 to-gray-900 bg-clip-text text-transparent drop-shadow-lg">
            Byteshandel i Linköping
          </span>
        </h2>
        
        <p className="text-lg sm:text-xl text-gray-800 leading-relaxed font-medium">
          Linköpings ledande bytesplattform för begagnade prylar. 
          <span className="block mt-2 text-green-700 font-bold">
            Byt möbler, kläder, elektronik & mer helt kostnadsfritt och hållbart i universitets- och teknikstaden!
          </span>
        </p>

        {/* Action Buttons */}
        <nav className="flex flex-col gap-3 pt-6 sm:flex-row sm:gap-4" aria-label="Primära åtgärder">
          <Link
            href="/tradeform"
            className="group relative bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-base sm:text-lg py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center w-full sm:w-auto shadow-xl hover:shadow-2xl transform hover:scale-105 min-h-[56px] touch-manipulation"
            aria-label="Börja byta begagnade prylar gratis i Linköping"
          >
            <ArrowLeftRight className="w-5 h-5 mr-2 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
            <span className="whitespace-nowrap">Börja Byta i Linköping</span>
          </Link>
          
          <Link
            href="/tradelistingpage"
            className="group bg-white hover:bg-green-50 border-2 border-green-600 hover:border-green-700 text-green-700 hover:text-green-800 font-bold text-base sm:text-lg py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center w-full sm:w-auto shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[56px] touch-manipulation"
            aria-label="Se bytesannonser i Linköping"
          >
            <BookOpen className="w-5 h-5 mr-2 flex-shrink-0" strokeWidth={2.5} aria-hidden="true" />
            <span className="whitespace-nowrap">Utforska Bytes Annonser</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} aria-hidden="true" />
          </Link>
        </nav>
      </div>

      {/* Right Column - Hero Image */}
      <div className="order-2 lg:order-2 transform hover:scale-105 transition-transform duration-500">
        <div className="relative w-full">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-green-700/30 rounded-3xl blur-3xl animate-pulse" aria-hidden="true"></div>
          <figure className="relative bg-gradient-to-br from-white via-green-50/30 to-white backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-green-300/50 overflow-hidden">
            <Image
              src="/radda-globen.webp"
              alt="Byteshandel i Linköping byt begagnade kläder, möbler, elektronik gratis på SwapDeals bytesplattform"
              width={800}
              height={800}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover w-full h-auto"
              priority
            />
            <figcaption className="sr-only">
              Bytesplattform för begagnade varor i Linköping handla second hand genom byteshandel lokalt
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};

// Platform Features Section - optimized
const PlatformFeatures = () => {
  return (
    <section className="mb-12 sm:mb-16 lg:mb-20" aria-labelledby="features-heading">
      <div className="bg-gradient-to-br from-white/95 via-green-50/40 to-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-green-200/60 p-6 sm:p-8 lg:p-10">
        <header className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-full px-4 py-2 shadow-md mb-4">
            <Shield className="w-5 h-5 text-green-600 mr-2" strokeWidth={2.5} aria-hidden="true" />
            <span className="text-green-800 font-bold text-sm">Fördelarna med SwapDeals</span>
          </div>
          <h3 id="features-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-green-700 to-gray-900 bg-clip-text text-transparent mb-4">
            Varför Välja SwapDeals i Linköping?
          </h3>
          <p className="text-gray-700 font-semibold text-base sm:text-lg">
            Linköpings bästa bytesmarknad för begagnade varor
          </p>
        </header>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <article className="text-center p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-green-50/90 to-green-100/60 hover:from-green-100 hover:to-green-200/70 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-green-200/60">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-200 to-green-300 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl" aria-hidden="true">
              <Leaf className="w-8 h-8 sm:w-10 sm:h-10 text-green-700" strokeWidth={2.5} />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Hållbar Byteshandel i Linköping</h4>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Byt lokalt, gratis och miljövänligt. Ge begagnade prylar nytt liv i Linköping utan mellanhänder - ett smart alternativ till nyköp och second hand-shopping.
            </p>
          </article>
          
          <article className="text-center p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-50/90 to-blue-100/60 hover:from-blue-100 hover:to-blue-200/70 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-blue-200/60">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-200 to-blue-300 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl" aria-hidden="true">
              <span className="text-3xl sm:text-4xl">💰</span>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">100% Gratis Bytesmarknad</h4>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Byt kläder, möbler, elektronik helt utan pengar i Linköping. En gratis bytesplattform där värde byts mot värde, utan avgifter eller provision.
            </p>
          </article>
          
          <article className="text-center p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-purple-50/90 to-purple-100/60 hover:from-purple-100 hover:to-purple-200/70 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-purple-200/60 sm:col-span-2 lg:col-span-1">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-200 to-purple-300 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl" aria-hidden="true">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-purple-700" strokeWidth={2.5} />
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">Säker Byteshandel i Linköping</h4>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Säker byteshandel i Linköping. Byt prylar lokalt, gratis och enkelt. Mer hållbart, mer personligt, mer Linköping.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

// How It Works Section - optimized
const HowItWorks = () => {
  const steps = useMemo(() => HOW_IT_WORKS_STEPS, []);
  
  return (
    <section className="mb-12 sm:mb-16 lg:mb-20" aria-labelledby="how-it-works-heading">
      <div className="bg-gradient-to-br from-green-50/60 via-white/60 to-yellow-50/60 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border-2 border-green-200/50 relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-gradient-to-br from-green-100/30 to-yellow-100/30 rounded-full blur-3xl" aria-hidden="true"></div>
        
        <div className="relative z-10">
          <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
            <div>
              <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-yellow-100 rounded-full px-4 py-2 shadow-md mb-3">
                <Sparkles className="w-5 h-5 text-green-600 mr-2" strokeWidth={2.5} aria-hidden="true" />
                <span className="text-green-800 font-bold text-sm">Enkelt & Snabbt</span>
              </div>
              <h3 id="how-it-works-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent">
                Så Fungerar SwapDeals i Linköping
              </h3>
            </div>
            <Link 
              href="/swapdeals-guide"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-bold text-sm sm:text-base transition-all duration-300 hover:bg-green-50 px-4 py-2.5 rounded-xl border-2 border-green-200/60 hover:border-green-300 hover:shadow-lg self-start group"
            >
              <span>Detaljerad Guide</span>
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} aria-hidden="true" />
            </Link>
          </header>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <article 
                  key={index} 
                  className={`bg-gradient-to-br ${step.cardBg} backdrop-blur-sm rounded-2xl shadow-xl p-5 sm:p-6 border-2 ${step.borderColor} transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl relative overflow-hidden group`}
                >
                  <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${step.bgColor}`} aria-hidden="true"></div>
                  
                  <div className="flex flex-col h-full">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${step.bgColor} rounded-2xl mb-4 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
                    </div>
                    
                    <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-3">
                      {step.title}
                    </h4>
                    <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed flex-1">
                      {step.description}
                    </p>
                    
                    <div className="flex items-center pt-3 border-t border-gray-200/50">
                      <div className={`w-8 h-8 bg-gradient-to-br ${step.bgColor} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                        {index + 1}
                      </div>
                      <div className="h-1 bg-gradient-to-r from-green-200 to-yellow-200 flex-grow ml-3 rounded-full" aria-hidden="true"></div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// Sustainable Trading Section - optimized
const SustainableTrading = () => {
  return (
    <section className="mb-12 sm:mb-16" aria-labelledby="sustainable-heading">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transform hover:-translate-y-1 transition-all duration-300 border-2 border-green-200/50 relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-yellow-400 to-green-500" aria-hidden="true"></div>
        
        <div className="grid lg:grid-cols-2 gap-0">
          
          {/* Left - Content */}
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center order-2 lg:order-1">
            <div className="mb-4">
              <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-yellow-100 rounded-full px-4 py-2 shadow-md">
                <Leaf className="w-5 h-5 text-green-600 mr-2" strokeWidth={2.5} aria-hidden="true" />
                <span className="text-green-800 font-bold text-sm">Miljövänligt Val</span>
              </div>
            </div>
            
            <h3 id="sustainable-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent mb-4">
              Hållbar Handel i Linköping
            </h3>
            
            <p className="text-gray-700 mb-6 text-base sm:text-lg leading-relaxed">
              Byt föremål du inte längre behöver mot saker du faktiskt vill ha. Möt andra linköpingsbor och handla hållbart. Bättre för din plånbok och planeten.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white mr-4 shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="font-bold">✓</span>
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="font-bold text-gray-800 mb-1">Minska Avfall</h4>
                  <p className="text-sm sm:text-base text-gray-600">Förläng produkters livscykler genom smart återanvändning i Linköping</p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white mr-4 shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="font-bold">✓</span>
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="font-bold text-gray-800 mb-1">Spara Pengar</h4>
                  <p className="text-sm sm:text-base text-gray-600">Byt direkt utan mellanhänder eller extra kostnader</p>
                </div>
              </div>
              
              <div className="flex items-start group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white mr-4 shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="font-bold">✓</span>
                </div>
                <div className="flex-1 pt-1">
                  <h4 className="font-bold text-gray-800 mb-1">Bygg Community</h4>
                  <p className="text-sm sm:text-base text-gray-600">Anslut med likasinnade i Linköping</p>
                </div>
              </div>
            </div>
            
            <nav className="flex flex-col sm:flex-row gap-3 sm:gap-4" aria-label="Sekundära åtgärder">
              <Link href="/tradeform" className="flex-1">
                <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3.5 px-6 rounded-xl transition-all duration-300 font-bold shadow-xl hover:shadow-2xl flex items-center justify-center transform hover:scale-105 text-base">
                  <ArrowLeftRight className="w-5 h-5 mr-2" strokeWidth={2.5} aria-hidden="true" />
                  Börja Byta
                </button>
              </Link>
              <Link href="/hallbar-konsumtion" className="flex-1">
                <button className="w-full bg-white border-2 border-green-300 hover:border-green-500 text-gray-800 hover:text-green-600 py-3.5 px-6 rounded-xl transition-all duration-300 font-bold flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 hover:bg-green-50/50 text-base">
                  <Coffee className="w-5 h-5 mr-2" strokeWidth={2.5} aria-hidden="true" />
                  Läs Mer
                </button>
              </Link>
            </nav>
          </div>

          {/* Right - Visual */}
          <aside className="order-1 lg:order-2 bg-gradient-to-br from-green-50/70 to-yellow-50/70 flex items-center justify-center p-8 sm:p-12 relative min-h-[300px] sm:min-h-[400px]">
            <div className="relative w-full max-w-md h-full">
              <div className="absolute inset-0 bg-gradient-to-r from-green-100/70 to-yellow-100/70 opacity-70 rounded-3xl" aria-hidden="true"></div>
              <div className="absolute inset-4 border-3 border-green-400/40 border-dashed rounded-3xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-yellow-400 rounded-full flex items-center justify-center shadow-2xl">
                  <Shuffle className="w-10 h-10 sm:w-12 sm:h-12 text-white" strokeWidth={2.5} aria-hidden="true" />
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full opacity-60 animate-bounce" aria-hidden="true"></div>
              <div className="absolute bottom-4 left-4 w-5 h-5 bg-gradient-to-br from-green-300 to-green-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0.5s'}} aria-hidden="true"></div>
              <div className="absolute top-1/2 right-8 w-4 h-4 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '1s'}} aria-hidden="true"></div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

// Main component
export default function HeroClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100/40 relative overflow-hidden">
      <BackgroundElements />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative z-10">
        
        {/* Header with Logo */}
        <header className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-green-600 to-gray-900 bg-clip-text text-transparent drop-shadow-lg leading-tight">
            SwapDeals Linköping - Second Hand & Begagnat
          </h1>
        </header>

        <HeroSection />
        <PlatformFeatures />
        <HowItWorks />
        <SustainableTrading />

        {/* New Trades Carousel Section */}
        <section className="mb-12 sm:mb-16 lg:mb-20">
          <NewTradesCarousel />
        </section>

        {/* Testimonials Section */}
        <section className="mb-12 sm:mb-16">
          <Testimonials />
        </section>
      </div>
    </div>
  );
}
