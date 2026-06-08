// app/page.js
import React from 'react';
import Hero from '@/components/Hero';
import NewTradesCarousel from './newtradescarousel/page';
import Testimonials from './testimonial/page';
import Script from 'next/script';

export const metadata = {
  // Set base URL for all relative URLs
  metadataBase: new URL('https://swapdeals.se'),
  
  // Title: 50-60 characters optimal, front-load primary keyword
  title: 'SwapDeals | Bortskänkes | Begagnat Online',
  
  // Description: 150-160 characters, includes CTA and benefit-driven copy
  description: 'Sveriges ledande bytesplattform ✓ Byt begagnade prylar ✓ Hållbart & Miljövänligt ✓ Second Hand. Hitta bytesannonser nära dig!',
  
  // Authors and creator info
  authors: [{ name: 'SwapDeals', url: 'https://swapdeals.se' }],
  creator: 'SwapDeals',
  publisher: 'SwapDeals',
  
  // Application name for better branding
  applicationName: 'SwapDeals - Byteshandel Sverige',
  
  // Generator info
  generator: 'Next.js',
  
  // Referrer policy
  referrer: 'origin-when-cross-origin',
  
  // Format detection - disable automatic detection
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Category for search engines
  category: 'E-commerce & Trading',
  
  // Classification
  classification: 'Online Trading Platform',
  
  // Enhanced Open Graph metadata
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://swapdeals.se',
    siteName: 'SwapDeals',
    title: 'SwapDeals - Byteshandel & Begagnade Prylar',
    description: 'Byt begagnade prylar på Sveriges största bytesplattform. Hållbart, miljövänligt och 100% kostnadsfritt. Hitta tusentals bytesannonser i hela Sverige!',
    images: [
      {
        url: '/bytaprylar.webp',
        width: 1200,
        height: 630,
        alt: 'SwapDeals - Sveriges bytesplattform för hållbar handel',
        type: 'image/webp'
      }
    ],
  },
  
  // Enhanced Twitter/X metadata
  twitter: {
    card: 'summary_large_image',
    site: '@SwapDealsSE',
    creator: '@SwapDealsSE',
    title: 'SwapDeals - Byt Begagnade Prylar i Sverige',
    description: 'Sveriges ledande bytesplattform för hållbar konsumtion. Byt kläder, elektronik, möbler och mer! Gå med idag.',
    images: {
      url: '/bytaprylar.webp',
      alt: 'SwapDeals - Byteshandel Sverige'
    }
  },
  
  // Canonical URL - critical for avoiding duplicate content
  alternates: {
    canonical: 'https://swapdeals.se',
    languages: {
      'sv-SE': 'https://swapdeals.se',
    },
  },
  
  // Robots configuration - explicit control over indexing
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Additional meta tags
  other: {
    // Geographic information - Sweden-wide
    'geo.region': 'SE',
    'geo.placename': 'Sverige',
    
    // Language and content
    'language': 'sv-SE',
    'content-language': 'sv-SE',
    
    // Business information
    'contact': 'support@swapdeals.se',
    'rating': 'General',
    
    // Mobile optimization
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SwapDeals',
    
    // Theme color - brand green
    'theme-color': '#10b981',
    'msapplication-TileColor': '#10b981',
    'msapplication-navbutton-color': '#10b981',
    
    // App-specific tags
    'application-name': 'SwapDeals',
    'HandheldFriendly': 'true',
    'MobileOptimized': '320',
    
    // Copyright
    'copyright': 'SwapDeals',
    'author': 'SwapDeals',
    
    // Revisit after (for crawlers)
    'revisit-after': '7 days',
    
    // Distribution
    'distribution': 'global',
    
    // Audience
    'audience': 'all',
    
    // Page topic
    'page-topic': 'Trading, E-commerce, Sustainability',
    'page-type': 'Product catalog',
  }
};

