'use client';

import { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Check if user has already given consent
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      // Show consent dialog after a short delay for better UX
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [mounted]);

  const handleAccept = async () => {
    // Store consent in localStorage
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // Optional: Send consent to your backend
    try {
      await fetch('/api/cookie-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consent: 'accepted',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.log('Failed to log consent:', error);
    }

    setShowConsent(false);
    
    // Initialize analytics/tracking after consent
    initializeTracking();
  };

  const handleDecline = async () => {
    // Store decline in localStorage
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // Optional: Send decline to your backend
    try {
      await fetch('/api/cookie-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consent: 'declined',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.log('Failed to log consent:', error);
    }

    setShowConsent(false);
  };

  const initializeTracking = () => {
    // Initialize Google Analytics, Facebook Pixel, etc.
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted',
        'ad_storage': 'granted'
      });
    }
    
    // Add other tracking initialization here
  };

  // Don't render on server side
  if (!mounted || !showConsent) return null;

  return (
    <>
      {/* Backdrop overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" />
      
      {/* Cookie consent modal - Mobile First */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="text-xl sm:text-2xl flex-shrink-0">🍪</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-gray-900 mb-2 sm:text-lg sm:mb-3">Cookie-inställningar</h3>
              <div>
                <p className="mb-4 text-xs leading-relaxed text-gray-900 sm:text-sm">
                  Vi använder cookies för att förbättra din upplevelse, visa personligt innehåll 
                  och analysera vår trafik. Genom att klicka Acceptera alla samtycker du till 
                  vår användning av cookies.
                  <br />
                  <a 
                    href="/privacy" 
                    className="text-green-600 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Läs mer i vår integritetspolicy
                  </a>
                </p>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-3 sm:justify-center">
                  <button
                    onClick={handleAccept}
                    className="bg-gradient-to-r from-green-500 to-green-600 active:from-green-600 active:to-green-700 text-white py-3 px-5 rounded-xl font-semibold shadow-lg flex items-center justify-center text-sm sm:py-3 sm:px-6"
                  >
                    Acceptera alla cookies
                    <span className="ml-2">✓</span>
                  </button>
                  <button
                    onClick={handleDecline}
                    className="bg-gradient-to-r from-gray-100 to-gray-200 active:from-gray-200 active:to-gray-300 text-gray-800 py-3 px-5 rounded-xl font-semibold shadow-md flex items-center justify-center text-sm sm:py-3 sm:px-6"
                  >
                    Avvisa alla
                    <span className="ml-2">✗</span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center mt-3">
                  Nödvändiga cookies är alltid aktiverade. Du kan ändra inställningar när som helst.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CookieConsent;
