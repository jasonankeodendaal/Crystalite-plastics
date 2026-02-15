
import React from 'react';
import { SiteConfig } from '../types';
import InquiryForm from './InquiryForm';

interface ContactPageProps {
  config: SiteConfig['contact'];
  emergency: SiteConfig['emergency'];
  ui: SiteConfig['ui'];
  onSubmit: (data: any) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ config, emergency, ui, onSubmit }) => {
  // Map source logic
  const mapSrc = (config.googleMapsEmbedUrl && config.googleMapsEmbedUrl.startsWith('http'))
    ? config.googleMapsEmbedUrl
    : `https://maps.google.com/maps?q=${config.lat},${config.lng}&z=14&output=embed`;

  return (
    <div className="bg-[#111111] min-h-screen text-white overflow-hidden">
      {/* Operational Command Header */}
      <section className="relative py-12 md:py-32 px-4 sm:px-6 lg:px-20 border-b-8 border-[var(--primary-yellow)] bg-black overflow-hidden">
        {/* Abstract Technical Overlays */}
        <div className="absolute top-0 right-0 w-[50%] h-full bg-[var(--primary-yellow)]/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2"></div>
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white/5"></div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-end gap-8 md:gap-12">
          <div className="text-center md:text-left space-y-4 md:space-y-6">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 px-2 py-0.5 md:px-3 md:py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                <span className="text-[8px] md:text-[10px] font-black uppercase text-green-500 tracking-widest whitespace-nowrap">System Active</span>
              </div>
              <span className="text-[8px] md:text-[10px] font-black uppercase text-white/30 tracking-[0.4em]">Auth // Terminal 01</span>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-[140px] font-black uppercase tracking-tighter leading-[0.85] text-white">
              CONTACT <br /> <span className="text-[var(--primary-yellow)]">CENTRAL</span>
            </h1>
          </div>
          <div className="hidden lg:block w-72 p-6 bg-white/5 border-l-4 border-[var(--primary-yellow)] backdrop-blur-md">
             <p className="text-[9px] font-black uppercase text-white/50 mb-2 tracking-widest">Global Protocol</p>
             <p className="text-xs font-bold text-gray-400 leading-relaxed italic">
               "{ui.inquirySubtext}"
             </p>
          </div>
        </div>
      </section>

      {/* Main Grid Interface */}
      <section className="max-w-[1920px] mx-auto px-3 sm:px-6 lg:px-10 py-8 md:py-24">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-20">
          
          {/* Left Interface: Network Nodes */}
          <div className="xl:col-span-7 space-y-12 md:space-y-16">
            
            {/* Operational Nodes Registry - Side-by-side on mobile */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-8">
               {/* Node 01: Physical */}
               <div className="p-4 sm:p-12 bg-black/40 border-l-4 sm:border-l-8 border-[var(--primary-yellow)] group hover:bg-black/60 transition-all shadow-2xl rounded-sm flex flex-col justify-between">
                  <div>
                    <div className="text-[7px] sm:text-[10px] font-black uppercase text-[var(--primary-yellow)] mb-4 sm:mb-8 tracking-[0.4em] flex items-center gap-2 sm:gap-3">
                      <span className="w-4 sm:w-6 h-[2px] bg-[var(--primary-yellow)]"></span> Node 01
                    </div>
                    <h3 className="text-sm sm:text-3xl font-black uppercase text-white leading-tight sm:leading-none mb-3 sm:mb-6 tracking-tighter">
                      HQ Distribution
                    </h3>
                  </div>
                  <p className="text-[9px] sm:text-lg text-gray-400 font-medium leading-tight">
                    {config.address.split(',')[0]}
                  </p>
               </div>

               {/* Node 02: Communications */}
               <div className="p-4 sm:p-12 bg-black/40 border-l-4 sm:border-l-8 border-white/10 group hover:border-[var(--primary-yellow)] transition-all shadow-2xl rounded-sm flex flex-col justify-between">
                  <div>
                    <div className="text-[7px] sm:text-[10px] font-black uppercase text-white/40 mb-4 sm:mb-8 tracking-[0.4em] flex items-center gap-2 sm:gap-3">
                      <span className="w-4 sm:w-6 h-[2px] bg-white/20"></span> Node 02
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[6px] sm:text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Switchboard</p>
                        <p className="text-xs sm:text-2xl font-black text-white">{config.phone}</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-[6px] sm:text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Digital</p>
                        <p className="text-xs sm:text-xl font-black text-[var(--primary-yellow)] truncate">{config.email.split('@')[0]}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-[9px] sm:hidden text-[var(--primary-yellow)] font-black uppercase">Online 24/7</p>
               </div>

               {/* Node 03: Emergency (Full Width) */}
               <div className="col-span-2 p-6 sm:p-16 bg-[var(--primary-yellow)] text-black relative overflow-hidden group shadow-2xl rounded-sm">
                  <div className="absolute top-0 right-0 w-32 md:w-64 h-full bg-black/5 -skew-x-12 translate-x-1/2 pointer-events-none"></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10">
                    <div className="text-center md:text-left">
                      <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-black/60 mb-3 sm:mb-6 flex items-center justify-center md:justify-start gap-3">
                        <span className="w-6 sm:w-8 h-[2px] bg-black/40"></span> Critical Hotline
                      </div>
                      <h3 className="text-2xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-2 sm:mb-4">
                        24/7 National <br className="hidden md:block" /> <span className="opacity-40">Support</span>
                      </h3>
                      <p className="text-[9px] sm:text-sm font-bold uppercase tracking-widest text-black/60 max-w-sm hidden sm:block">
                        {emergency.label} &bull; {emergency.desc}
                      </p>
                    </div>
                    <div className="text-4xl sm:text-8xl font-black tracking-tighter drop-shadow-2xl animate-pulse">
                      {emergency.number}
                    </div>
                  </div>
               </div>
            </div>

            {/* Geospatial Registry (Map) */}
            <div className="space-y-6">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/5 pb-4 gap-3">
                  <div>
                    <h3 className="text-lg md:text-xl font-black uppercase text-white tracking-widest">Geospatial Registry</h3>
                    <p className="text-[8px] md:text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] mt-1">Satellite Visualization // Primary Node</p>
                  </div>
                  <div className="text-[8px] md:text-[10px] font-mono text-slate-500 uppercase tracking-widest px-3 py-1 bg-white/5 rounded-sm">
                    {config.lat.toFixed(4)} , {config.lng.toFixed(4)}
                  </div>
               </div>
               
               <div className="aspect-video sm:aspect-[21/9] bg-black border border-white/10 relative group overflow-hidden rounded-sm shadow-inner">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }} 
                    loading="lazy" 
                    allowFullScreen 
                    referrerPolicy="no-referrer-when-downgrade"
                    src={mapSrc}
                    title="HQ Hub Location"
                  ></iframe>
                  {/* Decorative Crosshairs */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-32 sm:h-32 border border-[var(--primary-yellow)]/30 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-1000"></div>
                  
                  <div className="absolute bottom-4 right-4 p-2 sm:p-4 bg-black/80 backdrop-blur-md border border-white/10 text-white shadow-2xl">
                    <p className="text-[7px] sm:text-[10px] font-black uppercase tracking-widest">ID: HQ_LOG_01</p>
                  </div>
               </div>
            </div>

          </div>

          {/* Right Interface: Inquiry Terminal */}
          <div className="xl:col-span-5">
            <div className="sticky top-28 space-y-6 md:space-y-8">
               <div className="bg-[#1a1a1a] p-8 sm:p-20 border-t-8 border-[var(--primary-yellow)] shadow-2xl relative overflow-hidden group rounded-sm">
                  {/* Background Grid Pattern */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                  
                  <div className="relative z-10 space-y-8 md:space-y-12">
                    <div className="space-y-3 md:space-y-4">
                      <div className="text-[9px] md:text-[10px] font-black uppercase text-[var(--primary-yellow)] tracking-[0.5em] flex items-center gap-3">
                        <span className="w-8 md:w-10 h-[2px] bg-[var(--primary-yellow)]"></span> Terminal
                      </div>
                      <h2 className="text-3xl md:text-7xl font-black uppercase text-white leading-none tracking-tighter">
                        TECHNICAL <br /> <span className="text-[var(--primary-yellow)]">INQUIRY</span>
                      </h2>
                      <p className="text-xs md:text-lg text-gray-400 font-medium leading-relaxed italic">
                        {config.formSubtext}
                      </p>
                    </div>

                    <div className="border-t border-white/10 pt-8 md:pt-12">
                      <InquiryForm 
                        emergencyConfig={emergency}
                        uiConfig={ui}
                        onSubmit={onSubmit}
                        isCompact={true}
                      />
                    </div>
                  </div>
               </div>

               {/* Auxiliary Operational Info - Side-by-side */}
               <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-sm">
                    <p className="text-[7px] sm:text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Response</p>
                    <p className="text-[10px] sm:text-sm font-black text-white uppercase">&lt; 2HR Lead</p>
                  </div>
                  <div className="p-4 sm:p-6 bg-white/5 border border-white/10 rounded-sm">
                    <p className="text-[7px] sm:text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Dispatch</p>
                    <p className="text-[10px] sm:text-sm font-black text-white uppercase">National</p>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ContactPage;
