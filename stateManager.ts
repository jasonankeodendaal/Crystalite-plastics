
import { AppState, Inquiry, Material, HeroItem, Brand, Range, Series, MaterialDepartment, AdvertItem, NewsletterConfig, Subscriber, PosterItem } from './types';
import { BRANCHES, MATERIALS } from './constants';
import { supabase } from './services/supabase';

const STORAGE_KEY = 'industrial_plastics_data_v16';

const DEFAULT_BRANDS: Brand[] = [
  { id: 'b-roland', name: 'Roland DG', logoData: 'https://www.rolanddg.com/-/media/rolanddg/global/images/common/logo/roland-logo.svg', showOnAboutPage: true },
  { id: 'b-mimaki', name: 'Mimaki', logoData: 'https://mimaki.com/common/img/logo.png', showOnAboutPage: true },
  { id: 'b-oracal', name: 'Oracal / Orafol', logoData: 'https://www.orafol.com/resource/blob/8604/479493f06d337f7e346f0436d4057865/orafol-logo-data.svg', showOnAboutPage: true },
  { id: 'b-avery', name: 'Avery Dennison', logoData: 'https://graphics.averydennison.com/etc.clientlibs/avery/clientlibs/global-styles/resources/images/logos/avery-dennison-logo.svg', showOnAboutPage: true },
  { id: 'b-perspex', name: 'Perspex', logoData: 'https://www.perspex.com/Perspex/media/Site-Assets/Logo/Perspex_Logo_RGB.png', showOnAboutPage: true },
  { id: 'b-lexan', name: 'Lexan', logoData: 'https://www.sabic.com/en/Images/sabic-logo-new_tcm1010-15551.png', showOnAboutPage: true },
  { id: 'b-raise3d', name: 'Raise3D', logoData: 'https://www.raise3d.com/wp-content/uploads/2021/11/logo-header.png', showOnAboutPage: true },
  { id: 'b-polyflex', name: 'Polyflex', logoData: 'https://www.polyflex.com/logo.png', showOnAboutPage: true },
  { id: 'b-chromodeck', name: 'Chromodeck', logoData: '', showOnAboutPage: false },
  { id: 'b-olfa', name: 'Olfa', logoData: 'https://www.olfa.co.jp/en/common/img/logo.png', showOnAboutPage: true }
];

const DEFAULT_RANGES: Range[] = [
  { id: 'r-truevis', name: 'TrueVIS', brandId: 'b-roland', department: 'Hardware', heroImages: [] },
  { id: 'r-ucjv', name: 'UCJV Series', brandId: 'b-mimaki', department: 'Hardware', heroImages: [] },
  { id: 'r-proseries', name: 'Pro Series', brandId: 'b-raise3d', department: 'Hardware', heroImages: [] },
  { id: 'r-651', name: '651 Series', brandId: 'b-oracal', department: 'Signage Materials', heroImages: [] },
  { id: 'r-751', name: '751 Series', brandId: 'b-oracal', department: 'Signage Materials', heroImages: [] },
  { id: 'r-mpi1100', name: 'MPI 1100 Series', brandId: 'b-avery', department: 'Signage Materials', heroImages: [] },
  { id: 'r-pxcast', name: 'Cast Series', brandId: 'b-perspex', department: 'Engineering Materials', heroImages: [] },
  { id: 'r-9034', name: '9034 Series', brandId: 'b-lexan', department: 'Engineering Materials', heroImages: [] },
  { id: 'r-metal', name: 'Steel Series', brandId: 'b-chromodeck', department: 'Signage Materials', heroImages: [] }
];

