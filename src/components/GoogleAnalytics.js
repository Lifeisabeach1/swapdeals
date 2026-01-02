'use client';
import { useEffect } from 'react';

export default function GoogleAnalytics() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_GA_ID) {
      // Load gtag script
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
      script.async = true;
      document.head.appendChild(script);

      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      
      gtag('consent', 'default', {
        'analytics_storage': 'denied',
        'ad_storage': 'denied',
        'wait_for_update': 500,
      });
      
      gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }, []);

  return null;
}