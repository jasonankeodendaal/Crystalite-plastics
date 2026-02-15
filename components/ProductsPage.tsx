
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Material, MaterialDepartment, SiteConfig, MaterialMedia } from '../types';
import { loadState } from '../stateManager';

interface ProductsPageProps {
  materials: Material[];
  config: SiteConfig;
  hasInteracted: boolean;
  onInquire: (materialName?: string, sku?: string) => void;
  onSelectProduct: (product: Material, filteredList: Material[]) => void;
  initialDept?: string;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ materials, config, hasInteracted, onInquire, onSelectProduct, initialDept = 'All' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<MaterialDepartment | 'All'>(initialDept);
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedRange, setSelectedRange] = useState<string>('All');
  const [selectedSeries, setSelectedSeries] = useState<string>('All');
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  
  const state = useMemo(() => loadState(), []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const departments: (MaterialDepartment | 'All')[] = ['All', ...Object.keys(config.divisions)];

  const heroContent = useMemo(() => {
    const selectedRangeObj = selectedRange !== 'All' ? state.ranges.find(r => r.name === selectedRange) : null;
    const selectedDeptConfig = selectedDept !== 'All' ? config.divisions[selectedDept] : null;

    let title = config.ui.catalogHeroTitle || "Distribution Hub";
    if (selectedRangeObj) {
      title = selectedRangeObj.name;
    } else if (selectedDeptConfig) {
      title = selectedDeptConfig.title;
    }

    let desc = config.ui.catalogHeroDesc || "Industrial inventory of engineering polymers and specialized hardware.";
    if (selectedRangeObj) {
      desc = `Technical overview of the ${selectedRangeObj.name} range within our ${selectedRangeObj.department} division.`;
    } else if (selectedDeptConfig) {
      desc = selectedDeptConfig.desc;
    }

    let media = [{ url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000", type: 'image' }] as MaterialMedia[];
    
    if (selectedRangeObj && selectedRangeObj.heroImages && selectedRangeObj.heroImages.length > 0) {
      media = selectedRangeObj.heroImages.map(img => ({ url: img, type: 'image' }));
    } 
    else if (selectedDept !== 'All' && config.hero.departmentHeroes[selectedDept] && config.hero.departmentHeroes[selectedDept].length > 0) {
      media = config.hero.departmentHeroes[selectedDept];
    }

    return { title, desc, media };
  }, [selectedDept, selectedRange, config, state.ranges]);

  useEffect(() => {
    setCurrentSlide(0);
  }, [selectedDept, selectedRange, searchTerm]);

  useEffect(() => {
    const slides = heroContent.media;
    if (slides.length <= 1) return;
    const currentMedia = slides[currentSlide];
    let timer: number;
    if (currentMedia.type === 'image') {
      timer = window.setTimeout(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length);
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [currentSlide, heroContent.media]);

  const brands = useMemo(() => {
    const b = new Set<string>();
    materials.forEach(m => {
      if (m.brand && (selectedDept === 'All' || m.department === selectedDept)) {
        b.add(m.brand);
      }
    });
    return ['All', ...Array.from(b)];
  }, [materials, selectedDept]);

  const ranges = useMemo(() => {
    const r = new Set<string>();
    materials.forEach(m => {
      if (m.brand && (selectedBrand === 'All' || m.brand === selectedBrand) && (selectedDept === 'All' || m.department === selectedDept)) {
        r.add(m.range || '');
      }
    });
    return ['All', ...Array.from(r).filter(Boolean)];
  }, [materials, selectedDept, selectedBrand]);

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = selectedDept === 'All' || m.department === selectedDept;
      const matchBrand = selectedBrand === 'All' || m.brand === selectedBrand;
      const matchRange = selectedRange === 'All' || m.range === selectedRange;
      const matchSeries = selectedSeries === 'All' || m.series === selectedSeries;
      return matchSearch && matchDept && matchBrand && matchRange && matchSeries;
    });
  }, [searchTerm, selectedDept, selectedBrand, selectedRange, selectedSeries, materials]);

  const titleParts = heroContent.title.split(' ');
  const lastTitlePart = titleParts.pop();
  const restTitle = titleParts.join(' ');

  const activeFiltersCount = [
    selectedBrand !== 'All',
    selectedRange !== 'All',
    selectedSeries !== 'All'
  ].filter(Boolean).length;

  return (
    <div className="bg-[#0c0c0c] min-h-screen text-white">
      {/* 1. Technical Banner Section */}
      <div className="relative h-[250px] md:h-[400px] flex items-center overflow-hidden border-b-4 border-[var(--primary-yellow)]">
        {heroContent.media.map((media, idx) => (
          <div 
            key={`${selectedDept}-${selectedRange}-${idx}`}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {media.type === 'video' ? (
              <video 
                ref={idx === currentSlide ? videoRef : null}
                src={media.url} 
                autoPlay 
                muted={!hasInteracted} 
                playsInline
                onEnded={() => setCurrentSlide(prev => (prev + 1) % heroContent.media.length)}
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.25) contrast(1.1)' }}
              />
            ) : (
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${media.url})`, filter: 'brightness(0.25) contrast(1.1)' }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] to-transparent opacity-60"></div>
          </div>
        ))}

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
               <span className="h-1 w-12 bg-[var(--primary-yellow)]"></span>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--primary-yellow)]">Authorized Distribution</span>
            </div>
            <h1 className="text-3xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white">
              {restTitle} <span className="text-[var(--primary-yellow)]">{lastTitlePart}</span>
            </h1>
            <p className="text-xs md:text-xl text-gray-400 font-medium leading-relaxed line-clamp-2">
              {heroContent.desc}
            </p>
          </div>
        </div>
        
        {heroContent.media.length > 1 && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
             <div 
               className="h-full bg-[var(--primary-yellow)] transition-all duration-100 linear"
               style={{ width: `${((currentSlide + 1) / heroContent.media.length) * 100}%` }}
             ></div>
          </div>
        )}
      </div>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 py-4 lg:py-8 flex flex-col lg:flex-row gap-6 lg:gap-10">
        
        {/* 2. Mobile Compact Filter Bar - Visible only on mobile */}
        <div className="lg:hidden space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {departments.map(dept => (
              <button 
                key={dept}
                onClick={() => { setSelectedDept(dept as any); setSelectedBrand('All'); setSelectedRange('All'); setSelectedSeries('All'); }}
                className={`whitespace-nowrap px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-full transition-all border ${selectedDept === dept ? 'bg-[var(--primary-yellow)] text-black border-[var(--primary-yellow)]' : 'bg-black text-gray-500 border-white/10 hover:border-white/30'}`}
              >
                {dept}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search SKU, Grade..." 
                className="w-full bg-[#111] border border-white/10 p-3 pl-4 text-xs text-white outline-none placeholder:text-gray-700 font-bold focus:border-[var(--primary-yellow)] transition-all rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                >
                  &times;
                </button>
              )}
            </div>
            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              className="bg-[#111] border border-white/10 px-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white rounded-md relative"
            >
              <svg className="w-4 h-4 text-[var(--primary-yellow)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
              Filter
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--primary-yellow)] text-black w-4 h-4 flex items-center justify-center rounded-full text-[8px] border-2 border-[#0c0c0c]">{activeFiltersCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* 3. Technical Control Sidebar - Desktop Only */}
        <aside className="hidden lg:block w-72 shrink-0 space-y-10">
          <div className="sticky top-28 space-y-10">
            
            {/* Division Selection */}
            <section className="bg-[#111] p-6 border-l-4 border-[var(--primary-yellow)] rounded-r-[var(--border-radius)] shadow-xl">
              <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-6 border-b border-white/5 pb-2">Material Division</h3>
              <div className="space-y-1.5">
                {departments.map(dept => (
                  <button 
                    key={dept}
                    onClick={() => { setSelectedDept(dept as any); setSelectedBrand('All'); setSelectedRange('All'); setSelectedSeries('All'); }}
                    className={`w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all rounded-sm flex justify-between items-center ${selectedDept === dept ? 'bg-[var(--primary-yellow)] text-black font-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                  >
                    <span>{dept}</span>
                    {selectedDept === dept && <span className="text-black">→</span>}
                  </button>
                ))}
              </div>
            </section>

            {/* Manufacturer Filtering */}
            {brands.length > 1 && (
              <section className="bg-[#111] p-6 border-l-4 border-slate-700 rounded-r-[var(--border-radius)] shadow-xl">
                <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-6 border-b border-white/5 pb-2">Manufacturer Node</h3>
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                  {brands.map(brand => (
                    <button 
                      key={brand} 
                      onClick={() => { setSelectedBrand(brand); setSelectedRange('All'); setSelectedSeries('All'); }}
                      className={`w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all rounded-sm flex justify-between items-center ${selectedBrand === brand ? 'bg-white text-black font-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                      <span>{brand}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Material Range Selection */}
            {ranges.length > 1 && (
              <section className="bg-[#111] p-6 border-l-4 border-slate-700 rounded-r-[var(--border-radius)] shadow-xl animate-in fade-in slide-in-from-top-2 duration-300">
                <h3 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-6 border-b border-white/5 pb-2">Technical Range</h3>
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                  {ranges.map(range => (
                    <button 
                      key={range} 
                      onClick={() => { setSelectedRange(range); setSelectedSeries('All'); }}
                      className={`w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest transition-all rounded-sm flex justify-between items-center ${selectedRange === range ? 'bg-white text-black font-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                      <span>{range}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            <div className="pt-4">
               <div className="p-6 bg-[var(--primary-yellow)]/5 border border-[var(--primary-yellow)]/20 rounded-sm">
                  <p className="text-[10px] font-black uppercase text-[var(--primary-yellow)] mb-2">Technical Support</p>
                  <p className="text-[11px] text-gray-500 font-medium leading-relaxed">Require help selecting the correct polymer? Consult our engineering hub.</p>
                  <button onClick={() => onInquire()} className="mt-4 text-[10px] font-black uppercase text-white border-b border-white pb-1">Call Technical Hub</button>
               </div>
            </div>
          </div>
        </aside>

        {/* 4. Main Catalog Environment */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Desktop Results Toolbar */}
          <div className="hidden lg:flex bg-[#111] border border-white/5 p-4 flex-col md:flex-row justify-between items-center gap-6 rounded-[var(--border-radius)] shadow-2xl">
            <div className="flex items-center gap-6 w-full md:w-auto">
               <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 border-r border-white/10 pr-6 hidden sm:block">
                 Results Index: {filteredMaterials.length}
               </div>
               <div className="relative flex-1 md:w-80">
                 <input 
                   type="text" 
                   placeholder="Search SKU, Grade or Category..." 
                   className="w-full bg-black/40 border-l-2 border-[var(--primary-yellow)] p-3 text-sm text-white outline-none placeholder:text-gray-700 font-bold focus:bg-black transition-all rounded-sm"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                 </div>
               </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
               { (selectedDept !== 'All' || selectedBrand !== 'All' || selectedRange !== 'All' || searchTerm) && (
                 <button 
                   onClick={() => { setSelectedDept('All'); setSelectedBrand('All'); setSelectedRange('All'); setSelectedSeries('All'); setSearchTerm(''); }} 
                   className="whitespace-nowrap bg-red-900/10 text-red-500 border border-red-900/30 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-red-900/20 transition-all"
                 >
                   Purge Filters &times;
                 </button>
               )}
               <div className="flex items-center gap-2">
                 {selectedDept !== 'All' && <span className="bg-white/5 px-3 py-1.5 text-[9px] font-black uppercase border border-white/10 rounded-sm whitespace-nowrap">{selectedDept}</span>}
                 {selectedBrand !== 'All' && <span className="bg-white/5 px-3 py-1.5 text-[9px] font-black uppercase border border-white/10 rounded-sm whitespace-nowrap">{selectedBrand}</span>}
               </div>
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 lg:gap-6">
            {filteredMaterials.map(m => (
              <div 
                key={m.id} 
                className="group relative bg-[#111] border border-white/5 hover:border-[var(--primary-yellow)] transition-all cursor-pointer flex flex-col shadow-xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden rounded-[var(--border-radius)]"
                onClick={() => onSelectProduct(m, filteredMaterials)}
              >
                {/* Product Visualization */}
                <div className="aspect-[4/3] bg-black overflow-hidden relative border-b border-white/5">
                  {m.media?.[0]?.url ? (
                    <img 
                      src={m.media[0].url} 
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                      alt={m.name} 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-black text-slate-800 uppercase tracking-widest">Protocol Image Missing</div>
                  )}
                  
                  <div className="absolute top-2 left-2 flex flex-col gap-1 sm:top-3 sm:left-3 sm:gap-1.5">
                    <span className="bg-[var(--primary-yellow)] text-black px-1.5 py-0.5 text-[7px] sm:text-[8px] font-black uppercase rounded-sm shadow-lg w-fit">
                      {m.department.split(' ')[0]}
                    </span>
                    <span className="bg-black/80 backdrop-blur-md text-white px-1.5 py-0.5 text-[7px] sm:text-[8px] font-black uppercase tracking-[0.2em] border border-white/10 rounded-sm w-fit">
                      {m.sku}
                    </span>
                  </div>
                </div>

                {/* Technical Data Content */}
                <div className="p-3 sm:p-6 flex flex-col flex-1 space-y-2 sm:space-y-4">
                  <div className="flex-1">
                    <p className="text-[7px] sm:text-[9px] font-black uppercase text-slate-600 mb-1 sm:mb-2 tracking-[0.2em]">
                      {m.brand || 'Generic'} &bull; {m.category}
                    </p>
                    <h3 className="text-[10px] sm:text-sm font-black uppercase tracking-tight leading-tight text-white group-hover:text-[var(--primary-yellow)] transition-colors line-clamp-2 min-h-[2.2rem] sm:min-h-[2.5rem]">
                      {m.name}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 sm:gap-4 border-y border-white/5 py-2 sm:py-3">
                    <div>
                      <p className="text-[7px] sm:text-[8px] font-black uppercase text-slate-700 mb-0.5">ESTIMATE</p>
                      <p className="text-[10px] sm:text-sm font-black text-white">R {m.price?.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[7px] sm:text-[8px] font-black uppercase text-slate-700 mb-0.5">STATUS</p>
                      <p className="text-[8px] sm:text-[9px] font-black text-green-500 uppercase">EX-STOCK</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[7px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-white transition-colors">Technical Data &rarr;</span>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border border-white/10 group-hover:bg-[var(--primary-yellow)] group-hover:border-black flex items-center justify-center transition-all group-hover:scale-110">
                        <span className="text-[9px] sm:text-xs font-black group-hover:text-black text-slate-500">→</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMaterials.length === 0 && (
            <div className="py-24 md:py-40 text-center border-2 border-dashed border-white/5 rounded-[var(--border-radius)] bg-[#111]">
              <div className="mb-6 opacity-20 flex justify-center">
                 <svg className="w-12 h-12 md:w-20 md:h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px] md:text-sm px-6">Zero Material Profiles Located.</p>
              <button 
                onClick={() => { setSelectedDept('All'); setSelectedBrand('All'); setSelectedRange('All'); setSelectedSeries('All'); setSearchTerm(''); }} 
                className="mt-6 text-[var(--primary-yellow)] font-black uppercase text-[10px] md:text-xs hover:border-b border-[var(--primary-yellow)] tracking-widest pb-1 transition-all"
              >
                Reset System Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 5. Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsFilterDrawerOpen(false)} />
          <div className="relative bg-[#111] w-full max-h-[85vh] rounded-t-3xl border-t-4 border-[var(--primary-yellow)] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
               <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Technical Filters</h3>
               <button onClick={() => setIsFilterDrawerOpen(false)} className="text-[var(--primary-yellow)] text-2xl font-black">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-10 no-scrollbar">
               {/* Mobile Division */}
               <section>
                 <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-4">Material Division</h4>
                 <div className="grid grid-cols-1 gap-2">
                    {departments.map(dept => (
                      <button 
                        key={dept} 
                        onClick={() => { setSelectedDept(dept as any); setSelectedBrand('All'); setSelectedRange('All'); }}
                        className={`w-full text-left px-4 py-4 text-[11px] font-black uppercase tracking-widest rounded-md flex justify-between items-center transition-all ${selectedDept === dept ? 'bg-[var(--primary-yellow)] text-black' : 'bg-white/5 text-gray-500'}`}
                      >
                        {dept}
                        {selectedDept === dept && <span>&check;</span>}
                      </button>
                    ))}
                 </div>
               </section>

               {/* Mobile Brands */}
               {brands.length > 1 && (
                  <section>
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-4">Manufacturer Node</h4>
                    <div className="grid grid-cols-2 gap-2">
                       {brands.map(brand => (
                         <button 
                           key={brand} 
                           onClick={() => { setSelectedBrand(brand); setSelectedRange('All'); }}
                           className={`px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${selectedBrand === brand ? 'bg-white text-black' : 'bg-white/5 text-gray-500'}`}
                         >
                           {brand}
                         </button>
                       ))}
                    </div>
                  </section>
               )}

               {/* Mobile Ranges */}
               {ranges.length > 1 && (
                  <section>
                    <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-4">Technical Range</h4>
                    <div className="grid grid-cols-2 gap-2">
                       {ranges.map(range => (
                         <button 
                           key={range} 
                           onClick={() => setSelectedRange(range)}
                           className={`px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${selectedRange === range ? 'bg-white text-black' : 'bg-white/5 text-gray-500'}`}
                         >
                           {range}
                         </button>
                       ))}
                    </div>
                  </section>
               )}
            </div>

            <div className="p-6 bg-black border-t border-white/5 grid grid-cols-2 gap-4 shrink-0">
               <button 
                 onClick={() => { setSelectedDept('All'); setSelectedBrand('All'); setSelectedRange('All'); setIsFilterDrawerOpen(false); }}
                 className="py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 border border-white/10 rounded-md"
               >
                 Clear All
               </button>
               <button 
                 onClick={() => setIsFilterDrawerOpen(false)}
                 className="py-4 text-[11px] font-black uppercase tracking-widest bg-[var(--primary-yellow)] text-black rounded-md"
               >
                 Show {filteredMaterials.length} Results
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
