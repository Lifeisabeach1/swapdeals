// app/layout.js
import { Inter } from "next/font/google";
import './global.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieConsent from '@/components/CookieConsent';
import { TradeAppProvider } from './contexts/trade-app-state';
import { AuthProvider } from '@/hooks/useAuth';
import Script from 'next/script';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: 'swap',
  preload: true,
});

export const metadata = {
  metadataBase: new URL('https://swapdeals.se'),
  
  title: {
    template: '%s | SwapDeals',
    default: 'SwapDeals - Byt Begagnade Prylar Gratis | Hållbar Byteshandel Sverige'
  },
  
  description: 'Sveriges ledande bytesplattform ✓ Byt begagnade prylar gratis ✓ Hållbart & Miljövänligt ✓ 100% kostnadsfritt. Hitta bytesannonser nära dig!',
  
  authors: [{ name: 'SwapDeals', url: 'https://swapdeals.se' }],
  creator: 'SwapDeals',
  publisher: 'SwapDeals',
  applicationName: 'SwapDeals',
  generator: 'Next.js',
  
  referrer: 'origin-when-cross-origin',
  
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  category: 'E-commerce & Trading',
  classification: 'Online Trading Platform',
  
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
  
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://swapdeals.se',
    siteName: 'SwapDeals',
    title: 'SwapDeals - Byteshandel & Begagnade Prylar | Helt Gratis',
    description: 'Byt begagnade prylar gratis på Sveriges största bytesplattform. Hållbart, miljövänligt och 100% kostnadsfritt.',
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
  
  twitter: {
    card: 'summary_large_image',
    site: '@SwapDealsSE',
    creator: '@SwapDealsSE',
    title: 'SwapDeals - Byt Begagnade Prylar Gratis i Sverige',
    description: 'Sveriges ledande bytesplattform för hållbar konsumtion. Byt kläder, elektronik, möbler och mer - helt gratis!',
    images: {
      url: '/planet.webp',
      alt: 'SwapDeals - Byteshandel Sverige'
    }
  },
  
  alternates: {
    canonical: 'https://swapdeals.se',
    languages: {
      'sv-SE': 'https://swapdeals.se',
    },
  },
  
  other: {
    'geo.region': 'SE',
    'geo.placename': 'Sverige',
    'language': 'sv-SE',
    'content-language': 'sv-SE',
    'contact': 'support@swapdeals.se',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SwapDeals',
    'theme-color': '#10b981',
    'msapplication-TileColor': '#10b981',
    'msapplication-navbutton-color': '#10b981',
    'application-name': 'SwapDeals',
    'HandheldFriendly': 'true',
    'MobileOptimized': '320',
    'copyright': 'SwapDeals',
    'author': 'SwapDeals',
    'revisit-after': '7 days',
    'distribution': 'global',
    'audience': 'all',
    'page-topic': 'Trading, E-commerce, Sustainability',
    'page-type': 'Product catalog',
  }
};

export default function RootLayout({ children }) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="sv" dir="ltr">
      <head>
        {/* DNS Prefetch for faster third-party connections */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Preconnect only for critical resources */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        
        <meta name="theme-color" content="#10b981" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      
      <body className={`${inter.variable} antialiased font-sans`}>
        <AuthProvider>
          <TradeAppProvider>
            <Navbar />
            
            <main className="min-h-screen bg-gradient-to-br from-green-50/30 via-gray-50 to-yellow-50/30">
              {children}
            </main>
            
            <Footer />
            <CookieConsent />

            {/* Google Analytics - Defer loading with afterInteractive strategy */}
            {GA_MEASUREMENT_ID && process.env.NODE_ENV === 'production' && (
              <>
                <Script
                  src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                  strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                  {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_MEASUREMENT_ID}', {
                      page_path: window.location.pathname,
                    });
                  `}
                </Script>
              </>
            )}
          </TradeAppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}