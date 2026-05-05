"use client";

import { useEffect, useRef } from 'react';

interface AdPlacementProps {
  zoneId: string;
  format: 'banner' | 'native' | 'in-page-push';
  label?: string;
}

/**
 * Reusable component for Monetag Ad Placements
 * @param zoneId - The unique Zone ID from Monetag dashboard
 * @param format - The type of ad format (affects container size)
 */
export default function AdPlacement({ zoneId, format, label = "Recommended" }: AdPlacementProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run in browser and if zoneId exists
    if (!zoneId || zoneId === 'REPLACE_WITH_YOUR_ID' || typeof window === 'undefined') return;

    const container = adRef.current;
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    // Monetag dynamic injection
    const script = document.createElement('script');
    script.type = 'text/javascript';
    
    // This is a common pattern for Monetag placements
    // Note: Actual src might vary slightly based on zone type, 
    // but the ID/Zone logic is the core.
    script.src = `//alwingulla.com/88/v74/js/fill/${zoneId}/main.js`;
    script.async = true;
    script.setAttribute('data-zone', zoneId);

    container.appendChild(script);

    return () => {
      if (container) container.innerHTML = '';
    };
  }, [zoneId, format]);

  // Styling based on format
  const sizeClasses = {
    'banner': 'min-h-[90px] w-full max-w-[728px]',
    'native': 'min-h-[250px] w-full max-w-[350px]',
    'in-page-push': 'min-h-[100px] w-full max-w-[468px]',
  };

  return (
    <div className="my-10 flex flex-col items-center justify-center gap-3 overflow-hidden">
      {label && (
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 opacity-40">
          {label}
        </span>
      )}
      <div 
        className={`glass-card relative flex items-center justify-center rounded-2xl border border-white/5 bg-white/5 shadow-2xl transition-all duration-500 hover:border-primary/20 ${sizeClasses[format]}`}
      >
        <div ref={adRef} className="z-10 w-full" />
        
        {/* Decorative background if ad is empty or loading */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-5">
          <div className="h-12 w-12 rounded-full border-2 border-dashed border-current animate-spin-slow mb-2" />
          <span className="text-[9px] font-black uppercase tracking-widest">Monetizing Content</span>
        </div>
      </div>
    </div>
  );
}
