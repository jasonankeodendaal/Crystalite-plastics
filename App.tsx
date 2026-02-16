
import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import FoundersSection from './components/FoundersSection';
import Footer from './components/Footer';
import Modal from './components/Modal';
import ProductsPage from './components/ProductsPage';
import ProductDetailPage from './components/ProductDetailPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import AdminDashboard from './components/AdminDashboard';
import BrandCarousel from './components/BrandCarousel';
import PlexusBackground from './components/PlexusBackground';
import AdvertStrip from './components/AdvertStrip';
import NewsletterPopup from './components/NewsletterPopup';
import BillboardSection from './components/BillboardSection';
import { loadState, saveState, addInquiry, addSubscriber } from './stateManager';
import { Material, AppState } from './types';

type View = 'home' | 'catalog' | 'admin' | 'product-detail' | 'about' | 'contact' | string;

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(loadState());
  const [view, setView] = useState<View>('home');
  const [selectedProduct, setSelectedProduct] = useState<Material | null>(null);
  const [inquirySubject, setInquirySubject] = useState<string>('');
  const [activeModal, setActiveModal] = useState<'privacy' | 'social' | 'newsletter' | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [logisticsIdx, setLogisticsIdx] = useState(0);

  // Use a ref to track current view in effects without triggering re-runs
  const viewRef = useRef<View>(view);
  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const [activeCollection, setActiveCollection] = useState<Material[]>([]);

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
    window.addEventListener('mousedown', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    
    // Auto-show newsletter after 5 seconds ONLY if on home page
    const newsletterTimer = setTimeout(() => {
        const dismissed = localStorage.getItem('newsletter_dismissed');
        const isHome = viewRef.current === 'home';
        // Defensive check: only show if config is present and we are on home
        if (!dismissed && isHome && appState.config?.newsletter) {
            setActiveModal('newsletter');
        }
    }, 5000);

    return () => {
      window.removeEventListener('mousedown', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      clearTimeout(newsletterTimer);
    };
  }, [appState.config?.newsletter]); // Dependency on config to ensure it's loaded

  useEffect(() => {
    saveState(appState);
    const r = document.documentElement;
    // Defensive access to config theme properties
    const theme = appState.config?.theme;
    if (theme) {
      r.style.setProperty('--primary-yellow', theme.primaryColor || '#FFD600');
      r.style.setProperty('--industrial-bg', theme.industrialBg || '#111111');
      r.style.setProperty('--border-radius', theme.borderRadius || '12px');
      r.style.setProperty('--border-weight', theme.borderWeight || '4px');
      document.body.style.backgroundColor = theme.industrialBg || '#111111';
    }
    
    if (appState.config?.seo?.pageTitle) {
      document.title = appState.config.seo.pageTitle;
    }
    
    document.body.style.color = '#ffffff';
  }, [appState]);

  useEffect(() => {
    if (view !== 'home' || !appState.config.ui.logisticsImages?.length) return;
    const interval = setInterval(() => {
      setLogisticsIdx(prev => (prev + 1) % appState.config.ui.logisticsImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [view, appState.config.ui.logisticsImages]);

  const handleUpdateState = (newState: AppState) => {
    setAppState(newState);
  };

  const handleInquirySubmit = async (data: { fullName: string; email: string; phone: string; type: string; message: string; rollMeters?: number }) => {
    await addInquiry(data);
    setAppState(loadState()); 
    alert("Industrial Technical Inquiry Submitted. Our team will contact you shortly.");
  };

  const handleSubscribe = async (email: string) => {
    await addSubscriber(email);
    setAppState(loadState());
  };

  const handleSelectProduct = (product: Material, collection?: Material[]) => {
    if (collection) {
      setActiveCollection(collection);
    }
    setSelectedProduct(product);
    setView('product-detail');
    window.scrollTo(0, 0);
  };

  const handleNavigateAdjacent = (direction: 'next' | 'prev') => {
    if (!selectedProduct || activeCollection.length === 0) return;
    const currentIndex = activeCollection.findIndex(m => m.id === selectedProduct.id);
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % activeCollection.length;
    } else {
      nextIndex = (currentIndex - 1 + activeCollection.length) % activeCollection.length;
    }

    setSelectedProduct(activeCollection[nextIndex]);
    window.scrollTo(0, 0);
  };

  const dismissNewsletter = () => {
    localStorage.setItem('newsletter_dismissed', 'true');
    setActiveModal(null);
  };

  if (view === 'admin') {
    return (
      <AdminDashboard 
        state={appState} 
        onUpdate={handleUpdateState} 
        onExit={() => setView('home')} 
      />
    );
  }

  const renderView = () => {
    if (view.startsWith('dept:')) {
      const deptName = view.replace('dept:', '');
      const filtered = appState.materials.filter(m => m.department === deptName);
      return <ProductsPage 
        initialDept={deptName}
        materials={filtered}
        config={appState.config}
        onInquire={(name, sku) => {
            setInquirySubject(name ? `SKU: ${sku} - Quote Request: ${name}` : '');
            setView('contact');
            window.scrollTo(0, 0);
        }} 
        onSelectProduct={(p) => handleSelectProduct(p, filtered)}
        hasInteracted={hasInteracted}
      />;
    }

    switch (view) {
      case 'catalog':
        return <ProductsPage 
          materials={appState.materials}
          config={appState.config}
          onInquire={(name, sku) => {
              setInquirySubject(name ? `SKU: ${sku} - Quote Request: ${name}` : '');
              setView('contact');
              window.scrollTo(0, 0);
          }} 
          onSelectProduct={(p) => handleSelectProduct(p, appState.materials)}
          hasInteracted={hasInteracted}
        />;
      case 'product-detail':
        return selectedProduct ? (
          <ProductDetailPage 
            product={selectedProduct} 
            emergencyConfig={appState.config.emergency}
            contactConfig={appState.config.contact}
            uiConfig={appState.config.ui}
            auditStatus={appState.config.company.productAuditStatus}
            hasInteracted={hasInteracted}
            onBack={() => setView('catalog')} 
            onInquire={(name, sku, variant) => {
                setInquirySubject(`Quote Request: ${name} (SKU: ${sku}${variant ? `, Variant: ${variant}` : ''})`);
                setView('contact');
                window.scrollTo(0, 0);
            }} 
            onNext={() => handleNavigateAdjacent('next')}
            onPrev={() => handleNavigateAdjacent('prev')}
            hasNext={activeCollection.length > 1}
            hasPrev={activeCollection.length > 1}
          />
        ) : <ProductsPage config={appState.config} materials={appState.materials} onInquire={() => setView('contact')} onSelectProduct={handleSelectProduct} hasInteracted={hasInteracted} />;
      case 'about':
        return <AboutPage config={appState.config.about} company={appState.config.company} brands={appState.brands} />;
      case 'contact':
        return <ContactPage 
          config={appState.config.contact} 
          emergency={appState.config.emergency} 
          ui={appState.config.ui} 
          onSubmit={handleInquirySubmit}
        />;
      default:
        return (
          <>
            <Hero 
              items={appState.config.hero.items}
              autoPlay={appState.config.hero.autoPlay}
              interval={appState.config.hero.interval}
              onQuoteClick={() => setView('contact')} 
              onBrowseClick={() => setView('catalog')} 
            />
            
            <BrandCarousel brands={appState.brands} />

            <FoundersSection config={appState.config.founders} />

            {appState.config.adverts && (
              <AdvertStrip adverts={appState.config.adverts} onNavigate={v => { setView(v); window.scrollTo(0,0); }} />
            )}

            <Services 
              config={appState.config.divisions}
              uiTitle={appState.config.ui.servicesTitle}
              sinceLabel={appState.config.ui.sinceLabel}
              onInquireClick={() => setView('contact')} 
              onNavigate={(v) => { setView(v); window.scrollTo(0,0); }}
            />

            {appState.config.posters && (
              <BillboardSection posters={appState.config.posters} />
            )}
            
            <section className="relative h-[450px] sm:min-h-[600px] flex items-center overflow-hidden border-t border-white/5">
               {appState.config.ui.logisticsImages?.map((img, idx) => (
                  <div 
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === logisticsIdx ? 'opacity-100' : 'opacity-0'}`}
                    style={{ 
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.9)), url(${img})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                  />
               ))}
               
               <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-20 w-full py-12 md:py-20">
                  <div className="max-w-xl bg-black/40 backdrop-blur-xl p-6 md:p-10 border-l-4 sm:border-l-8 border-[var(--primary-yellow)] rounded-r-[var(--border-radius)]">
                    <span className="text-[var(--primary-yellow)] text-[9px] font-black uppercase tracking-[0.4em] mb-4 block">Fulfillment Grid</span>
                    <h2 className="text-3xl sm:text-6xl font-black uppercase mb-4 md:mb-6 leading-none tracking-tighter text-white">
                        {appState.config.ui.logisticsTitle} <br />
                        <span className="text-[var(--primary-yellow)]">{appState.config.ui.logisticsHighlight}</span>
                    </h2>
                    <p className="text-gray-300 text-sm sm:text-lg mb-6 md:mb-8 leading-tight font-medium">
                        {appState.config.ui.logisticsDesc}
                    </p>
                    <button 
                        onClick={() => { setView('contact'); window.scrollTo(0,0); }}
                        className="w-full sm:w-auto bg-[var(--primary-yellow)] text-black px-6 sm:px-10 py-3 sm:py-4 font-black uppercase text-[10px] sm:text-sm hover:opacity-90 transition shadow-2xl rounded-[var(--border-radius)]"
                    >
                        {appState.config.ui.branchDirectoryBtnText}
                    </button>
                  </div>
               </div>

               {appState.config.ui.logisticsImages?.length > 1 && (
                  <div className="absolute bottom-6 right-6 z-20 flex gap-1.5">
                     {appState.config.ui.logisticsImages.map((_, i) => (
                        <div key={i} className={`h-1 transition-all duration-300 rounded-full ${i === logisticsIdx ? 'w-8 bg-[var(--primary-yellow)]' : 'w-2 bg-white/30'}`} />
                     ))}
                  </div>
               )}
            </section>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex flex-col font-sans transition-colors duration-500">
      <PlexusBackground />
      <Navbar 
        config={appState.config}
        onNavigate={(v) => { 
          const targetView = v === 'products' ? 'catalog' : v;
          setView(targetView); 
          setSelectedProduct(null); 
          window.scrollTo(0,0); 
        }}
      />
      <main className="flex-grow">{renderView()}</main>
      
      {activeModal === 'privacy' && (
        <Modal title="Data Protection Commitment" onClose={() => setActiveModal(null)}>
          <PrivacyPolicy content={appState.config.privacyPolicy} />
        </Modal>
      )}

      {activeModal === 'newsletter' && (
        <NewsletterPopup 
          config={appState.config.newsletter}
          onClose={dismissNewsletter} 
          onSubscribe={handleSubscribe}
        />
      )}

      <Footer 
        companyConfig={appState.config.company}
        footerConfig={appState.config.footer}
        legalConfig={appState.config.legal}
        uiConfig={appState.config.ui}
        onPrivacy={() => setActiveModal('privacy')}
        onAdmin={() => setView('admin')}
      />
    </div>
  );
};

export default App;
