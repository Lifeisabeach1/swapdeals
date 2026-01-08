'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
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

export default function Hero() {
  const howItWorks = [
    { 
      title: "Ladda upp dina föremål",
      description: "Ta foton och lista föremål du inte längre behöver",
      icon: Camera,
      bgColor: "from-green-400 to-green-500",
      cardBg: "from-green-50 to-green-100",
      borderColor: "border-green-200"
    },
    { 
      title: "Bläddra & Matcha",
      description: "Hitta användare med föremål du vill ha och föreslå byten",
      icon: Shuffle,
      bgColor: "from-yellow-400 to-yellow-500",
      cardBg: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-200"
    },
    { 
      title: "Kom överens & Byt",
      description: "Slutför detaljer och genomför ditt byte",
      icon: RefreshCw,
      bgColor: "from-emerald-400 to-emerald-500",
      cardBg: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100/40 relative">
      {/* Simplified background - removed animations for performance */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-100/20 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 relative">
        
        {/* Header - Simplified */}
        <header className="mb-6 sm:mb-10">
          <h1 className="text-xl font-bold text-green-700 sm:text-2xl lg:text-3xl">
            SwapDeals Bytesmarknad | Second Hand | Hållbart
          </h1>
        </header>

        {/* Hero Section - Mobile First */}
        <section className="grid lg:grid-cols-2 gap-6 items-center mb-10 sm:mb-14 lg:mb-16 lg:gap-10">
          
          {/* Content */}
          <div>
            <div className="inline-flex items-center bg-green-100 rounded-full px-3 py-1.5 mb-3 sm:mb-4">
              <Sparkles className="w-4 h-4 text-green-600 mr-1.5" />
              <span className="text-green-800 font-semibold text-xs sm:text-sm">Sveriges Smartaste Bytesplattform</span>
            </div>

            <h2 className="text-3xl font-extrabold leading-tight mb-4 sm:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-gray-900 via-green-600 to-gray-900 bg-clip-text text-transparent">
                Byteshandel Online
              </span>
            </h2>
            
            <p className="text-base text-gray-800 mb-2 sm:text-lg">
              Sveriges smartaste bytesplattform för begagnade prylar. 
            </p>
            <p className="text-base text-green-700 font-semibold mb-6 sm:text-lg">
              Byt kläder, möbler, elektronik & mer helt kostnadsfritt och hållbart!
            </p>

            {/* Action Buttons - Stacked on mobile */}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <a
                href="/tradeform"
                className="bg-gradient-to-r from-green-500 to-emerald-600 active:from-green-600 active:to-emerald-700 text-white font-bold text-base py-3.5 px-5 rounded-xl flex items-center justify-center shadow-lg sm:text-lg sm:py-4"
              >
                <ArrowLeftRight className="w-5 h-5 mr-2" />
                Börja Byta Nu Gratis
              </a>
              
              <a
                href="/tradelistingpage"
                className="bg-white border-2 border-green-600 active:border-green-700 text-green-700 font-bold text-base py-3.5 px-5 rounded-xl flex items-center justify-center shadow-md sm:text-lg sm:py-4"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Utforska Bytesannonser
              </a>
            </div>
          </div>

          {/* Image - Always visible */}
          <div>
            <div className="relative">
              <div className="bg-gradient-to-br from-white to-green-50/30 rounded-2xl shadow-xl border border-green-300/50 overflow-hidden">
                <img
                  src="/planet.webp"
                  alt="Byteshandel online"
                  width="800"
                  height="800"
                  fetchPriority="high"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features - Simplified cards */}
        <section className="mb-10 sm:mb-14 lg:mb-16">
          <div className="bg-white/95 rounded-2xl shadow-lg border border-green-200/50 p-5 sm:p-7 lg:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center bg-green-100 rounded-full px-3 py-1.5 mb-3">
                <Shield className="w-4 h-4 text-green-600 mr-1.5" />
                <span className="text-green-800 font-semibold text-xs sm:text-sm">Fördelarna med SwapDeals</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2 sm:text-3xl">
                Varför Välja SwapDeals Bytesplattform?
              </h3>
              <p className="text-gray-700 font-medium text-sm sm:text-base">
                Den bästa bytesmarknaden för begagnade varor i Sverige
              </p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
              <div className="text-center p-5 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 sm:p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-green-200 to-green-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-7 h-7 text-green-700" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-2 sm:text-lg">Hållbar Byteshandel Online</h4>
                <p className="text-sm text-gray-700">
                  Ge begagnade prylar nytt liv genom gratis byteshandel. Miljövänligt alternativ till nyköp.
                </p>
              </div>
              
              <div className="text-center p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 sm:p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-200 to-blue-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💰</span>
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-2 sm:text-lg">100% Gratis Bytesmarknad</h4>
                <p className="text-sm text-gray-700">
                  Byt kläder, möbler, elektronik & mer utan pengar. Kostnadsfri bytesplattform där värde möter värde.
                </p>
              </div>
              
              <div className="text-center p-5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 sm:p-6 sm:col-span-2 lg:col-span-1">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-200 to-purple-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-purple-700" />
                </div>
                <h4 className="text-base font-bold text-gray-900 mb-2 sm:text-lg">Säker Byteshandel Sverige</h4>
                <p className="text-sm text-gray-700">
                  Trygg bytesmarknad. Handla begagnat med förtroende i Sveriges största community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-10 sm:mb-14">
          <div className="bg-gradient-to-br from-green-50/60 via-white/60 to-yellow-50/60 rounded-2xl shadow-lg p-5 border border-green-200/50 sm:p-7 lg:p-8">
            
            <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:justify-between sm:items-center sm:mb-8">
              <div>
                <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-yellow-100 rounded-full px-3 py-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-green-600 mr-1.5" />
                  <span className="text-green-800 font-semibold text-xs sm:text-sm">Enkelt & Snabbt</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                  Så Fungerar SwapDeals
                </h3>
              </div>
              <a 
                href="/swapdeals-guide"
                className="inline-flex items-center justify-center text-green-600 font-semibold text-sm px-4 py-2 rounded-lg border border-green-200 sm:text-base"
              >
                Detaljerad Guide
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </a>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
              {howItWorks.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div 
                    key={index} 
                    className={`bg-gradient-to-br ${step.cardBg} rounded-xl shadow-md p-4 border ${step.borderColor} sm:p-5`}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.bgColor} rounded-xl mb-3 flex items-center justify-center sm:w-14 sm:h-14`}>
                      <IconComponent className="w-6 h-6 text-white sm:w-7 sm:h-7" />
                    </div>
                    
                    <h4 className="text-base font-bold text-gray-800 mb-2">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">
                      {step.description}
                    </p>
                    
                    <div className="flex items-center pt-2 border-t border-gray-200/50">
                      <div className={`w-7 h-7 bg-gradient-to-br ${step.bgColor} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                        {index + 1}
                      </div>
                      <div className="h-1 bg-gradient-to-r from-green-200 to-yellow-200 flex-grow ml-2 rounded-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Sustainable Trading - Simplified */}
        <section className="mb-10">
          <div className="bg-white/95 rounded-2xl shadow-lg overflow-hidden border border-green-200/50">
            <div className="h-1 bg-gradient-to-r from-green-400 via-yellow-400 to-green-500" />
            
            <div className="p-5 sm:p-7 lg:p-8">
              <div className="mb-4">
                <div className="inline-flex items-center bg-gradient-to-r from-green-100 to-yellow-100 rounded-full px-3 py-1.5">
                  <Leaf className="w-4 h-4 text-green-600 mr-1.5" />
                  <span className="text-green-800 font-semibold text-xs sm:text-sm">Miljövänligt Val</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-3 sm:text-3xl">
                Hållbar Handel för Framtiden
              </h3>
              
              <p className="text-gray-700 mb-5 text-base">
                Byt föremål du inte längre behöver mot saker du faktiskt vill ha. Bättre för din plånbok och planeten.
              </p>
              
              <div className="space-y-3 mb-5">
                <div className="flex items-start">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white mr-3 flex-shrink-0">
                    <span className="font-bold">✓</span>
                  </div>
                  <div className="pt-1">
                    <h4 className="font-bold text-gray-800 text-sm mb-0.5">Minska Avfall</h4>
                    <p className="text-sm text-gray-600">Förläng produkters livscykler genom smart återanvändning</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center text-white mr-3 flex-shrink-0">
                    <span className="font-bold">✓</span>
                  </div>
                  <div className="pt-1">
                    <h4 className="font-bold text-gray-800 text-sm mb-0.5">Spara Pengar</h4>
                    <p className="text-sm text-gray-600">Byt direkt utan mellanhänder eller extra kostnader</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center text-white mr-3 flex-shrink-0">
                    <span className="font-bold">✓</span>
                  </div>
                  <div className="pt-1">
                    <h4 className="font-bold text-gray-800 text-sm mb-0.5">Bygg Community</h4>
                    <p className="text-sm text-gray-600">Anslut med likasinnade över hela Sverige</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                <a href="/tradeform" className="flex-1">
                  <button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-5 rounded-xl font-bold shadow-lg flex items-center justify-center text-base">
                    <ArrowLeftRight className="w-5 h-5 mr-2" />
                    Börja Byta
                  </button>
                </a>
                <a href="/hallbar-konsumtion" className="flex-1">
                  <button className="w-full bg-white border-2 border-green-300 text-gray-800 py-3 px-5 rounded-xl font-bold flex items-center justify-center shadow-md text-base">
                    <Coffee className="w-5 h-5 mr-2" />
                    Läs Mer
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}