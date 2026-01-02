// app/layout.js
import './global.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import CookieConsent from '@/components/CookieConsent';
import { TradeAppProvider } from './contexts/trade-app-state';
import { AuthProvider } from '@/hooks/useAuth';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata = {
  metadataBase: new URL('https://swapdeals.se'),
  title: {
    default: 'SwapDeals - Hållbar Byteshandel Online Sverige',
    template: '%s | SwapDeals'
  },
  description: 'SwapDeals är Sveriges ledande plattform för hållbar byteshandel. Byt föremål du inte längre behöver mot saker du faktiskt vill ha. Miljövänligt, kostnadsfritt och enkelt.',
  applicationName: 'SwapDeals',
  authors: [{ name: 'SwapDeals Team' }],
  creator: 'SwapDeals',
  publisher: 'SwapDeals',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: 'https://swapdeals.se',
    siteName: 'SwapDeals',
    title: 'SwapDeals - Hållbar Byteshandel Online Sverige',
    description: 'Byt föremål du inte längre behöver mot saker du faktiskt vill ha. Miljövänligt, kostnadsfritt och enkelt.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SwapDeals - Hållbar Byteshandel Sverige',
      },
    ],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'SwapDeals - Hållbar Byteshandel Online',
    description: 'Byt föremål du inte längre behöver mot saker du faktiskt vill ha.',
    images: ['/twitter-image.jpg'],
  },
  
  // PWA
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SwapDeals'
  },
  
  // Additional
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  verification: {
    // Add when you get these
    // google: 'your-google-site-verification',
    // yandex: 'your-yandex-verification',
  },
  
  other: {
    'mobile-web-app-capable': 'yes'
  }
};

// Separate viewport export (Next.js 15 requirement)
export const viewport = {
  themeColor: '#00a86b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <head>
        {/* Organization structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SwapDeals",
              "url": "https://swapdeals.se",
              "logo": "https://swapdeals.se/logo.png",
              "description": "Sveriges ledande plattform för hållbar byteshandel",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "SE"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "availableLanguage": ["Swedish", "English"],
                "url": "https://swapdeals.se/kontakt"
              },
              "sameAs": [
                "https://facebook.com/swapdeals",
                "https://instagram.com/swapdeals",
                "https://twitter.com/swapdeals"
              ]
            })
          }}
        />
      </head>
      <body>
        <GoogleAnalytics />
        <AuthProvider>
          <TradeAppProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <CookieConsent />
          </TradeAppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}