import React, { useState } from 'react';
import { SiteConfig } from '../types';

interface NavbarProps {
  config: SiteConfig;
  onNavigate: (view: any) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  config,
  onNavigate,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const nameParts = config.company.name.split(' ');
  const highlightIdx = config.navigation.highlightWordIndex;

  const handleMobileNav = (view: string) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  const repeatCount = config.announcement.repeatCount || 3;
  const duration = config.announcement.duration || '20s';

  return (
    <header className="sticky top-0 z-50 shadow-2xl">
      {config.announcement.enabled && (
        <div 
          className="py-2 px-4 text-center text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em] border-b border-black/10 overflow-hidden whitespace-nowrap animate-emergency-flash"
        >
          <div 
            className="animate-marquee"
            style={{ animationDuration: duration }}
          >
            {Array.from({ length: repeatCount }).map((_, i) => (
              <span key={i}>
                {config.announcement.text} {i < repeatCount - 1 && ' \u2022 '}
              </span>
            ))}
          </div>
        </div>
      )}
      <nav className="bg-[#1a1a1a] text-white border-b-[var(--border-weight)] border-[var(--primary-yellow)] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4 cursor-pointer group" onClick={() => onNavigate('home')}>
              {config.branding.logoData && (
                <div className="p-1 bg-[var(--primary-yellow)] rounded-sm group-hover:rotate-6 transition-transform">
                  <img 
                    src={config.branding.logoData} 
                    alt="Logo" 
                    style={{ width: config.branding.logoWidth }} 
                    className="brightness-0"
                  />
                </div>
              )}
              <div className="text-xl font-black tracking-tighter hidden sm:block">
                {nameParts.map((part, i) => (
                  <span key={i} className={i === highlightIdx ? "text-[var(--primary-yellow)] ml-1" : "ml-1"}>
                    {part}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block h-full">
              <ul className="flex space-x-8 text-[13px] font-black uppercase tracking-widest h-full">
                {config.navigation.items.map((item, idx) => (
                  <li 
                    key={idx}
                    onClick={() => onNavigate(item.view)} 
                    className="hover:text-[var(--primary-yellow)] cursor-pointer transition h-full flex items-center relative group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-[var(--primary-yellow)] group-hover:w-full transition-all"></span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('contact')}
                className="hidden lg:block bg-white/10 hover:bg-white/20 px-6 py-2.5 rounded text-[12px] font-black uppercase tracking-widest transition"
              >
                Contact HQ
              </button>

              {/* Mobile Hamburger Button */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-[var(--primary-yellow)] focus:outline-none"
              >
                <div className="w-6 h-6 flex flex-col justify-between items-end group">
                  <span className={`h-1 bg-current transition-all duration-300 ${isMenuOpen ? 'w-6 rotate-45 translate-y-2.5' : 'w-6'}`}></span>
                  <span className={`h-1 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-4'}`}></span>
                  <span className={`h-1 bg-current transition-all duration-300 ${isMenuOpen ? 'w-6 -rotate-45 -translate-y-2.5' : 'w-5'}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#1a1a1a] border-b-4 border-[var(--primary-yellow)] shadow-2xl animate-in slide-in-from-top duration-300 z-50 overflow-hidden">
            <ul className="flex flex-col w-full">
              {config.navigation.items.map((item, idx) => (
                <li 
                  key={idx}
                  onClick={() => handleMobileNav(item.view)}
                  className="px-6 py-5 border-b border-white/5 text-[14px] font-black uppercase tracking-widest active:bg-[var(--primary-yellow)] active:text-black transition-colors w-full"
                >
                  {item.label}
                </li>
              ))}
              <li 
                onClick={() => handleMobileNav('contact')}
                className="px-6 py-5 text-[14px] font-black uppercase tracking-widest text-[var(--primary-yellow)] w-full"
              >
                Contact HQ
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;