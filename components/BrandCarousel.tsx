
import React from 'react';
import { Brand, SiteConfig } from '../types';

interface BrandCarouselProps {
  brands: Brand[];
  config: SiteConfig['ui'];
}

const BrandCarousel: React.FC<BrandCarouselProps> = ({ brands, config }) => {
  if (!brands || brands.length === 0) return null;

  // Duplicate the brands array multiple times to ensure the marquee is full and seamless across all screen resolutions
  const extendedBrands = Array(8).fill(brands).flat();

  return (
    <section className="bg-white border-y-[var(--border-weight)] border-gray-100 py-12 overflow-hidden relative group">
      {/* Decorative Technical ID - Establishes the "Protocol" aesthetic */}
      <div className="absolute top-3 left-6 z-20 pointer-events-none select-none">
        <span className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-200">
          {config.brandCarouselRegistryLabel}
        </span>
      </div>

      {/* Main Marquee Container */}
      <div className="flex animate-marquee-slow whitespace-nowrap items-center hover:[animation-play-state:paused] cursor-pointer">
        {extendedBrands.map((brand, idx) => (
          <div 
            key={`${brand.id}-${idx}`} 
            className="flex flex-col items-center justify-center shrink-0 mx-10 sm:mx-20 relative group/logo transition-all duration-300"
          >
            {/* Dynamic Node Label - appears on hover */}
            <span className="absolute -top-5 left-0 text-[7px] font-black text-[var(--primary-yellow)] uppercase opacity-0 group-hover/logo:opacity-100 transition-all tracking-[0.2em] transform translate-y-2 group-hover/logo:translate-y-0">
              NODE: {brand.id.toUpperCase().replace('B-', '')}
            </span>
            
            <div className="h-8 sm:h-16 w-auto flex items-center justify-center transition-all duration-500 transform group-hover/logo:scale-110">
              {brand.logoData ? (
                <img 
                  src={brand.logoData} 
                  alt={brand.name} 
                  className="h-full w-auto object-contain opacity-60 group-hover/logo:opacity-100 transition-all duration-700"
                />
              ) : (
                <span className="text-sm sm:text-2xl font-black uppercase text-gray-200 group-hover/logo:text-black transition-colors tracking-tighter">
                  {brand.name}
                </span>
              )}
            </div>
            
            {/* Active Status Indicator Dot */}
            <div className="mt-3 w-1.5 h-1.5 bg-transparent group-hover/logo:bg-[var(--primary-yellow)] rounded-full transition-all group-hover/logo:shadow-[0_0_10px_var(--primary-yellow)] scale-0 group-hover/logo:scale-100"></div>
          </div>
        ))}
      </div>
      
      {/* Edge Gradient Fades for a seamless look */}
      <div className="absolute inset-y-0 left-0 w-32 md:w-80 bg-gradient-to-r from-white via-white/90 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 md:w-80 bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-none"></div>
      
      {/* Industrial Scanline Overlay Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0)_50%,rgba(0,0,0,0.01)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30"></div>
      
      {/* Technical coordinate labels for corners */}
      <div className="absolute bottom-3 right-6 z-20 pointer-events-none select-none hidden sm:block">
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-100">
          {config.brandCarouselCoordsLabel}
        </span>
      </div>
    </section>
  );
};

export default BrandCarousel;
