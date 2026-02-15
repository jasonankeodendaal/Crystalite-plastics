
import React, { useState, useEffect } from 'react';
import { HeroItem } from '../types';

interface HeroProps {
  items: HeroItem[];
  autoPlay?: boolean;
  interval?: number;
  onQuoteClick: () => void;
  onBrowseClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ items, autoPlay = true, interval = 5000, onQuoteClick, onBrowseClick }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!autoPlay || items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(timer);
  }, [items.length, autoPlay, interval]);

  if (items.length === 0) return null;

  return (
    <section className="relative h-[65vh] md:h-[85vh] w-full overflow-hidden bg-[#1a1a1a]">
      {items.map((slide, idx) => (
        <div 
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {slide.mediaType === 'video' ? (
            <video 
              src={slide.mediaData} 
              autoPlay 
              muted 
              loop 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover opacity-60" 
            />
          ) : (
            <div 
              style={{ backgroundImage: `url(${slide.mediaData})` }}
              className="absolute inset-0 w-full h-full bg-cover bg-center opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-black/60"></div>
          
          <div className="relative z-20 h-full flex items-center px-4 sm:px-6 lg:px-20 max-w-7xl mx-auto">
            <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 text-left w-full">
              <div className="inline-block bg-[var(--primary-yellow)] text-black px-2 py-0.5 text-[9px] font-black uppercase tracking-widest mb-4 rounded-sm">
                System Active // {idx + 1}
              </div>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase leading-[0.9] mb-4 tracking-tighter text-white">
                {slide.title} <br />
                <span className="text-[var(--primary-yellow)]">{slide.highlight}</span>
              </h1>
              <p className="text-sm sm:text-lg md:text-2xl text-slate-300 max-w-xl mb-8 md:mb-14 font-medium leading-tight">
                {slide.subtitle}
              </p>
              <div className="flex flex-row gap-3 sm:gap-5">
                <button 
                  onClick={onBrowseClick}
                  className="flex-1 sm:flex-none bg-[var(--primary-yellow)] text-black px-4 sm:px-12 py-3.5 sm:py-5 font-black uppercase text-[10px] sm:text-lg hover:opacity-90 transition-all shadow-2xl active:scale-95 rounded-[var(--border-radius)]"
                >
                  {slide.button1Text}
                </button>
                <button 
                  onClick={onQuoteClick}
                  className="flex-1 sm:flex-none border-2 sm:border-4 border-white text-white px-4 sm:px-12 py-3.5 sm:py-5 font-black uppercase text-[10px] sm:text-lg hover:bg-white hover:text-black transition-all active:scale-95 rounded-[var(--border-radius)]"
                >
                  {slide.button2Text}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {items.length > 1 && (
        <div className="absolute bottom-6 left-6 z-30 flex gap-2 sm:bottom-10 sm:left-auto sm:right-20">
          {items.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrent(i)}
              className={`h-1.5 transition-all duration-300 rounded-full ${current === i ? 'w-8 bg-[var(--primary-yellow)]' : 'w-2 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
