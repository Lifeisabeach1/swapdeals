// Enhanced Footer Component matching Navbar style
'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const [hoveredSection, setHoveredSection] = useState(null);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [isLogoHovered, setIsLogoHovered] = useState(false);

 

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
       
        { name: 'Kontakta oss', href: 'mailto:kontakt@swapdeals.se' },
       
      ]
    }
  ];

  const legalLinks = [
    { name: 'Sekretesspolicy', href: '/privacy' },
    { name: 'Användarvillkor', href: '/terms' },
    { name: 'Cookie-policy', href: '/cookieconsent' },
   
  ];

  return (
    <footer className="bg-green-100 backdrop-blur-lg border-t border-green-200/30 mt-auto relative overflow-hidden">
      {/* Premium light effect overlay with green tint */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-green-50/20 to-transparent pointer-events-none"></div>
      
      {/* Subtle decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-300/40 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100/10 rounded-full blur-3xl -z-0 transform translate-x-1/3 translate-y-1/3"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Enhanced Brand Section */}
            <div className="lg:col-span-2">
              <div 
                className="flex items-center mb-6 group cursor-pointer"
                onMouseEnter={() => setIsLogoHovered(true)}
                onMouseLeave={() => setIsLogoHovered(false)}
              >
                {/* Premium logo design matching navbar */}
                <div className="relative mr-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-xl shadow-lg flex items-center justify-center group-hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <Image
                      src="/Swapdealsemoji.png"
                      alt="SwapDeals Logotyp"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full shadow-sm"></div>
                </div>
                <div className="flex flex-col">
                  <div className={`text-2xl font-bold bg-gradient-to-r from-gray-800 via-green-700 to-gray-800 bg-clip-text text-transparent transition-all duration-300`}>
                    SwapDeals
                  </div>
                  
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-6 leading-relaxed max-w-sm">
                🌱 Hållbart. 💰 Ekonomiskt. ✅ Enkelt
              </p>
              </div>
            
            
            {/* Navigation Sections */}
            {footerSections.map((section, index) => (
              <div 
                key={section.title}
                className="transform transition-all duration-300 hover:translate-y-[-2px]"
                onMouseEnter={() => setHoveredSection(section.title)}
                onMouseLeave={() => setHoveredSection(null)}
              >
                <h3 className={`text-lg font-semibold text-gray-800 mb-4 transition-all duration-300 ${hoveredSection === section.title ? 'text-green-800' : ''}`}>
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <a 
                        href={item.href}
                        className="text-gray-600 hover:text-green-700 text-sm transition-all duration-200 hover:translate-x-1 transform inline-flex items-center group"
                      >
                        <span>{item.name}</span>
                        {item.comingSoon && (
                          <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-green-100 to-green-200 text-green-700 text-xs rounded-full font-medium">
                            Coming soon
                          </span>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        {/* Enhanced Footer Bottom */}
        <div className="py-6 border-t border-green-200/50 relative">
          {/* Subtle top border effect */}
          <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-green-300/30 to-transparent"></div>
          
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="flex items-center text-gray-600 text-sm">
              <span className="mr-2">©</span>
              <span>{new Date().getFullYear()}</span>
              <span className="mx-2 w-1 h-1 bg-green-400 rounded-full"></span>
              <span className="font-medium bg-gradient-to-r from-gray-600 to-green-700 bg-clip-text text-transparent">
                SwapDeals 
              </span>
              <span className="mx-2 w-1 h-1 bg-green-400 rounded-full"></span>
              <span>Alla rättigheter förbehållna</span>
            </div>
            
            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {legalLinks.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-green-700 text-sm transition-all duration-200 hover:translate-y-[-1px] transform relative group"
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-green-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-0 scale-110"></div>
                </a>
              ))}
            </div>
          </div>
          
      
          
        </div>
      </div>
    </footer>
  );
}