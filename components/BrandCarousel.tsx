
import React from 'react';
import { Brand } from '../types';

interface BrandCarouselProps {
  brands: Brand[];
}

const BrandCarousel: React.FC<BrandCarouselProps> = ({ brands }) => {
  if (!brands || brands.length === 0) return null;

  // Duplicate the brands array multiple times to ensure the marquee is full and seamless
  const extendedBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <div className="bg-white border-y border-gray-100 py-6 overflow-hidden relative group">
      <div className="flex animate-marquee-slow whitespace-nowrap items-center gap-12 sm:gap-24 px-4 sm:px-10">
        {extendedBrands.map((brand, idx) => (
          <div key={`${brand.id}-${idx}`} className="flex flex-col items-center justify-center shrink-0">
            {brand.logoData ? (
              <img 
                src={brand.logoData} 
                alt={brand.name} 
                className="h-6 sm:h-12 w-auto object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            ) : (
              <span className="text-sm sm:text-lg font-black uppercase text-gray-300 group-hover:text-[var(--primary-yellow)] transition-colors">
                {brand.name}
              </span>
            )}
          </div>
        ))}
      </div>
      
      {/* Visual gradients for smooth edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
    </div>
  );
};

export default BrandCarousel;
