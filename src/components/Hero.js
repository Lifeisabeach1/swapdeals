'use client';

import { TrendingUp, ArrowLeftRight, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link'

export default function Hero() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100/40 relative overflow-hidden">
        {/* Premium light effect overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-100/30 to-transparent pointer-events-none"></div>
        
        {/* Animated background shapes */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
          {/* Header with Logo */}
          <header className="flex items-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-green-700 via-green-600 to-green-700 bg-clip-text text-transparent drop-shadow-sm">
              SwapDeals Bytesmarknad för Hållbar Handel
            </h1>
          </header>

          {/* Main Hero Section */}
          <section className="grid lg:grid-cols-2 gap-12 items-center mb-12 relative" aria-labelledby="hero-heading">
            {/* Left Column - Content */}
            <div className="space-y-6">
              <h2 id="hero-heading" className="text-4xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-gray-900 via-green-600 to-gray-900 bg-clip-text text-transparent drop-shadow-lg">
                 Byteshandel Online
                </span>
              </h2>
              
              <p className="text-xl text-gray-800 leading-relaxed font-medium">
                Sveriges smartaste bytesplattform för begagnade prylar. 
                <span className="block mt-2 text-green-700 font-bold">Byt kläder, möbler, elektronik & mer helt kostnadsfritt och hållbart!</span>
              </p>

              {/* Action Buttons - Mobile First */}
              <div className="flex flex-col gap-3 pt-6 sm:flex-row sm:gap-4">
                {/* Primary CTA Button */}
                <Link
                  href="/tradeform"
                  className="group relative bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-base sm:text-lg py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center w-full sm:w-auto shadow-lg hover:shadow-xl active:scale-98 min-h-[56px] touch-manipulation"
                  aria-label="Börja byta begagnade prylar gratis"
                >
                  <ArrowLeftRight className="w-5 h-5 mr-2 flex-shrink-0" aria-hidden="true" />
                  <span className="whitespace-nowrap">Börja Byta Nu Gratis</span>
                </Link>
                
                {/* Secondary Button */}
                <Link
                  href="/tradelistingpage"
                  className="group bg-white hover:bg-green-50 active:bg-green-100 border-2 border-green-600 text-green-700 hover:text-green-800 font-bold text-base sm:text-lg py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center w-full sm:w-auto shadow-md hover:shadow-lg active:scale-98 min-h-[56px] touch-manipulation"
                  aria-label="Se bytesannonser och begagnade prylar"
                >
                  <BookOpen className="w-5 h-5 mr-2 flex-shrink-0" aria-hidden="true" />
                  <span className="whitespace-nowrap">Utforska Bytesannonser</span>
                  <span className="ml-1 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Right Column - Hero Image - pulled up on desktop */}
            <div className="lg:-mt-24 transform hover:scale-105 transition-transform duration-500">
              <div className="relative w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/30 to-green-700/30 rounded-3xl blur-3xl animate-pulse"></div>
                <figure className="relative bg-gradient-to-br from-white via-green-50/30 to-white backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-green-300/50 overflow-hidden">
                  <Image
                    src="/bytaprylar.webp"
                    alt="Byteshandel online byt begagnade kläder, möbler, elektronik gratis på SwapDeals bytesplattform för hållbar handel och second hand shopping"
                    width={800}
                    height={800}
                    className="object-cover w-full h-auto"
                    priority
                  />
                  <figcaption className="sr-only">
                    Bytesplattform för begagnade varor handla second hand gratis genom byteshandel online
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>

          {/* Platform Features Section */}
          <section className="mt-16" aria-labelledby="features-heading">
            <div className="bg-gradient-to-br from-white via-green-50/30 to-white backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-green-300/50 p-10">
              <header className="text-center mb-10">
                <h3 id="features-heading" className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-900 via-green-700 to-gray-900 bg-clip-text text-transparent mb-4">
                  Varför Välja SwapDeals Bytesplattform?
                </h3>
                <p className="text-gray-700 font-semibold text-lg">Den bästa bytesmarknaden för begagnade varor i Sverige</p>
              </header>
              
              <div className="grid md:grid-cols-3 gap-8">
                <article className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 hover:from-green-100 hover:to-green-200/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-green-200/50">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-200 to-green-300 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl" aria-hidden="true">
                    <span className="text-4xl">🌱</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Hållbar Byteshandel Online</h4>
                  <p className="text-gray-700 leading-relaxed">Ge begagnade prylar nytt liv genom gratis byteshandel. Miljövänligt alternativ till nyköp second hand shopping utan mellanhänder.</p>
                </article>
                
                <article className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 hover:from-blue-100 hover:to-blue-200/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-blue-200/50">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-200 to-blue-300 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl" aria-hidden="true">
                    <span className="text-4xl">💰</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">100% Gratis Bytesmarknad</h4>
                  <p className="text-gray-700 leading-relaxed">Byt kläder, möbler, elektronik & mer utan pengar. Kostnadsfri bytesplattform där värde möter värde ingen provision eller dolda avgifter.</p>
                </article>
                
                <article className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-200/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-purple-200/50">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-200 to-purple-300 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xl" aria-hidden="true">
                    <span className="text-4xl">🤝</span>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">Säker Byteshandel Sverige</h4>
                  <p className="text-gray-700 leading-relaxed">Trygg bytesmarknad. Handla begagnat med förtroende i Sveriges största community för byteshandel online.</p>
                </article>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}