'use client';

import { Adsense } from '@ctrl/react-adsense';

interface AdSenseProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | '';
  style?: React.CSSProperties;
  layout?: string;
  className?: string;
  responsive?: boolean;
}

export function AdSense({ 
  slot, 
  format = 'auto',
  style = { display: 'block' },
  layout,
  className = '',
  responsive = true
}: AdSenseProps) {
  return (
    <div className={className} data-testid={`ad-slot-${slot}`}>
      <Adsense
        client="ca-pub-9361445858164574"
        slot={slot}
        style={style}
        format={format}
        responsive={responsive.toString()}
        layout={layout}
      />
    </div>
  );
}

export function ResponsiveAd({ slot, className = '' }: { slot: string; className?: string }) {
  return (
    <AdSense
      slot={slot}
      format="auto"
      style={{ display: 'block' }}
      className={className}
      responsive={true}
    />
  );
}

export function InFeedAd({ slot, className = '' }: { slot: string; className?: string }) {
  return (
    <AdSense
      slot={slot}
      format="fluid"
      layout="in-article"
      style={{ display: 'block', textAlign: 'center' }}
      className={className}
      responsive={true}
    />
  );
}
