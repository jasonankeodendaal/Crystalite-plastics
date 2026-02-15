import React from 'react';
import { SiteConfig } from '../types';

interface FooterProps {
  companyConfig: SiteConfig['company'];
  footerConfig: SiteConfig['footer'];
  legalConfig: SiteConfig['legal'];
  uiConfig: SiteConfig['ui'];
  onPrivacy: () => void;
  onAdmin: () => void;
}

const Footer: React.FC<FooterProps> = ({ companyConfig, footerConfig, legalConfig, uiConfig, onPrivacy, onAdmin }) => {
  const copyrightText = legalConfig.copyrightOverride || 
    `&copy; ${new Date().getFullYear()} ${companyConfig.name} &bull; ${companyConfig.tagline}`;

  return (
    <footer className="bg-black text-gray-500 py-20 px-6 lg:px-20 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
        <div className="text-center md:text-left space-y-6">
          <div className="text-3xl font-black tracking-tighter text-white">
            {companyConfig.name.split(' ')[0]}<span className="text-[var(--primary-yellow)]">{companyConfig.name.split(' ').slice(1).join('')}</span>
          </div>
          <p className="text-[13px] font-bold tracking-widest text-slate-400 max-w-md leading-relaxed">
            {companyConfig.footerText}
          </p>
          <div className="space-y-3">
            <p className="text-[12px] uppercase font-black tracking-widest text-gray-500" dangerouslySetInnerHTML={{ __html: copyrightText }}>
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">
               {legalConfig.vatNumber && <span>VAT: {legalConfig.vatNumber}</span>}
               {legalConfig.regNumber && <span>REG: {legalConfig.regNumber}</span>}
            </div>
            <p className="text-[11px] uppercase font-black text-[var(--primary-yellow)] tracking-widest">
              {companyConfig.isoStatus}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-10">
          <div className="flex gap-10">
            {footerConfig.socials.map(soc => (
              <a 
                key={soc.id} 
                href={soc.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-3"
              >
                {soc.iconData ? (
                  <img src={soc.iconData} className="w-8 h-8 object-contain opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" alt={soc.name} />
                ) : (
                  <span className="text-[12px] font-black uppercase text-slate-600 group-hover:text-[var(--primary-yellow)] transition-colors tracking-widest">{soc.name}</span>
                )}
              </a>
            ))}
          </div>
          <button onClick={onPrivacy} className="text-[13px] font-black uppercase tracking-[0.2em] hover:text-[var(--primary-yellow)] transition border-b border-transparent hover:border-[var(--primary-yellow)] pb-1.5">
            {footerConfig.privacyText}
          </button>
        </div>

        <div className="flex flex-col items-center md:items-end gap-10">
          {footerConfig.showIsoIcons && (
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 border border-white/10 flex items-center justify-center rounded group hover:border-[var(--primary-yellow)] transition-all bg-white/5">
                <span className="text-[11px] font-black text-white group-hover:text-[var(--primary-yellow)] text-center uppercase leading-none px-2 tracking-widest">
                  {uiConfig.isoLabel || 'ISO 9001'}
                </span>
              </div>
              <div className="w-16 h-16 border border-white/10 flex items-center justify-center rounded group hover:border-[var(--primary-yellow)] transition-all bg-white/5">
                <span className="text-[11px] font-black text-white group-hover:text-[var(--primary-yellow)] text-center uppercase leading-none px-2 tracking-widest">
                  {uiConfig.qcLabel || 'QC PASS'}
                </span>
              </div>
            </div>
          )}
          <button onClick={onAdmin} className="opacity-10 hover:opacity-100 transition-opacity text-[10px] font-black uppercase tracking-[0.4em]">
            Central Access
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;