// app/cookieconsent/page.js
'use client';

import { useState, useEffect } from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export default function CookieSettingsPage() {
  const { consent, resetConsent } = useCookieConsent();
  const [settings, setSettings] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    functional: false
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load current settings
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('cookieSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      } else if (consent === 'accepted') {
        setSettings({
          necessary: true,
          analytics: true,
          marketing: true,
          functional: true
        });
      }
    }
  }, [consent]);

  const handleSave = async () => {
    localStorage.setItem('cookieSettings', JSON.stringify(settings));
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());

    // Send to backend
    try {
      await fetch('/api/cookie-consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consent: 'custom',
          settings: settings,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.log('Failed to save settings:', error);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleToggle = (category) => {
    if (category === 'necessary') return; // Can't disable necessary cookies
    
    setSettings(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleReset = () => {
    // Clear all localStorage entries
    localStorage.removeItem('cookieSettings');
    localStorage.removeItem('cookieConsent');
    localStorage.removeItem('cookieConsentDate');
    
    // Reset settings to default (only necessary cookies)
    setSettings({
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    });
    
    // Call the hook's reset function if it exists
    if (resetConsent) {
      resetConsent();
    }
    
    // Show confirmation
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie-inställningar</h1>
          
          <div className="mb-8">
            <p className="text-gray-600 leading-relaxed">
              Vi använder cookies för att förbättra din upplevelse på TradeSmart. 
              Du kan välja vilka typer av cookies du vill acceptera nedan.
            </p>
          </div>

          {saved && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">✅ Dina ändringar har sparats!</p>
            </div>
          )}

          <div className="space-y-6">
            {/* Necessary Cookies */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Nödvändiga cookies</h3>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-3">Alltid aktiv</span>
                  <div className="w-12 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5"></div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av.
              </p>
            </div>

            {/* Analytics Cookies */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Analytiska cookies</h3>
                <button
                  onClick={() => handleToggle('analytics')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings.analytics ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    settings.analytics ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>
              <p className="text-gray-600 text-sm">
                Hjälper oss förstå hur besökare använder webbplatsen genom att samla in statistik.
              </p>
            </div>

            {/* Marketing Cookies */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Marknadsföring</h3>
                <button
                  onClick={() => handleToggle('marketing')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings.marketing ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    settings.marketing ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>
              <p className="text-gray-600 text-sm">
                Används för att visa relevanta annonser och mäta effektiviteten av reklamkampanjer.
              </p>
            </div>

            {/* Functional Cookies */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Funktionella cookies</h3>
                <button
                  onClick={() => handleToggle('functional')}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings.functional ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                    settings.functional ? 'translate-x-6' : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>
              <p className="text-gray-600 text-sm">
                Möjliggör förbättrade funktioner och personalisering som videor och live-chatt.
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Spara inställningar
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Återställ alla inställningar
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mt-2">
              För mer information, läs vår{' '}
              <a href="/privacy" className="text-green-600 hover:underline">
                integritetspolicy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}