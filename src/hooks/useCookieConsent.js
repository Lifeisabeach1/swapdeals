// src/hooks/useCookieConsent.js
'use client';

import { useState, useEffect } from 'react';

export const useCookieConsent = () => {
  const [consent, setConsent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedConsent = localStorage.getItem('cookieConsent');
      setConsent(storedConsent);
      setLoading(false);
    }
  }, []);

  const hasConsent = () => {
    return consent === 'accepted';
  };

  const hasDeclined = () => {
    return consent === 'declined';
  };

  const resetConsent = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cookieConsent');
      localStorage.removeItem('cookieConsentDate');
      localStorage.removeItem('cookieSettings');
      setConsent(null);
    }
  };

  return {
    consent,
    loading,
    hasConsent,
    hasDeclined,
    resetConsent
  };
};

// Usage example:
// const { hasConsent, loading } = useCookieConsent();
// 
// if (!loading && hasConsent()) {
//   // Initialize tracking scripts
// }