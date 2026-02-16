
import React, { useState } from 'react';
import { NewsletterConfig } from '../types';

interface NewsletterPopupProps {
  config: NewsletterConfig;
  onClose: () => void;
}

const NewsletterPopup: React.FC<NewsletterPopupProps> = ({ config, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(onClose, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative bg-[#1a1a1a] border-t-8 border-[var(--primary-yellow)] w-full max-w-md rounded-[var(--border-radius)] shadow-2xl animate-in zoom-in duration-300 overflow-hidden">
        {/* Technical Header Image */}
        <div className="h-32 sm:h-44 overflow-hidden relative">
          <img 
            src={config.image} 
            alt="Industrial Process" 
            className="w-full h-full object-cover grayscale opacity-50 hover:grayscale-0 transition-all duration-1000 scale-110 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/40 to-transparent"></div>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white text-3xl font-black transition-colors z-20"
        >
          &times;
        </button>
        
        <div className="p-8 sm:p-12 pt-0 text-center space-y-6">
          {/* Offset Branding Icon */}
          <div className="w-16 h-16 bg-[var(--primary-yellow)] flex items-center justify-center mx-auto rounded-[var(--border-radius)] shadow-[0_0_40px_rgba(255,214,0,0.4)] -mt-8 relative z-10 border-4 border-[#1a1a1a]">
            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">{config.title}</h2>
            <p className="text-slate-400 text-sm font-medium tracking-wide">{config.subtitle}</p>
          </div>

          {isSuccess ? (
            <div className="py-8 animate-in fade-in zoom-in">
              <p className="text-[var(--primary-yellow)] font-black uppercase tracking-[0.2em] text-sm">{config.successTitle}</p>
              <p className="text-white text-xs mt-2 uppercase font-bold">{config.successSubtitle}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="email" 
                required 
                placeholder="OPERATIONAL_EMAIL@DOMAIN.COM" 
                className="w-full bg-black border border-white/10 p-4 text-sm text-white font-mono rounded-md focus:border-[var(--primary-yellow)] outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[var(--primary-yellow)] text-black py-4 font-black uppercase text-xs tracking-[0.2em] hover:opacity-90 transition shadow-2xl rounded-md flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Synchronizing...' : config.buttonText}
              </button>
              <p className="text-[9px] text-slate-600 uppercase font-black tracking-widest">{config.footerText}</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsletterPopup;