const HomePage = () => {
  return (
    <>
      {/* CONSOLIDATED STRUCTURED DATA SCRIPT */}
      <Script
        id="consolidated-structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              // Website Schema
              {
                "@type": "WebSite",
                "@id": "https://swapdeals.se#website",
                "url": "https://swapdeals.se",
                "name": "SwapDeals",
                "alternateName": "SwapDeals",
                "description": "Sveriges ledande plattform för hållbar byteshandel - byt begagnade prylar",
                "publisher": {
                  "@id": "https://swapdeals.se#organization"
                },
                "inLanguage": "sv-SE",
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": {
                    "@type": "EntryPoint",
                    "urlTemplate": "https://swapdeals.se/search?q={search_term_string}"
                  },
                  "query-input": "required name=search_term_string"
                }
              },
              
              // Organization Schema
              {
                "@type": "Organization",
                "@id": "https://swapdeals.se#organization",
                "name": "SwapDeals",
                "alternateName": "SwapDeals",
                "url": "https://swapdeals.se",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://swapdeals.se/bytaprylar.webp",
                  "width": 512,
                  "height": 512
                },
                "description": "Sveriges ledande bytesplattform för hållbar konsumtion och cirkulär ekonomi",
                "email": "support@swapdeals.se",
                "foundingDate": "2024",
                "slogan": "Byt istället för att köpa",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "contactType": "customer support",
                  "email": "support@swapdeals.se",
                  "areaServed": "SE",
                  "availableLanguage": ["Swedish"]
                },
                "areaServed": {
                  "@type": "Country",
                  "name": "Sverige"
                },
                "sameAs": [
                  "https://www.facebook.com/swapdeals",
                  "https://www.instagram.com/swapdeals.se/",
                  "https://twitter.com/SwapDealsSE",
                  "https://www.tiktok.com/@swapdeals"
                ]
              },
              
              // WebPage Schema
              {
                "@type": "WebPage",
                "@id": "https://swapdeals.se#webpage",
                "url": "https://swapdeals.se",
                "name": "SwapDeals - Byteshandel & Begagnade Prylar",
                "description": "Byt begagnade prylar på Sveriges största bytesplattform. Hållbart, miljövänligt och kostnadsfritt.",
                "isPartOf": {
                  "@id": "https://swapdeals.se#website"
                },
                "about": {
                  "@id": "https://swapdeals.se#organization"
                },
                "inLanguage": "sv-SE",
                "primaryImageOfPage": {
                  "@type": "ImageObject",
                  "url": "https://swapdeals.se/bytaprylar.webp"
                }
              },
              
              // Breadcrumb Schema
              {
                "@type": "BreadcrumbList",
                "@id": "https://swapdeals.se#breadcrumb",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Hem",
                    "item": "https://swapdeals.se"
                  }
                ]
              },
              
              // FAQ Schema
              {
                "@type": "FAQPage",
                "@id": "https://swapdeals.se#faq",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "Hur fungerar byteshandel på SwapDeals?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "På SwapDeals kan du lägga upp bytesannonser. Du väljer vad du vill byta bort och vad du söker i utbyte. När någon är intresserad kontaktar ni varandra direkt genom plattformen för att komma överens om bytesdetaljer. Ingen betalning behövs - det är bara att byta prylar!"
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Kostar det något att använda SwapDeals?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Nej, SwapDeals är helt att använda! Du kan lägga upp obegränsat med bytesannonser, bläddra bland alla annonser och kontakta andra användare utan någon kostnad. Vår mission är att göra hållbar byteshandel tillgänglig för alla."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Vilka typer av prylar kan man byta på SwapDeals?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Du kan byta nästan vad som helst på SwapDeals! Populära kategorier inkluderar kläder och mode, elektronik och prylar, böcker och media, sport och fritid, hem och inredning, leksaker och barnprylar. Så länge det är lagligt och i gott skick kan du byta det!"
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Hur säkert är det att byta prylar med okända personer?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Vi rekommenderar alltid att träffas på offentliga platser vid byte. Kommunicera tydligt om föremålets skick innan ni träffas. Du kan också kolla användarens omdömen och historik på plattformen. Vi har säkerhetsriktlinjer och support-team som hjälper till om något skulle uppstå."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Måste man byta mot något med samma värde?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Nej, du och den andra parten bestämmer helt själva vad som är ett rättvist byte. Många väljer att byta prylar med liknande värde, men andra kanske byter flera mindre saker mot en större. Det viktiga är att båda parter är nöjda med bytet!"
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Kan jag byta prylar i hela Sverige?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Ja! SwapDeals fungerar i hela Sverige. Du kan välja att söka efter bytesannonser nära dig för enkla möten, eller kontakta personer längre bort om du vill skicka prylar med posten. Många användare är öppna för både fysiska möten och postbyte."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Varför ska jag välja byteshandel istället för att köpa nytt?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Byteshandel är både ekonomiskt smart och miljövänligt! Du sparar pengar genom att inte köpa nytt, minskar konsumtion och avfall, ger saker nytt liv, och bidrar till cirkulär ekonomi. Plus att du kan hitta unika prylar och träffa nya människor i din omgivning. Det är en win-win för både plånboken och planeten!"
                    }
                  }
                ]
              },
              
              // CollectionPage for listings
              {
                "@type": "CollectionPage",
                "@id": "https://swapdeals.se#collection",
                "name": "Bytesannonser Sverige",
                "description": "Bläddra bland tusentals bytesannonser i hela Sverige",
                "url": "https://swapdeals.se",
                "isPartOf": {
                  "@id": "https://swapdeals.se#website"
                }
              },
              
              // Service Schema
              {
                "@type": "Service",
                "@id": "https://swapdeals.se#service",
                "serviceType": "Trading Platform",
                "name": "Byteshandel Plattform",
                "description": "Gratis plattform för byteshandel av begagnade prylar i Sverige",
                "provider": {
                  "@id": "https://swapdeals.se#organization"
                },
                "areaServed": {
                  "@type": "Country",
                  "name": "Sverige"
                },
                "hasOfferCatalog": {
                  "@type": "OfferCatalog",
                  "name": "Bytesannonser",
                  "itemListElement": [
                    {
                      "@type": "OfferCategory",
                      "name": "Elektronik & Prylar",
                      "description": "Byt mobiler, datorer, surfplattor och elektronik"
                    },
                    {
                      "@type": "OfferCategory",
                      "name": "Kläder & Mode",
                      "description": "Byt kläder, skor och accessoarer"
                    },
                    {
                      "@type": "OfferCategory",
                      "name": "Hem & Inredning",
                      "description": "Byt möbler, lampor och heminredning"
                    },
                    {
                      "@type": "OfferCategory",
                      "name": "Sport & Fritid",
                      "description": "Byt sportutrustning och fritidsprylar"
                    },
                    {
                      "@type": "OfferCategory",
                      "name": "Böcker & Media",
                      "description": "Byt böcker, filmer och musik"
                    }
                  ]
                },
                "termsOfService": "https://swapdeals.se/terms",
                "audience": {
                  "@type": "Audience",
                  "audienceType": "Everyone interested in sustainable trading"
                }
              }
            ]
          })
        }}
      />

      {/* Main content */}
      <main className="flex flex-col min-h-screen bg-gradient-to-br from-green-50/30 via-gray-50 to-yellow-50/30">
        {/* Hero Section - Contains main landing content */}
        <Hero />

        {/* Additional Sections Container */}
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16">
          
          {/* New Trades Carousel Section */}
          <section 
            className="mb-8 sm:mb-12" 
            aria-label="Senaste bytesannonser"
          >
            <NewTradesCarousel />
          </section>

          {/* Testimonials Section */}
          <section 
            className="mb-8 sm:mb-12" 
            aria-label="Användarrecensioner"
          >
            <Testimonials />
          </section>
        </div>
      </main>
    </>
  );
};

export default HomePage;
