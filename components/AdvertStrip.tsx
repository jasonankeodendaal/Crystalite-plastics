
import React, { useState, useEffect } from 'react';
import { AdvertItem } from '../types';

interface AdvertStripProps {
  adverts: AdvertItem[];
  onNavigate: (view: string) => void;
}

const AdvertStrip: React.FC<AdvertStripProps> = ({ adverts, onNavigate }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (adverts.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % adverts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [adverts.length]);

  if (!adverts || adverts.length === 0) return null;

  const currentAd = adverts[current];

  return (
    <section className="relative w-full h-40 sm:h-64 overflow-hidden border-y-[var(--border-weight)] border-[var(--primary-yellow)] bg-black">
      {adverts.map((ad, idx) => (
        <div
          key={ad.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500"
            style={{ backgroundImage: `url(${ad.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>
          
          <div className="relative h-full flex items-center justify-between px-6 sm:px-20 max-w-7xl mx-auto">
            <div className="max-w-xl">
              <span className="bg-[var(--primary-yellow)] text-black px-2 py-0.5 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.3em] mb-2 inline-block rounded-sm">
                System Alert // Special Access
              </span>
              <h3 className="text-xl sm:text-4xl font-black uppercase tracking-tighter text-white leading-none">
                {ad.title}
              </h3>
            </div>
            
            <button
              onClick={() => onNavigate(ad.link)}
              className="bg-[var(--primary-yellow)] text-black px-4 sm:px-10 py-3 sm:py-4 font-black uppercase text-[10px] sm:text-sm hover:scale-105 transition-transform shadow-2xl rounded-[var(--border-radius)] whitespace-nowrap"
            >
              {ad.ctaText} &rarr;
            </button>
          </div>
        </div>
      ))}
      
      {/* Progress Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
        <div 
          className="h-full bg-[var(--primary-yellow)] transition-all duration-[4000ms] linear"
          key={current}
          style={{ width: '100%', animation: 'progress-bar 4s linear forwards' }}
        />
      </div>

      <style>{`
        @keyframes progress-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default AdvertStrip;
