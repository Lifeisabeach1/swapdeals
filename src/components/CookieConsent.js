// src/components/CookieConsent.js
'use client';

import { useState, useEffect } from 'react';
import Alert from './Alert';

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
      {/* Backdrop overlay to block interaction */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
      
      {/* Cookie consent modal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="text-2xl">🍪</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Cookie-inställningar</h3>
              <div>
                <p className="mb-4 text-sm leading-relaxed text-gray-900">
                  Vi använder cookies för att förbättra din upplevelse, visa personligt innehåll 
                  och analysera vår trafik. Genom att klicka Acceptera alla samtycker du till 
                  vår användning av cookies.
                  <br />
                  <a 
                    href="/privacy" 
                    className="text-green-600 hover:text-green-800 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Läs mer i vår integritetspolicy
                  </a>
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <button
                    onClick={handleAccept}
                    className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-2xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl flex items-center justify-center transform hover:-translate-y-1 relative overflow-hidden text-sm"
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    Acceptera alla cookies
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">✓</span>
                  </button>
                  <button
                    onClick={handleDecline}
                    className="group bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white py-3 px-6 rounded-2xl transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl flex items-center justify-center transform hover:-translate-y-1 relative overflow-hidden text-sm"
                  >
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    Avvisa alla
                    <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">✗</span>
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