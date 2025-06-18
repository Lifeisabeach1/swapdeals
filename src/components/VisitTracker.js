'use client';

import { useEffect, useState } from 'react';
import { trackAnonymousVisit } from '@/lib/utils/platformStats';

export default function VisitTracker() {
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    // Only run on client side and track once per session
    if (typeof window === 'undefined' || hasTracked) return;

    const trackVisit = async () => {
      try {
        console.log('🚀 VisitTracker: Tracking page visit...');
        const result = await trackAnonymousVisit();
        
        if (result.success) {
          setHasTracked(true);
          console.log('✅ Visit tracked successfully');
        } else {
          console.error('❌ Visit tracking failed:', result);
        }
      } catch (error) {
        console.error('❌ Error in VisitTracker:', error);
      }
    };

    // Track visit after a short delay
    const timeoutId = setTimeout(trackVisit, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [hasTracked]);

  return null; // This component doesn't render anything
}
