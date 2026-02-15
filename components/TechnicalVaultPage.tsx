
import React, { useState } from 'react';
import { Material, SiteConfig, TechnicalDocument } from '../types';

interface TechnicalVaultPageProps {
  materials: Material[];
  config: SiteConfig['ui'];
}

const TechnicalVaultPage: React.FC<TechnicalVaultPageProps> = ({ materials, config }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = materials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.documents?.some(doc => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const downloadFile = (doc: TechnicalDocument) => {
    const link = document.createElement('a');
    link.href = doc.data;
    link.download = doc.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-[#1a1a1a] py-20 px-6 lg:px-20 text-white border-b-8 border-[var(--primary-yellow)] shadow-2xl">
        <div className="max-w-4xl mx-auto">
          <div className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--primary-yellow)] mb-4">{config.vaultSubtext}</div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-10 leading-none">
            {config.vaultHeading.split(' ')[0]} <span className="text-[var(--primary-yellow)]">{config.vaultHeading.split(' ').slice(1).join(' ')}</span>
          </h1>
          <div className="relative group">
            <input 
              type="text" 
              placeholder={config.vaultSearchPlaceholder} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#2d2d2d] p-8 text-xl border-l-8 border-[var(--primary-yellow)] outline-none text-white font-bold placeholder:text-gray-600 transition-all focus:bg-[#333]"
            />
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[var(--primary-yellow)] transition-transform group-focus-within:scale-110">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="bg-white shadow-2xl rounded-sm overflow-hidden">
          <div className="grid grid-cols-1 divide-y divide-gray-100">
            {filtered.length > 0 ? filtered.map(m => (
              <div key={m.id} className="p-8 hover:bg-gray-50 transition group flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[9px] font-black uppercase bg-[#1a1a1a] text-[var(--primary-yellow)] px-2 py-0.5">{m.category}</span>
                    {m.brand && <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{m.brand}</span>}
                  </div>
                  <h4 className="font-black uppercase text-2xl group-hover:text-[var(--primary-yellow)] transition-colors">{m.name}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">Available Document Packs: {m.documents?.length || 0}</p>
                </div>
                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  {m.documents && m.documents.length > 0 ? m.documents.map((doc, idx) => (
                    <button 
                      key={idx}
                      onClick={() => downloadFile(doc)}
                      className="flex items-center gap-3 bg-gray-100 hover:bg-[#1a1a1a] hover:text-white transition-all px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded shadow-sm hover:shadow-lg"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 18h12V6h-4V2H4v16zm4-7h4v2H8v-2zm0-4h4v2H8V7z"/></svg>
                      {doc.name.length > 20 ? doc.name.slice(0, 17) + '...' : doc.name}
                    </button>
                  )) : (
                    <span className="text-[9px] font-black uppercase text-gray-300 italic">No files linked</span>
                  )}
                </div>
              </div>
            )) : (
              <div className="p-32 text-center opacity-30">
                <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-lg">No matching technical data located.</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 bg-white p-10 border-l-8 border-[var(--primary-yellow)] shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl text-center md:text-left">
            <h5 className="font-black uppercase text-xl mb-2">Technical Certification Request</h5>
            <p className="text-sm text-gray-500 font-medium">Require Batch Test Certificates (CoC), FDA Food-Grade Approvals, or RoHS Compliance documentation?</p>
          </div>
          <button className="bg-black text-white px-10 py-5 text-xs font-black uppercase tracking-[0.2em] hover:bg-[var(--primary-yellow)] hover:text-black transition transform hover:-translate-y-1 shadow-xl whitespace-nowrap">
            Contact Quality Control
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicalVaultPage;
