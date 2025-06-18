import './global.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import CookieConsent from '@/components/CookieConsent';
import { TradeAppProvider } from './contexts/trade-app-state';
import { AuthProvider } from '@/hooks/useAuth';

export const metadata = {
  title: 'SwapDeals',
  description: 'Byter saker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="sv">
      <head>
        {/* Google Analytics - Load but don't initialize until consent */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  
                  // Default consent to 'denied' as a placeholder
                  gtag('consent', 'default', {
                    'analytics_storage': 'denied',
                    'ad_storage': 'denied',
                    'wait_for_update': 500,
                  });
                  
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                    page_title: document.title,
                    page_location: window.location.href,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body>
        <AuthProvider>
          <TradeAppProvider>
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
            <CookieConsent />
          </TradeAppProvider>
        </AuthProvider>
      </body>
    </html>
  );
}