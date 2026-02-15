
import React from 'react';
import { Brand, SiteConfig } from '../types';

interface AboutPageProps {
  config: SiteConfig['about'];
  company: SiteConfig['company'];
  brands: Brand[];
}

const AboutPage: React.FC<AboutPageProps> = ({ config, company, brands }) => {
  const visibleBrands = brands.filter(b => b.showOnAboutPage);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden">
      {/* Cinematic Hero Section */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden border-b-8 border-[var(--primary-yellow)]">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] scale-110 hover:scale-100"
          style={{ backgroundImage: `url(${config.image})`, filter: 'brightness(0.3) contrast(1.2)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80"></div>
        
        {/* Background Decorative Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
          <h2 className="text-[20vw] font-black text-white/[0.03] uppercase leading-none whitespace-nowrap">
            SINCE 1994
          </h2>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-block bg-[var(--primary-yellow)] text-black px-3 py-0.5 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] mb-4 sm:mb-6 rounded-sm">
            Operational Legacy: {company.foundingYear}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-[120px] font-black uppercase tracking-tighter leading-[0.85] mb-6 md:mb-8 drop-shadow-2xl">
            {config.title.split(' ').map((word, i) => (
              <span key={i} className={i === 1 ? "text-[var(--primary-yellow)] block" : "block"}>{word}</span>
            ))}
          </h1>
          <p className="text-sm sm:text-lg md:text-2xl text-gray-400 font-medium max-w-3xl mx-auto border-l-2 md:border-l-4 border-[var(--primary-yellow)] pl-4 md:pl-8 italic">
            "{config.subtitle}"
          </p>
        </div>
      </section>

      {/* Infrastructure & Heritage Grid */}
      <section className="py-16 md:py-48 px-4 sm:px-6 lg:px-20 bg-[#0c0c0c]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
          
          <div className="lg:col-span-7 space-y-8 md:space-y-12">
            <div className="space-y-4">
              <span className="text-[var(--primary-yellow)] text-[10px] font-black uppercase tracking-[0.5em]">Section 01 // History</span>
              <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tight text-white leading-none">
                Industrial <span className="text-transparent border-t-2 border-b-2 md:border-t-4 md:border-b-4 border-white px-2">Logistics</span> DNA
              </h2>
            </div>
            
            <div className="text-base md:text-xl text-gray-400 font-medium leading-relaxed space-y-6 md:space-y-8">
              {config.content.split('\n').map((para, i) => (
                <p key={i} className="first-letter:text-4xl md:first-letter:text-5xl first-letter:font-black first-letter:text-[var(--primary-yellow)] first-letter:mr-2 md:first-letter:mr-3 first-letter:float-left">
                  {para}
                </p>
              ))}
            </div>

            {/* Side-by-side stats on mobile */}
            <div className="grid grid-cols-2 gap-3 sm:gap-8 pt-4 md:pt-8">
              <div className="p-4 sm:p-10 bg-white/5 border border-white/10 rounded-[var(--border-radius)] group hover:border-[var(--primary-yellow)] transition-all flex flex-col justify-center">
                <span className="text-3xl sm:text-5xl font-black text-[var(--primary-yellow)] block mb-1 md:mb-4">30+</span>
                <span className="text-[8px] sm:text-xs font-black uppercase tracking-widest text-slate-500 leading-tight">Distribution Authority</span>
              </div>
              <div className="p-4 sm:p-10 bg-white/5 border border-white/10 rounded-[var(--border-radius)] group hover:border-[var(--primary-yellow)] transition-all flex flex-col justify-center">
                <span className="text-3xl sm:text-5xl font-black text-white block mb-1 md:mb-4">4x</span>
                <span className="text-[8px] sm:text-xs font-black uppercase tracking-widest text-slate-500 leading-tight">National Strategic Hubs</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative group hidden sm:block">
            <div className="absolute -top-10 -right-10 w-40 h-40 border-r-8 border-t-8 border-[var(--primary-yellow)] opacity-20 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 border-l-8 border-b-8 border-[var(--primary-yellow)] opacity-20 group-hover:opacity-100 transition-all duration-700"></div>
            <div className="relative aspect-[4/5] bg-black overflow-hidden rounded-sm shadow-2xl border-4 border-white/5">
              <img 
                src={config.image} 
                className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-105 group-hover:opacity-90 transition-all duration-[2s]" 
                alt="Infrastructure" 
              />
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-black/60 backdrop-blur-md border-l-4 border-[var(--primary-yellow)]">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">Internal Registry Asset</p>
                <p className="text-sm font-black text-white uppercase leading-tight">Master Distribution Facility</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Values - Side-by-side on mobile */}
      <section className="py-16 md:py-48 px-4 sm:px-6 lg:px-20 bg-black border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 md:mb-20 space-y-4">
             <span className="text-[var(--primary-yellow)] text-[10px] font-black uppercase tracking-[0.5em]">Section 02 // Protocol</span>
             <h2 className="text-3xl md:text-6xl font-black uppercase tracking-tight text-white">Strategic <span className="text-[var(--primary-yellow)]">Directives</span></h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-0 items-stretch">
            <div className="p-4 sm:p-20 bg-[#111] border-l-4 sm:border-l-8 border-[var(--primary-yellow)] shadow-2xl flex flex-col justify-between">
               <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-[var(--primary-yellow)] mb-4 sm:mb-8 flex items-center gap-2 sm:gap-3">
                 <span className="w-4 sm:w-8 h-[2px] bg-[var(--primary-yellow)]"></span> Mission
               </div>
               <p className="text-xs sm:text-2xl md:text-4xl font-black text-white uppercase tracking-tighter leading-[1.1] sm:leading-[0.9] mb-4 sm:mb-12">
                 {config.mission}
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-white/10 pt-4 sm:pt-10">
                  <div className="text-[6px] sm:text-[9px] font-black uppercase text-slate-600">Priority: CRITICAL</div>
                  <div className="text-[6px] sm:text-[9px] font-black uppercase text-slate-600">Audit: PASS</div>
               </div>
            </div>
            
            <div className="p-4 sm:p-20 bg-[#161616] border-l-4 border-white/5 lg:border-l-0 shadow-2xl flex flex-col justify-between">
               <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-4 sm:mb-8 flex items-center gap-2 sm:gap-3">
                 <span className="w-4 sm:w-8 h-[2px] bg-white/20"></span> Vision
               </div>
               <p className="text-xs sm:text-2xl md:text-4xl font-black text-white/60 uppercase tracking-tighter leading-[1.1] sm:leading-[0.9] mb-4 sm:mb-12">
                 {config.vision}
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-white/10 pt-4 sm:pt-10">
                  <div className="text-[6px] sm:text-[9px] font-black uppercase text-slate-600">Horizon: 2030+</div>
                  <div className="text-[6px] sm:text-[9px] font-black uppercase text-slate-600">Sector: NATIONAL</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Roadmap Timeline */}
      <section className="py-16 md:py-48 px-4 sm:px-6 lg:px-20 bg-[#0c0c0c] relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[var(--primary-yellow)]/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 md:mb-32 space-y-4 md:space-y-6">
            <span className="text-[var(--primary-yellow)] text-[10px] font-black uppercase tracking-[0.5em]">Section 03 // Timeline</span>
            <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none">The <span className="text-[var(--primary-yellow)]">Assembly</span> Line</h2>
          </div>

          <div className="relative space-y-16 md:space-y-24">
            <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-0.5 bg-white/5 -translate-x-1/2"></div>
            
            {config.roadmap.map((item, idx) => (
              <div key={idx} className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="absolute left-[15px] md:left-1/2 -translate-x-1/2 w-6 h-6 md:w-10 md:h-10 bg-black border-2 md:border-4 border-[var(--primary-yellow)] rounded-full z-10 shadow-[0_0_15px_rgba(255,214,0,0.3)]"></div>
                
                <div className="w-full md:w-1/2 flex justify-start md:justify-end pl-10 md:pl-0">
                   <div className={`w-full max-w-md p-6 md:p-10 bg-[#161616] border-b-4 md:border-b-8 border-[var(--primary-yellow)] shadow-2xl group hover:-translate-y-1 md:hover:-translate-y-2 transition-transform duration-500 ${idx % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                      <span className="text-3xl md:text-6xl font-black text-white/5 absolute -top-8 left-4 group-hover:text-[var(--primary-yellow)]/10 transition-colors pointer-events-none">{item.year}</span>
                      <div className={`text-[var(--primary-yellow)] font-black text-xl mb-2`}>
                        {item.year}
                      </div>
                      <p className="text-xs md:text-xl font-bold text-white uppercase tracking-tight leading-tight">
                        {item.event}
                      </p>
                   </div>
                </div>
                <div className="hidden md:block w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Authorized Partners Node Grid */}
      {visibleBrands.length > 0 && (
        <section className="bg-white py-16 md:py-48 px-4 sm:px-6 lg:px-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-24 space-y-4">
               <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.5em]">Authorized National Network</span>
               <h2 className="text-3xl md:text-7xl font-black uppercase tracking-tighter text-black">Technical <span className="text-[var(--primary-yellow)]">Partners</span></h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {visibleBrands.map(brand => (
                <div key={brand.id} className="aspect-square flex flex-col items-center justify-center p-4 sm:p-12 border border-gray-100 group transition-all hover:bg-[#111] hover:scale-105 shadow-sm hover:shadow-2xl">
                  {brand.logoData ? (
                    <img 
                      src={brand.logoData} 
                      alt={brand.name} 
                      className="max-h-12 md:max-h-16 w-full object-contain filter brightness-0 group-hover:brightness-0 group-hover:invert transition-all" 
                    />
                  ) : (
                    <span className="text-sm md:text-xl font-black uppercase tracking-tighter text-black group-hover:text-[var(--primary-yellow)]">
                      {brand.name}
                    </span>
                  )}
                  <span className="mt-4 md:mt-8 text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">Authorized Dist.</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutPage;