const DEFAULT_SERIES: Series[] = [
  { id: 's-vg3', name: 'VG3 Series', rangeId: 'r-truevis', standardSizes: ['1625mm (64")'] },
  { id: 's-ucjv300', name: 'UCJV300', rangeId: 'r-ucjv', standardSizes: ['1610mm'] },
  { id: 's-651gloss', name: '651 Gloss', rangeId: 'r-651', standardSizes: ['1260mm x 50m', '630mm x 50m'] },
  { id: 's-mpi1105', name: 'MPI 1105 Series', rangeId: 'r-mpi1100', standardSizes: ['1370mm x 50m', '1524mm x 50m'] },
  { id: 's-pxcast', name: 'Perspex Cast', rangeId: 'r-pxcast', standardSizes: ['2440 x 1220mm', '3050 x 2030mm'] },
  { id: 's-lxpc', name: 'Lexan PC', rangeId: 'r-9034', standardSizes: ['2440 x 1220mm'] }
];

const DEFAULT_HERO: HeroItem[] = [
  {
    id: 'hero-1',
    mediaType: 'image',
    mediaData: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=2000',
    title: "Premium",
    highlight: "Wrapping Films",
    subtitle: "Authorized national distribution for Avery Dennison and Oracal. Master rolls of MPI 1105 and 970RA series available ex-stock.",
    button1Text: "Browse Media",
    button2Text: "Technical Data"
  },
  {
    id: 'hero-2',
    mediaType: 'image',
    mediaData: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=2000',
    title: "TrueVIS",
    highlight: "VG3 Series",
    subtitle: "Roland DG authorized hardware coordination. Elite printing and contour cutting for high-precision industrial output.",
    button1Text: "View Hardware",
    button2Text: "Request Demo"
  },
  {
    id: 'hero-3',
    mediaType: 'image',
    mediaData: 'https://images.unsplash.com/photo-1590483736622-39da8af75620?auto=format&fit=crop&q=80&w=2000',
    title: "Engineering",
    highlight: "Polymers",
    subtitle: "Premium rigid substrates including Perspex Cast Acrylic and Lexan Polycarbonate. Impact resistance and optical clarity guaranteed.",
    button1Text: "Browse Rigid",
    button2Text: "Cut-to-Size"
  }
];

