// Enhanced Premium Footer with Blog
'use client';

import { useState } from 'react';
import { Heart, Mail, MapPin, Clock, ArrowRight, Instagram, Facebook, Twitter } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const [hoveredSection, setHoveredSection] = useState(null);

  const footerSections = [
    {
      title: 'SwapDeals',
      items: [
        { name: 'Blogg', href: '/blogg' },
        { name: 'Kontakta oss', href: '/kontakt' },
      ]
    }
  ];

  const cityColumns = [
    {
      title: 'Städer',
      items: [
        { name: 'Stockholm', href: '/swapdeal-stockholm' },
        { name: 'Göteborg', href: '/swapdeal-goteborg' },
        { name: 'Malmö', href: '/swapdeal-malmo' },
        { name: 'Uppsala', href: '/swapdeal-uppsala' },
      ]
    },
    {
      title: 'Städer',
      items: [
        { name: 'Linköping', href: '/swapdeal-linkoping' },
        { name: 'Västerås', href: '/swapdeal-vasteras' },
        { name: 'Örebro', href: '/swapdeal-orebro' },
      ]
    }
  ];

  const legalLinks = [
    { name: 'Sekretesspolicy', href: '/privacy' },
    { name: 'Användarvillkor', href: '/terms' },
    { name: 'Cookie-policy', href: '/cookieconsent' },
  ];

  const contactInfo = [
    { icon: Mail, text: 'kontakt@swapdeals.se', href: 'mailto:kontakt@swapdeals.se' },
    { icon: MapPin, text: 'Uppsala, Sverige' },
    { icon: Clock, text: 'Mån-Fre 9:00-17:00' },
  ];

  const socialLinks = [
    { icon: Instagram, href: 'https://www.instagram.com/swapdeals.se/', label: 'Instagram', color: 'hover:bg-pink-500' },
    { icon: Facebook, href: 'https://www.facebook.com/swapdeals', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Twitter, href: 'https://twitter.com/SwapDealsSE', label: 'Twitter', color: 'hover:bg-sky-500' },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-green-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.3) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-8 sm:py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Brand Section - 5 columns */}
            <div className="md:col-span-5">
              {/* Logo */}
              <div className="flex items-center mb-5 group cursor-pointer">
                <div className="relative mr-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-emerald-500 to-green-600 rounded-xl shadow-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300">
                    <Image
                      src="/Swapdealsemoji.webp"
                      alt="SwapDeals"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-gray-900 animate-pulse"></div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">
                    SwapDeals
                  </div>
                  <div className="text-[10px] font-semibold text-green-400 tracking-wider">HÅLLBAR KONSUMTION</div>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-md">
                Sveriges ledande plattform för hållbar byteshandel. Ge dina prylar nytt liv och hitta skatterna du letar efter - helt gratis och miljövänligt.
              </p>
              
              {/* Feature Pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 backdrop-blur-sm text-green-300 rounded-lg text-xs font-semibold border border-green-500/30 hover:bg-green-500/30 transition-colors">
                  🌱 Klimatsmart
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 backdrop-blur-sm text-emerald-300 rounded-lg text-xs font-semibold border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
                  💰 100% Gratis
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 backdrop-blur-sm text-green-300 rounded-lg text-xs font-semibold border border-green-500/30 hover:bg-green-500/30 transition-colors">
                  🤝 Lokalt
                </span>
              </div>
            </div>
            
            {/* Navigation Links - 4 columns */}
            <div className="md:col-span-4 grid grid-cols-3 gap-6">
              {/* SwapDeals section */}
              {footerSections.map((section) => (
                <div 
                  key={section.title}
                  onMouseEnter={() => setHoveredSection(section.title)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                    {section.title}
                    <div className={`h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-300 ${hoveredSection === section.title ? 'w-6' : 'w-0'}`}></div>
                  </h3>
                  <ul className="space-y-2.5">
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <a 
                          href={item.href}
                          className="group/link text-gray-400 hover:text-white text-sm transition-all duration-200 inline-flex items-center gap-2"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-green-400 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all duration-200" strokeWidth={2.5} />
                          <span className="relative">
                            {item.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover/link:w-full transition-all duration-300"></span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              
              {/* City columns */}
              {cityColumns.map((section, idx) => (
                <div 
                  key={`${section.title}-${idx}`}
                  onMouseEnter={() => setHoveredSection(`${section.title}-${idx}`)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <h3 className="text-white text-sm font-bold mb-3 flex items-center gap-2">
                    {idx === 0 ? section.title : <span className="opacity-0">{section.title}</span>}
                    <div className={`h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 transition-all duration-300 ${hoveredSection === `${section.title}-${idx}` ? 'w-6' : 'w-0'}`}></div>
                  </h3>
                  <ul className="space-y-2.5">
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <a 
                          href={item.href}
                          className="group/link text-gray-400 hover:text-white text-sm transition-all duration-200 inline-flex items-center gap-2"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-green-400 opacity-0 group-hover/link:opacity-100 -translate-x-2 group-hover/link:translate-x-0 transition-all duration-200" strokeWidth={2.5} />
                          <span className="relative">
                            {item.name}
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover/link:w-full transition-all duration-300"></span>
                          </span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            {/* Contact Info - 3 columns */}
            <div className="md:col-span-3">
              <h3 className="text-white text-sm font-bold mb-3">Kontakta Oss</h3>
              <ul className="space-y-2.5">
                {contactInfo.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={index}>
                      {item.href ? (
                        <a 
                          href={item.href}
                          className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-all duration-200 group"
                        >
                          <div className="w-9 h-9 rounded-xl bg-green-500/20 backdrop-blur-sm border border-green-500/30 flex items-center justify-center group-hover:bg-green-500/30 group-hover:scale-110 transition-all duration-200">
                            <Icon className="w-4 h-4 text-green-400" strokeWidth={2} />
                          </div>
                          <span className="group-hover:translate-x-1 transition-transform duration-200">{item.text}</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                          <div className="w-9 h-9 rounded-xl bg-green-500/20 backdrop-blur-sm border border-green-500/30 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-green-400" strokeWidth={2} />
                          </div>
                          <span>{item.text}</span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Elegant Divider */}
        <div className="relative h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent blur-sm"></div>
        </div>
        
        {/* Bottom Bar */}
        <div className="py-5">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="flex items-center gap-2.5 text-gray-400 text-sm">
              <span>© {new Date().getFullYear()}</span>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              <span className="font-semibold text-white">SwapDeals</span>
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              <span className="hidden sm:inline">Alla rättigheter förbehållna</span>
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-6">
              {legalLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-white text-sm transition-all duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
            
            {/* Made with Love Badge */}
            <div className="group inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-green-400/50 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <span className="text-gray-400 text-sm font-medium">Byggd med</span>
              <div className="relative">
                <Heart className="w-4 h-4 text-green-400 fill-green-400 group-hover:scale-125 transition-transform duration-300" />
                <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              <span className="text-gray-400 text-sm font-medium">i <span className="font-semibold text-green-400">Uppsala</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500"></div>
    </footer>
  );
}