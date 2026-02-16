
import React from 'react';
import { SiteConfig } from '../types';

interface FoundersSectionProps {
  config: SiteConfig['founders'];
}

const FoundersSection: React.FC<FoundersSectionProps> = ({ config }) => {
  return (
    <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-20 bg-[#111111] overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-20 items-center">
          <div className="relative group overflow-hidden rounded-[var(--border-radius)]">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 opacity-60 md:hidden"></div>
            <img 
              src={config.image} 
              alt="Founders" 
              className="w-full h-72 sm:h-[500px] object-cover shadow-2xl hover:scale-105 transition-transform duration-1000 grayscale group-hover:grayscale-0"
            />
            {/* Mobile floating label */}
            <div className="absolute bottom-4 left-4 z-20 md:hidden">
              <span className="bg-[var(--primary-yellow)] text-black px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm shadow-xl">
                {config.roleLabel}
              </span>
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-10">
            <div>
              <p className="text-[var(--primary-yellow)] text-[10px] sm:text-[14px] font-black uppercase tracking-[0.3em] mb-2 sm:mb-4">{config.subtitle}</p>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none">
                {config.title.split(' ')[0]} <br className="sm:hidden" />
                <span className="text-[var(--primary-yellow)] border-b-4 border-[var(--primary-yellow)] sm:border-0 sm:bg-[var(--primary-yellow)] sm:text-black sm:px-4 sm:rounded-[var(--border-radius)]">
                  {config.title.split(' ').slice(1).join(' ')}
                </span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm sm:text-xl md:text-2xl font-medium leading-tight sm:leading-relaxed italic">
              "{config.text}"
            </p>
            <div className="hidden md:flex items-center gap-6">
              <span className="w-20 h-2 bg-[var(--primary-yellow)]"></span>
              <span className="text-[14px] font-black uppercase tracking-[0.2em] text-white">{config.roleLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoundersSection;
