import React, { useState } from 'react';
/* Import Material type from types.ts */
import { Material } from '../types';

interface CalculatorProps {
  /* Add materials prop to allow dynamic data from app state */
  materials: Material[];
  uiLabel: string;
  heading: string;
}

const Calculator: React.FC<CalculatorProps> = ({ materials, uiLabel, heading }) => {
  /* Use the materials prop instead of the global constant */
  const [material, setMaterial] = useState(materials[0]);
  const [dims, setDims] = useState({ length: 0, width: 0, thick: 0, qty: 1 });
  const [weight, setWeight] = useState<number | null>(null);

  const calculateWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const kg = (dims.length * dims.width * dims.thick * material.density) / 1000000;
    setWeight(kg * dims.qty);
  };

  return (
    <div className="bg-[#f5f6fa] p-8 border-l-8 border-[var(--primary-yellow)] rounded-[var(--border-radius)] shadow-md h-full">
      <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
        {heading}
      </h3>
      <form onSubmit={calculateWeight} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Select Material</label>
          <select 
            className="w-full p-3 border border-gray-300 rounded-[var(--border-radius)] focus:ring-2 focus:ring-[var(--primary-yellow)] outline-none"
            /* Ensure we search within the passed materials prop */
            onChange={(e) => setMaterial(materials.find(m => m.name === e.target.value) || materials[0])}
          >
            {materials.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <input type="number" className="p-3 border rounded-[var(--border-radius)]" placeholder="L (mm)" required onChange={(e) => setDims({...dims, length: parseFloat(e.target.value)})} />
          <input type="number" className="p-3 border rounded-[var(--border-radius)]" placeholder="W (mm)" required onChange={(e) => setDims({...dims, width: parseFloat(e.target.value)})} />
          <input type="number" className="p-3 border rounded-[var(--border-radius)]" placeholder="T (mm)" required onChange={(e) => setDims({...dims, thick: parseFloat(e.target.value)})} />
        </div>
        <button type="submit" className="w-full bg-[var(--primary-yellow)] text-[#1a1a1a] p-4 font-black uppercase tracking-widest hover:opacity-90 transition rounded-[var(--border-radius)]">
          {uiLabel}
        </button>
      </form>
      
      {weight !== null && (
        <div className="mt-6 p-4 bg-white border border-gray-200 rounded-[var(--border-radius)] text-center">
          <p className="text-4xl font-black text-[#1a1a1a]">{weight.toFixed(2)} <span className="text-lg">KG</span></p>
        </div>
      )}
    </div>
  );
};

export default Calculator;