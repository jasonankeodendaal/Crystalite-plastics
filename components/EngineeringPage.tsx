import React from 'react';
/* Import Material type from types.ts */
import { Material } from '../types';

interface EngineeringPageProps {
  /* Add materials prop to allow dynamic data from app state */
  materials: Material[];
  onInquire: () => void;
}

const EngineeringPage: React.FC<EngineeringPageProps> = ({ materials, onInquire }) => {
  /* Filter from the materials prop instead of global constant */
  const engineeringMaterials = materials.filter(m => m.category === 'Engineering');

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="bg-[#1a1a1a] py-24 px-6 lg:px-20 text-white border-b-8 border-[var(--primary-yellow)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="max-w-3xl">
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none mb-6">
              Engineering <br />
              <span className="text-[var(--primary-yellow)]">Polymers</span>
            </h1>
            <p className="text-xl text-gray-400 font-medium">High-performance materials for heavy-duty industrial environments. From self-lubricating wear parts to chemically resistant liners.</p>
          </div>
          <button onClick={onInquire} className="bg-[var(--primary-yellow)] text-black px-10 py-5 font-black uppercase tracking-widest hover:opacity-90 transition shadow-2xl">
            Technical Support
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <h2 className="text-3xl font-black uppercase tracking-tight flex items-center gap-4">
              <span className="w-12 h-1 bg-[var(--primary-yellow)]"></span>
              Technical Specifications
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#1a1a1a] text-white uppercase text-[10px] tracking-widest">
                    <th className="p-4">Material Name</th>
                    <th className="p-4">Density (g/cm³)</th>
                    <th className="p-4">Operating Temp</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {engineeringMaterials.map(m => (
                    <tr key={m.name} className="border-b border-gray-100 hover:bg-yellow-50 transition">
                      <td className="p-4 font-black uppercase text-sm">{m.name}</td>
                      <td className="p-4 text-sm font-medium">{m.density}</td>
                      <td className="p-4 text-sm font-medium">{m.tempRange}</td>
                      <td className="p-4 text-right">
                        <button className="text-[10px] font-black uppercase text-[var(--primary-yellow)] hover:underline">Download TDS</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-[#1a1a1a] p-10 text-white rounded-sm shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-2xl font-black uppercase mb-4 text-[var(--primary-yellow)]">Custom Component Machining</h3>
                <p className="text-gray-400 max-w-xl mb-8">Our CNC facilities specialize in precision machining of engineering plastics. Submit your DXF/DWG files for immediate fabrication quotes.</p>
                <button onClick={onInquire} className="border-2 border-white px-8 py-3 font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-[#1a1a1a] transition">
                  Upload Drawing
                </button>
              </div>
              <div className="absolute top-0 right-0 w-64 h-full bg-[var(--primary-yellow)] opacity-10 transform skew-x-12 -mr-32 group-hover:-mr-20 transition-all duration-700"></div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 border-t-4 border-[var(--primary-yellow)] shadow-sm">
              <h4 className="font-black uppercase mb-4 text-lg">Key Advantages</h4>
              <ul className="space-y-4 text-sm font-medium text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[var(--primary-yellow)] font-black">/</span> Self-lubricating properties reducing maintenance downtime.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--primary-yellow)] font-black">/</span> High impact strength vs traditional metallic components.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--primary-yellow)] font-black">/</span> Zero corrosion in aggressive chemical environments.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[var(--primary-yellow)] font-black">/</span> Up to 80% weight reduction compared to steel.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineeringPage;