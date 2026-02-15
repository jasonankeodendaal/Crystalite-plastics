import React, { useState } from 'react';
import { SiteConfig } from '../types';

interface InquiryFormProps {
  defaultSubject?: string;
  emergencyConfig: SiteConfig['emergency'];
  uiConfig: SiteConfig['ui'];
  onSubmit: (data: { fullName: string; email: string; phone: string; type: string; message: string; rollMeters?: number }) => void;
  isCompact?: boolean;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ 
  defaultSubject, 
  emergencyConfig, 
  uiConfig, 
  onSubmit, 
  isCompact = false 
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    type: uiConfig.inquiryTypes?.[0] || 'Mechanical / Engineering',
    message: defaultSubject ? `Subject: ${defaultSubject}\n\n` : '',
    rollMeters: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;
    
    let finalMessage = formData.message;
    if (formData.type === 'Visual Communications' && formData.rollMeters > 0) {
      finalMessage = `QUICK QUOTE: FULL ROLL METERAGE: ${formData.rollMeters}m\n\n` + finalMessage;
    }

    onSubmit({ ...formData, message: finalMessage });
    setFormData({ fullName: '', email: '', phone: '', type: uiConfig.inquiryTypes?.[0] || 'Mechanical / Engineering', message: '', rollMeters: 0 });
  };

  const words = uiConfig.inquiryHeading.split(' ');
  const last = words.pop();
  const rest = words.join(' ');

  const containerClasses = isCompact 
    ? "bg-transparent text-white" 
    : "bg-[#111111] text-white py-24 px-6 lg:px-20 border-t-8 border-[var(--primary-yellow)]";

  const inputClasses = isCompact
    ? "bg-[#1a1a1a] p-4 border-b-2 border-white/10 rounded-none text-white focus:border-[var(--primary-yellow)] outline-none text-sm md:text-base transition-all placeholder:text-gray-600"
    : "bg-[#1a1a1a] p-5 border border-white/10 rounded-[var(--border-radius)] text-white focus:border-[var(--primary-yellow)] outline-none text-base md:text-lg";

  return (
    <section className={containerClasses}>
      <div className={isCompact ? "w-full" : "max-w-5xl mx-auto"}>
        {!isCompact && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white">{rest} <span className="text-[var(--primary-yellow)]">{last}</span></h2>
            <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg leading-relaxed">{uiConfig.inquirySubtext}</p>
          </div>
        )}

        <div className={`mb-10 p-8 ${isCompact ? 'bg-white/5' : 'bg-[var(--primary-yellow)]/5'} border-l-8 border-[var(--primary-yellow)] rounded-[var(--border-radius)]`}>
           <p className={`text-[12px] font-black ${isCompact ? 'text-[var(--primary-yellow)]' : 'text-[var(--primary-yellow)]'} uppercase tracking-widest mb-2`}>
             {uiConfig.formNoticeHeading || 'Technical Hub Notice'}
           </p>
           <p className="text-[13px] md:text-[15px] text-gray-400 italic leading-relaxed">{uiConfig.inventoryNote}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase text-gray-500 ml-1 tracking-widest">Full Name</label>
            <input 
              type="text" required placeholder="John Doe" 
              value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
              className={inputClasses} 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase text-gray-500 ml-1 tracking-widest">Email Address</label>
            <input 
              type="email" required placeholder="john@company.com" 
              value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
              className={inputClasses} 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase text-gray-500 ml-1 tracking-widest">Contact Number</label>
            <input 
              type="tel" placeholder="+27 ..." 
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
              className={inputClasses} 
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase text-gray-500 ml-1 tracking-widest">Inquiry Type</label>
            <select 
              value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
              className={`${inputClasses} appearance-none bg-[#1a1a1a]`}
            >
              {uiConfig.inquiryTypes.map(type => (
                <option key={type} value={type} className="bg-[#1a1a1a]">{type}</option>
              ))}
            </select>
          </div>

          {formData.type === 'Visual Communications' && (
             <div className="md:col-span-2 space-y-2 animate-in slide-in-from-top-2 duration-300">
                <label className="text-[11px] font-black uppercase text-[var(--primary-yellow)] tracking-[0.2em] ml-1">Full Roll Meter Entry</label>
                <input 
                  type="number" 
                  placeholder="Total Meters Required (e.g. 50)" 
                  value={formData.rollMeters === 0 ? '' : formData.rollMeters}
                  onChange={e => setFormData({...formData, rollMeters: parseFloat(e.target.value) || 0})}
                  className={`${inputClasses} w-full font-black !text-2xl text-[var(--primary-yellow)] bg-black/40`} 
                />
             </div>
          )}

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-[11px] font-black uppercase text-gray-500 ml-1 tracking-widest">Dimensions & Requirements</label>
            <textarea 
              required placeholder="Provide specific dimensions, material grades, and quantity..." 
              value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
              className={`${inputClasses} h-48 leading-relaxed`}
            ></textarea>
          </div>
          
          <button type="submit" className="md:col-span-2 bg-[var(--primary-yellow)] text-black py-5 font-black uppercase tracking-widest text-sm md:text-base hover:opacity-90 transition transform hover:-translate-y-1 shadow-2xl rounded-[var(--border-radius)] mt-4 active:scale-95">
            {uiConfig.inquiryButton}
          </button>
        </form>

        {!isCompact && (
          <div className="mt-16 flex flex-col md:flex-row items-center justify-between p-10 bg-[#1a1a1a] rounded-[var(--border-radius)] border border-white/5 shadow-2xl">
            <div className="text-center md:text-left">
              <h4 className="font-black uppercase text-[var(--primary-yellow)] text-lg md:text-2xl mb-2">{uiConfig.emergencyHeading || emergencyConfig.label}</h4>
              <p className="text-base text-gray-400 font-medium">For urgent engineering material requirements, call our 24/7 technical hotline.</p>
            </div>
            <div className="mt-8 md:mt-0 text-4xl md:text-6xl font-black text-[var(--primary-yellow)] tracking-tighter">
              {emergencyConfig.number}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default InquiryForm;