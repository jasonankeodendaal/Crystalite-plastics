
import React, { useState, useMemo } from 'react';
import { Material, ColorSwatch } from '../types';

interface GraphicsPageProps {
  materials: Material[];
  onInquire: (subject?: string) => void;
}

const GraphicsPage: React.FC<GraphicsPageProps> = ({ materials, onInquire }) => {
  const [activeTab, setActiveTab] = useState<'Hardware' | 'Media'>('Media');
  
  // Filtering Logic
  const filteredByCategory = useMemo(() => 
    materials.filter(m => activeTab === 'Hardware' ? m.category === 'Printer' : m.category === 'Signage' && m.brand),
    [materials, activeTab]
  );

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Material | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [activeColor, setActiveColor] = useState<ColorSwatch | null>(null);

  const brands = useMemo(() => Array.from(new Set(filteredByCategory.map(p => p.brand).filter(Boolean))), [filteredByCategory]);
  
  const ranges = useMemo(() => {
    if (!selectedBrand) return [];
    return Array.from(new Set(filteredByCategory.filter(p => p.brand === selectedBrand).map(p => p.range).filter(Boolean)));
  }, [selectedBrand, filteredByCategory]);

  const filteredItems = useMemo(() => {
    let list = filteredByCategory;
    if (selectedBrand) list = list.filter(p => p.brand === selectedBrand);
    if (selectedRange) list = list.filter(p => p.range === selectedRange);
    return list;
  }, [selectedBrand, selectedRange, filteredByCategory]);

  const resetFilters = () => {
    setSelectedBrand(null);
    setSelectedRange(null);
    setSelectedItem(null);
    setActiveColor(null);
  };

  const handleTabChange = (tab: 'Hardware' | 'Media') => {
    setActiveTab(tab);
    resetFilters();
  };

  if (selectedItem) {
    return (
      <div className="bg-white min-h-screen">
        <div className="bg-[#1a1a1a] py-12 px-6 lg:px-20 text-white border-b-8 border-[var(--primary-yellow)]">
          <div className="max-w-7xl mx-auto">
            <button 
              onClick={() => { setSelectedItem(null); setActiveColor(null); }}
              className="text-[var(--primary-yellow)] text-xs font-black uppercase tracking-widest mb-6 hover:underline"
            >
              &larr; Back to Listings
            </button>
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <p className="text-[10px] font-black uppercase text-gray-500 mb-2">{selectedItem.brand} &bull; {selectedItem.range}</p>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">{selectedItem.name}</h1>
                <p className="text-sm md:text-lg text-[var(--primary-yellow)] font-bold mt-2">
                  {activeTab === 'Hardware' ? `Model: ${selectedItem.modelNumber}` : `Series: ${selectedItem.range}`} | Size: {selectedItem.size || selectedItem.standardSizes?.[0]}
                </p>
              </div>
              <button 
                onClick={() => onInquire(`${activeTab} Quote: ${selectedItem.name} ${activeColor ? `(Color: ${activeColor.name})` : ''}`)}
                className="w-full md:w-auto bg-[var(--primary-yellow)] text-black px-10 py-4 font-black uppercase text-sm hover:opacity-90 transition shadow-xl rounded-[var(--border-radius)]"
              >
                Request Quote
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-10 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
            <div className="space-y-6">
              <div className="aspect-[4/3] bg-gray-100 border border-gray-200 overflow-hidden relative rounded-[var(--border-radius)]">
                {selectedItem.media && selectedItem.media[activeMediaIndex] ? (
                  selectedItem.media[activeMediaIndex].type === 'image' ? (
                    <img src={selectedItem.media[activeMediaIndex].url} className="w-full h-full object-cover" alt={selectedItem.name} />
                  ) : (
                    <video src={selectedItem.media[activeMediaIndex].url} className="w-full h-full object-cover" autoPlay muted loop playsInline controls />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 font-black uppercase">No Media Available</div>
                )}
                {activeColor && (
                  <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 p-2 rounded shadow">
                    <div className="w-6 h-6 border" style={{ backgroundColor: activeColor.code }} />
                    <span className="text-[10px] font-black uppercase">{activeColor.name}</span>
                  </div>
                )}
              </div>
              
              {selectedItem.media && selectedItem.media.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                  {selectedItem.media.map((m, i) => (
                    <button 
                      key={i} 
                      onClick={() => setActiveMediaIndex(i)}
                      className={`w-16 md:w-20 h-16 md:h-20 border-4 transition-all shrink-0 overflow-hidden rounded-sm ${activeMediaIndex === i ? 'border-[var(--primary-yellow)]' : 'border-gray-200 opacity-50'}`}
                    >
                      {m.type === 'image' ? (
                        <img src={m.url} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black text-[6px] text-white font-black">VIDEO</div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === 'Media' && selectedItem.colorSwatches && (
                <div className="bg-gray-50 p-6 rounded-[var(--border-radius)]">
                  <h3 className="text-xs font-black uppercase tracking-widest mb-4">Available Colors ({selectedItem.colorSwatches.length})</h3>
                  <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
                    {selectedItem.colorSwatches.map((swatch, idx) => (
                      <button 
                        key={idx}
                        title={swatch.name}
                        onClick={() => setActiveColor(swatch)}
                        className={`aspect-square w-full border-2 transition-all hover:scale-110 ${activeColor?.name === swatch.name ? 'border-black ring-2 ring-[var(--primary-yellow)] scale-110' : 'border-white'}`}
                        style={{ backgroundColor: swatch.code }}
                      />
                    ))}
                  </div>
                  {activeColor && (
                    <p className="mt-4 text-xs font-bold text-center uppercase tracking-widest text-gray-400">Selected: {activeColor.name}</p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-4 border-b pb-2">Material Specification</h3>
                <p className="text-gray-600 leading-relaxed text-base md:text-lg">{selectedItem.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-8 bg-gray-50 p-6 md:p-8 border-l-8 border-[#1a1a1a] rounded-r-[var(--border-radius)]">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-gray-400 mb-1">Estimated Price</h4>
                  <p className="text-xl md:text-2xl font-black text-black">
                    R {selectedItem.price?.toLocaleString() || 'POA'}
                    <span className="text-xs text-gray-400 font-bold ml-1">{activeTab === 'Media' ? '/ Roll' : ''}</span>
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase text-gray-400 mb-1">Stock Status</h4>
                  <p className="text-xs md:text-sm font-black text-green-600 uppercase">In Stock (National)</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-gray-400 border-b pb-2">Core Performance</h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedItem.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-700">
                      <span className="text-[var(--primary-yellow)]">⚡</span> {f}
                    </div>
                  ))}
                </div>
              </div>

              {selectedItem.documents && selectedItem.documents.length > 0 && (
                <div className="bg-[#1a1a1a] p-4 md:p-6 flex justify-between items-center text-white rounded-[var(--border-radius)]">
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-gray-400 mb-1">Technical Data</h4>
                    <p className="text-xs md:text-sm font-bold">{selectedItem.documents[0].name}</p>
                  </div>
                  <button className="bg-[var(--primary-yellow)] text-black px-4 py-2 text-[9px] md:text-[10px] font-black uppercase hover:opacity-90 transition rounded-sm">Download</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-[#1a1a1a] py-16 md:py-20 px-4 sm:px-6 lg:px-20 text-white border-b-8 border-[var(--primary-yellow)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-4">
              Graphics <span className="text-[var(--primary-yellow)]">Hub</span>
            </h1>
            <p className="text-base md:text-xl text-gray-400 max-w-2xl font-medium mx-auto md:mx-0">
              National distribution of wide-format printer hardware and premium visual media.
            </p>
          </div>
          <div className="flex bg-[#222] p-1 rounded w-full md:w-auto">
            {(['Media', 'Hardware'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`flex-1 md:flex-none px-6 md:px-8 py-3 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[var(--primary-yellow)] text-black' : 'text-gray-500 hover:text-white'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Sidebar */}
          <div className="w-full lg:w-72 space-y-8">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">Select Brand</h3>
                {(selectedBrand || selectedRange) && (
                  <button onClick={resetFilters} className="text-[10px] font-black text-[var(--primary-yellow)] uppercase">Reset</button>
                )}
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {brands.map(brand => (
                  <button 
                    key={brand}
                    onClick={() => { setSelectedBrand(brand!); setSelectedRange(null); }}
                    className={`w-full text-left p-3 text-[10px] font-black uppercase tracking-tighter border-l-4 transition-all rounded-[var(--border-radius)] ${selectedBrand === brand ? 'bg-[#1a1a1a] text-[var(--primary-yellow)] border-[var(--primary-yellow)]' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'}`}
                  >
                    {brand}
                  </button>
                ))}
              </div>
            </section>

            {selectedBrand && ranges.length > 0 && (
              <section className="animate-in fade-in slide-in-from-top-2">
                <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Select Series</h3>
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  {ranges.map(range => (
                    <button 
                      key={range}
                      onClick={() => setSelectedRange(range!)}
                      className={`w-full text-left p-3 text-[10px] font-black uppercase tracking-tighter border-l-4 transition-all rounded-[var(--border-radius)] ${selectedRange === range ? 'bg-[#1a1a1a] text-[var(--primary-yellow)] border-[var(--primary-yellow)]' : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'}`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Grid - 2 Column on Mobile */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3 sm:gap-8">
              {filteredItems.map(item => (
                <div 
                  key={item.id} 
                  className="group bg-white border border-gray-200 overflow-hidden hover:border-[var(--primary-yellow)] transition-all cursor-pointer flex flex-col rounded-[var(--border-radius)]"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="aspect-video sm:aspect-video bg-gray-50 overflow-hidden relative">
                    {item.media?.[0]?.url ? (
                      item.media[0].type === 'image' ? (
                        <img src={item.media[0].url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black text-white font-black text-[6px] sm:text-[10px]">VIDEO PREVIEW</div>
                      )
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200 font-black text-[6px]">IMAGE_PLACEHOLDER</div>
                    )}
                    {activeTab === 'Media' && item.colorSwatches && (
                      <div className="absolute bottom-1 sm:bottom-2 left-1 sm:left-2 flex -space-x-1">
                        {item.colorSwatches.slice(0, 3).map((sw, i) => (
                          <div key={i} className="w-2 h-2 sm:w-4 sm:h-4 rounded-full border border-white" style={{ backgroundColor: sw.code }} />
                        ))}
                        {item.colorSwatches.length > 3 && (
                          <div className="w-2 h-2 sm:w-4 sm:h-4 rounded-full bg-white text-[5px] sm:text-[6px] font-black flex items-center justify-center border border-gray-200">+{item.colorSwatches.length - 3}</div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-6 space-y-2 sm:space-y-4 flex-1 flex flex-col">
                    <div>
                      <p className="text-[6px] sm:text-[10px] font-black uppercase text-[var(--primary-yellow)] mb-0.5 sm:mb-1">{item.brand} &bull; {item.range}</p>
                      <h4 className="text-xs sm:text-xl font-black uppercase leading-tight group-hover:text-[var(--primary-yellow)] transition-colors line-clamp-2">{item.name}</h4>
                    </div>
                    <div className="hidden sm:flex gap-4 border-y border-gray-100 py-3">
                      <div>
                        <p className="text-[8px] font-black uppercase text-gray-400">Width</p>
                        <p className="text-xs font-black">{item.size || item.standardSizes?.[0] || 'N/A'}</p>
                      </div>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2 flex-1 leading-tight">{item.description}</p>
                    <div className="pt-2 sm:pt-4 flex justify-between items-center border-t border-gray-50">
                      <span className="text-xs sm:text-lg font-black">R {item.price?.toLocaleString()}</span>
                      <span className="hidden sm:inline text-[8px] sm:text-[10px] font-black uppercase text-gray-400 group-hover:text-black">View Technical Data &rarr;</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-gray-100 rounded-[var(--border-radius)]">
                <p className="text-gray-400 font-black uppercase text-xs sm:text-sm">No items found matching criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphicsPage;
