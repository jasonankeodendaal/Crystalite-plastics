
import React, { useState, useMemo, useEffect } from 'react';
import { Material, SiteConfig, TechnicalDocument, MaterialVariant } from '../types';

interface ProductDetailPageProps {
  product: Material;
  emergencyConfig: SiteConfig['emergency'];
  contactConfig: SiteConfig['contact'];
  uiConfig: SiteConfig['ui'];
  auditStatus: string;
  hasInteracted: boolean;
  onBack: () => void;
  onInquire: (materialName: string, sku: string, variant?: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
  product, 
  emergencyConfig, 
  contactConfig,
  uiConfig, 
  auditStatus,
  hasInteracted, 
  onBack, 
  onInquire,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}) => {
  const [selectedVariant, setSelectedVariant] = useState<MaterialVariant | null>(product.variants?.[0] || null);
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [meterage, setMeterage] = useState<number>(1);
  const [isFlipping, setIsFlipping] = useState(false);

  // Trigger flip animation when variant or product changes
  useEffect(() => {
    setIsFlipping(true);
    const timer = setTimeout(() => setIsFlipping(false), 300);
    return () => clearTimeout(timer);
  }, [product.id, selectedVariant?.id, selectedVariant?.value]);

  const downloadFile = (doc: TechnicalDocument) => {
    const link = document.createElement('a');
    link.href = doc.data;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculatedPrice = useMemo(() => {
    const basePrice = selectedVariant?.priceOverride || product.price;
    return product.pricingType === 'meter' ? basePrice * meterage : basePrice;
  }, [product, selectedVariant, meterage]);

  const rollsNeeded = useMemo(() => {
    if (product.department === 'Signage Materials' && product.fullRollLength && product.fullRollLength > 0) {
      return Math.ceil(meterage / product.fullRollLength);
    }
    return null;
  }, [product, meterage]);

  // Content Overrides based on variant
  const displaySku = selectedVariant?.skuOverride || product.sku;
  const displayDescription = selectedVariant?.descriptionOverride || product.description;
  const displayMedia = (selectedVariant?.mediaOverride && selectedVariant.mediaOverride.length > 0) 
    ? selectedVariant.mediaOverride 
    : product.media;

  const whatsappNumber = product.whatsappOverride || contactConfig.whatsapp || "";
  const whatsappUrl = whatsappNumber 
    ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Industrial Technical Inquiry: I am interested in ${product.name} (SKU: ${displaySku}).`)}` 
    : null;

  return (
    <div className="bg-[#0f0f0f] min-h-screen text-white animate-swipe">
      {/* Dynamic Substrate Header */}
      <div className="bg-[#1a1a1a] text-white py-12 px-6 lg:px-20 border-b-8 border-[var(--primary-yellow)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <button 
              onClick={onBack}
              className="text-[var(--primary-yellow)] uppercase text-xs font-black tracking-widest flex items-center gap-2 hover:-translate-x-1 transition-transform"
            >
              &larr; Return to Inventory
            </button>
            
            {(hasPrev || hasNext) && (
              <div className="flex items-center gap-2 bg-black/40 p-1 rounded-sm border border-white/5">
                <button 
                  disabled={!hasPrev}
                  onClick={onPrev}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${hasPrev ? 'text-white hover:bg-white/10' : 'text-gray-700 cursor-not-allowed'}`}
                >
                  &larr; Prev Item
                </button>
                <div className="w-[1px] h-4 bg-white/10"></div>
                <button 
                  disabled={!hasNext}
                  onClick={onNext}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${hasNext ? 'text-white hover:bg-white/10' : 'text-gray-700 cursor-not-allowed'}`}
                >
                  Next Item &rarr;
                </button>
              </div>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className={`flex-1 transition-all duration-300 ${isFlipping ? 'opacity-50 translate-x-4' : 'opacity-100 translate-x-0'}`}>
              <div className="flex items-center gap-4 mb-3">
                <span className="bg-[var(--primary-yellow)] text-black px-3 py-1 text-xs font-black uppercase tracking-widest rounded-[var(--border-radius)]">
                  {product.department}
                </span>
                <span className="text-gray-500 font-black text-xs uppercase tracking-widest">
                  SKU: {displaySku}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
                {product.name}
              </h1>
              <div className="flex items-center flex-wrap gap-4 mt-2">
                <p className="text-xl text-[var(--primary-yellow)] font-bold uppercase tracking-tight">
                    {product.brand} &bull; {product.range}
                </p>
                {product.tags && product.tags.map((tag, i) => (
                    <span key={i} className="bg-white/10 text-white text-[10px] px-3 py-1 font-black uppercase tracking-widest border border-white/20 rounded-sm">
                        {tag}
                    </span>
                ))}
              </div>
            </div>

            <div className={`text-right shrink-0 flex flex-col gap-6 transition-all duration-300 ${isFlipping ? 'scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
               
               {/* Variant Selection Bar - Above Price */}
               {product.variants && product.variants.length > 0 && (
                 <div className="flex flex-col items-end gap-2 animate-in fade-in slide-in-from-right-2 duration-500">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Select Variant</span>
                    <div className="flex flex-wrap justify-end gap-1.5">
                      {product.variants.map((v, idx) => (
                        <button 
                          key={v.id || idx}
                          onClick={() => {
                            setSelectedVariant(v);
                            setActiveMediaIdx(0);
                          }}
                          className={`px-3 py-1.5 text-[10px] font-black uppercase border transition-all rounded-sm ${selectedVariant?.value === v.value ? 'bg-[var(--primary-yellow)] text-black border-[var(--primary-yellow)]' : 'bg-black/40 text-slate-400 border-white/10 hover:border-white/30'}`}
                        >
                          {v.value}
                        </button>
                      ))}
                    </div>
                 </div>
               )}

               <div className="flex flex-col md:flex-row items-end gap-6 md:gap-10">
                  {product.pricingType === 'meter' && (
                    <div className="bg-black/40 p-6 border-l-4 border-[var(--primary-yellow)] rounded-[var(--border-radius)] text-left min-w-[240px] animate-in fade-in slide-in-from-right-4 duration-500">
                       <div className="flex justify-between items-center mb-4">
                          <h3 className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Running Meter Entry</h3>
                          <span className="text-[8px] font-black text-black bg-[var(--primary-yellow)] px-2 py-0.5 rounded uppercase">Manual Input</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="flex-1 relative">
                            <input 
                              type="number" 
                              min="1" 
                              value={meterage} 
                              onChange={(e) => setMeterage(Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-full p-2 bg-black text-[var(--primary-yellow)] font-black text-2xl rounded-[var(--border-radius)] border border-white/5 focus:border-[var(--primary-yellow)] outline-none transition-all"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--primary-yellow)] font-black text-sm pointer-events-none opacity-50">m</span>
                          </div>
                          <p className="text-[8px] font-black uppercase text-gray-500 max-w-[60px] leading-tight">Length (m)</p>
                       </div>
                       {rollsNeeded !== null && (
                         <div className="mt-3 pt-2 border-t border-white/5 animate-in fade-in slide-in-from-top-1">
                            <p className="text-[10px] font-black uppercase text-white">
                               Rolls: <span className="text-black bg-[var(--primary-yellow)] px-2 py-0.5 rounded ml-1">{rollsNeeded}x</span>
                            </p>
                         </div>
                       )}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-black uppercase text-gray-500 mb-1">
                      {product.pricingType === 'meter' ? `Estimated Price (${meterage}m)` : 'Estimated Unit Price'} (ZAR)
                    </p>
                    <p className="text-5xl font-black">R {calculatedPrice.toLocaleString()}</p>
                  </div>
               </div>
               
               <div className="flex flex-col sm:flex-row gap-3">
                 <button 
                  onClick={() => onInquire(product.name, displaySku, `${selectedVariant ? `${selectedVariant.type}: ${selectedVariant.value}` : ''}${product.pricingType === 'meter' ? `, Qty: ${meterage}m` : ''}${rollsNeeded ? `, Rolls: ${rollsNeeded}` : ''}`)}
                  className="bg-[var(--primary-yellow)] text-black px-8 py-4 font-black uppercase text-sm hover:opacity-90 transition transform hover:-translate-y-1 shadow-2xl rounded-[var(--border-radius)]"
                >
                  {uiConfig.inquiryButton}
                </button>
                {whatsappUrl && (
                  <a 
                    href={whatsappUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#25D366] text-white px-8 py-4 font-black uppercase text-sm hover:bg-[#128C7E] transition transform hover:-translate-y-1 shadow-2xl rounded-[var(--border-radius)] flex items-center justify-center gap-2 border-b-4 border-green-800"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.625 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp Quote
                  </a>
                )}
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="flex-1 space-y-20">
            
            {/* 1. Visual Showcase Section */}
            <section className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-gray-500 mb-4">Material Visual Diagnostics</h2>
              <div className="aspect-video bg-[#111] border border-white/5 overflow-hidden shadow-2xl relative rounded-[var(--border-radius)]">
                {displayMedia && displayMedia[activeMediaIdx] ? (
                  displayMedia[activeMediaIdx].type === 'image' ? (
                    <img src={displayMedia[activeMediaIdx].url} className={`w-full h-full object-cover transition-all duration-500 ${isFlipping ? 'scale-105 blur-sm' : 'scale-100 blur-0'}`} alt={`${product.name}`} />
                  ) : (
                    <video 
                      src={displayMedia[activeMediaIdx].url} 
                      className="w-full h-full object-cover" 
                      autoPlay 
                      muted={!hasInteracted} 
                      loop 
                      playsInline 
                      controls 
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-black uppercase text-gray-600">No Asset Data</div>
                )}
              </div>
              
              {displayMedia && displayMedia.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {displayMedia.map((m, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveMediaIdx(i)}
                      className={`w-24 h-16 shrink-0 border-2 transition-all rounded-[var(--border-radius)] overflow-hidden ${activeMediaIdx === i ? 'border-[var(--primary-yellow)] opacity-100' : 'border-white/5 opacity-40 hover:opacity-80'}`}
                    >
                       {m.type === 'image' ? (
                         <img src={m.url} className="w-full h-full object-cover grayscale" alt="Preview" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center bg-black text-xs font-black text-white uppercase">Video</div>
                       )}
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* 2. Intelligence Section */}
            <section className="space-y-10 animate-in fade-in duration-700">
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h3 className="text-2xl font-black uppercase flex items-center gap-3">
                    <span className="w-8 h-1 bg-[var(--primary-yellow)]"></span>
                    Substrate Intelligence
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed font-medium">
                    {displayDescription}
                  </p>
                  
                  {product.features && product.features.length > 0 && (
                    <div className="grid grid-cols-1 gap-3">
                       {product.features.map((f, i) => (
                         <div key={i} className="flex items-center gap-3 text-sm font-black uppercase text-gray-400">
                           <span className="text-black bg-[var(--primary-yellow)] px-2 py-0.5 rounded-sm text-[10px]">SPEC</span> {f}
                         </div>
                       ))}
                    </div>
                  )}
                </div>

                <div className="space-y-6 data-card-transition">
                  {/* Document Vault moved here */}
                  <div className={`bg-[#161616] p-10 border-l-8 border-[var(--primary-yellow)] shadow-sm rounded-[var(--border-radius)] space-y-8 data-card-inner ${isFlipping ? 'data-card-flipping' : ''}`}>
                    <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest border-b border-white/5 pb-4">Document Vault</h3>
                    <div className="space-y-3">
                       {product.documents.length > 0 ? product.documents.map((doc, i) => (
                         <button 
                          key={i} 
                          onClick={() => downloadFile(doc)}
                          className="w-full flex items-center justify-between p-4 bg-black border border-white/5 hover:border-[var(--primary-yellow)] group transition-all rounded-[var(--border-radius)]"
                         >
                            <div className="text-left">
                               <h4 className="text-[11px] font-black uppercase tracking-widest mb-1 truncate w-40 text-white">{doc.name}</h4>
                               <p className="text-[9px] text-gray-500 uppercase">{doc.type.split('/')[1]}</p>
                            </div>
                            <div className="text-[var(--primary-yellow)] group-hover:scale-125 transition-transform">
                               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4 18h12V6h-4V2H4v16zm4-7h4v2H8v-2zm0-4h4v2H8V7z"/></svg>
                            </div>
                         </button>
                       )) : (
                         <div className="py-8 text-center border border-dashed border-white/10 text-[9px] font-black uppercase text-gray-600 rounded-[var(--border-radius)]">No Technical Library Assets Found</div>
                       )}
                    </div>
                  </div>

                  {product.variants && product.variants.length > 0 && (
                    <div className="bg-[#161616] p-10 border-l-8 border-[var(--primary-yellow)] shadow-sm rounded-[var(--border-radius)]">
                       <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest mb-6 border-b border-white/5 pb-4">Verified Substrate Variants</h3>
                       <div className="flex flex-wrap gap-2">
                          {product.variants.map((v, idx) => (
                            <button 
                              key={v.id || idx}
                              onClick={() => {
                                setSelectedVariant(v);
                                setActiveMediaIdx(0);
                              }}
                              className={`px-4 py-3 text-xs font-black uppercase tracking-widest border transition-all rounded-[var(--border-radius)] ${selectedVariant?.value === v.value ? 'bg-[var(--primary-yellow)] text-black border-[var(--primary-yellow)]' : 'bg-black text-gray-500 border-white/10 hover:border-[var(--primary-yellow)]'}`}
                            >
                               {v.value} <span className="ml-1 opacity-50">({v.type})</span>
                            </button>
                          ))}
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* 3. Technical Master Sheet Section */}
            <section className={`bg-[#161616] border border-white/5 p-10 space-y-12 shadow-sm rounded-[var(--border-radius)] transition-all duration-300 ${isFlipping ? 'scale-[0.98] opacity-70' : 'scale-100 opacity-100'}`}>
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/5 pb-6 gap-4">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Technical Master Sheet</h2>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 py-2 bg-black/40 rounded-[var(--border-radius)] border border-white/5">Audit Status: {auditStatus}</span>
               </div>
               
               <div className="grid md:grid-cols-2 gap-16">
                  {/* Specs Table */}
                  <div>
                    <h4 className="text-xs font-black uppercase text-gray-500 mb-6 tracking-widest">Property Data Matrix</h4>
                    <div className="divide-y divide-white/5 font-mono text-sm">
                      <div className="flex justify-between py-3">
                         <span className="text-gray-500">BRAND_ID</span>
                         <span className="font-bold text-white">{product.brand}</span>
                      </div>
                      <div className="flex justify-between py-3">
                         <span className="text-gray-500">MATERIAL_SKU</span>
                         <span className="font-bold text-white">{displaySku}</span>
                      </div>
                      {product.engineeringSpecs?.thickness && (
                        <div className="flex justify-between py-3">
                           <span className="text-gray-500">THICKNESS_MM</span>
                           <span className="font-bold text-white">{product.engineeringSpecs.thickness}mm</span>
                        </div>
                      )}
                      {product.technicalSpecs.map((spec, i) => (
                        <div key={i} className="flex justify-between py-3">
                           <span className="text-gray-500 uppercase">{spec.label.replace(' ', '_')}</span>
                           <span className="font-bold text-white">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Empty/Auxiliary Column after Document Vault was moved */}
                  <div className="bg-white/5 p-8 rounded-[var(--border-radius)] border border-white/5 flex items-center justify-center">
                    <p className="text-[10px] font-black uppercase text-slate-600 tracking-[0.3em] text-center">Reference technical specs for exact tolerances and chemical resistance profile.</p>
                  </div>
               </div>
            </section>

          </div>

          <aside className="w-full lg:w-80 space-y-8 shrink-0">
             <div className="bg-[#1a1a1a] p-8 text-white rounded-[var(--border-radius)] border border-white/5 shadow-2xl">
                <h4 className="text-xs font-black uppercase text-[var(--primary-yellow)] mb-3">
                   {uiConfig.formNoticeHeading || 'Inventory Notice'}
                </h4>
                <p className="text-base text-gray-400 leading-relaxed font-medium">{product.inventoryNote || uiConfig.inventoryNote}</p>
             </div>
             <div className="p-8 border-2 border-white/5 bg-[#161616] rounded-[var(--border-radius)]">
                <h4 className="text-xs font-black uppercase text-gray-500 mb-6 border-b border-white/5 pb-2">National Footprint</h4>
                <div className="space-y-4">
                   <div className="flex justify-between text-sm font-black uppercase tracking-tighter">
                      <span className="text-gray-500">{uiConfig.hubStockLabel}</span>
                      <span className="text-green-500">{uiConfig.hubStockValue}</span>
                   </div>
                   <div className="flex justify-between text-sm font-black uppercase tracking-tighter">
                      <span className="text-gray-500">{uiConfig.leadTimeLabel}</span>
                      <span className="text-white">{uiConfig.leadTimeValue}</span>
                   </div>
                   <div className="pt-4 border-t border-white/5">
                      <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">{uiConfig.techSummaryHeading}</p>
                      <p className="text-sm font-medium text-gray-400 italic">{uiConfig.techSummaryText}</p>
                   </div>
                </div>
             </div>
             <div className="bg-[#ffd600]/10 p-6 border-l-4 border-[var(--primary-yellow)] rounded-[var(--border-radius)] border-y border-r border-white/5">
                <p className="text-[10px] font-black uppercase text-[var(--primary-yellow)] mb-1">
                   {uiConfig.emergencyHeading || 'Emergency Support'}
                </p>
                <p className="text-2xl font-black text-white">{emergencyConfig.number}</p>
             </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
