
import React from 'react';
import { DivisionConfig } from '../types';

interface ServicesProps {
  config: Record<string, DivisionConfig>;
  uiTitle: string;
  sinceLabel: string;
  onInquireClick: () => void;
  onNavigate: (view: string) => void;
}

const Services: React.FC<ServicesProps> = ({ config, uiTitle, sinceLabel, onNavigate }) => {
  const words = uiTitle.split(' ');
  const lastWord = words.pop();
  const firstPart = words.join(' ');

  const renderIcon = (icon: string) => {
    if (icon.startsWith('data:') || icon.startsWith('http') || icon.length > 32) {
      return <img src={icon} alt="Icon" className="w-5 h-5 sm:w-8 object-contain" />;
    }
    return <span className="text-xl sm:text-2xl">{icon}</span>;
  };

  const deptEntries = Object.entries(config) as [string, DivisionConfig][];

  return (
    <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-20 bg-[#111111]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-16 text-left">
          <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-none text-white">
            {firstPart} <span className="text-black bg-[var(--primary-yellow)] px-3 py-1 rounded-[var(--border-radius)]">{lastWord}</span>
          </h2>
          <p className="text-gray-500 mt-2 font-bold uppercase tracking-widest text-[10px] md:text-sm">{sinceLabel}</p>
        </div>
        
        {/* Mobile 2-column side-by-side grid, Desktop flex row */}
        <div className="grid grid-cols-2 lg:flex lg:flex-row gap-3 sm:gap-6 md:gap-8 lg:gap-12 items-stretch">
          {deptEntries.map(([name, div], idx) => {
            const isFeatured = idx === 1;
            const isLastOnMobileOdd = idx === 2 && deptEntries.length % 2 !== 0;
            
            return (
              <div 
                key={name}
                onClick={() => onNavigate(`dept:${name}`)}
                className={`
                  cursor-pointer group p-4 sm:p-6 md:p-10 border-t-[3px] sm:border-t-[8px] transition-all duration-300 rounded-[var(--border-radius)] shadow-lg flex flex-col
                  ${isFeatured ? 'bg-[var(--primary-yellow)] border-black lg:-translate-y-6 z-10' : 'bg-[#1a1a1a] border-[#333] hover:border-[var(--primary-yellow)]'}
                  ${isLastOnMobileOdd ? 'col-span-2 lg:col-span-1' : 'col-span-1'}
                  lg:w-[380px] lg:shrink-0
                `}
              >
                <div className={`mb-3 sm:mb-6 ${isFeatured ? 'text-black' : 'text-[var(--primary-yellow)]'}`}>
                  {renderIcon(div.icon)}
                </div>
                
                <h3 className={`text-[11px] sm:text-lg md:text-2xl font-black uppercase mb-2 leading-tight ${isFeatured ? 'text-black' : 'text-white group-hover:text-[var(--primary-yellow)]'}`}>
                  {div.title}
                </h3>
                
                <p className={`mb-4 font-medium text-[9px] sm:text-sm md:text-lg leading-tight line-clamp-3 sm:line-clamp-none ${isFeatured ? 'text-black/80' : 'text-gray-400 group-hover:text-gray-200'}`}>
                  {div.desc}
                </p>
                
                <div className="mt-auto">
                  <span className={`inline-flex items-center font-black text-[9px] sm:text-xs uppercase tracking-widest border-b-2 sm:border-b-4 pb-0.5 ${isFeatured ? 'text-black border-black/20' : 'text-white group-hover:text-[var(--primary-yellow)] border-white/10 group-hover:border-[var(--primary-yellow)]/30'}`}>
                    {div.ctaText} <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