const DEFAULT_POSTERS: PosterItem[] = [
  { id: 'p1', title: 'Precision Engineering', image: 'https://images.unsplash.com/photo-1504148455328-497c5efdf13a?auto=format&fit=crop&q=80&w=800' },
  { id: 'p2', title: 'Material Innovation', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800' },
  { id: 'p3', title: 'National Logistics', image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800' }
];

const DEFAULT_ADVERTS: AdvertItem[] = [
  {
    id: 'ad-1',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
    title: 'Flash Sale: 20% Off Lexan 3mm Sheets',
    ctaText: 'Shop Sale',
    link: 'dept:Engineering Materials'
  },
  {
    id: 'ad-2',
    image: 'https://images.unsplash.com/photo-1626608322397-f4e507d10c73?auto=format&fit=crop&q=80&w=1200',
    title: 'New Arrival: Oracal 970RA Metallic Series',
    ctaText: 'View Series',
    link: 'dept:Signage Materials'
  },
  {
    id: 'ad-3',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=1200',
    title: 'Hardware Upgrade: Trade-in Your Old Printer',
    ctaText: 'Request Quote',
    link: 'contact'
  }
];

const DEFAULT_NEWSLETTER: NewsletterConfig = {
  title: "Technical Digest",
  subtitle: "Subscribe to our national inventory replenishment reports and material alerts.",
  image: "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?auto=format&fit=crop&q=80&w=800",
  buttonText: "Initialize Subscription",
  successTitle: "Deployment Successful.",
  successSubtitle: "You are now synchronized.",
  footerText: "Authorized data access only. Unsubscribe via portal registry."
};

const DEFAULT_PRIVACY = `At INDUSTRIAL PLASTICS DISTRIBUTORS, we understand the critical nature of the engineering data and technical inquiries shared with us. This policy outlines our commitment to protecting your corporate and personal information.

1. Information Collection
We collect information necessary to provide technical quotations and logistics services, including Company Name, Contact Details, and Technical Specifications for your application.

2. Data Usage
Your data is used exclusively for:
- Generating formal technical quotations.
- Coordinating delivery via our national branch network.
- Providing updated MSDS and TDS documents when requested.
- Professional material recommendation by our technical specialists.

3. Technical Confidentiality
We respect intellectual property. Technical drawings (DXF, DWG, PDF) submitted for fabrication quotes are handled with strict internal confidentiality and are only accessible by our branch engineering teams.

4. Contact
For any privacy-related queries or to request data deletion, please contact our Compliance Officer at compliance@industrialplastics.example.com`;

const DEFAULT_STATE: AppState = {
  config: {
    theme: {
      primaryColor: '#FFD600', 
      industrialBg: '#111111',
      accentSuccess: '#22c55e',
      borderRadius: '12px',
      borderWeight: '4px'
    },
    branding: {
      logoData: "https://www.svgrepo.com/show/443105/factory.svg",
      logoWidth: "40px",
      showIsoSeals: true
    },
    navigation: {
      items: [
        { label: 'Home', view: 'home' },
        { label: 'Products', view: 'catalog' },
        { label: 'About', view: 'about' }
      ],
      highlightWordIndex: 1,
      branchTriggerText: 'Hub Locator'
    },
    announcement: {
      enabled: true,
      text: "MARKET NOTICE: NATIONAL INVENTORY REPLENISHMENT FOR AVERY DENNISON WRAP SERIES. CONTACT ISANDO HUB FOR ALLOCATION.",
      bgColor: "#FFD600",
      textColor: "#000000",
      duration: "20s",
      repeatCount: 5
    },
    about: {
      title: "Material Distribution Authority",
      subtitle: "Authorized National Hub Network",
      content: "Established in 1994, Industrial Plastics serves as the critical technical link between global manufacturers and the South African industrial landscape. We specialize in the logistics of high-performance hardware from Roland and Mimaki, alongside premium media from Orafol and Avery Dennison.",
      mission: "To deliver the world's most advanced industrial substrates and hardware through a highly optimized, technical logistics infrastructure.",
      vision: "To be the primary technical authority for high-performance visual communication substrates and engineering polymers in Africa.",
      roadmap: [
        { year: "1994", event: "Foundation of Industrial Plastics Johannesburg." },
        { year: "2005", event: "Official Platinum Tier Distribution Partnership with Roland DG." },
        { year: "2012", event: "Launch of specialized Engineering Polymer division." },
        { year: "2024", event: "National Digital Integration for real-time inventory synchronization." }
      ],
      image: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1200"
    },
    founders: {
      title: "Technical Excellence",
      subtitle: "Industry Authority since 1994",
      text: "Our core strategy is built on material reliability. We don't just supply stock; we provide the technical ecosystem required for high-stakes industrial production.",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800",
      roleLabel: "IP Executive Leadership"
    },
    adverts: DEFAULT_ADVERTS,
    posters: DEFAULT_POSTERS,
    newsletter: DEFAULT_NEWSLETTER,
    contact: {
      address: "12 Industrial Way, Isando, Johannesburg, 1600, South Africa",
      email: "logistics@industrialplastics.example.com",
      phone: "+27 11 555 0100",
      whatsapp: "27115550100",
      lat: -26.1368,
      lng: 28.2109,
      formHeading: "Technical Portal Access",
      formSubtext: "Contact our central distribution hub for authorized hardware service or national substrate procurement.",
      googleMapsEmbedUrl: ""
    },
    legal: {
      vatNumber: "4123456789",
      regNumber: "1994/012345/07",
      copyrightOverride: ""
    },
    privacyPolicy: DEFAULT_PRIVACY,
    ui: {
      navButton: 'Dist. Hubs',
      servicesTitle: 'Distribution Vaults',
      sinceLabel: 'Technical Material Partners established 1994.',
      inquiryButton: 'Request Industrial Quote',
      inquiryHeading: 'National Support Portal',
      inquirySubtext: 'Submit technical inquiries for hardware coordination or substrate procurement.',
      inventoryNote: 'Ex-stock availability on Roland consumables and Oracal/Avery vinyl master rolls across all hubs.',
      calcButton: 'Weight Estimator',
      calcHeading: 'Technical Estimator',
      logisticsTitle: 'National Footprint',
      logisticsHighlight: 'Logistics',
      logisticsDesc: 'Strategically distributed hubs in Isando, Paarden Eiland, and Pinetown ensure optimized dispatch for heavy hardware and high-volume vinyl orders.',
      logisticsLabel: 'Fulfillment Grid',
      logisticsImages: [
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000',
        'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=2000',
        'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=2000'
      ],
      branchDirectoryBtnText: 'View Hub Network →',
      modalCloseText: 'Close Portal',
      vaultSubtext: 'TECHNICAL DATA REPOSITORY',
      vaultHeading: 'Industrial Substrate Hub',
      vaultSearchPlaceholder: 'Search SKU, TDS, MSDS or ICC Profile...',
      hubStockLabel: 'Inventory',
      hubStockValue: 'In-Stock',
      leadTimeLabel: 'Dispatch',
      leadTimeValue: '24HR Lead',
      techSummaryHeading: 'Technical Audit',
      techSummaryText: 'Authorized distribution status verified for this material series.',
      catalogHeroTitle: 'Distribution Hub',
      catalogHeroDesc: 'Authorized national inventory of Roland/Mimaki hardware and Oracal/Avery visual media.',
      isoLabel: 'ISO 9001',
      qcLabel: 'QC PASS',
      formNoticeHeading: 'Technical Hub Notice',
      emergencyHeading: 'Hardware Breakdown',
      inquiryTypes: ['Hardware Technical Support', 'Signage Media / Vinyl', 'Engineering Substrates', 'Technical Training'],
      brandCarouselRegistryLabel: 'PARTNER_REGISTRY // NODE_SCAN_ACTIVE',
      brandCarouselCoordsLabel: 'LOGISTICS_FEED_01 // [34.0522° N, 118.2437° W]',
      billboardShowcaseLabel: 'Technical Showcase Matrix',
      billboardAssetProtocolLabel: 'Asset_Protocol: V3.1 // High_Fidelity_View',
      billboardEnlargeLabel: 'Click to enlarge technical asset'
    },
    hero: {
      items: DEFAULT_HERO,
      autoPlay: true,
      interval: 7000,
      departmentHeroes: {
        'Engineering Materials': [{ url: 'https://images.unsplash.com/photo-1504148455328-497c5efdf13a?auto=format&fit=crop&q=80&w=2000', type: 'image' }],
        'Signage Materials': [{ url: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=2000', type: 'image' }],
        'Hardware': [{ url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000', type: 'image' }]
      }
    },
    emergency: {
      label: "24/7 National Breakdown",
      number: "086-PLASTICS-911",
      desc: "Priority hardware repair and urgent technical procurement hotline."
    },
    company: {
      name: "INDUSTRIAL PLASTICS",
      tagline: "HARDWARE. MEDIA. POLYMERS.",
      isoStatus: "ISO 9001:2015 CERTIFIED DISTRIBUTOR.",
      footerText: "National authorized distribution node for Roland DG, Mimaki, Oracal, and Avery Dennison.",
      foundingYear: "EST. 1994",
      productAuditStatus: "Verified 2024"
    },
    footer: {
      socials: [
        { id: 'soc-1', name: 'LinkedIn', url: 'https://linkedin.com', iconData: '' },
        { id: 'soc-2', name: 'Facebook', url: 'https://facebook.com', iconData: '' },
        { id: 'soc-3', name: 'Instagram', url: 'https://instagram.com', iconData: '' }
      ],
      privacyText: "Data Privacy Policy",
      showIsoIcons: true
    },
    divisions: {
      'Engineering Materials': { 
        title: "Technical Polymers", 
        desc: "High-impact Lexan Polycarbonate and genuine Perspex cast acrylic sheets.", 
        icon: "⚙️", 
        ctaText: "Browse Substrates" 
      },
      'Signage Materials': { 
        title: "Signage Media", 
        desc: "Master rolls of Oracal and Avery Dennison vinyl for visual communications.", 
        icon: "📐", 
        ctaText: "View Vault" 
      },
      'Hardware': { 
        title: "Print Hardware", 
        desc: "Authorized Roland DG and Mimaki wide-format printers and Olfa cutting tools.", 
        icon: "🖨️", 
        ctaText: "View Hardware" 
      }
    },
    seo: {
      metaDescription: "Authorized distributor of Roland, Mimaki, Oracal, and Avery Dennison in South Africa.",
      pageTitle: "Industrial Plastics | National Substrate Forge"
    }
  },
  branches: BRANCHES,
  materials: MATERIALS,
  inquiries: [],
  brands: DEFAULT_BRANDS,
  ranges: DEFAULT_RANGES,
  series: DEFAULT_SERIES,
  subscribers: []
};

export const loadState = (): AppState => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      const state = { ...DEFAULT_STATE, ...parsed };
      state.config = { ...DEFAULT_STATE.config, ...parsed.config };
      
      if (parsed.config) {
        state.config.theme = { ...DEFAULT_STATE.config.theme, ...parsed.config.theme };
        state.config.ui = { ...DEFAULT_STATE.config.ui, ...parsed.config.ui };
        state.config.newsletter = { ...DEFAULT_STATE.config.newsletter, ...parsed.config.newsletter };
        state.config.posters = parsed.config.posters || DEFAULT_STATE.config.posters;
        state.config.founders = { ...DEFAULT_STATE.config.founders, ...parsed.config.founders };
      }
      
      return state;
    } catch (e) {
      console.error("Failed to parse saved state", e);
    }
  }
  return DEFAULT_STATE;
};

export const saveState = (state: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
};

export const addInquiry = async (inquiry: Omit<Inquiry, 'id' | 'date' | 'status'>) => {
  const state = loadState();
  const id = crypto.randomUUID();
  const date = new Date().toISOString();
  
  const newInquiry: Inquiry = {
    ...inquiry,
    id,
    date,
    status: 'New',
    chatHistory: [
      { id: crypto.randomUUID(), sender: 'user', text: inquiry.message, timestamp: date }
    ]
  };

  if (supabase) {
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([{
          id: newInquiry.id,
          full_name: newInquiry.fullName,
          email: newInquiry.email,
          phone: newInquiry.phone || '',
          type: newInquiry.type,
          message: newInquiry.message,
          status: newInquiry.status,
          chat_history: newInquiry.chatHistory
        }]);
      
      if (error) console.error('Supabase Sync Error:', error.message);
    } catch (err) {
      console.error('Supabase Connection Error:', err);
    }
  }

  state.inquiries.unshift(newInquiry);
  saveState(state);
  return newInquiry;
};

export const addSubscriber = async (email: string) => {
  const state = loadState();
  const newSubscriber: Subscriber = {
    id: crypto.randomUUID(),
    email,
    date: new Date().toISOString()
  };
  
  state.subscribers.unshift(newSubscriber);
  saveState(state);
  
  if (supabase) {
    try {
      await supabase.from('subscribers').insert([newSubscriber]);
    } catch (e) {
      console.error('Failed to sync subscriber to Supabase', e);
    }
  }
  
  return newSubscriber;
};

export const updateInquiryChat = async (inquiryId: string, message: { sender: 'user' | 'admin', text: string }) => {
  const state = loadState();
  const idx = state.inquiries.findIndex(i => i.id === inquiryId);
  if (idx !== -1) {
    const timestamp = new Date().toISOString();
    const updatedHistory = [
      ...(state.inquiries[idx].chatHistory || []),
      { id: crypto.randomUUID(), ...message, timestamp }
    ];
    state.inquiries[idx].chatHistory = updatedHistory;
    saveState(state);

    if (supabase) {
      try {
        await supabase
          .from('inquiries')
          .update({ chat_history: updatedHistory })
          .eq('id', inquiryId);
      } catch (err) {
        console.error('Supabase Update Error:', err);
      }
    }
  }
};
