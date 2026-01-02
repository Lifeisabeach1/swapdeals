// Organized Compact Premium Footer
'use client';

import { useState } from 'react';
import { Heart, Mail, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const [hoveredSection, setHoveredSection] = useState(null);

  const footerSections = [
    {
      title: 'Plattform',
      items: [
        { name: 'Så fungerar det', href: '/zwapit-guide' },
      ]
    },
    {
      title: 'Gemenskap',
      items: [
        { name: 'Forum', href: '/community/forums', comingSoon: true },
      ]
    },
    {
      title: 'Support',
      items: [
        { name: 'Kontakta oss', href: '/kontakt' },
      ]
    }
  ];

  const legalLinks = [
    { name: 'Sekretesspolicy', href: '/privacy' },
    { name: 'Användarvillkor', href: '/terms' },
    { name: 'Cookie-policy', href: '/cookieconsent' },
  ];

  const contactInfo = [
    { icon: Mail, text: 'support@swapdeals.se', href: 'mailto:support@swapdeals.se' },
    { icon: MapPin, text: 'Uppsala, Sverige' },
    { icon: Clock, text: 'Mån-Fre 9:00-17:00' },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden bg-gradient-to-br from-slate-50 via-green-50/30 to-emerald-50/40 border-t border-green-200/30">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #059669 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Grid */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Description - 4 columns */}
          <div className="md:col-span-4">
            <div className="flex items-center mb-4 group">
              <div className="relative mr-3">
                <div className="w-11 h-11 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 rounded-xl shadow-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                  <Image
                    src="/Swapdealsemoji.png"
                    alt="SwapDeals"
                    width={26}
                    height={26}
                    className="object-contain"
                  />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-gray-900 via-green-700 to-emerald-800 bg-clip-text text-transparent">
                  SwapDeals
                </div>
                <div className="text-[10px] font-semibold text-green-600 tracking-wider">SUSTAINABLE MARKETPLACE</div>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-sm">
              Upptäck en hållbar marknadsplats där du kan byta, köpa och sälja begagnat på ett enkelt och miljövänligt sätt.
            </p>
            
            {/* Feature Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                🌱 Klimatsmart
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                💰 Spara pengar
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                🤝 Lokalt
              </span>
            </div>
          </div>
          
          {/* Navigation Links - 5 columns */}
          <div className="md:col-span-5 grid grid-cols-3 gap-6">
            {footerSections.map((section) => (
              <div 
                key={section.title}
                onMouseEnter={() => setHoveredSection(section.title)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  {section.title}
                  <div className={`h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300 ${hoveredSection === section.title ? 'w-4' : 'w-0'}`}></div>
                </h3>
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <a 
                        href={item.href}
                        className="group/link text-gray-600 hover:text-green-700 text-sm transition-all duration-200 inline-flex items-center gap-1.5"
                      >
                        <span className="relative">
                          {item.name}
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover/link:w-full transition-all duration-300"></span>
                        </span>
                        {item.comingSoon && (
                          <span className="px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] rounded-full font-bold shadow-sm">
                            Snart
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          {/* Contact Info - 3 columns */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Kontakt</h3>
            <ul className="space-y-2.5">
              {contactInfo.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    {item.href ? (
                      <a 
                        href={item.href}
                        className="flex items-center gap-2 text-gray-600 hover:text-green-700 text-sm transition-colors duration-200 group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors duration-200">
                          <Icon className="w-3.5 h-3.5 text-green-600" />
                        </div>
                        <span>{item.text}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <div className="w-7 h-7 rounded-lg bg-green-100 flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5 text-green-600" />
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
        
        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-green-200/50 to-transparent"></div>
        
        {/* Bottom Bar */}
        <div className="py-6">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <span>© {new Date().getFullYear()}</span>
              <span className="w-1 h-1 bg-green-400 rounded-full"></span>
              <span className="font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">SwapDeals</span>
              <span className="w-1 h-1 bg-green-400 rounded-full"></span>
              <span className="hidden sm:inline">Alla rättigheter förbehållna</span>
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4">
              {legalLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-green-700 text-sm transition-colors duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
            
            {/* Made with Love */}
            <div className="group inline-flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-green-200/60 hover:border-emerald-300/80 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
              <span className="text-gray-700 text-sm font-medium">Byggd med</span>
              <div className="relative">
                <Heart className="w-4 h-4 text-emerald-500 fill-emerald-500 group-hover:scale-125 transition-transform duration-300" />
                <div className="absolute inset-0 bg-emerald-400 rounded-full blur-sm opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
              </div>
              <span className="text-gray-700 text-sm font-medium">i <span className="font-semibold text-green-700">Uppsala</span></span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}