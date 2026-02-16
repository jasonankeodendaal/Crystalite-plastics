
import React, { useState } from 'react';
import { PosterItem, SiteConfig } from '../types';

interface BillboardSectionProps {
  posters: PosterItem[];
  config: SiteConfig['ui'];
}

const BillboardSection: React.FC<BillboardSectionProps> = ({ posters, config }) => {
  const [expandedPoster, setExpandedPoster] = useState<PosterItem | null>(null);

  if (!posters || posters.length === 0) return null;

  return (
    <section className="py-12 md:py-24 px-4 sm:px-6 lg:px-20 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-12 flex items-center justify-between">
           <div className="flex items-center gap-2 md:gap-4">
             <div className="h-[1px] md:h-[2px] w-8 md:w-12 bg-[var(--primary-yellow)]"></div>
             <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-[var(--primary-yellow)]">{config.billboardShowcaseLabel}</span>
           </div>
           <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest hidden sm:block">{config.billboardAssetProtocolLabel}</span>
        </div>

        {/* Side-by-side 3-column grid on all screens */}
        <div className="grid grid-cols-3 gap-2 md:gap-6 lg:gap-10">
          {posters.slice(0, 3).map((poster, idx) => (
            <div 
              key={poster.id || idx}
              onClick={() => setExpandedPoster(poster)}
              className="relative group cursor-pointer overflow-hidden rounded-sm transition-all duration-500 hover:shadow-[0_0_30px_rgba(255,214,0,0.1)]"
            >
              {/* Technical Display Frame */}
              <div className="relative aspect-[4/5] w-full bg-black overflow-hidden border border-white/5">
                {/* Poster Image */}
                <img 
                  src={poster.image} 
                  alt={poster.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-110"
                />

                {/* Industrial UI Accents - Hidden/Simplified on mobile */}
                <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-0.5 md:gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                   <div className="flex gap-1">
                      <div className="w-1 h-1 bg-[var(--primary-yellow)]"></div>
                      <div className="hidden md:block w-4 h-1 bg-white/20"></div>
                   </div>
                   <span className="text-[5px] md:text-[7px] font-black text-white uppercase tracking-widest">ID: {idx + 1}</span>
                </div>

                {/* Technical Corner Markers - Only on desktop */}
                <div className="hidden md:block absolute top-2 left-2 w-3 h-3 border-l border-t border-[var(--primary-yellow)] opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0"></div>
                <div className="hidden md:block absolute top-2 right-2 w-3 h-3 border-r border-t border-[var(--primary-yellow)] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 -translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0"></div>
                <div className="hidden md:block absolute bottom-2 left-2 w-3 h-3 border-l border-b border-[var(--primary-yellow)] opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0"></div>
                <div className="hidden md:block absolute bottom-2 right-2 w-3 h-3 border-r border-b border-[var(--primary-yellow)] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0"></div>

                {/* Ambient Glow on Hover */}
                <div className="absolute inset-0 bg-[var(--primary-yellow)]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                {/* Lighting Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent pointer-events-none"></div>

                {/* Content Overlay - Optimized for density */}
                <div className="absolute bottom-0 left-0 w-full p-2.5 sm:p-8 bg-gradient-to-t from-black via-black/60 to-transparent">
                  <div className="space-y-1 md:space-y-2 translate-y-1 md:translate-y-0 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="hidden md:block text-[var(--primary-yellow)] text-[8px] font-black uppercase tracking-[0.3em] mb-1">Module // 0{idx + 1}</span>
                    <h3 className="text-[9px] sm:text-2xl font-black uppercase text-white tracking-tighter leading-tight group-hover:text-[var(--primary-yellow)] transition-colors line-clamp-2 md:line-clamp-none">
                      {poster.title}
                    </h3>
                    <span className="hidden md:block text-[7px] font-black text-slate-500 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">{config.billboardEnlargeLabel} &rarr;</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Enlarged View Overlay */}
      {expandedPoster && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-10 animate-in fade-in duration-300">
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-xl cursor-zoom-out"
            onClick={() => setExpandedPoster(null)}
          />
          
          {/* Scanline Overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,128,0.06))] bg-[length:100%_2px,3px_100%]"></div>

          <div className="relative max-w-6xl w-full max-h-[90vh] flex flex-col items-center animate-in zoom-in-95 duration-500">
             <div className="absolute -top-12 left-0 w-full flex justify-between items-end px-4">
                <div className="space-y-1">
                   <h4 className="text-[10px] font-black text-[var(--primary-yellow)] uppercase tracking-[0.4em]">Asset_Inspection_Protocol</h4>
                   <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter">{expandedPoster.title}</h2>
                </div>
                <button 
                  onClick={() => setExpandedPoster(null)}
                  className="bg-white text-black px-4 sm:px-6 py-2 text-[8px] sm:text-[10px] font-black uppercase rounded-[var(--border-radius)] hover:bg-[var(--primary-yellow)] transition-all mb-1"
                >
                  Close &times;
                </button>
             </div>

             <div className="relative w-full h-full border-2 border-white/10 p-1 sm:p-2 bg-[#111] shadow-[0_0_100px_rgba(0,0,0,1)]">
                <img 
                  src={expandedPoster.image} 
                  className="w-full h-full object-contain max-h-[75vh]" 
                  alt={expandedPoster.title} 
                />
                
                {/* HUD Elements */}
                <div className="absolute top-6 left-6 text-white/20 font-mono text-[8px] uppercase tracking-widest pointer-events-none hidden sm:block">
                   REC_TYPE: Industrial_Visual_Sample<br />
                   BIT_DEPTH: 32_BIT_ENGINE<br />
                   LOG_MODE: RAW_FIDELITY
                </div>
                
                <div className="absolute bottom-6 right-6 text-white/20 font-mono text-[8px] uppercase tracking-widest pointer-events-none text-right hidden sm:block">
                   LAT: -26.1368<br />
                   LNG: 28.2109<br />
                   REF_NODE: ISANDO_HQ_01
                </div>
             </div>

             <div className="mt-6 flex items-center gap-6 text-white/40">
                <div className="w-12 h-[1px] bg-white/10"></div>
                <p className="text-[9px] font-black uppercase tracking-[0.4em]">High Precision Technical Showcase Asset</p>
                <div className="w-12 h-[1px] bg-white/10"></div>
             </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BillboardSection;
