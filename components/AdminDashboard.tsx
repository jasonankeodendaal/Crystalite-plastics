
import React, { useState } from 'react';
import { AppState, Material, Inquiry, TechnicalDocument, SocialLink, MaterialMedia, Brand, Range, Series, MaterialDepartment, PricingType, RoadmapItem, DivisionConfig, Branch, HeroItem, NavItem, MaterialVariant, AdvertItem, Subscriber, PosterItem } from '../types';

interface AdminDashboardProps {
  state: AppState;
  onUpdate: (newState: AppState) => void;
  onExit: () => void;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ state, onUpdate, onExit }) => {
  const [activeTab, setActiveTab] = useState<'system' | 'hero' | 'home-content' | 'vault' | 'catalog' | 'crm' | 'pages' | 'contact' | 'info'>('catalog');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [catalogFilter, setCatalogFilter] = useState<string>('All');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [crmView, setCrmView] = useState<'leads' | 'subscribers'>('leads');

  // Info section verifier state
  const [verifiedDim, setVerifiedDim] = useState<{ w: number, h: number, name: string } | null>(null);

  // Roadmap editing state
  const [newRoadmapItem, setNewRoadmapItem] = useState<RoadmapItem>({ year: '', event: '' });

  // Vault Management Hierarchical State
  const [selectedDept, setSelectedDept] = useState<MaterialDepartment>(Object.keys(state.config.divisions)[0] || '');
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);
  const [selectedRangeId, setSelectedRangeId] = useState<string | null>(null);
  const [selectedSeriesId, setSelectedSeriesId] = useState<string | null>(null);

  const [newSize, setNewSize] = useState('');
  const [brandForm, setBrandForm] = useState<{ name: string, logoData: string, showOnAboutPage: boolean }>({ name: '', logoData: '', showOnAboutPage: false });
  const [rangeForm, setRangeForm] = useState<{ name: string }>({ name: '' });
  const [seriesForm, setSeriesForm] = useState<{ name: string }>({ name: '' });

  // Department Manager State
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editingDeptName, setEditingDeptName] = useState<string | null>(null);
  const [deptForm, setDeptForm] = useState<{ name: string; title: string; desc: string; icon: string; cta: string }>({
    name: '', title: '', desc: '', icon: '📦', cta: 'Explore'
  });

  // Material Modal State
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editingVariantIndex, setEditingVariantIndex] = useState<number | null>(null);
  
  const [materialForm, setMaterialForm] = useState<Material>({
    id: '', sku: '', name: '', department: '', category: '',
    brand: '', brandId: '', range: '', rangeId: '', series: '', seriesId: '', modelNumber: '', density: 0,
    tempRange: '', description: '', inventoryNote: '', whatsappOverride: '', features: [], applications: [],
    standardSizes: [], variants: [], media: [], pros: [], cons: [],
    price: 0, pricingType: 'unit', fullRollLength: 0, engineeringSpecs: { length: 0, width: 0, thickness: 0, weight: 0 },
    technicalSpecs: [], tags: [], documents: []
  });

  const updateConfig = (path: string, value: any) => {
    const newState = JSON.parse(JSON.stringify(state));
    const keys = path.split('.');
    let current: any = newState.config;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    onUpdate(newState);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, path: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const b64 = await fileToBase64(file);
      updateConfig(path, b64);
    }
  };

  const handleVerifyImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setVerifiedDim({ w: img.width, h: img.height, name: file.name });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleBrandLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>, brandId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const b64 = await fileToBase64(file);
      const newBrands = state.brands.map(b => b.id === brandId ? { ...b, logoData: b64 } : b);
      onUpdate({ ...state, brands: newBrands });
    }
  };

  const handleHomeHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newItems: HeroItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const b64 = await fileToBase64(file);
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      newItems.push({
        id: crypto.randomUUID(),
        mediaType: type as any,
        mediaData: b64,
        title: "Dynamic",
        highlight: "Industry",
        subtitle: "Global material distribution network for high-performance industrial plastics and hardware.",
        button1Text: "Browse Catalog",
        button2Text: "Request Quote"
      });
    }
    updateConfig('hero.items', [...state.config.hero.items, ...newItems]);
  };

  const handleAdvertImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const b64 = await fileToBase64(file);
      const newAdverts = [...(state.config.adverts || [])];
      newAdverts[idx].image = b64;
      updateConfig('adverts', newAdverts);
    }
  };

  const handlePosterImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const b64 = await fileToBase64(file);
      const newPosters = [...(state.config.posters || [])];
      if (!newPosters[idx]) {
        newPosters[idx] = { id: crypto.randomUUID(), image: b64, title: 'Poster Title' };
      } else {
        newPosters[idx].image = b64;
      }
      updateConfig('posters', newPosters);
    }
  };

  const handleDeptIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const b64 = await fileToBase64(file);
      setDeptForm({ ...deptForm, icon: b64 });
    }
  };

  const handleSocialIconUpload = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const b64 = await fileToBase64(file);
      const newSocs = [...state.config.footer.socials];
      newSocs[idx].iconData = b64;
      updateConfig('footer.socials', newSocs);
    }
  };

  const handleAddBrand = () => {
    if (!brandForm.name) return;
    const newBrand: Brand = { id: crypto.randomUUID(), name: brandForm.name, logoData: brandForm.logoData, showOnAboutPage: brandForm.showOnAboutPage };
    onUpdate({ ...state, brands: [...state.brands, newBrand] });
    setBrandForm({ name: '', logoData: '', showOnAboutPage: false });
  };

  const handleToggleBrandOnAbout = (brandId: string) => {
    const newBrands = state.brands.map(b => b.id === brandId ? { ...b, showOnAboutPage: !b.showOnAboutPage } : b);
    onUpdate({ ...state, brands: newBrands });
  };

  const handleAddRange = () => {
    if (!rangeForm.name || !selectedBrandId) return;
    const newRange: Range = { 
      id: crypto.randomUUID(), 
      name: rangeForm.name, 
      brandId: selectedBrandId, 
      department: selectedDept,
      heroImages: [] 
    };
    onUpdate({ ...state, ranges: [...state.ranges, newRange] });
    setRangeForm({ name: '' });
  };

  const handleRangeHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>, rangeId: string) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      newImages.push(await fileToBase64(files[i]));
    }
    const newRanges = state.ranges.map(r => r.id === rangeId ? { ...r, heroImages: [...r.heroImages, ...newImages] } : r);
    onUpdate({ ...state, ranges: newRanges });
  };

  const handleAddSeries = () => {
    if (!seriesForm.name || !selectedRangeId) return;
    const newSeries: Series = {
      id: crypto.randomUUID(),
      name: seriesForm.name,
      rangeId: selectedRangeId,
      standardSizes: []
    };
    onUpdate({ ...state, series: [...state.series, newSeries] });
    setSeriesForm({ name: '' });
  };

  const handleAddSize = () => {
    if (!newSize || !selectedSeriesId) return;
    const newSeriesList = [...state.series];
    const idx = newSeriesList.findIndex(s => s.id === selectedSeriesId);
    if (idx !== -1) {
      newSeriesList[idx].standardSizes = [...(newSeriesList[idx].standardSizes || []), newSize];
      onUpdate({ ...state, series: newSeriesList });
      setNewSize('');
    }
  };

  const handleRemoveSize = (seriesId: string, size: string) => {
    const newSeriesList = [...state.series];
    const idx = newSeriesList.findIndex(s => s.id === seriesId);
    if (idx !== -1) {
      newSeriesList[idx].standardSizes = newSeriesList[idx].standardSizes.filter(s => s !== size);
      onUpdate({ ...state, series: newSeriesList });
    }
  };

  const handleSaveDept = () => {
    if (!deptForm.name) return;
    const newState = JSON.parse(JSON.stringify(state));
    
    // If we are editing and the name has changed
    if (editingDeptName && editingDeptName !== deptForm.name) {
      // 1. Move the division config
      newState.config.divisions[deptForm.name] = {
        title: deptForm.title || deptForm.name,
        desc: deptForm.desc,
        icon: deptForm.icon,
        ctaText: deptForm.cta
      };
      delete newState.config.divisions[editingDeptName];

      // 2. Move hero assets
      newState.config.hero.departmentHeroes[deptForm.name] = newState.config.hero.departmentHeroes[editingDeptName] || [];
      delete newState.config.hero.departmentHeroes[editingDeptName];

      // 3. Update all materials that reference the old department name
      newState.materials = newState.materials.map((m: Material) => 
        m.department === editingDeptName ? { ...m, department: deptForm.name } : m
      );

      // 4. Update ranges
      newState.ranges = newState.ranges.map((r: Range) => 
        r.department === editingDeptName ? { ...r, department: deptForm.name } : r
      );

      if (selectedDept === editingDeptName) setSelectedDept(deptForm.name);
    } else {
      // Regular create or update (no key change)
      newState.config.divisions[deptForm.name] = {
        title: deptForm.title || deptForm.name,
        desc: deptForm.desc,
        icon: deptForm.icon,
        ctaText: deptForm.cta
      };
      if (!newState.config.hero.departmentHeroes[deptForm.name]) {
        newState.config.hero.departmentHeroes[deptForm.name] = [];
      }
    }

    onUpdate(newState);
    setIsDeptModalOpen(false);
    setEditingDeptName(null);
    setDeptForm({ name: '', title: '', desc: '', icon: '📦', cta: 'Explore' });
  };

  const handleEditDept = (deptName: string) => {
    const d = state.config.divisions[deptName];
    setEditingDeptName(deptName);
    setDeptForm({
      name: deptName,
      title: d.title,
      desc: d.desc,
      icon: d.icon,
      cta: d.ctaText
    });
    setIsDeptModalOpen(true);
  };

  const handleRemoveDept = (deptName: string) => {
    if (!confirm(`Confirm purge of ${deptName} department and associated hero assets?`)) return;
    const newState = JSON.parse(JSON.stringify(state));
    delete newState.config.divisions[deptName];
    delete newState.config.hero.departmentHeroes[deptName];
    if (selectedDept === deptName) setSelectedDept(Object.keys(newState.config.divisions)[0] || '');
    onUpdate(newState);
  };

  const handleAddRoadmap = () => {
    if (!newRoadmapItem.year || !newRoadmapItem.event) return;
    updateConfig('about.roadmap', [...state.config.about.roadmap, newRoadmapItem]);
    setNewRoadmapItem({ year: '', event: '' });
  };

  const handleRemoveRoadmap = (index: number) => {
    const newRoadmap = [...state.config.about.roadmap];
    newRoadmap.splice(index, 1);
    updateConfig('about.roadmap', newRoadmap);
  };

  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    const newMaterials = [...state.materials];
    const brandObj = state.brands.find(b => b.id === materialForm.brandId);
    const rangeObj = state.ranges.find(r => r.id === materialForm.rangeId);
    const seriesObj = state.series.find(s => s.id === materialForm.seriesId);
    
    const finalMaterial = { 
      ...materialForm, 
      id: materialForm.id || crypto.randomUUID(),
      brand: brandObj?.name || '',
      range: rangeObj?.name || '',
      series: seriesObj?.name || ''
    };
    
    if (editingMaterial) {
      const index = newMaterials.findIndex(m => m.id === editingMaterial.id);
      newMaterials[index] = finalMaterial;
    } else {
      newMaterials.push(finalMaterial);
    }
    
    onUpdate({ ...state, materials: newMaterials });
    setIsMaterialModalOpen(false);
    setEditingVariantIndex(null);
  };

  const updateInquiryNotes = (iqId: string, notes: string) => {
    const newState = { ...state };
    const idx = newState.inquiries.findIndex(i => i.id === iqId);
    if (idx !== -1) {
      newState.inquiries[idx].adminNotes = notes;
      onUpdate(newState);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'main' | 'variant' = 'main') => {
    const files = e.target.files;
    if (!files) return;
    const newMedia: MaterialMedia[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await fileToBase64(file);
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      newMedia.push({ url: base64, type, fileName: file.name });
    }
    
    if (target === 'main') {
      setMaterialForm({ ...materialForm, media: [...materialForm.media, ...newMedia] });
    } else if (editingVariantIndex !== null) {
      const updatedVariants = [...materialForm.variants];
      updatedVariants[editingVariantIndex].mediaOverride = [...(updatedVariants[editingVariantIndex].mediaOverride || []), ...newMedia];
      setMaterialForm({...materialForm, variants: updatedVariants});
    }
  };

  const handleLogisticsMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64 = await fileToBase64(file);
        newUrls.push(base64);
    }
    const current = state.config.ui.logisticsImages || [];
    updateConfig('ui.logisticsImages', [...current, ...newUrls]);
  };

  const handleDeptHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !selectedDept) return;
    const newMedia: MaterialMedia[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64 = await fileToBase64(file);
      const type = file.type.startsWith('video/') ? 'video' : 'image';
      newMedia.push({ url: base64, type, fileName: file.name });
    }
    const currentHeroes = state.config.hero.departmentHeroes[selectedDept] || [];
    updateConfig(`hero.departmentHeroes.${selectedDept}`, [...currentHeroes, ...newMedia]);
  };

  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newDocs: TechnicalDocument[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const b64 = await fileToBase64(file);
      newDocs.push({ name: file.name, data: b64, type: file.type });
    }
    setMaterialForm({ ...materialForm, documents: [...materialForm.documents, ...newDocs] });
  };

  const handleAddVariant = () => {
    const newVariant: MaterialVariant = {
      id: crypto.randomUUID(),
      type: 'thickness',
      value: 'New Variant',
      priceOverride: materialForm.price,
      skuOverride: '',
      descriptionOverride: '',
      mediaOverride: []
    };
    setMaterialForm({ ...materialForm, variants: [...materialForm.variants, newVariant] });
    setEditingVariantIndex(materialForm.variants.length);
  };

  const selectedInquiry = state.inquiries.find(i => i.id === selectedInquiryId);

  const navCategories = [
    { 
      label: 'Identity', 
      tabs: ['system', 'contact'] 
    },
    { 
      label: 'Content', 
      tabs: ['hero', 'home-content', 'pages'] 
    },
    { 
      label: 'Product', 
      tabs: ['vault', 'catalog'] 
    },
    { 
      label: 'Operations', 
      tabs: ['crm', 'info'] 
    }
  ];

  const getTabLabel = (t: string) => {
    switch(t) {
      case 'vault': return 'DNA';
      case 'system': return 'Brand';
      case 'hero': return 'Carousel';
      case 'home-content': return 'Sections';
      case 'contact': return 'HQ';
      case 'crm': return 'Leads';
      case 'catalog': return 'Catalog';
      case 'pages': return 'Subpages';
      case 'info': return 'Specs';
      default: return t;
    }
  };

  const SectionHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({ title, subtitle, action }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 border-b border-white/10 pb-6 gap-4">
      <div>
        <h3 className="text-lg sm:text-2xl font-black uppercase text-[var(--primary-yellow)] tracking-tight">{title}</h3>
        {subtitle && <p className="text-[10px] sm:text-xs text-slate-500 uppercase font-black tracking-widest mt-1">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );

  const IMAGE_SPECS = [
    { label: 'Global Site Logo', target: 'Header & Brand', dimensions: '256 x 256 px', ratio: '1:1 (Square)', notes: 'Transparent SVG or PNG preferred' },
    { label: 'Home Hero Sequence', target: 'Homepage Slide', dimensions: '1920 x 1080 px', ratio: '16:9', notes: 'Maintain high contrast for readability' },
    { label: 'Logistics Grid', target: 'Landing Page Hub', dimensions: '2000 x 1200 px', ratio: '5:3', notes: 'Optimized for wide-format backgrounds' },
    { label: 'Advert Strip Items', target: 'Promo Banner', dimensions: '1600 x 400 px', ratio: '4:1', notes: 'Panoramic wide orientation' },
    { label: 'Industrial Billboard Poster', target: 'Technical Showcase', dimensions: '800 x 1000 px', ratio: '4:5 (Portrait)', notes: 'Ultra-high res industrial visuals' },
    { label: 'Division Glyph / Icon', target: 'Service Nodes', dimensions: '128 x 128 px', ratio: '1:1', notes: 'Flat vector or high-res PNG' },
    { label: 'Division Hero Media', target: 'Category Landing', dimensions: '1920 x 800 px', ratio: '~21:9', notes: 'Wide cinematic feel' },
    { label: 'Partner Brand Logos', target: 'Marquee / About', dimensions: '600 x 300 px', ratio: '2:1', notes: 'Transparency is critical' },
    { label: 'Technical Range Visuals', target: 'Product Range', dimensions: '1600 x 900 px', ratio: '16:9', notes: 'Authorized manufacturer data' },
    { label: 'Primary Profile Image', target: 'Product Detail', dimensions: '1200 x 900 px', ratio: '4:3', notes: 'Standard industrial specification' },
    { label: 'Variant Precision Media', target: 'Material Swatch', dimensions: '800 x 800 px', ratio: '1:1', notes: 'Close-up texture or color focus' },
    { label: 'Executive Heritage Asset', target: 'About / Founders', dimensions: '1200 x 800 px', ratio: '3:2', notes: 'Grayscale or high-fidelity color' },
    { label: 'Newsletter Hub Interface', target: 'Pop-up Terminal', dimensions: '800 x 600 px', ratio: '4:3', notes: 'Background context for subscription' },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-slate-300 flex flex-col font-sans">
      <header className="h-24 bg-[#111] border-b-4 border-[var(--primary-yellow)] flex items-center justify-between px-4 sm:px-8 shrink-0 sticky top-0 z-[150] shadow-2xl">
        <div className="flex items-center gap-4 sm:gap-6 md:gap-10 h-full overflow-hidden">
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={onExit}>
            <div className="w-10 h-10 bg-[var(--primary-yellow)] flex items-center justify-center rounded-[var(--border-radius)] shadow-[0_0_20px_rgba(255,214,0,0.3)]">
              <span className="text-black font-black text-xl">IP</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <h1 className="text-sm font-black uppercase tracking-[0.1em] text-white leading-none">Hub <span className="text-[var(--primary-yellow)]">Forge</span></h1>
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">Control</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 h-full min-w-0">
            {navCategories.map((cat, catIdx) => (
              <div key={catIdx} className="flex flex-col h-full justify-center relative group min-w-0 shrink-1">
                <span className="text-[7px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1 truncate">{cat.label}</span>
                <div className="flex items-center gap-1">
                  {cat.tabs.map(t => (
                    <button 
                      key={t} 
                      onClick={() => setActiveTab(t as any)} 
                      className={`px-2 xl:px-3 py-2 flex items-center text-[10px] xl:text-[11px] font-black uppercase tracking-widest transition-all rounded-md whitespace-nowrap ${activeTab === t ? 'text-black bg-[var(--primary-yellow)] shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                    >
                      {getTabLabel(t)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-3 text-[var(--primary-yellow)] focus:outline-none bg-white/5 rounded-full border border-white/10"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          
          <button onClick={onExit} className="bg-white text-black px-4 sm:px-6 py-3 text-xs sm:text-sm font-black uppercase tracking-widest hover:bg-[var(--primary-yellow)] transition-all shadow-xl rounded-[var(--border-radius)] shrink-0 active:scale-95">Exit</button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-24 left-0 w-full bg-[#111] border-b-4 border-[var(--primary-yellow)] shadow-2xl z-[140] animate-in slide-in-from-top duration-300">
            <nav className="flex flex-col py-6 divide-y divide-white/5">
              {navCategories.map((cat, catIdx) => (
                <div key={catIdx} className="px-8 py-4 space-y-3">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{cat.label}</span>
                  <div className="grid grid-cols-2 gap-2">
                    {cat.tabs.map(t => (
                      <button 
                        key={t} 
                        onClick={() => { setActiveTab(t as any); setIsMobileMenuOpen(false); }} 
                        className={`px-4 py-3 text-left text-[11px] font-black uppercase tracking-widest transition-all rounded ${activeTab === t ? 'text-black bg-[var(--primary-yellow)]' : 'text-slate-500 bg-white/5'}`}
                      >
                        {getTabLabel(t)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 overflow-y-auto p-6 sm:p-12 lg:p-20 no-scrollbar">
        <div className="max-w-[1920px] mx-auto space-y-16 pb-40">
          
          {activeTab === 'info' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="bg-[#111] p-8 sm:p-16 border border-white/5 rounded-[var(--border-radius)] shadow-2xl">
                <SectionHeader 
                  title="Technical Asset Specifications" 
                  subtitle="Authorized dimension registry and aspect ratio guide for all industrial hub visual nodes"
                  action={
                    <div className="flex items-center gap-4">
                       <input type="file" accept="image/*" id="specVerifier" className="hidden" onChange={handleVerifyImage} />
                       <button onClick={() => document.getElementById('specVerifier')?.click()} className="bg-white text-black px-8 py-3 text-xs font-black uppercase rounded-[var(--border-radius)] shadow-lg hover:bg-[var(--primary-yellow)] transition-all">Audit Local Asset Spec</button>
                    </div>
                  }
                />

                {verifiedDim && (
                  <div className="mb-12 p-8 bg-[var(--primary-yellow)]/10 border-l-8 border-[var(--primary-yellow)] rounded-r-[var(--border-radius)] flex flex-col sm:flex-row justify-between items-center gap-6 animate-in slide-in-from-top-4">
                     <div className="space-y-2 text-center sm:text-left">
                        <p className="text-[10px] font-black uppercase text-[var(--primary-yellow)] tracking-[0.4em]">LIVE_ASSET_DIAGNOSTICS</p>
                        <h4 className="text-xl font-black text-white uppercase truncate max-w-sm">{verifiedDim.name}</h4>
                     </div>
                     <div className="flex gap-10">
                        <div className="text-center">
                           <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Pixel Width</p>
                           <p className="text-3xl font-black text-white">{verifiedDim.w} <span className="text-xs">PX</span></p>
                        </div>
                        <div className="text-center">
                           <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Pixel Height</p>
                           <p className="text-3xl font-black text-white">{verifiedDim.h} <span className="text-xs">PX</span></p>
                        </div>
                        <div className="text-center hidden md:block">
                           <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Est. Aspect</p>
                           <p className="text-3xl font-black text-[var(--primary-yellow)]">{(verifiedDim.w / verifiedDim.h).toFixed(2)}</p>
                        </div>
                     </div>
                     <button onClick={() => setVerifiedDim(null)} className="text-slate-500 hover:text-white font-black text-2xl">&times;</button>
                  </div>
                )}

                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-black/40 text-[10px] font-black uppercase text-slate-600 tracking-[0.4em]">
                       <tr>
                         <th className="px-8 py-6 border-b border-white/5">Asset Category</th>
                         <th className="px-8 py-6 border-b border-white/5">Primary Hub Location</th>
                         <th className="px-8 py-6 border-b border-white/5">Recommended Px Spec</th>
                         <th className="px-8 py-6 border-b border-white/5">Aspect Ratio</th>
                         <th className="px-8 py-6 border-b border-white/5">Technical Notes</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                      {IMAGE_SPECS.map((spec, i) => (
                        <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                          <td className="px-8 py-6">
                            <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-[var(--primary-yellow)] transition-colors">{spec.label}</p>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{spec.target}</span>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-[11px] font-mono font-black text-[var(--primary-yellow)]">{spec.dimensions}</p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-[11px] font-black uppercase text-slate-300">{spec.ratio}</p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-[10px] font-medium italic text-slate-500 group-hover:text-slate-400">{spec.notes}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-16 p-10 bg-black/40 border border-white/5 rounded-[var(--border-radius)] flex flex-col md:flex-row items-center justify-between gap-8">
                   <div className="max-w-2xl text-center md:text-left space-y-2">
                      <h5 className="text-sm font-black uppercase text-white tracking-[0.2em]">Asset Quality Protocol</h5>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Uploading assets outside of these recommended parameters may result in suboptimal hub visualization, including unwanted cropping, pixelation on retina displays, or layout distortion. Always verify master roll imagery and hardware visuals against this DNA specification registry.
                      </p>
                   </div>
                   <div className="text-[var(--primary-yellow)] text-6xl opacity-10 font-black tracking-tighter hidden sm:block">SPEC_HUB</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="space-y-12 animate-in fade-in duration-300">
              <div className="bg-[#111] p-8 sm:p-16 border border-white/5 rounded-[var(--border-radius)] shadow-2xl">
                <SectionHeader 
                  title="Homepage Carousel Architect" 
                  subtitle="Manage high-impact visual sequences for the industrial portal landing"
                  action={
                    <>
                      <input type="file" multiple accept="image/*,video/*" id="homeHeroUpload" className="hidden" onChange={handleHomeHeroUpload} />
                      <button onClick={() => document.getElementById('homeHeroUpload')?.click()} className="bg-white text-black px-8 py-3 text-xs font-black uppercase rounded-[var(--border-radius)] shadow-lg hover:bg-[var(--primary-yellow)] transition-all">Add Visual Cluster +</button>
                    </>
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                  {state.config.hero.items.map((item, idx) => (
                    <div key={item.id} className="bg-black/40 border border-white/5 rounded-[var(--border-radius)] overflow-hidden flex flex-col group shadow-xl">
                      <div className="aspect-video relative overflow-hidden bg-black border-b border-white/5">
                        {item.mediaType === 'video' ? (
                          <video src={item.mediaData} className="w-full h-full object-cover opacity-60" muted autoPlay loop />
                        ) : (
                          <img src={item.mediaData} className="w-full h-full object-cover opacity-60" alt="Slide" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 backdrop-blur-sm">
                           <button onClick={() => {
                             const newItems = [...state.config.hero.items];
                             newItems.splice(idx, 1);
                             updateConfig('hero.items', newItems);
                           }} className="bg-red-600 text-white px-8 py-3 text-[10px] font-black uppercase rounded-sm hover:bg-red-500 transition-colors">Expunge Slide</button>
                        </div>
                      </div>
                      <div className="p-8 space-y-6 flex-1">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Headline Alpha</label>
                           <input className="w-full bg-black border border-white/10 p-4 text-sm text-white uppercase font-black rounded-md focus:border-[var(--primary-yellow)] outline-none" value={item.title} onChange={e => {
                             const newItems = [...state.config.hero.items];
                             newItems[idx].title = e.target.value;
                             updateConfig('hero.items', newItems);
                           }} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Highlight Segment</label>
                           <input className="w-full bg-black border border-white/10 p-4 text-sm text-[var(--primary-yellow)] font-black rounded-md focus:border-[var(--primary-yellow)] outline-none" value={item.highlight} onChange={e => {
                             const newItems = [...state.config.hero.items];
                             newItems[idx].highlight = e.target.value;
                             updateConfig('hero.items', newItems);
                           }} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Technical Subtext</label>
                           <textarea className="w-full bg-black border border-white/10 p-4 text-xs text-slate-400 h-28 rounded-md focus:border-[var(--primary-yellow)] outline-none leading-relaxed" value={item.subtitle} onChange={e => {
                             const newItems = [...state.config.hero.items];
                             newItems[idx].subtitle = e.target.value;
                             updateConfig('hero.items', newItems);
                           }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'home-content' && (
            <div className="space-y-16 animate-in fade-in duration-300">
               <div className="bg-[#111] p-8 sm:p-16 border border-white/5 rounded-[var(--border-radius)] shadow-2xl">
                 <SectionHeader title="Homepage Modular Assembly" subtitle="Refine specific block components of the primary distribution portal" />
                 
                 <div className="grid lg:grid-cols-2 gap-16">
                   <section className="space-y-10">
                     <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 bg-[var(--primary-yellow)] rounded-sm"></div>
                        <h4 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em]">Leadership Block Profile</h4>
                     </div>
                     <div className="bg-black/40 p-8 sm:p-12 space-y-8 border border-white/5 rounded-[var(--border-radius)] shadow-lg">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Founders Header Title</label>
                          <input className="w-full bg-black border border-white/10 p-4 text-sm text-white font-black rounded-md focus:border-[var(--primary-yellow)] outline-none" value={state.config.founders.title} onChange={e => updateConfig('founders.title', e.target.value)} />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Operational Credibility Label</label>
                          <input className="w-full bg-black border border-white/10 p-4 text-sm text-[var(--primary-yellow)] font-black rounded-md focus:border-[var(--primary-yellow)] outline-none" value={state.config.founders.subtitle} onChange={e => updateConfig('founders.subtitle', e.target.value)} />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Manifesto / Executive Summary</label>
                          <textarea className="w-full bg-black border border-white/10 p-4 text-sm text-slate-400 h-44 rounded-md focus:border-[var(--primary-yellow)] outline-none leading-relaxed" value={state.config.founders.text} onChange={e => updateConfig('founders.text', e.target.value)} />
                       </div>
                       <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Primary Visual Representative</label>
                          <div className="flex flex-col sm:flex-row gap-6">
                            <div className="w-32 h-32 bg-black border border-white/10 rounded-sm overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                               <img src={state.config.founders.image} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" alt="Founders" />
                            </div>
                            <div className="flex-1 space-y-3 flex flex-col justify-center">
                               <input type="file" id="foundersImageUpload" className="hidden" onChange={e => handleFileUpload(e, 'founders.image')} />
                               <button onClick={() => document.getElementById('foundersImageUpload')?.click()} className="w-full bg-white/5 border border-white/10 py-4 text-xs font-black uppercase text-white hover:bg-white hover:text-black transition-all rounded-md">Replace Executive Imagery</button>
                               <p className="text-[9px] text-slate-500 uppercase italic">Recommened Resolution: 1200x800 for optimal industrial fidelity</p>
                            </div>
                          </div>
                       </div>
                     </div>
                   </section>

                   <section className="space-y-10">
                     <div className="flex items-center gap-4 mb-2">
                        <div className="w-8 h-8 bg-slate-800 rounded-sm"></div>
                        <h4 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em]">National Logistics Grid</h4>
                     </div>
                     <div className="bg-black/40 p-8 sm:p-12 space-y-8 border border-white/5 rounded-[var(--border-radius)] shadow-lg">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">National Registry Title</label>
                          <input className="w-full bg-black border border-white/10 p-4 text-sm text-white font-black rounded-md focus:border-[var(--primary-yellow)] outline-none" value={state.config.ui.logisticsTitle} onChange={e => updateConfig('ui.logisticsTitle', e.target.value)} />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Accent Highlight Label</label>
                          <input className="w-full bg-black border border-white/10 p-4 text-sm text-[var(--primary-yellow)] font-black rounded-md focus:border-[var(--primary-yellow)] outline-none" value={state.config.ui.logisticsHighlight} onChange={e => updateConfig('ui.logisticsHighlight', e.target.value)} />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Logistic Capability Description</label>
                          <textarea className="w-full bg-black border border-white/10 p-4 text-sm text-slate-400 h-32 rounded-md focus:border-[var(--primary-yellow)] outline-none leading-relaxed" value={state.config.ui.logisticsDesc} onChange={e => updateConfig('ui.logisticsDesc', e.target.value)} />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Branch Access Button Label</label>
                          <input className="w-full bg-black border border-white/10 p-4 text-sm text-white rounded-md focus:border-[var(--primary-yellow)] outline-none" value={state.config.ui.branchDirectoryBtnText} onChange={e => updateConfig('ui.branchDirectoryBtnText', e.target.value)} />
                       </div>
                     </div>
                   </section>
                 </div>

                 {/* CONVERSION & ADVERTISING Section */}
                 <div className="mt-20 pt-16 border-t-2 border-white/5 space-y-20">
                    <SectionHeader title="Conversion & Broadcast Management" subtitle="Refine promotional assets and newsletter subscriber triggers" />
                    
                    <div className="grid lg:grid-cols-1 gap-16">
                       {/* Billboard Matrix Section */}
                       <section className="space-y-10">
                          <div className="flex items-center gap-4 mb-2">
                             <div className="w-8 h-8 bg-yellow-600 rounded-sm"></div>
                             <h4 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em]">Industrial Billboard Matrix</h4>
                          </div>
                          <div className="bg-black/40 p-8 sm:p-12 space-y-12 border border-white/5 rounded-[var(--border-radius)] shadow-lg">
                             <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-4">Manage the primary 3-row portrait poster visual showcase</p>
                             <div className="grid md:grid-cols-3 gap-8">
                                {[0, 1, 2].map(idx => {
                                  const poster = (state.config.posters || [])[idx];
                                  return (
                                    <div key={idx} className="bg-black/40 border border-white/10 rounded-md p-6 space-y-6">
                                       <div className="aspect-[4/5] bg-black border border-white/10 relative overflow-hidden rounded">
                                          {poster?.image ? (
                                            <img src={poster.image} className="w-full h-full object-cover grayscale opacity-50" />
                                          ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase text-slate-800">No Asset</div>
                                          )}
                                          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm">
                                             <input type="file" id={`posterImage-${idx}`} className="hidden" onChange={e => handlePosterImageUpload(e, idx)} />
                                             <button onClick={() => document.getElementById(`posterImage-${idx}`)?.click()} className="bg-white text-black px-6 py-2 text-[9px] font-black uppercase rounded shadow-lg">Upload Spec (800x1000)</button>
                                          </div>
                                       </div>
                                       <div className="space-y-2">
                                          <label className="text-[9px] font-black uppercase text-slate-600">Poster Headline 0{idx + 1}</label>
                                          <input 
                                            className="w-full bg-black border border-white/10 p-3 text-[11px] text-white font-black uppercase rounded outline-none" 
                                            value={poster?.title || ''} 
                                            onChange={e => {
                                              const newPosters = [...(state.config.posters || [])];
                                              if (newPosters[idx]) {
                                                newPosters[idx].title = e.target.value;
                                              } else {
                                                newPosters[idx] = { id: crypto.randomUUID(), title: e.target.value, image: '' };
                                              }
                                              updateConfig('posters', newPosters);
                                            }}
                                          />
                                       </div>
                                    </div>
                                  );
                                })}
                             </div>
                          </div>
                       </section>

                       {/* Newsletter Manager */}
                       <section className="space-y-10">
                          <div className="flex items-center gap-4 mb-2">
                             <div className="w-8 h-8 bg-blue-600 rounded-sm"></div>
                             <h4 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em]">Newsletter Sync Configuration</h4>
                          </div>
                          <div className="bg-black/40 p-8 sm:p-12 space-y-12 border border-white/5 rounded-[var(--border-radius)] shadow-lg">
                             <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                   <div className="space-y-3">
                                      <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Lead Terminal Title</label>
                                      <input className="w-full bg-black border border-white/10 p-4 text-sm text-white font-black rounded-md outline-none" value={state.config.newsletter.title} onChange={e => updateConfig('newsletter.title', e.target.value)} />
                                   </div>
                                   <div className="space-y-3">
                                      <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Operational Subtext</label>
                                      <textarea className="w-full bg-black border border-white/10 p-4 text-sm text-slate-400 h-24 rounded-md outline-none leading-relaxed" value={state.config.newsletter.subtitle} onChange={e => updateConfig('newsletter.subtitle', e.target.value)} />
                                   </div>
                                   <div className="space-y-3">
                                      <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Call-To-Action Button</label>
                                      <input className="w-full bg-black border border-white/10 p-4 text-sm text-white rounded-md outline-none" value={state.config.newsletter.buttonText} onChange={e => updateConfig('newsletter.buttonText', e.target.value)} />
                                   </div>
                                </div>
                                <div className="space-y-8">
                                   <div className="space-y-3">
                                      <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Success State Headline</label>
                                      <input className="w-full bg-black border border-white/10 p-4 text-sm text-green-500 font-black rounded-md outline-none" value={state.config.newsletter.successTitle} onChange={updateConfig.bind(null, 'newsletter.successTitle')} />
                                   </div>
                                   <div className="space-y-3">
                                      <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Success Confirmation Text</label>
                                      <input className="w-full bg-black border border-white/10 p-4 text-sm text-white rounded-md outline-none" value={state.config.newsletter.successSubtitle} onChange={e => updateConfig('newsletter.successSubtitle', e.target.value)} />
                                   </div>
                                   <div className="space-y-3">
                                      <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Compliance Footer Notice</label>
                                      <input className="w-full bg-black border border-white/10 p-4 text-xs text-slate-500 rounded-md outline-none" value={state.config.newsletter.footerText} onChange={e => updateConfig('newsletter.footerText', e.target.value)} />
                                   </div>
                                </div>
                             </div>
                             <div className="pt-8 border-t border-white/10">
                                <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest block mb-4">Promotional Interface Visual</label>
                                <div className="flex flex-col sm:flex-row gap-10 items-center">
                                   <div className="w-48 h-32 bg-black border border-white/10 rounded-md overflow-hidden shrink-0 shadow-inner">
                                      <img src={state.config.newsletter.image} className="w-full h-full object-cover grayscale" alt="Newsletter" />
                                   </div>
                                   <div className="flex-1 space-y-4">
                                      <input type="file" id="newsletterImageUpload" className="hidden" onChange={e => handleFileUpload(e, 'newsletter.image')} />
                                      <button onClick={() => document.getElementById('newsletterImageUpload')?.click()} className="bg-white text-black px-8 py-3 text-xs font-black uppercase hover:bg-[var(--primary-yellow)] transition-all rounded-md shadow-lg">Replace Interface Asset</button>
                                      <p className="text-[9px] text-slate-600 uppercase italic">Industrial high-fidelity background image (16:9 recommended)</p>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </section>

                       {/* Advertising Manager */}
                       <section className="space-y-10">
                          <div className="flex justify-between items-center mb-2">
                             <div className="flex items-center gap-4">
                                <div className="w-8 h-8 bg-red-600 rounded-sm"></div>
                                <h4 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em]">Advert Strip Sequences</h4>
                             </div>
                             <button onClick={() => {
                               const newAd: AdvertItem = { id: crypto.randomUUID(), title: 'New Strategic Offer', ctaText: 'Inquire Now', image: '', link: 'catalog' };
                               updateConfig('adverts', [...(state.config.adverts || []), newAd]);
                             }} className="bg-white text-black px-6 py-2 text-[10px] font-black uppercase rounded hover:bg-[var(--primary-yellow)] transition-all shadow-lg">Inject Advert +</button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                             {(state.config.adverts || []).map((ad, idx) => (
                                <div key={ad.id} className="bg-black/40 border border-white/5 rounded-[var(--border-radius)] overflow-hidden flex flex-col group shadow-xl">
                                   <div className="h-40 relative bg-black border-b border-white/5 group-hover:bg-white/5 transition-colors">
                                      {ad.image ? (
                                        <img src={ad.image} className="w-full h-full object-cover opacity-40 group-hover:opacity-60 grayscale transition-all" />
                                      ) : (
                                        <div className="h-full flex items-center justify-center text-[10px] font-black uppercase text-slate-800 tracking-widest">No Visual Asset</div>
                                      )}
                                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm">
                                         <input type="file" id={`adImage-${idx}`} className="hidden" onChange={e => handleAdvertImageUpload(e, idx)} />
                                         <button onClick={() => document.getElementById(`adImage-${idx}`)?.click()} className="bg-white text-black px-6 py-2 text-[9px] font-black uppercase rounded shadow-lg mr-2">Replace Image</button>
                                         <button onClick={() => {
                                           const newAds = [...(state.config.adverts || [])];
                                           newAds.splice(idx, 1);
                                           updateConfig('adverts', newAds);
                                         }} className="bg-red-900 text-white px-6 py-2 text-[9px] font-black uppercase rounded shadow-lg">Terminate</button>
                                      </div>
                                   </div>
                                   <div className="p-8 space-y-4">
                                      <div className="space-y-1">
                                         <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Broadcast Headline</label>
                                         <input className="w-full bg-black border border-white/10 p-3 text-sm text-white font-black rounded outline-none" value={ad.title} onChange={e => {
                                           const newAds = [...(state.config.adverts || [])];
                                           newAds[idx].title = e.target.value;
                                           updateConfig('adverts', newAds);
                                         }} />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest">CTA Label</label>
                                            <input className="w-full bg-black border border-white/10 p-3 text-[11px] text-[var(--primary-yellow)] font-black rounded outline-none" value={ad.ctaText} onChange={e => {
                                              const newAds = [...(state.config.adverts || [])];
                                              newAds[idx].ctaText = e.target.value;
                                              updateConfig('adverts', newAds);
                                            }} />
                                         </div>
                                         <div className="space-y-1">
                                            <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Navigation Link</label>
                                            <select className="w-full bg-black border border-white/10 p-3 text-[11px] text-white rounded outline-none appearance-none cursor-pointer" value={ad.link} onChange={e => {
                                               const newAds = [...(state.config.adverts || [])];
                                               newAds[idx].link = e.target.value;
                                               updateConfig('adverts', newAds);
                                            }}>
                                               <option value="catalog">Full Catalog</option>
                                               <option value="contact">Contact HQ</option>
                                               <option value="about">About Hub</option>
                                               {Object.keys(state.config.divisions).map(dept => (
                                                  <option key={dept} value={`dept:${dept}`}>{dept}</option>
                                               ))}
                                            </select>
                                         </div>
                                      </div>
                                   </div>
                                </div>
                             ))}
                          </div>
                       </section>
                    </div>

                    <div className="pt-16 border-t-2 border-white/5">
                      <SectionHeader title="Technical Form Logic" subtitle="Manage lead capture triggers and automated dispatch categories" />
                      
                      <div className="grid lg:grid-cols-2 gap-16">
                        <div className="space-y-10">
                          <h4 className="text-sm font-black uppercase text-slate-500 tracking-[0.2em]">Interface Alerts & Notices</h4>
                          <div className="bg-black/40 p-8 sm:p-12 space-y-8 border border-white/5 rounded-[var(--border-radius)] shadow-lg">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Technical Portal Header</label>
                               <input className="w-full bg-black border border-white/10 p-4 text-sm text-white font-black rounded-md outline-none" value={state.config.ui.formNoticeHeading} onChange={e => updateConfig('ui.formNoticeHeading', e.target.value)} />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Rapid-Response Hotline Header</label>
                               <input className="w-full bg-black border border-white/10 p-4 text-sm text-[var(--primary-yellow)] font-black rounded-md outline-none" value={state.config.ui.emergencyHeading} onChange={e => updateConfig('ui.emergencyHeading', e.target.value)} />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Global Fulfillment Disclaimer</label>
                               <textarea className="w-full bg-black border border-white/10 p-4 text-sm text-slate-400 h-32 rounded-md outline-none leading-relaxed" value={state.config.ui.inventoryNote} onChange={e => updateConfig('ui.inventoryNote', e.target.value)} />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-10">
                          <h4 className="text-sm font-black uppercase text-slate-500 tracking-[0.2em]">Inquiry Classification Registry</h4>
                          <div className="bg-black/40 p-8 sm:p-12 space-y-6 border border-white/5 rounded-[var(--border-radius)] shadow-lg">
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-4">Define active lead categories for technical dispatch routing</p>
                            <div className="space-y-4 max-h-[450px] overflow-y-auto no-scrollbar pr-2">
                              {state.config.ui.inquiryTypes.map((type, idx) => (
                                <div key={idx} className="flex gap-4 items-center bg-black/60 p-4 border border-white/10 rounded-md group hover:border-[var(--primary-yellow)] transition-all">
                                  <input 
                                    className="flex-1 bg-transparent text-sm font-black text-white p-2 border-b border-transparent focus:border-[var(--primary-yellow)] outline-none" 
                                    value={type} 
                                    onChange={e => {
                                      const newTypes = [...state.config.ui.inquiryTypes];
                                      newTypes[idx] = e.target.value;
                                      updateConfig('ui.inquiryTypes', newTypes);
                                    }} 
                                  />
                                  <button onClick={() => {
                                    const newTypes = state.config.ui.inquiryTypes.filter((_, i) => i !== idx);
                                    updateConfig('ui.inquiryTypes', newTypes);
                                  }} className="text-red-900 font-black text-2xl px-3 hover:text-red-500 transition-colors">&times;</button>
                                </div>
                              ))}
                              <button onClick={() => {
                                const newTypes = [...state.config.ui.inquiryTypes, 'New Technical Category'];
                                updateConfig('ui.inquiryTypes', newTypes);
                              }} className="w-full text-xs font-black uppercase text-[var(--primary-yellow)] border-2 border-dashed border-[var(--primary-yellow)]/30 py-6 rounded-md hover:bg-[var(--primary-yellow)]/5 transition-all">Add Inquiry Classification +</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-[#111] p-8 sm:p-16 border border-white/5 rounded-[var(--border-radius)] shadow-2xl">
                <SectionHeader 
                  title="Master Visual Identity Forge" 
                  subtitle="Synchronize global corporate assets and high-level UX parameters across the entire hub"
                />

                <div className="grid lg:grid-cols-2 gap-20">
                  <div className="space-y-12">
                    <div className="space-y-8">
                      <h4 className="text-sm font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[var(--primary-yellow)]"></span> Core Global Authority
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Entity Full Title</label>
                          <input className="w-full bg-black border border-white/10 p-4 text-sm text-white font-black rounded-md focus:border-[var(--primary-yellow)] outline-none" value={state.config.company.name} onChange={e => updateConfig('company.name', e.target.value)} />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Proprietary Tagline</label>
                          <input className="w-full bg-black border border-white/10 p-4 text-sm text-white font-black rounded-md focus:border-[var(--primary-yellow)] outline-none" value={state.config.company.tagline} onChange={e => updateConfig('company.tagline', e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <h4 className="text-sm font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-slate-700"></span> Primary Visual Signifier
                      </h4>
                      <div className="flex flex-col sm:flex-row gap-10 items-center bg-black/40 p-10 border border-white/5 rounded-[var(--border-radius)]">
                        <div className="w-32 h-32 bg-black border border-white/10 flex items-center justify-center rounded-[var(--border-radius)] overflow-hidden shrink-0 shadow-2xl p-4">
                          <img src={state.config.branding.logoData} className="max-w-full max-h-full object-contain filter brightness-125" alt="Current Logo" />
                        </div>
                        <div className="flex-1 w-full space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">SVG/PNG Source Registry</label>
                             <input type="file" id="siteLogoUpload" className="hidden" onChange={e => handleFileUpload(e, 'branding.logoData')} />
                             <button onClick={() => document.getElementById('siteLogoUpload')?.click()} className="w-full bg-white text-black py-4 text-xs font-black uppercase hover:bg-[var(--primary-yellow)] transition-all rounded-md shadow-lg">Upload Global Mark</button>
                          </div>
                          <div className="flex gap-6 items-center">
                             <label className="text-[10px] font-black uppercase text-slate-600 whitespace-nowrap">Asset Scale (PX):</label>
                             <input className="bg-black border border-white/10 px-4 py-3 text-xs text-white font-black w-32 rounded-md focus:border-[var(--primary-yellow)] outline-none" value={state.config.branding.logoWidth} onChange={e => updateConfig('branding.logoWidth', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8 pt-8 border-t border-white/10">
                      <h4 className="text-sm font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[var(--primary-yellow)]"></span> Chromatic Forge
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Industrial Primary Hue</label>
                          <div className="flex gap-4">
                            <input type="color" className="h-14 w-20 bg-black border border-white/10 p-1 rounded-sm cursor-pointer shrink-0" value={state.config.theme.primaryColor} onChange={e => updateConfig('theme.primaryColor', e.target.value)} />
                            <input className="flex-1 bg-black border border-white/10 p-4 text-sm text-white font-mono rounded-md" value={state.config.theme.primaryColor} onChange={e => updateConfig('theme.primaryColor', e.target.value)} />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Base Hub Background</label>
                          <div className="flex gap-4">
                            <input type="color" className="h-14 w-20 bg-black border border-white/10 p-1 rounded-sm cursor-pointer shrink-0" value={state.config.theme.industrialBg} onChange={e => updateConfig('theme.industrialBg', e.target.value)} />
                            <input className="flex-1 bg-black border border-white/10 p-4 text-sm text-white font-mono rounded-md" value={state.config.theme.industrialBg} onChange={e => updateConfig('theme.industrialBg', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-12">
                    <section className="space-y-8">
                      <h4 className="text-sm font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-slate-700"></span> Institutional Metadata
                      </h4>
                      <div className="bg-black/40 p-10 border border-white/5 space-y-8 rounded-[var(--border-radius)] shadow-lg">
                        <div className="grid sm:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Entity VAT ID</label>
                             <input className="w-full bg-black border border-white/10 p-4 text-sm text-white font-black rounded-md outline-none focus:border-[var(--primary-yellow)]" value={state.config.legal.vatNumber} onChange={e => updateConfig('legal.vatNumber', e.target.value)} />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Filing REG Number</label>
                             <input className="w-full bg-black border border-white/10 p-4 text-sm text-white font-black rounded-md outline-none focus:border-[var(--primary-yellow)]" value={state.config.legal.regNumber} onChange={e => updateConfig('legal.regNumber', e.target.value)} />
                          </div>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Global Copyright Formula (HTML)</label>
                           <textarea className="w-full bg-black border border-white/10 p-4 text-xs text-slate-400 h-28 rounded-md focus:border-[var(--primary-yellow)] outline-none leading-relaxed" value={state.config.legal.copyrightOverride} onChange={e => updateConfig('legal.copyrightOverride', e.target.value)} />
                        </div>
                      </div>
                    </section>

                    <section className="space-y-8 pt-4">
                      <h4 className="text-sm font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[var(--primary-yellow)]"></span> Ticker & Broadcast
                      </h4>
                      <div className="bg-black/40 p-10 border border-white/5 space-y-8 rounded-[var(--border-radius)] shadow-lg">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                           <span className="text-[10px] font-black uppercase text-slate-500">Live Announcement Visibility</span>
                           <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" checked={state.config.announcement.enabled} onChange={e => updateConfig('announcement.enabled', e.target.checked)} />
                              <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[var(--primary-yellow)]"></div>
                           </label>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Broadcast Transmission Text</label>
                          <textarea className="w-full bg-black border border-white/10 p-4 text-xs text-[var(--primary-yellow)] font-black h-28 rounded-md outline-none leading-tight tracking-widest" value={state.config.announcement.text} onChange={e => updateConfig('announcement.text', e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Transmission Rate (s)</label>
                             <input className="w-full bg-black border border-white/10 p-4 text-sm text-white rounded-md" value={state.config.announcement.duration || '20s'} onChange={e => updateConfig('announcement.duration', e.target.value)} />
                           </div>
                           <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Iterative Count</label>
                             <input type="number" className="w-full bg-black border border-white/10 p-4 text-sm text-white rounded-md" value={state.config.announcement.repeatCount || 3} onChange={e => updateConfig('announcement.repeatCount', parseInt(e.target.value))} />
                           </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                <div className="mt-20 pt-16 border-t-4 border-white/5">
                  <SectionHeader title="Syndicated Social Registry" subtitle="Manage external authoritative connectivity nodes" />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {state.config.footer.socials.map((soc, idx) => (
                      <div key={soc.id} className="bg-black/40 p-8 border border-white/5 space-y-6 rounded-[var(--border-radius)] shadow-lg group hover:border-[var(--primary-yellow)] transition-all">
                        <div className="flex gap-6 items-center">
                          <div className="w-16 h-16 bg-black border border-white/10 rounded-md flex items-center justify-center overflow-hidden shrink-0 shadow-inner group-hover:border-[var(--primary-yellow)]/30 transition-all">
                            {soc.iconData ? <img src={soc.iconData} className="w-10 h-10 object-contain filter brightness-125" alt="Icon" /> : <span className="text-[10px] text-slate-700 font-black">NULL</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <input className="w-full bg-black border border-white/10 p-3 text-[10px] text-white font-black uppercase tracking-widest rounded-md mb-2 focus:border-[var(--primary-yellow)] outline-none" placeholder="Registry Name" value={soc.name} onChange={e => {
                              const newSocs = [...state.config.footer.socials];
                              newSocs[idx].name = e.target.value;
                              updateConfig('footer.socials', newSocs);
                            }} />
                            <input type="file" id={`socIcon-${idx}`} className="hidden" onChange={e => handleSocialIconUpload(e, idx)} />
                            <button onClick={() => document.getElementById(`socIcon-${idx}`)?.click()} className="text-[10px] font-black uppercase text-[var(--primary-yellow)] hover:underline tracking-widest">Update Glyph</button>
                          </div>
                        </div>
                        <input className="w-full bg-black border border-white/10 p-3 text-[10px] text-slate-400 rounded-md focus:border-[var(--primary-yellow)] outline-none font-mono" placeholder="Endpoint URL" value={soc.url} onChange={e => {
                          const newSocs = [...state.config.footer.socials];
                          newSocs[idx].url = e.target.value;
                          updateConfig('footer.socials', newSocs);
                        }} />
                        <button onClick={() => {
                          const newSocs = [...state.config.footer.socials];
                          newSocs.splice(idx, 1);
                          updateConfig('footer.socials', newSocs);
                        }} className="w-full text-red-900 text-[10px] font-black uppercase hover:text-red-500 transition-colors border border-red-900/20 py-2 rounded-md">Terminate Link</button>
                      </div>
                    ))}
                    <button onClick={() => {
                      const newSoc: SocialLink = { id: crypto.randomUUID(), name: 'New Platform', url: 'https://', iconData: '' };
                      updateConfig('footer.socials', [...state.config.footer.socials, newSoc]);
                    }} className="flex items-center justify-center border-2 border-dashed border-white/10 hover:border-[var(--primary-yellow)] hover:text-[var(--primary-yellow)] transition-all min-h-[220px] rounded-[var(--border-radius)] bg-white/[0.01]">
                       <div className="text-center space-y-2">
                          <span className="text-3xl font-light">+</span>
                          <span className="block text-[10px] font-black uppercase tracking-[0.3em]">Synch New Node</span>
                       </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="space-y-12 animate-in fade-in duration-500">
              {/* Hierarchy Forge View */}
              <div className="bg-[#111] border border-white/5 rounded-[var(--border-radius)] shadow-2xl flex flex-col h-[85vh] overflow-hidden">
                <div className="p-8 border-b border-white/10 bg-black/40 flex justify-between items-center shrink-0">
                  <div className="flex items-center gap-6">
                    <h3 className="text-2xl font-black uppercase text-[var(--primary-yellow)] tracking-tight">Material DNA Forge</h3>
                    <div className="hidden sm:flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Division:</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase rounded">{selectedDept}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { 
                      setEditingDeptName(null);
                      setDeptForm({ name: '', title: '', desc: '', icon: '📦', cta: 'Explore' });
                      setIsDeptModalOpen(true); 
                    }} className="bg-white/5 border border-white/10 text-white px-6 py-2 text-[10px] font-black uppercase rounded hover:bg-white hover:text-black transition-all">New Division +</button>
                    <button onClick={() => {
                        const firstDept = Object.keys(state.config.divisions)[0] || '';
                        setEditingMaterial(null);
                        setMaterialForm({
                          id: '', sku: '', name: '', department: selectedDept || firstDept, category: '', brand: '', brandId: '', range: '', rangeId: '', series: '', seriesId: '', modelNumber: '',
                          density: 0, tempRange: '', description: '', inventoryNote: '', whatsappOverride: '', features: [], applications: [], standardSizes: [], variants: [],
                          media: [], pros: [], cons: [], price: 0, pricingType: (selectedDept === 'Engineering Materials' || selectedDept === 'Hardware') ? 'unit' : 'meter', fullRollLength: 0, 
                          engineeringSpecs: { length: 0, width: 0, thickness: 0, weight: 0 }, technicalSpecs: [], tags: [], documents: []
                        });
                        setIsMaterialModalOpen(true);
                      }} className="bg-[var(--primary-yellow)] text-black px-6 py-2 text-[10px] font-black uppercase rounded hover:opacity-90 transition-all border-b-2 border-black">New Material +</button>
                  </div>
                </div>

                <div className="flex flex-1 overflow-x-auto no-scrollbar divide-x divide-white/5">
                  {/* Column 1: Divisions */}
                  <div className="w-64 shrink-0 flex flex-col bg-black/20">
                    <div className="p-4 border-b border-white/5 text-[9px] font-black uppercase text-slate-600 tracking-widest bg-black/40">1. Hub Division</div>
                    <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
                      {Object.keys(state.config.divisions).map(deptName => (
                        <button 
                          key={deptName} 
                          onClick={() => { setSelectedDept(deptName); setSelectedBrandId(null); setSelectedRangeId(null); setSelectedSeriesId(null); }}
                          className={`w-full text-left p-4 rounded transition-all group border-l-4 ${selectedDept === deptName ? 'bg-white/10 border-[var(--primary-yellow)] text-white' : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[12px] font-black uppercase tracking-tight">{deptName}</span>
                            <div onClick={(e) => { e.stopPropagation(); handleEditDept(deptName); }} className="opacity-0 group-hover:opacity-100 p-1 hover:text-[var(--primary-yellow)] transition-opacity">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </div>
                          </div>
                          <p className="text-[8px] font-black uppercase tracking-widest text-slate-600 truncate">{state.config.divisions[deptName].title}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Column 2: Partners (Brands) */}
                  <div className="w-64 shrink-0 flex flex-col bg-black/10">
                    <div className="p-4 border-b border-white/5 text-[9px] font-black uppercase text-slate-600 tracking-widest bg-black/40 flex justify-between">
                      <span>2. Partner Brand</span>
                      <button onClick={() => { setSelectedBrandId('new'); }} className="text-[var(--primary-yellow)] hover:underline">+</button>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
                      {state.brands.map(brand => (
                        <button 
                          key={brand.id} 
                          onClick={() => { setSelectedBrandId(brand.id); setSelectedRangeId(null); setSelectedSeriesId(null); }}
                          className={`w-full text-left p-4 rounded transition-all group border-l-4 ${selectedBrandId === brand.id ? 'bg-white/10 border-[var(--primary-yellow)] text-white' : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black/40 border border-white/5 flex items-center justify-center p-1 rounded-sm shrink-0">
                                {brand.logoData ? <img src={brand.logoData} className="max-w-full max-h-full object-contain filter brightness-125" /> : <div className="text-[6px]">NULL</div>}
                            </div>
                            <div className="min-w-0">
                                <span className="text-[12px] font-black uppercase tracking-tight block truncate">{brand.name}</span>
                                <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{state.ranges.filter(r => r.brandId === brand.id && r.department === selectedDept).length} Ranges</span>
                            </div>
                          </div>
                        </button>
                      ))}
                      {selectedBrandId === 'new' && (
                        <div className="p-4 bg-white/5 border-l-4 border-white rounded animate-in slide-in-from-top-2">
                           <input 
                              className="w-full bg-black border border-white/10 p-2 text-[10px] text-white rounded mb-2 font-black uppercase outline-none" 
                              placeholder="Brand Name" 
                              value={brandForm.name} 
                              onChange={e => setBrandForm({...brandForm, name: e.target.value})}
                           />
                           <div className="flex gap-2">
                             <button onClick={handleAddBrand} className="flex-1 bg-[var(--primary-yellow)] text-black py-2 text-[8px] font-black uppercase rounded">Synch</button>
                             <button onClick={() => setSelectedBrandId(null)} className="flex-1 bg-white/5 text-slate-500 py-2 text-[8px] font-black uppercase rounded">Cancel</button>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Column 3: Ranges */}
                  <div className="w-64 shrink-0 flex flex-col bg-black/5">
                    <div className="p-4 border-b border-white/5 text-[9px] font-black uppercase text-slate-600 tracking-widest bg-black/40 flex justify-between">
                      <span>3. Material Range</span>
                      {selectedBrandId && selectedBrandId !== 'new' && <button onClick={() => setSelectedRangeId('new')} className="text-[var(--primary-yellow)] hover:underline">+</button>}
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
                      {selectedBrandId && selectedBrandId !== 'new' ? (
                        <>
                          {state.ranges.filter(r => r.brandId === selectedBrandId && r.department === selectedDept).map(range => (
                            <button 
                              key={range.id} 
                              onClick={() => { setSelectedRangeId(range.id); setSelectedSeriesId(null); }}
                              className={`w-full text-left p-4 rounded transition-all group border-l-4 ${selectedRangeId === range.id ? 'bg-white/10 border-[var(--primary-yellow)] text-white' : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                            >
                                <span className="text-[12px] font-black uppercase tracking-tight block truncate">{range.name}</span>
                                <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{state.series.filter(s => s.rangeId === range.id).length} Series</span>
                            </button>
                          ))}
                          {selectedRangeId === 'new' && (
                            <div className="p-4 bg-white/5 border-l-4 border-white rounded animate-in slide-in-from-top-2">
                               <input 
                                  className="w-full bg-black border border-white/10 p-2 text-[10px] text-white rounded mb-2 font-black uppercase outline-none" 
                                  placeholder="Range Name" 
                                  value={rangeForm.name} 
                                  onChange={e => setRangeForm({...rangeForm, name: e.target.value})}
                               />
                               <div className="flex gap-2">
                                 <button onClick={handleAddRange} className="flex-1 bg-[var(--primary-yellow)] text-black py-2 text-[8px] font-black uppercase rounded">Synch</button>
                                 <button onClick={() => setSelectedRangeId(null)} className="flex-1 bg-white/5 text-slate-500 py-2 text-[8px] font-black uppercase rounded">Cancel</button>
                               </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="p-10 text-center opacity-20 text-[8px] font-black uppercase tracking-widest leading-relaxed">Select Partner To View Ranges</div>
                      )}
                    </div>
                  </div>

                  {/* Column 4: Series */}
                  <div className="w-64 shrink-0 flex flex-col bg-black/10">
                    <div className="p-4 border-b border-white/5 text-[9px] font-black uppercase text-slate-600 tracking-widest bg-black/40 flex justify-between">
                      <span>4. Specific Series</span>
                      {selectedRangeId && selectedRangeId !== 'new' && <button onClick={() => setSelectedSeriesId('new')} className="text-[var(--primary-yellow)] hover:underline">+</button>}
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar p-2 space-y-1">
                      {selectedRangeId && selectedRangeId !== 'new' ? (
                        <>
                          {state.series.filter(s => s.rangeId === selectedRangeId).map(series => (
                            <button 
                              key={series.id} 
                              onClick={() => setSelectedSeriesId(series.id)}
                              className={`w-full text-left p-4 rounded transition-all group border-l-4 ${selectedSeriesId === series.id ? 'bg-white/10 border-[var(--primary-yellow)] text-white' : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-300'}`}
                            >
                                <span className="text-[12px] font-black uppercase tracking-tight block truncate">{series.name}</span>
                                <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest">{(series.standardSizes || []).length} Specs</span>
                            </button>
                          ))}
                          {selectedSeriesId === 'new' && (
                            <div className="p-4 bg-white/5 border-l-4 border-white rounded animate-in slide-in-from-top-2">
                               <input 
                                  className="w-full bg-black border border-white/10 p-2 text-[10px] text-white rounded mb-2 font-black uppercase outline-none" 
                                  placeholder="Series Name" 
                                  value={seriesForm.name} 
                                  onChange={e => setSeriesForm({...seriesForm, name: e.target.value})}
                               />
                               <div className="flex gap-2">
                                 <button onClick={handleAddSeries} className="flex-1 bg-[var(--primary-yellow)] text-black py-2 text-[8px] font-black uppercase rounded">Synch</button>
                                 <button onClick={() => setSelectedSeriesId(null)} className="flex-1 bg-white/5 text-slate-500 py-2 text-[8px] font-black uppercase rounded">Cancel</button>
                               </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="p-10 text-center opacity-20 text-[8px] font-black uppercase tracking-widest leading-relaxed">Select Range To View Series</div>
                      )}
                    </div>
                  </div>

                  {/* Column 5: Specifications (Sizes) */}
                  <div className="flex-1 flex flex-col bg-black/20">
                    <div className="p-4 border-b border-white/5 text-[9px] font-black uppercase text-slate-600 tracking-widest bg-black/40">5. Spec Dimensions</div>
                    <div className="flex-1 overflow-y-auto no-scrollbar p-4">
                      {selectedSeriesId && selectedSeriesId !== 'new' ? (
                        <div className="space-y-6 animate-in fade-in duration-300">
                          <div className="flex gap-2">
                             <input 
                                className="flex-1 bg-black border border-white/10 p-3 text-[10px] text-white rounded font-black uppercase outline-none focus:border-[var(--primary-yellow)]" 
                                placeholder="Add Size (e.g. 2440 x 1220mm)" 
                                value={newSize} 
                                onChange={e => setNewSize(e.target.value)}
                             />
                             <button onClick={handleAddSize} className="bg-[var(--primary-yellow)] text-black px-6 text-[10px] font-black uppercase rounded">Add</button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {(state.series.find(s => s.id === selectedSeriesId)?.standardSizes || []).map((size, idx) => (
                              <div key={idx} className="bg-black/40 border border-white/5 p-3 flex justify-between items-center rounded group hover:border-white/10 transition-all">
                                <span className="text-[11px] font-black uppercase text-white tracking-tight">{size}</span>
                                <button onClick={() => handleRemoveSize(selectedSeriesId, size)} className="text-red-900 opacity-0 group-hover:opacity-100 hover:text-red-500 text-lg px-2 leading-none transition-all">&times;</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center opacity-20 text-[10px] font-black uppercase tracking-[0.4em] text-center px-10">Select Series To Modify Technical Specs</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Node Inspector Panel */}
                <div className="h-64 border-t border-white/10 bg-black/60 shrink-0 overflow-hidden flex flex-col">
                  <div className="p-3 border-b border-white/5 bg-black/40 text-[9px] font-black uppercase text-slate-600 tracking-[0.4em]">Node Asset Inspector</div>
                  <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                     {!selectedRangeId && selectedDept && (
                        <div className="flex flex-col md:flex-row gap-10 animate-in fade-in slide-in-from-bottom-2">
                           <div className="w-full md:w-64 space-y-3">
                              <h4 className="text-[10px] font-black uppercase text-white tracking-widest">{selectedDept} Visuals</h4>
                              <p className="text-[8px] text-slate-600 uppercase font-black leading-relaxed">Hero media cluster for this primary division hub.</p>
                              <input type="file" multiple id="deptHeroFiles" className="hidden" onChange={handleDeptHeroUpload} />
                              <button onClick={() => document.getElementById('deptHeroFiles')?.click()} className="w-full bg-[var(--primary-yellow)] text-black py-2.5 text-[9px] font-black uppercase rounded shadow-lg">Upload Hero +</button>
                           </div>
                           <div className="flex-1 flex gap-3 overflow-x-auto no-scrollbar">
                              {(state.config.hero.departmentHeroes[selectedDept] || []).map((media, idx) => (
                                <div key={idx} className="h-32 aspect-video bg-black rounded relative group shrink-0 border border-white/5 overflow-hidden">
                                  {media.type === 'image' ? <img src={media.url} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all" /> : <div className="w-full h-full flex items-center justify-center bg-black text-[8px] text-white">VIDEO</div>}
                                  <button onClick={() => {
                                      const newHeroes = (state.config.hero.departmentHeroes[selectedDept] || []).filter((_, i) => i !== idx);
                                      updateConfig(`hero.departmentHeroes.${selectedDept}`, newHeroes);
                                  }} className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                                </div>
                              ))}
                              {(state.config.hero.departmentHeroes[selectedDept] || []).length === 0 && <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 text-[9px] font-black uppercase text-slate-700 tracking-widest rounded">No Assets Registered</div>}
                           </div>
                        </div>
                     )}
                     {selectedRangeId && selectedRangeId !== 'new' && (
                        <div className="flex flex-col md:flex-row gap-10 animate-in fade-in slide-in-from-bottom-2">
                           <div className="w-full md:w-64 space-y-3">
                              <h4 className="text-[10px] font-black uppercase text-white tracking-widest">
                                {state.ranges.find(r => r.id === selectedRangeId)?.name} Range Visuals
                              </h4>
                              <p className="text-[8px] text-slate-600 uppercase font-black leading-relaxed">DNA imagery cluster for this specific technical range.</p>
                              <input type="file" multiple id="rangeHeroFiles" className="hidden" onChange={(e) => handleRangeHeroUpload(e, selectedRangeId)} />
                              <button onClick={() => document.getElementById('rangeHeroFiles')?.click()} className="w-full bg-white text-black py-2.5 text-[9px] font-black uppercase rounded shadow-lg">Upload Assets +</button>
                           </div>
                           <div className="flex-1 flex gap-3 overflow-x-auto no-scrollbar">
                              {(state.ranges.find(r => r.id === selectedRangeId)?.heroImages || []).map((img, idx) => (
                                <div key={idx} className="h-32 aspect-video bg-black rounded relative group shrink-0 border border-white/5 overflow-hidden">
                                  <img src={img} className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all" />
                                  <button onClick={() => {
                                      const newRanges = state.ranges.map(r => r.id === selectedRangeId ? { ...r, heroImages: r.heroImages.filter((_, i) => i !== idx) } : r);
                                      onUpdate({ ...state, ranges: newRanges });
                                  }} className="absolute top-2 right-2 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                                </div>
                              ))}
                              {(state.ranges.find(r => r.id === selectedRangeId)?.heroImages || []).length === 0 && <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 text-[9px] font-black uppercase text-slate-700 tracking-widest rounded">No Range Assets Registered</div>}
                           </div>
                        </div>
                     )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'catalog' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8 bg-[#111] p-10 border border-white/5 rounded-[var(--border-radius)] shadow-2xl">
                <div className="space-y-6 flex-1">
                   <h3 className="text-2xl font-black uppercase text-[var(--primary-yellow)] tracking-tight">Material Profile Repository</h3>
                   <div className="flex flex-wrap gap-3">
                      <button 
                        onClick={() => setCatalogFilter('All')}
                        className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm border ${catalogFilter === 'All' ? 'bg-[var(--primary-yellow)] text-black border-black shadow-lg' : 'text-slate-500 hover:text-white bg-white/5 border-white/10'}`}
                      >
                        All Materials
                      </button>
                      {Object.keys(state.config.divisions).map(dept => (
                        <button 
                          key={dept} 
                          onClick={() => setCatalogFilter(dept)}
                          className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-sm border ${catalogFilter === dept ? 'bg-white text-black border-white shadow-lg' : 'text-slate-500 hover:text-white bg-white/5 border-white/10'}`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                </div>
                <button 
                  onClick={() => {
                    const firstDept = Object.keys(state.config.divisions)[0] || '';
                    setEditingMaterial(null);
                    setMaterialForm({
                      id: '', sku: '', name: '', department: firstDept, category: '', brand: '', brandId: '', range: '', rangeId: '', series: '', seriesId: '', modelNumber: '',
                      density: 0, tempRange: '', description: '', inventoryNote: '', whatsappOverride: '', features: [], applications: [], standardSizes: [], variants: [],
                      media: [], pros: [], cons: [], price: 0, pricingType: (firstDept === 'Engineering Materials' || firstDept === 'Hardware') ? 'unit' : 'meter', fullRollLength: 0, 
                      engineeringSpecs: { length: 0, width: 0, thickness: 0, weight: 0 }, technicalSpecs: [], tags: [], documents: []
                    });
                    setIsMaterialModalOpen(true);
                  }}
                  className="bg-[var(--primary-yellow)] text-black px-12 py-4 text-xs font-black uppercase rounded-md shadow-2xl hover:scale-105 transition-all active:scale-95 border-b-4 border-black"
                >
                  Synchronize New Material Profile +
                </button>
              </div>

              <div className="bg-[#111] border border-white/5 rounded-[var(--border-radius)] overflow-x-auto no-scrollbar shadow-2xl">
                <table className="w-full text-left min-w-[1000px]">
                  <thead className="bg-black/60 text-[10px] font-black uppercase text-slate-500 border-b border-white/5">
                    <tr>
                      <th className="px-10 py-8">SKU / Technical Identifier</th>
                      <th className="px-10 py-8">Material Hub Specification</th>
                      <th className="px-10 py-8">Hierarchy Context</th>
                      <th className="px-10 py-8">Fulfillment Valuation</th>
                      <th className="px-10 py-8 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {state.materials.filter(m => catalogFilter === 'All' || m.department === catalogFilter).map(m => (
                      <tr key={m.id} className="hover:bg-white/[0.03] group transition-all">
                        <td className="px-10 py-8">
                          <p className="text-[10px] text-slate-500 font-black uppercase mb-1 tracking-widest">{m.sku}</p>
                          <p className="text-base text-white font-black uppercase tracking-tight">{m.name}</p>
                        </td>
                        <td className="px-10 py-8">
                          <span className="bg-white/5 border border-white/10 text-[9px] font-black uppercase text-white px-3 py-1.5 rounded-sm tracking-[0.2em]">{m.department}</span>
                        </td>
                        <td className="px-10 py-8">
                          <p className="text-[10px] text-white font-black uppercase tracking-widest">{m.brand || 'NULL_ORIGIN'}</p>
                          <p className="text-[10px] text-slate-600 uppercase font-black tracking-widest mt-1">{m.range || 'NO_RANGE'}</p>
                        </td>
                        <td className="px-10 py-8 whitespace-nowrap">
                          <p className="text-lg font-black text-[var(--primary-yellow)]">R {m.price.toLocaleString()} <span className="text-[9px] text-slate-500 opacity-80 uppercase ml-1">/{m.pricingType || 'unit'}</span></p>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <div className="flex justify-end gap-3">
                            <button onClick={() => { setEditingMaterial(m); setMaterialForm(m); setIsMaterialModalOpen(true); }} className="px-6 py-2 bg-white/5 text-[10px] font-black uppercase text-white hover:bg-white hover:text-black rounded-sm border border-white/10 transition-all">Modify</button>
                            <button onClick={() => { if(confirm('Purge this material?')) onUpdate({...state, materials: state.materials.filter(x => x.id !== m.id)}) }} className="text-red-900 text-[10px] font-black uppercase hover:text-red-500 transition-colors border border-red-900/20 px-4 py-2 rounded-sm">Terminate</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {state.materials.filter(m => catalogFilter === 'All' || m.department === catalogFilter).length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-40 text-center text-xs font-black uppercase text-slate-700 tracking-[0.5em]">No material profiles located in this hub segment.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'crm' && (
            <div className="flex flex-col xl:flex-row gap-12 min-h-[85vh] xl:h-[85vh]">
               <div className="w-full xl:w-[450px] bg-[#111] border border-white/5 rounded-[var(--border-radius)] overflow-y-auto shrink-0 divide-y divide-white/5 max-h-[400px] xl:max-h-none no-scrollbar shadow-2xl">
                 <div className="p-10 bg-black/40 border-b border-white/10 sticky top-0 z-10 backdrop-blur-md">
                   <h3 className="text-sm font-black uppercase text-[var(--primary-yellow)] tracking-[0.3em]">Operational Leads</h3>
                   <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => setCrmView('leads')}
                        className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest transition-all border ${crmView === 'leads' ? 'bg-[var(--primary-yellow)] text-black border-black' : 'bg-white/5 text-slate-500 border-white/10'}`}
                      >
                        Inquiries ({state.inquiries.length})
                      </button>
                      <button 
                        onClick={() => setCrmView('subscribers')}
                        className={`flex-1 py-2 text-[9px] font-black uppercase tracking-widest transition-all border ${crmView === 'subscribers' ? 'bg-[var(--primary-yellow)] text-black border-black' : 'bg-white/5 text-slate-500 border-white/10'}`}
                      >
                        Subscribers ({state.subscribers?.length || 0})
                      </button>
                   </div>
                 </div>

                 {crmView === 'leads' ? (
                   <>
                     {state.inquiries.length > 0 ? state.inquiries.map(iq => (
                       <button 
                        key={iq.id} 
                        onClick={() => setSelectedInquiryId(iq.id)} 
                        className={`w-full text-left p-10 transition-all border-l-8 ${selectedInquiryId === iq.id ? 'bg-white/5 border-[var(--primary-yellow)] shadow-2xl' : 'border-transparent hover:bg-white/[0.03]'}`}
                       >
                         <div className="flex justify-between items-start mb-3 gap-4">
                           <p className={`text-base font-black uppercase truncate flex-1 tracking-tight ${selectedInquiryId === iq.id ? 'text-white' : 'text-slate-300'}`}>{iq.fullName}</p>
                           <span className="text-[9px] font-black bg-white/10 text-slate-500 px-3 py-1 rounded-sm uppercase shrink-0 tracking-widest">
                             {iq.date ? new Date(iq.date).toLocaleDateString() : 'N/A'}
                           </span>
                         </div>
                         <p className="text-xs font-black text-[var(--primary-yellow)] uppercase tracking-widest mb-4 opacity-80">{iq.email}</p>
                         <div className="flex items-center gap-4 mt-2">
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white bg-black px-3 py-1.5 rounded-sm shrink-0 border border-white/5">
                              {iq.type}
                            </span>
                            <p className="text-[10px] text-slate-600 truncate flex-1 font-black uppercase tracking-widest">{iq.message}</p>
                         </div>
                       </button>
                     )) : (
                       <div className="py-40 text-center opacity-20">
                         <p className="text-xs font-black uppercase tracking-[0.5em]">No Strategic Leads Logged</p>
                       </div>
                     )}
                   </>
                 ) : (
                   <div className="p-0">
                      {(state.subscribers || []).length > 0 ? (state.subscribers || []).map(sub => (
                        <div key={sub.id} className="p-10 border-b border-white/5 flex justify-between items-center group hover:bg-white/5 transition-all">
                           <div className="space-y-1">
                              <p className="text-sm font-black text-white">{sub.email}</p>
                              <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">{new Date(sub.date).toLocaleString()}</p>
                           </div>
                           <button onClick={() => {
                              if(confirm('Expunge subscriber?')) onUpdate({...state, subscribers: state.subscribers.filter(s => s.id !== sub.id)});
                           }} className="text-red-900 opacity-0 group-hover:opacity-100 hover:text-red-500 font-black text-xl transition-all">&times;</button>
                        </div>
                      )) : (
                        <div className="py-40 text-center opacity-20">
                          <p className="text-xs font-black uppercase tracking-[0.5em]">Zero Subscriber Data</p>
                        </div>
                      )}
                   </div>
                 )}
               </div>

               <div className="flex-1 bg-[#111] border border-white/5 rounded-[var(--border-radius)] p-12 sm:p-20 overflow-y-auto flex flex-col no-scrollbar shadow-2xl">
                 {crmView === 'leads' && selectedInquiry ? (
                   <div className="space-y-16 animate-in fade-in duration-300">
                     <div className="flex flex-col sm:flex-row justify-between items-start border-b border-white/5 pb-12 gap-10">
                        <div className="space-y-4">
                          <h2 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tighter leading-none">{selectedInquiry.fullName}</h2>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
                            <p className="text-sm font-black text-[var(--primary-yellow)] uppercase tracking-[0.3em] truncate">{selectedInquiry.email}</p>
                            <span className="hidden sm:block w-2 h-2 rounded-full bg-slate-800"></span>
                            <p className="text-xs font-black text-slate-600 uppercase tracking-widest">Logged: {new Date(selectedInquiry.date).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-4 shrink-0">
                          <span className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.3em] rounded-sm shadow-xl ${selectedInquiry.status === 'New' ? 'bg-green-600/20 text-green-500 border border-green-600/30' : 'bg-blue-600/20 text-blue-500 border border-blue-600/30'}`}>
                            {selectedInquiry.status} Hub Lead
                          </span>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2 space-y-12">
                           <h4 className="text-xs font-black uppercase text-slate-600 tracking-[0.5em] flex items-center gap-4"><span className="w-10 h-1 bg-slate-800"></span> Primary Engagement Feed</h4>
                           <div className="bg-black/40 p-12 sm:p-16 border border-white/5 text-base sm:text-lg text-slate-300 whitespace-pre-wrap leading-relaxed rounded-[var(--border-radius)] shadow-inner">
                             {selectedInquiry.message}
                           </div>
                           
                           <div className="space-y-6">
                             <h4 className="text-xs font-black uppercase text-slate-600 tracking-[0.5em] flex items-center gap-4"><span className="w-10 h-1 bg-[var(--primary-yellow)]"></span> Internal Operational Notes</h4>
                             <textarea 
                               className="w-full bg-black border border-white/10 p-10 text-sm text-white h-64 font-bold rounded-[var(--border-radius)] focus:border-[var(--primary-yellow)] outline-none leading-relaxed shadow-inner" 
                               placeholder="Record technical feasibility, logistics obstacles, or CRM history for this client..."
                               value={selectedInquiry.adminNotes || ''} 
                               onChange={e => updateInquiryNotes(selectedInquiry.id, e.target.value)} 
                             />
                           </div>
                        </div>

                        <div className="space-y-10">
                           <h4 className="text-xs font-black uppercase text-slate-600 tracking-[0.5em]">Lead Diagnostics</h4>
                           <div className="bg-white/[0.02] border border-white/5 p-10 space-y-10 rounded-[var(--border-radius)] shadow-xl">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Inquiry Category</label>
                                 <p className="text-sm font-black text-white mt-1 uppercase tracking-widest">{selectedInquiry.type}</p>
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Unique Protocol ID</label>
                                 <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase break-all leading-relaxed">{selectedInquiry.id}</p>
                              </div>
                              <div className="pt-10 border-t border-white/5 flex flex-col gap-4">
                                 <button className="w-full bg-white text-black hover:bg-[var(--primary-yellow)] text-[10px] font-black uppercase tracking-[0.3em] py-5 transition-all rounded-md shadow-2xl">Generate Technical Response</button>
                                 <button className="w-full bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-[0.3em] py-5 border border-white/10 transition-all rounded-md">Mark Protocol Quoted</button>
                                 <button className="w-full text-red-900 hover:text-red-500 text-[10px] font-black uppercase tracking-[0.3em] py-5 border border-red-900/10 transition-all rounded-md">Terminate Lead</button>
                              </div>
                           </div>
                        </div>
                     </div>
                   </div>
                 ) : crmView === 'subscribers' ? (
                    <div className="h-full flex flex-col space-y-12 animate-in fade-in duration-300">
                      <div className="border-b border-white/5 pb-8">
                         <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Technical Mailing Registry</h2>
                         <p className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] mt-2">Active Digital Subscriptions // National Broadcast Network</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(state.subscribers || []).map(sub => (
                          <div key={sub.id} className="bg-black/40 border border-white/5 p-8 rounded-[var(--border-radius)] shadow-xl hover:border-[var(--primary-yellow)]/30 transition-all">
                             <div className="flex items-center gap-3 mb-4">
                               <div className="w-2 h-2 rounded-full bg-green-500"></div>
                               <span className="text-[9px] font-black uppercase text-slate-600 tracking-[0.4em]">SYNC_ACTIVE</span>
                             </div>
                             <p className="text-xl font-black text-white mb-2">{sub.email}</p>
                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Protocol ID: {sub.id.split('-')[0]}</p>
                             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Registry Date: {new Date(sub.date).toLocaleDateString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-slate-800 font-black uppercase tracking-[0.6em] text-center p-12">
                     <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-10 border border-white/10">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                     </div>
                     Select Strategic Lead From Inventory To Initiate Operational View
                   </div>
                 )}
               </div>
            </div>
          )}

          {activeTab === 'pages' && (
            <div className="space-y-16 animate-in fade-in duration-300">
              <div className="bg-[#111] p-8 sm:p-16 border border-white/5 rounded-[var(--border-radius)] shadow-2xl">
                 <SectionHeader title="Institutional Content Forge" subtitle="Manage static content blocks for auxiliary subpages" />
                 
                 <div className="space-y-20">
                   <section className="space-y-12">
                     <h4 className="text-sm font-black uppercase text-slate-400 tracking-[0.4em] flex items-center gap-4"><span className="w-10 h-1 bg-[var(--primary-yellow)]"></span> About Page Heritage Hub</h4>
                     <div className="grid lg:grid-cols-2 gap-16">
                       <div className="space-y-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Heritage Page Main Title</label>
                            <input className="w-full bg-black border border-white/10 p-4 text-sm text-white font-black rounded-md focus:border-[var(--primary-yellow)] outline-none" value={state.config.about.title} onChange={e => updateConfig('about.title', e.target.value)} />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Heritage Tagline / Subtitle</label>
                            <input className="w-full bg-black border border-white/10 p-4 text-sm text-white font-bold rounded-md focus:border-[var(--primary-yellow)] outline-none" value={state.config.about.subtitle} onChange={e => updateConfig('about.subtitle', e.target.value)} />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Corporate Legacy Narrative</label>
                            <textarea className="w-full bg-black border border-white/10 p-4 text-sm text-slate-400 h-64 rounded-md focus:border-[var(--primary-yellow)] outline-none leading-relaxed" value={state.config.about.content} onChange={e => updateConfig('about.content', e.target.value)} />
                         </div>
                       </div>
                       <div className="space-y-8">
                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Official Mission Statement</label>
                            <textarea className="w-full bg-black border border-white/10 p-4 text-sm text-white h-32 rounded-md focus:border-[var(--primary-yellow)] outline-none leading-relaxed font-bold italic" value={state.config.about.mission} onChange={e => updateConfig('about.mission', e.target.value)} />
                         </div>
                         <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Global Vision Prospectus</label>
                            <textarea className="w-full bg-black border border-white/10 p-4 text-sm text-slate-400 h-32 rounded-md focus:border-[var(--primary-yellow)] outline-none leading-relaxed" value={state.config.about.vision} onChange={e => updateConfig('about.vision', e.target.value)} />
                         </div>
                         <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Featured Heritage Asset</label>
                            <div className="flex gap-8 items-center bg-black/40 p-6 rounded-md border border-white/5">
                               <div className="w-40 h-40 bg-black border border-white/10 rounded-sm overflow-hidden flex items-center justify-center shrink-0 shadow-2xl">
                                  <img src={state.config.about.image} className="w-full h-full object-cover grayscale" alt="About" />
                               </div>
                               <div className="flex-1 space-y-4">
                                  <input type="file" id="aboutImageUpload" className="hidden" onChange={e => handleFileUpload(e, 'about.image')} />
                                  <button onClick={() => document.getElementById('aboutImageUpload')?.click()} className="w-full bg-white text-black py-4 text-xs font-black uppercase hover:bg-[var(--primary-yellow)] transition-all rounded-md shadow-lg">Replace Heritage Asset</button>
                                  <p className="text-[9px] text-slate-600 uppercase italic">Recommened Format: Wide-angle industrial landscape (16:9)</p>
                               </div>
                            </div>
                         </div>
                       </div>
                     </div>
                   </section>

                   <section className="space-y-12 pt-16 border-t-2 border-white/5">
                     <h4 className="text-sm font-black uppercase text-slate-400 tracking-[0.4em] flex items-center gap-4"><span className="w-10 h-1 bg-slate-800"></span> Privacy & Data Governance Vault</h4>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Legal Jurisprudence Narrative (Markdown Enabled)</label>
                        <textarea className="w-full bg-black border border-white/10 p-10 text-sm text-slate-300 h-[600px] leading-relaxed rounded-[var(--border-radius)] font-mono shadow-inner focus:border-[var(--primary-yellow)] outline-none" value={state.config.privacyPolicy} onChange={e => updateConfig('privacyPolicy', e.target.value)} />
                     </div>
                   </section>

                   <section className="space-y-12 pt-16 border-t-2 border-white/5">
                     <SectionHeader title="Institutional Evolution Timeline" subtitle="Maintain the chronological registry of strategic milestones" />
                     <div className="grid lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-1 space-y-8">
                           <p className="text-xs font-black uppercase text-slate-500 tracking-widest leading-relaxed">Define historical events to populate the corporate heritage roadmap section.</p>
                           <div className="space-y-4 bg-black/40 p-8 border border-white/5 rounded-md shadow-xl">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-slate-600">Event Epoch (Year)</label>
                                <input className="w-full bg-black border border-white/10 p-4 text-sm text-white font-black rounded-md" placeholder="e.g. 1994" value={newRoadmapItem.year} onChange={e => setNewRoadmapItem({...newRoadmapItem, year: e.target.value})} />
                              </div>
                              <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase text-slate-600">Milestone Narrative</label>
                                <textarea className="w-full bg-black border border-white/10 p-4 text-xs text-white h-24 rounded-md" placeholder="Technical milestone details..." value={newRoadmapItem.event} onChange={e => setNewRoadmapItem({...newRoadmapItem, event: e.target.value})} />
                              </div>
                              <button onClick={handleAddRoadmap} className="w-full bg-[var(--primary-yellow)] text-black py-4 text-xs font-black uppercase rounded-md shadow-2xl active:scale-95 transition-all">Archive Event Record</button>
                           </div>
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                           <h4 className="text-[10px] font-black uppercase text-slate-600 tracking-[0.4em]">Active Timeline Registry</h4>
                           <div className="space-y-4 max-h-[700px] overflow-y-auto no-scrollbar pr-4">
                              {state.config.about.roadmap.map((item, idx) => (
                                 <div key={idx} className="bg-black/60 p-8 border border-white/5 flex justify-between items-center rounded-md group hover:border-[var(--primary-yellow)] transition-all">
                                    <div className="flex gap-8 items-center">
                                       <span className="text-[var(--primary-yellow)] font-black text-lg sm:text-2xl tracking-tighter w-24 shrink-0">{item.year}</span>
                                       <p className="text-xs sm:text-sm text-white font-black uppercase leading-relaxed max-w-xl">{item.event}</p>
                                    </div>
                                    <button onClick={() => handleRemoveRoadmap(idx)} className="text-red-900 hover:text-red-500 font-black text-3xl px-4 transition-colors">&times;</button>
                                 </div>
                              ))}
                           </div>
                        </div>
                     </div>
                   </section>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-16 animate-in fade-in duration-300">
              <div className="bg-[#111] p-8 sm:p-16 border border-white/5 rounded-[var(--border-radius)] shadow-2xl">
                 <SectionHeader title="National Distribution Registry" subtitle="Synchronize contact parameters for the central hub and regional depots" />
                 
                 <div className="grid lg:grid-cols-2 gap-24">
                    <div className="space-y-16">
                       <section className="space-y-10">
                          <h4 className="text-sm font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-4"><span className="w-10 h-1 bg-[var(--primary-yellow)]"></span> Hub Identity & Comms</h4>
                          <div className="bg-black/40 p-10 border border-white/5 space-y-8 rounded-[var(--border-radius)] shadow-lg">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">National HQ Physical Address</label>
                               <input className="w-full bg-black border border-white/10 p-5 text-sm text-white font-black rounded-md outline-none focus:border-[var(--primary-yellow)]" value={state.config.contact.address} onChange={e => updateConfig('contact.address', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Global Switchboard Email</label>
                                  <input className="w-full bg-black border border-white/10 p-4 text-sm text-[var(--primary-yellow)] font-black rounded-md outline-none focus:border-[var(--primary-yellow)]" value={state.config.contact.email} onChange={e => updateConfig('contact.email', e.target.value)} />
                               </div>
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Central Voice Terminal</label>
                                  <input className="w-full bg-black border border-white/10 p-4 text-sm text-white font-black rounded-md outline-none focus:border-[var(--primary-yellow)]" value={state.config.contact.phone} onChange={e => updateConfig('contact.phone', e.target.value)} />
                               </div>
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Direct WhatsApp Node (Numeric Only)</label>
                                  <input className="w-full bg-black border border-white/10 p-4 text-sm text-green-500 font-black rounded-md outline-none focus:border-green-400" value={state.config.contact.whatsapp} onChange={e => updateConfig('contact.whatsapp', e.target.value)} placeholder="e.g. 27115550100" />
                               </div>
                            </div>
                          </div>
                       </section>

                       <section className="space-y-10 pt-10 border-t-2 border-white/5">
                          <h4 className="text-sm font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-4"><span className="w-10 h-1 bg-slate-800"></span> Geospatial Registry Hub</h4>
                          <div className="bg-black/40 p-10 border border-white/5 space-y-8 rounded-[var(--border-radius)] shadow-lg">
                            <div className="grid grid-cols-2 gap-8">
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Hub Latitude</label>
                                  <input type="number" step="any" className="w-full bg-black border border-white/10 p-4 text-sm text-white font-mono rounded-md outline-none focus:border-[var(--primary-yellow)]" value={state.config.contact.lat} onChange={e => updateConfig('contact.lat', parseFloat(e.target.value))} />
                               </div>
                               <div className="space-y-3">
                                  <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Hub Longitude</label>
                                  <input type="number" step="any" className="w-full bg-black border border-white/10 p-4 text-sm text-white font-mono rounded-md outline-none focus:border-[var(--primary-yellow)]" value={state.config.contact.lng} onChange={e => updateConfig('contact.lng', parseFloat(e.target.value))} />
                               </div>
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Google Maps Synthesis Endpoint (Embed URL)</label>
                               <input className="w-full bg-black border border-white/10 p-4 text-xs text-slate-500 font-mono rounded-md outline-none focus:border-[var(--primary-yellow)]" value={state.config.contact.googleMapsEmbedUrl} onChange={e => updateConfig('contact.googleMapsEmbedUrl', e.target.value)} placeholder="https://www.google.com/maps/embed?..." />
                            </div>
                          </div>
                       </section>
                    </div>

                    <div className="space-y-16">
                       <section className="space-y-10">
                          <h4 className="text-sm font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-4"><span className="w-10 h-1 bg-red-900"></span> Emergency Dispatch Hotline</h4>
                          <div className="bg-black/40 p-10 border border-white/5 space-y-8 rounded-[var(--border-radius)] shadow-lg">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Hotline Label Identifier</label>
                               <input className="w-full bg-black border border-white/10 p-5 text-sm text-white font-black rounded-md outline-none focus:border-[var(--primary-yellow)]" value={state.config.emergency.label} onChange={e => updateConfig('emergency.label', e.target.value)} />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Direct Hotline Protocol Number</label>
                               <input className="w-full bg-black border border-white/10 p-6 text-2xl text-[var(--primary-yellow)] font-black rounded-md outline-none focus:border-[var(--primary-yellow)] tracking-tighter shadow-2xl" value={state.config.emergency.number} onChange={e => updateConfig('emergency.number', e.target.value)} />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Emergency Tactical Description</label>
                               <textarea className="w-full bg-black border border-white/10 p-5 text-sm text-slate-400 h-32 rounded-md outline-none leading-relaxed" value={state.config.emergency.desc} onChange={e => updateConfig('emergency.desc', e.target.value)} />
                            </div>
                          </div>
                       </section>

                       <section className="space-y-10 pt-10 border-t-2 border-white/5">
                          <h4 className="text-sm font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-4"><span className="w-10 h-1 bg-slate-800"></span> Portal Engagement Meta</h4>
                          <div className="bg-black/40 p-10 border border-white/5 space-y-8 rounded-[var(--border-radius)] shadow-lg">
                            <div className="space-y-3">
                               <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Technical Portal CTA Title</label>
                               <input className="w-full bg-black border border-white/10 p-5 text-base text-white font-black uppercase rounded-md outline-none focus:border-[var(--primary-yellow)]" value={state.config.contact.formHeading} onChange={e => updateConfig('contact.formHeading', e.target.value)} />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[10px] font-black uppercase text-slate-600 tracking-widest">Portal Navigational Instructions</label>
                               <textarea className="w-full bg-black border border-white/10 p-5 text-sm text-slate-400 h-32 rounded-md outline-none leading-relaxed" value={state.config.contact.formSubtext} onChange={e => updateConfig('contact.formSubtext', e.target.value)} />
                            </div>
                          </div>
                       </section>
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Enlarged Material Profile Modal */}
      {isMaterialModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 sm:p-12 bg-black/98 backdrop-blur-3xl">
           <div className="bg-[#0c0c0c] border-2 border-[var(--primary-yellow)]/20 w-full max-w-[1400px] rounded-[var(--border-radius)] shadow-[0_0_100px_rgba(255,214,0,0.1)] flex flex-col max-h-[95vh] animate-in zoom-in duration-300">
              <div className="p-10 sm:p-16 border-b border-white/5 flex justify-between items-center bg-[#111] shrink-0">
                 <div className="flex items-center gap-8">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--primary-yellow)] flex items-center justify-center rounded-[var(--border-radius)] shadow-2xl">
                       <span className="text-black font-black text-3xl">DNA</span>
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-4xl font-black uppercase text-white tracking-tighter leading-none">Material Specification Forge</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[10px] font-black text-[var(--primary-yellow)] uppercase tracking-[0.4em]">Protocol Sequence Active</span>
                        <span className="w-2 h-2 rounded-full bg-[var(--primary-yellow)] animate-ping"></span>
                      </div>
                    </div>
                 </div>
                 <button onClick={() => { setIsMaterialModalOpen(false); setEditingVariantIndex(null); }} className="text-4xl sm:text-6xl text-slate-600 hover:text-white transition-colors leading-none">&times;</button>
              </div>
              
              <form onSubmit={handleSaveMaterial} className="flex-1 overflow-y-auto p-10 sm:p-20 space-y-20 no-scrollbar">
                 <section className="space-y-12">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b-2 border-white/5 pb-4 gap-6">
                       <div>
                          <h4 className="text-sm font-black uppercase text-[var(--primary-yellow)] tracking-[0.3em]">1. Identity & Hub Allocation</h4>
                          <p className="text-[10px] text-slate-600 uppercase font-black mt-1">Classify the substrate within the national fulfillment architecture</p>
                       </div>
                       <div className="flex gap-4 flex-wrap sm:justify-end">
                          {Object.keys(state.config.divisions).map(dept => (
                            <button 
                              key={dept}
                              type="button"
                              onClick={() => {
                                const newPricingType = (dept === 'Engineering Materials' || dept === 'Hardware') ? 'unit' : 'meter';
                                setMaterialForm({...materialForm, department: dept, rangeId: '', seriesId: '', pricingType: newPricingType});
                              }}
                              className={`px-6 py-2.5 text-[10px] font-black uppercase border transition-all rounded-sm tracking-widest ${materialForm.department === dept ? 'bg-[var(--primary-yellow)] text-black border-black shadow-xl' : 'text-slate-500 border-white/10 hover:border-white bg-white/5'}`}
                            >
                               {dept}
                            </button>
                          ))}
                       </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                       <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">HUB PROTOCOL SKU</label>
                          <input className="w-full bg-black border border-white/10 p-5 text-base text-white uppercase font-mono rounded-md focus:border-[var(--primary-yellow)] outline-none shadow-inner" value={materialForm.sku} onChange={e => setMaterialForm({...materialForm, sku: e.target.value})} placeholder="e.g. IP-SPEC-X01" />
                       </div>
                       <div className="space-y-3 sm:col-span-2">
                          <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">NOMINAL SUBSTRATE NAME</label>
                          <input className="w-full bg-black border border-white/10 p-5 text-base text-white uppercase font-black rounded-md focus:border-[var(--primary-yellow)] outline-none shadow-inner" value={materialForm.name} onChange={e => setMaterialForm({...materialForm, name: e.target.value})} placeholder="e.g. ULTRA-IMPACT POLYCARBONATE" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">MANUFACTURER / BRAND ORIGIN</label>
                          <select 
                            className="w-full bg-black border border-white/10 p-5 text-sm text-white uppercase font-black rounded-md focus:border-[var(--primary-yellow)] outline-none appearance-none cursor-pointer" 
                            value={materialForm.brandId} 
                            onChange={e => setMaterialForm({...materialForm, brandId: e.target.value, rangeId: '', seriesId: ''})}
                          >
                            <option value="">AUTHENTICATED BRAND...</option>
                            {state.brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                          </select>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">FUNCTIONAL RANGE</label>
                          <select 
                            className="w-full bg-black border border-white/10 p-5 text-sm text-white uppercase font-black rounded-md focus:border-[var(--primary-yellow)] outline-none appearance-none cursor-pointer" 
                            value={materialForm.rangeId} 
                            onChange={e => setMaterialForm({...materialForm, rangeId: e.target.value, seriesId: ''})}
                          >
                            <option value="">SELECT RANGE...</option>
                            {state.ranges
                              .filter(r => r.brandId === materialForm.brandId && r.department === materialForm.department)
                              .map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                          </select>
                       </div>
                       <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">SPECIFIC SERIES</label>
                          <select 
                            className="w-full bg-black border border-white/10 p-5 text-sm text-white uppercase font-black rounded-md focus:border-[var(--primary-yellow)] outline-none appearance-none cursor-pointer" 
                            value={materialForm.seriesId} 
                            onChange={e => setMaterialForm({...materialForm, seriesId: e.target.value})}
                          >
                            <option value="">SELECT SERIES...</option>
                            {state.series
                              .filter(s => s.rangeId === materialForm.rangeId)
                              .map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                       </div>
                       
                       <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">
                             {materialForm.pricingType === 'meter' ? 'Valuation / Running Meter (ZAR)' : 'Valuation / Static Unit (ZAR)'}
                          </label>
                          <input type="number" step="any" className="w-full bg-black border border-white/10 p-5 text-2xl text-[var(--primary-yellow)] font-black rounded-md outline-none shadow-2xl" value={materialForm.price} onChange={e => setMaterialForm({...materialForm, price: parseFloat(e.target.value)})} placeholder="0.00" />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                          <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Substrate Taxonomy Tags (Comma Separated)</label>
                          <textarea 
                            className="w-full bg-black border border-white/10 p-5 text-sm text-white h-24 font-bold rounded-md outline-none focus:border-[var(--primary-yellow)]" 
                            placeholder="e.g. CHEMICAL_RESISTANT, FOOD_GRADE, UV_STABLE"
                            value={materialForm.tags.join(', ')} 
                            onChange={e => setMaterialForm({...materialForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})} 
                          />
                      </div>
                      <div className="space-y-4">
                          <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Exclusive WhatsApp Lead Terminal (Optional)</label>
                          <input className="w-full bg-black border border-white/10 p-5 text-sm text-white font-black rounded-md outline-none focus:border-[var(--primary-yellow)]" value={materialForm.whatsappOverride || ''} onChange={e => setMaterialForm({...materialForm, whatsappOverride: e.target.value})} placeholder="e.g. 27115550100" />
                          <p className="text-[9px] text-slate-600 uppercase italic">Overrides the national switchboard number for this specific profile</p>
                      </div>
                    </div>

                    {/* Verified Substrate Variants Section */}
                    <div className="mt-12 p-10 border-t-2 border-white/5 space-y-10">
                       <div className="flex justify-between items-center">
                          <h4 className="text-sm font-black uppercase text-[var(--primary-yellow)] tracking-[0.3em]">Verified Substrate Variants</h4>
                          <button type="button" onClick={handleAddVariant} className="bg-white text-black px-4 py-2 text-[9px] font-black uppercase rounded shadow-lg hover:bg-[var(--primary-yellow)] transition-all">Add Custom Variant +</button>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="md:col-span-1 space-y-2 max-h-[500px] overflow-y-auto no-scrollbar pr-2">
                             {materialForm.variants.map((v, idx) => (
                               <div 
                                 key={v.id || idx}
                                 className={`p-4 border-l-4 transition-all cursor-pointer group flex justify-between items-center ${editingVariantIndex === idx ? 'bg-white/10 border-[var(--primary-yellow)]' : 'bg-black/40 border-transparent hover:bg-white/5'}`}
                                 onClick={() => setEditingVariantIndex(idx)}
                               >
                                  <div className="flex items-center gap-3 min-w-0">
                                     {v.mediaOverride?.[0] && (
                                       <div className="w-8 h-8 rounded bg-black overflow-hidden border border-white/10 shrink-0">
                                          <img src={v.mediaOverride[0].url} className="w-full h-full object-cover" alt="Variant Thumb" />
                                       </div>
                                     )}
                                     <div className="min-w-0">
                                        <p className="text-[10px] font-black text-white uppercase truncate">{v.value}</p>
                                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{v.type}</p>
                                     </div>
                                  </div>
                                  <button type="button" onClick={(e) => {
                                    e.stopPropagation();
                                    const newVariants = [...materialForm.variants];
                                    newVariants.splice(idx, 1);
                                    setMaterialForm({...materialForm, variants: newVariants});
                                    if(editingVariantIndex === idx) setEditingVariantIndex(null);
                                  }} className="text-red-900 group-hover:text-red-500 font-black text-xl transition-colors">&times;</button>
                               </div>
                             ))}
                             {materialForm.variants.length === 0 && <div className="py-8 text-center border border-dashed border-white/10 text-[9px] font-black uppercase text-slate-700 rounded tracking-[0.3em]">No Variants Defined</div>}
                          </div>

                          <div className="md:col-span-2">
                             {editingVariantIndex !== null && materialForm.variants[editingVariantIndex] ? (
                               <div className="bg-white/[0.02] border border-white/10 p-8 space-y-6 rounded-md animate-in fade-in slide-in-from-right-2 duration-300">
                                  <div className="grid grid-cols-2 gap-6">
                                     <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-slate-500">Variant Classification</label>
                                        <select 
                                          className="w-full bg-black border border-white/10 p-3 text-[11px] text-white font-black uppercase rounded outline-none" 
                                          value={materialForm.variants[editingVariantIndex].type}
                                          onChange={e => {
                                            const updated = [...materialForm.variants];
                                            updated[editingVariantIndex].type = e.target.value as any;
                                            setMaterialForm({...materialForm, variants: updated});
                                          }}
                                        >
                                           <option value="thickness">Thickness</option>
                                           <option value="color">Color</option>
                                           <option value="model">Model</option>
                                           <option value="size">Size</option>
                                        </select>
                                     </div>
                                     <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-slate-500">Nominal Value</label>
                                        <input 
                                          className="w-full bg-black border border-white/10 p-3 text-[11px] text-white font-black uppercase rounded outline-none" 
                                          value={materialForm.variants[editingVariantIndex].value}
                                          onChange={e => {
                                            const updated = [...materialForm.variants];
                                            updated[editingVariantIndex].value = e.target.value;
                                            setMaterialForm({...materialForm, variants: updated});
                                          }}
                                        />
                                     </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-6">
                                     <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-slate-500">SKU Identifier Override</label>
                                        <input 
                                          className="w-full bg-black border border-white/10 p-3 text-[11px] text-white font-mono uppercase rounded outline-none" 
                                          value={materialForm.variants[editingVariantIndex].skuOverride || ''}
                                          onChange={e => {
                                            const updated = [...materialForm.variants];
                                            updated[editingVariantIndex].skuOverride = e.target.value;
                                            setMaterialForm({...materialForm, variants: updated});
                                          }}
                                        />
                                     </div>
                                     <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase text-slate-500">Price Override (ZAR)</label>
                                        <input 
                                          type="number"
                                          className="w-full bg-black border border-white/10 p-3 text-[11px] text-[var(--primary-yellow)] font-black rounded outline-none" 
                                          value={materialForm.variants[editingVariantIndex].priceOverride || 0}
                                          onChange={e => {
                                            const updated = [...materialForm.variants];
                                            updated[editingVariantIndex].priceOverride = parseFloat(e.target.value);
                                            setMaterialForm({...materialForm, variants: updated});
                                          }}
                                        />
                                     </div>
                                  </div>
                                  <div className="space-y-2">
                                     <label className="text-[9px] font-black uppercase text-slate-500">Technical Description Override</label>
                                     <textarea 
                                       className="w-full bg-black border border-white/10 p-4 text-[10px] text-slate-400 h-24 rounded outline-none leading-relaxed" 
                                       value={materialForm.variants[editingVariantIndex].descriptionOverride || ''}
                                       onChange={e => {
                                         const updated = [...materialForm.variants];
                                         updated[editingVariantIndex].descriptionOverride = e.target.value;
                                         setMaterialForm({...materialForm, variants: updated});
                                       }}
                                     />
                                  </div>
                                  <div className="space-y-4">
                                     <div className="flex justify-between items-center bg-black/40 p-4 border border-white/5 rounded">
                                        <div>
                                          <label className="text-[9px] font-black uppercase text-[var(--primary-yellow)] tracking-widest block">Variant Visual Assets</label>
                                          <p className="text-[8px] text-slate-600 uppercase mt-1">Assign unique media for this specific variant</p>
                                        </div>
                                        <input type="file" multiple accept="image/*,video/*" id="variantMediaFiles" className="hidden" onChange={e => handleMediaUpload(e, 'variant')} />
                                        <button type="button" onClick={() => document.getElementById('variantMediaFiles')?.click()} className="text-[9px] font-black uppercase text-black bg-white px-4 py-2 hover:bg-[var(--primary-yellow)] transition-all rounded shadow-lg">Upload Media +</button>
                                     </div>
                                     <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                        {(materialForm.variants[editingVariantIndex].mediaOverride || []).map((m, i) => (
                                          <div key={i} className="w-20 h-20 bg-black border border-white/10 rounded flex-shrink-0 relative group shadow-lg">
                                            {m.type === 'image' ? <img src={m.url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" /> : <div className="w-full h-full flex items-center justify-center text-[8px] font-black uppercase text-slate-600">Video</div>}
                                            <button type="button" onClick={() => {
                                              const updated = [...materialForm.variants];
                                              updated[editingVariantIndex].mediaOverride = (updated[editingVariantIndex].mediaOverride || []).filter((_, idx) => idx !== i);
                                              setMaterialForm({...materialForm, variants: updated});
                                            }} className="absolute top-1 right-1 bg-red-600 text-white rounded-sm w-5 h-5 text-[10px] font-black flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">X</button>
                                          </div>
                                        ))}
                                     </div>
                                  </div>
                               </div>
                             ) : (
                               <div className="h-full flex items-center justify-center border border-dashed border-white/5 text-[10px] font-black uppercase text-slate-700 tracking-[0.4em] p-10 text-center leading-relaxed">Select Or Create Variant To Define Overrides</div>
                             )}
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4 bg-[var(--primary-yellow)]/5 p-10 border-l-[12px] border-[var(--primary-yellow)] rounded-md shadow-inner">
                        <label className="text-[11px] font-black uppercase text-[var(--primary-yellow)] tracking-[0.3em]">Profile-Specific Fulfillment Disclaimer</label>
                        <textarea 
                          className="w-full bg-black border border-white/10 p-5 text-sm text-white h-32 rounded-md focus:border-[var(--primary-yellow)] outline-none leading-relaxed" 
                          placeholder="Provide inventory context specific to this material (e.g. limited master roll stock in Cape Town)..."
                          value={materialForm.inventoryNote || ''} 
                          onChange={e => setMaterialForm({...materialForm, inventoryNote: e.target.value})} 
                        />
                    </div>

                    <div className="mt-12 p-12 bg-white/[0.02] border border-white/5 rounded-md shadow-2xl animate-in fade-in duration-500">
                       {materialForm.department === 'Signage Materials' && (
                          <div className="space-y-10">
                             <div className="space-y-6">
                                <h5 className="text-sm font-black uppercase text-slate-400 tracking-[0.4em] flex items-center gap-4"><span className="w-10 h-1 bg-slate-700"></span> Signage Matrix Specification</h5>
                                <div className="flex gap-6 max-w-xl">
                                    {(['unit', 'meter'] as PricingType[]).map(pt => (
                                      <button 
                                          key={pt}
                                          type="button"
                                          onClick={() => setMaterialForm({...materialForm, pricingType: pt})}
                                          className={`flex-1 py-4 text-[11px] font-black uppercase border tracking-[0.3em] transition-all rounded-md ${materialForm.pricingType === pt ? 'bg-[var(--primary-yellow)] text-black border-black shadow-2xl' : 'bg-black text-slate-500 border-white/10 hover:border-white'}`}
                                      >
                                          {pt === 'unit' ? 'Static Unit' : 'Running Meter'}
                                      </button>
                                    ))}
                                </div>
                             </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 max-w-4xl">
                               <div className="space-y-3">
                                  <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Fulfillment Width (mm)</label>
                                  <input 
                                      type="number" 
                                      className="w-full bg-black border border-white/10 p-5 text-base text-white font-black rounded-md outline-none focus:border-[var(--primary-yellow)]" 
                                      value={materialForm.engineeringSpecs?.width || 0}
                                      onChange={e => setMaterialForm({...materialForm, engineeringSpecs: { ...materialForm.engineeringSpecs!, width: parseFloat(e.target.value) }})}
                                      placeholder="e.g. 1524"
                                  />
                               </div>
                               <div className="space-y-3">
                                  <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Full Master Roll Index (m)</label>
                                  <input 
                                      type="number" 
                                      className="w-full bg-black border border-white/10 p-5 text-base text-[var(--primary-yellow)] font-black rounded-md outline-none focus:border-[var(--primary-yellow)] shadow-inner" 
                                      value={materialForm.fullRollLength || 0}
                                      onChange={e => setMaterialForm({...materialForm, fullRollLength: parseFloat(e.target.value) || 0})}
                                      placeholder="e.g. 50"
                                  />
                               </div>
                             </div>
                          </div>
                       )}

                       {(materialForm.department === 'Engineering Materials' || materialForm.department === 'Hardware') && (
                          <div className="space-y-10">
                             <h5 className="text-sm font-black uppercase text-slate-400 tracking-[0.4em] flex items-center gap-4"><span className="w-10 h-1 bg-[var(--primary-yellow)]"></span> Engineering Dimension Matrix</h5>
                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
                                <div className="space-y-3">
                                   <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Length (mm)</label>
                                   <input 
                                      type="number" 
                                      className="w-full bg-black border border-white/10 p-5 text-base text-white font-black rounded-md outline-none shadow-inner" 
                                      value={materialForm.engineeringSpecs?.length || 0}
                                      onChange={e => setMaterialForm({...materialForm, engineeringSpecs: { ...materialForm.engineeringSpecs!, length: parseFloat(e.target.value) }})}
                                   />
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Width (mm)</label>
                                   <input 
                                      type="number" 
                                      className="w-full bg-black border border-white/10 p-5 text-base text-white font-black rounded-md outline-none shadow-inner" 
                                      value={materialForm.engineeringSpecs?.width || 0}
                                      onChange={e => setMaterialForm({...materialForm, engineeringSpecs: { ...materialForm.engineeringSpecs!, width: parseFloat(e.target.value) }})}
                                   />
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Thickness (mm)</label>
                                   <input 
                                      type="number" 
                                      className="w-full bg-black border border-white/10 p-5 text-base text-white font-black rounded-md outline-none shadow-inner" 
                                      value={materialForm.engineeringSpecs?.thickness || 0}
                                      onChange={e => setMaterialForm({...materialForm, engineeringSpecs: { ...materialForm.engineeringSpecs!, thickness: parseFloat(e.target.value) }})}
                                   />
                                </div>
                                <div className="space-y-3">
                                   <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Mass / Weight (KG)</label>
                                   <input 
                                      type="number" 
                                      className="w-full bg-black border border-white/10 p-5 text-2xl text-[var(--primary-yellow)] font-black rounded-md outline-none shadow-2xl" 
                                      value={materialForm.engineeringSpecs?.weight || 0}
                                      onChange={e => setMaterialForm({...materialForm, engineeringSpecs: { ...materialForm.engineeringSpecs!, weight: parseFloat(e.target.value) }})}
                                   />
                                </div>
                             </div>
                          </div>
                       )}
                    </div>
                 </section>

                 <section className="space-y-12">
                    <h4 className="text-sm font-black uppercase text-[var(--primary-yellow)] border-b-2 border-white/5 pb-4 tracking-[0.3em]">2. Hub Narrative & Performance</h4>
                    <div className="space-y-4">
                       <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Hub Narrative Description</label>
                       <textarea className="w-full bg-black border border-white/10 p-6 text-sm text-slate-300 h-32 leading-relaxed rounded-md focus:border-[var(--primary-yellow)] outline-none shadow-inner" value={materialForm.description} onChange={e => setMaterialForm({...materialForm, description: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                       <div className="space-y-6">
                          <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-3"><span className="w-1 h-4 bg-green-500"></span> Technical Pros / Advantages</label>
                          <textarea className="w-full bg-black border border-white/10 p-5 text-sm text-white h-44 rounded-md focus:border-green-900 outline-none leading-relaxed" value={materialForm.features.join('\n')} onChange={e => setMaterialForm({...materialForm, features: e.target.value.split('\n')})} placeholder="Enter one technical advantage per line..." />
                       </div>
                       <div className="space-y-6">
                          <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-3"><span className="w-1 h-4 bg-red-900"></span> Operational Limitations / Cons</label>
                          <textarea className="w-full bg-black border border-white/10 p-5 text-sm text-slate-400 h-44 rounded-md focus:border-red-900 outline-none leading-relaxed" value={materialForm.cons.join('\n')} onChange={e => setMaterialForm({...materialForm, cons: e.target.value.split('\n')})} placeholder="Enter one material limitation per line..." />
                       </div>
                    </div>
                 </section>

                 <section className="space-y-12">
                    <h4 className="text-sm font-black uppercase text-[var(--primary-yellow)] border-b-2 border-white/5 pb-4 tracking-[0.3em]">3. Multi-Modality Asset Repository</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                       <div className="space-y-8">
                          <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Visual Asset Library (High Res Only)</label>
                          <div className="flex gap-4">
                             <input type="file" multiple accept="image/*,video/*" id="mediaFiles" className="hidden" onChange={handleMediaUpload} />
                             <button type="button" onClick={() => document.getElementById('mediaFiles')?.click()} className="w-full bg-white text-black py-6 text-xs font-black uppercase hover:bg-[var(--primary-yellow)] transition-all rounded-md shadow-2xl">Inject Visual DNA +</button>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                             {materialForm.media.map((m, i) => (
                               <div key={i} className="relative aspect-square border-2 border-white/5 group overflow-hidden rounded-md shadow-lg bg-black">
                                  {m.type === 'image' ? <img src={m.url} className="w-full h-full object-cover grayscale opacity-60 hover:opacity-100 group-hover:grayscale-0 transition-all duration-700" alt="Substrate" /> : <div className="w-full h-full flex items-center justify-center bg-black text-[10px] font-black text-slate-500 uppercase tracking-widest">Video Hub</div>}
                                  <div className="absolute inset-0 bg-red-900/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm">
                                    <button type="button" onClick={() => {
                                      const newMedia = [...materialForm.media];
                                      newMedia.splice(i, 1);
                                      setMaterialForm({...materialForm, media: newMedia});
                                    }} className="text-[10px] font-black uppercase text-white border-2 border-white px-6 py-2 hover:bg-white hover:text-red-900 transition-all">Expunge</button>
                                  </div>
                               </div>
                             ))}
                             {materialForm.media.length === 0 && (
                               <div className="col-span-full py-16 text-center border-2 border-dashed border-white/5 text-[10px] font-black uppercase text-slate-700 tracking-[0.4em] rounded-md">No visual documentation found.</div>
                             )}
                          </div>
                       </div>
                       <div className="space-y-8">
                          <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Documentation Vault (TDS / MSDS / CoC)</label>
                          <div className="flex gap-4">
                             <input type="file" id="docFiles" className="hidden" onChange={handleDocUpload} />
                             <button type="button" onClick={() => document.getElementById('docFiles')?.click()} className="w-full bg-white/5 border border-white/10 py-6 text-xs font-black uppercase text-white hover:bg-white/10 transition rounded-md shadow-lg">Deposit Document +</button>
                          </div>
                          <div className="space-y-4 pt-4 max-h-[400px] overflow-y-auto no-scrollbar pr-4">
                             {materialForm.documents.map((doc, i) => (
                               <div key={i} className="flex justify-between items-center bg-black border border-white/5 p-6 text-xs font-black uppercase tracking-[0.1em] rounded-md shadow-inner group hover:border-[var(--primary-yellow)]/30 transition-all">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-sm">
                                        <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 18h12V6h-4V2H4v16zm4-7h4v2H8v-2zm0-4h4v2H8V7z"/></svg>
                                     </div>
                                     <span className="text-white truncate max-w-xs">{doc.name}</span>
                                  </div>
                                  <button type="button" onClick={() => {
                                    const newDocs = [...materialForm.documents];
                                    newDocs.splice(i, 1);
                                    setMaterialForm({...materialForm, documents: newDocs});
                                  }} className="text-red-900 hover:text-red-500 font-black text-2xl transition-colors">&times;</button>
                               </div>
                             ))}
                             {materialForm.documents.length === 0 && (
                               <div className="py-16 text-center border-2 border-dashed border-white/5 text-[10px] font-black uppercase text-slate-700 tracking-[0.4em] rounded-md">Legal documentation vault empty.</div>
                             )}
                          </div>
                       </div>
                    </div>
                 </section>
              </form>
              
              <div className="p-10 sm:p-20 border-t-4 border-[var(--primary-yellow)] bg-[#111] flex flex-col sm:flex-row justify-end gap-8 shrink-0 shadow-2xl">
                 <button type="button" onClick={() => { setIsMaterialModalOpen(false); setEditingVariantIndex(null); }} className="px-12 py-5 text-xs font-black uppercase text-slate-500 hover:text-white transition-all rounded-md order-2 sm:order-1">Abort Profile Forge</button>
                 <button type="button" onClick={handleSaveMaterial} className="bg-[var(--primary-yellow)] text-black px-24 py-5 text-sm font-black uppercase shadow-[0_0_50px_rgba(255,214,0,0.2)] hover:scale-[1.03] transition-all border-b-8 border-black active:scale-95 rounded-md order-1 sm:order-2">Synchronize Substrate DNA</button>
              </div>
           </div>
        </div>
      )}

      {/* Enlarged Dept Modal */}
      {isDeptModalOpen && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-6 sm:p-12 bg-black/95 backdrop-blur-3xl">
              <div className="bg-[#111] border-2 border-[var(--primary-yellow)]/30 w-full max-w-2xl rounded-[var(--border-radius)] shadow-[0_0_80px_rgba(255,214,0,0.1)] overflow-hidden animate-in zoom-in duration-300">
                  <div className="p-10 border-b border-white/5 flex justify-between items-center bg-black/20">
                      <h3 className="text-xl sm:text-3xl font-black uppercase text-white tracking-tighter leading-none">{editingDeptName ? `Modify ${editingDeptName}` : 'Forge New Hub Division'}</h3>
                      <button onClick={() => { setIsDeptModalOpen(false); setEditingDeptName(null); }} className="text-5xl text-slate-600 hover:text-white transition-colors leading-none">&times;</button>
                  </div>
                  <div className="p-10 sm:p-16 space-y-10 overflow-y-auto max-h-[80vh] no-scrollbar">
                      <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Protocol Identifier (System Key)</label>
                          <input className="w-full bg-black border border-white/10 p-5 text-sm text-white font-black rounded-md outline-none focus:border-[var(--primary-yellow)]" placeholder="e.g. SPECIALTY_SUBSTRATES" value={deptForm.name} onChange={e => setDeptForm({...deptForm, name: e.target.value})} />
                      </div>
                      <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Public Display Designation</label>
                          <input className="w-full bg-black border border-white/10 p-5 text-sm text-white font-black rounded-md outline-none focus:border-[var(--primary-yellow)]" placeholder="e.g. TECHNICAL POLYMERS" value={deptForm.title} onChange={e => setDeptForm({...deptForm, title: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Division Glyph (Icon)</label>
                            <div className="flex gap-6 items-center bg-black/40 p-4 border border-white/10 rounded-md">
                              <div className="w-16 h-16 bg-black border-2 border-white/5 flex items-center justify-center rounded-md overflow-hidden shrink-0 shadow-inner">
                                {deptForm.icon.length > 32 || deptForm.icon.startsWith('data:') ? <img src={deptForm.icon} alt="Preview" className="w-10 h-10 object-contain filter brightness-125" /> : <span className="text-4xl">{deptForm.icon}</span>}
                              </div>
                              <div className="flex-1 space-y-2">
                                <input type="file" id="deptIconFile" className="hidden" onChange={handleDeptIconUpload} />
                                <button onClick={() => document.getElementById('deptIconFile')?.click()} className="w-full bg-white/5 border border-white/10 py-3 text-[10px] font-black uppercase text-white hover:bg-white/10 rounded-sm">Inject Asset</button>
                              </div>
                            </div>
                        </div>
                        <div className="space-y-3 flex flex-col justify-end">
                            <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Call-to-Action Label</label>
                            <input className="w-full bg-black border border-white/10 p-5 text-sm text-white font-black rounded-md outline-none focus:border-[var(--primary-yellow)]" value={deptForm.cta} onChange={e => setDeptForm({...deptForm, cta: e.target.value})} />
                        </div>
                      </div>
                      <div className="space-y-3">
                          <label className="text-[11px] font-black uppercase text-slate-500 tracking-widest">Division Technical Prospectus</label>
                          <textarea className="w-full bg-black border border-white/10 p-5 text-sm text-slate-400 h-32 rounded-md outline-none leading-relaxed focus:border-[var(--primary-yellow)]" value={deptForm.desc} onChange={e => setDeptForm({...deptForm, desc: e.target.value})} />
                      </div>
                      <div className="flex gap-6 pt-6">
                        {editingDeptName && (
                          <button onClick={() => handleRemoveDept(editingDeptName)} className="bg-red-900 text-white px-8 py-4 text-xs font-black uppercase tracking-widest rounded-md hover:bg-red-600 transition-all shadow-xl">Purge Division</button>
                        )}
                        <button onClick={handleSaveDept} className="flex-1 bg-[var(--primary-yellow)] text-black py-5 text-sm font-black uppercase tracking-[0.3em] rounded-md shadow-2xl hover:scale-[1.02] transition-all border-b-4 border-black active:scale-95">Synchronize Division Hub</button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminDashboard;
