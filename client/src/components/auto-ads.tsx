import { useEffect } from 'react';

export function AutoAds() {
  useEffect(() => {
    try {
      // Enable Auto Ads programmatically
      // This tells AdSense to automatically place ads in optimal positions
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({
        google_ad_client: "ca-pub-9361445858164574",
        enable_page_level_ads: true,
        overlays: { bottom: true }
      });
    } catch (err) {
      console.log('Auto ads initialization:', err);
    }
  }, []);

  return null;
}
