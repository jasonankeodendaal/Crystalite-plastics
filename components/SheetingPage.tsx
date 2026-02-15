
import React, { useState } from 'react';
import { Material } from '../types';

interface SheetingPageProps {
  materials: Material[];
  onInquire: (subject?: string) => void;
}

const SheetingPage: React.FC<SheetingPageProps> = ({ materials, onInquire }) => {
  const sheetingMaterials = materials.filter(m => m.category === 'Sheeting' || m.category === 'Engineering' || m.department === 'Engineering Materials');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(sheetingMaterials[0] || null);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  if (!selectedMaterial) {
    return (
      <div className="py-20 text-center bg-white min-h-screen">
        <h2 className="text-2xl font-black uppercase">No sheeting products available.</h2>
        <p className="text-gray-500 mt-2">Add sheeting materials in the Admin Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      <div className="bg-[#1a1a1a] py-20 px-6 lg:px-20 text-white border-b-8 border-[var(--primary-yellow)]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-4">
            Industrial <span className="text-[var(--primary-yellow)]">Sheeting</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl font-medium">
            High-performance technical substrates for structural, chemical, and wear-resistant applications.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Selector */}
          <div className="w-full lg:w-72 space-y-2">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest mb-4">Available Specs</h3>
            <div className="max-h-[600px] overflow-y-auto no-scrollbar space-y-2">
              {sheetingMaterials.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setSelectedMaterial(m); setActiveMediaIndex(0); }}
                  className={`w-full text-left p-4 font-black uppercase text-xs tracking-tight transition-all border-l-4 ${selectedMaterial.id === m.id ? 'bg-[#1a1a1a] text-[var(--primary-yellow)] border-[var(--primary-yellow)] shadow-lg' : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'}`}
                >
                  {m.name}
                </button>
              ))}
            </div>
          </div>

          {/* Main Showcase */}
          <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image/Media Gallery */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 border border-gray-200 overflow-hidden relative group rounded-[var(--border-radius)]">
                  {selectedMaterial.media && selectedMaterial.media.length > 0 ? (
                    selectedMaterial.media[activeMediaIndex].type === 'image' ? (
                      <img 
                        src={selectedMaterial.media[activeMediaIndex].url} 
                        alt={selectedMaterial.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video src={selectedMaterial.media[activeMediaIndex].url} className="w-full h-full object-cover" autoPlay muted loop playsInline controls />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-black uppercase text-center p-8">
                      Media Gallery Placeholder
                    </div>
                  )}
                </div>
                {selectedMaterial.media && selectedMaterial.media.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                    {selectedMaterial.media.map((m, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setActiveMediaIndex(idx)}
                        className={`w-16 h-16 border-2 transition-all shrink-0 rounded-sm overflow-hidden ${activeMediaIndex === idx ? 'border-[var(--primary-yellow)]' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                      >
                        {m.type === 'image' ? (
                          <img src={m.url} className="w-full h-full object-cover" alt="Thumb" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-black text-[6px] text-white font-black uppercase">Video</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">{selectedMaterial.name}</h2>
                  <p className="text-gray-600 leading-relaxed text-lg">{selectedMaterial.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 border-t-4 border-[#1a1a1a]">
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-gray-400 mb-1">Operating Temp</h4>
                    <p className="font-bold">{selectedMaterial.tempRange}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-gray-400 mb-1">Density</h4>
                    <p className="font-bold">{selectedMaterial.density} g/cm³</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-black uppercase tracking-widest border-b-2 border-gray-100 pb-2">Advantages & Capabilities</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-green-600">Pros / Strength</p>
                      <ul className="text-xs space-y-1 font-bold text-gray-700">
                        {selectedMaterial.features?.slice(0, 5).map((f, i) => <li key={i}>+ {f}</li>) || <li>Standard Industrial Spec</li>}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-red-600">Cons / Limitations</p>
                      <ul className="text-xs space-y-1 font-bold text-gray-500">
                        {selectedMaterial.cons?.length ? selectedMaterial.cons.map((c, i) => <li key={i}>- {c}</li>) : <li>Application Specific Limits</li>}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    onClick={() => onInquire(`Technical Quote: ${selectedMaterial.name}`)}
                    className="w-full bg-[var(--primary-yellow)] text-black py-4 font-black uppercase text-sm hover:opacity-90 transition-all shadow-xl rounded-[var(--border-radius)]"
                  >
                    Request Technical Quote
                  </button>
                  {selectedMaterial.documents && selectedMaterial.documents.length > 0 && (
                    <button className="w-full border-2 border-[#1a1a1a] text-[#1a1a1a] py-4 font-black uppercase text-sm hover:bg-[#1a1a1a] hover:text-white transition-all flex items-center justify-center gap-2 rounded-[var(--border-radius)]">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 18h12V6h-4V2H4v16zm4-7h4v2H8v-2zm0-4h4v2H8V7z"/></svg>
                      {selectedMaterial.documents[0].name}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetingPage;
