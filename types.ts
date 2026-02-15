
export interface Branch {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  email?: string;
  hours?: string;
  isOpen?: boolean;
  mainHubImage?: string; // Base64 or URL
}

export interface Brand {
  id: string;
  name: string;
  logoData: string; // Base64
  showOnAboutPage?: boolean;
}

export interface Range {
  id: string;
  name: string;
  brandId: string;
  department: MaterialDepartment;
  heroImages: string[]; // Base64
}

export interface Series {
  id: string;
  name: string;
  rangeId: string;
  standardSizes: string[];
}

export interface ColorSwatch {
  name: string;
  code: string; 
}

export interface TechnicalDocument {
  name: string;
  data: string; // Base64
  type: string; // MIME type
}

export interface MaterialVariant {
  id?: string;
  type: 'thickness' | 'color' | 'model' | 'size';
  value: string;
  priceOverride?: number;
  skuOverride?: string;
  descriptionOverride?: string;
  mediaOverride?: MaterialMedia[];
}

export interface MaterialMedia {
  url: string; // Base64 string for images/videos
  type: 'image' | 'video';
  fileName?: string;
}

export interface HeroItem {
  id: string;
  mediaType: 'image' | 'video';
  mediaData: string; // Base64 or URL
  title: string;
  highlight: string;
  subtitle: string;
  button1Text: string;
  button2Text: string;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  iconData: string; // Base64
}

export interface RoadmapItem {
  year: string;
  event: string;
}

export type MaterialDepartment = string;

export type PricingType = 'unit' | 'meter';

export interface Material {
  id: string;
  sku: string;
  name: string;
  department: MaterialDepartment;
  category: string; 
  brand?: string;
  brandId?: string; // Linked reference
  range?: string;
  rangeId?: string; // Linked reference
  series?: string;
  seriesId?: string; // Linked reference
  modelNumber?: string;
  density: number;
  tempRange: string;
  description: string;
  inventoryNote?: string; // Per-product specific note
  whatsappOverride?: string; // Product specific WhatsApp number
  features: string[];
  applications: string[];
  standardSizes: string[];
  variants: MaterialVariant[];
  media: MaterialMedia[];
  pros: string[];
  cons: string[];
  price: number; 
  pricingType?: PricingType;
  fullRollLength?: number; // Added for signage roll calculation
  engineeringSpecs?: {
    length: number;
    width: number;
    thickness: number;
    weight: number;
  };
  technicalSpecs: { label: string; value: string }[];
  tags: string[];
  documents: TechnicalDocument[];
  brandLink?: string;
  rangeLink?: string;
  // Added properties to resolve compilation errors across specialized page components
  size?: string;
  images?: string[];
  colorSwatches?: ColorSwatch[];
  manualName?: string;
  subCategory?: string;
  specSheetName?: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'admin';
  text: string;
  phone?: string;
  timestamp: string;
}

export interface Inquiry {
  id: string;
  date: string;
  fullName: string;
  email: string;
  phone?: string;
  type: string;
  message: string;
  status: 'New' | 'In Progress' | 'Quoted' | 'Closed';
  assignedTo?: string;
  aiSummary?: string;
  adminNotes?: string;
  chatHistory?: Message[];
}

export interface NavItem {
  label: string;
  view: string;
}

export interface DivisionConfig {
  title: string;
  desc: string;
  icon: string; // Can be an emoji or base64 image string
  ctaText: string;
}

export interface ContactConfig {
  address: string;
  email: string;
  phone: string;
  whatsapp?: string; // Global WhatsApp link
  lat: number;
  lng: number;
  formHeading: string;
  formSubtext: string;
  googleMapsEmbedUrl?: string;
}

export interface AppState {
  config: SiteConfig;
  branches: Branch[];
  materials: Material[];
  inquiries: Inquiry[];
  brands: Brand[];
  ranges: Range[];
  series: Series[];
}

export interface SiteConfig {
  theme: {
    primaryColor: string;
    industrialBg: string;
    accentSuccess: string;
    borderRadius: string;
    borderWeight: string;
  };
  branding: {
    logoData: string; 
    logoWidth: string;
    showIsoSeals: boolean;
  };
  navigation: {
    items: NavItem[];
    highlightWordIndex: number;
    branchTriggerText: string;
  };
  announcement: {
    enabled: boolean;
    text: string;
    bgColor: string;
    textColor: string;
    duration?: string;
    repeatCount?: number;
  };
  about: {
    title: string;
    subtitle: string;
    content: string;
    mission: string;
    vision: string;
    roadmap: RoadmapItem[];
    image: string;
  };
  founders: {
    title: string;
    subtitle: string;
    text: string;
    image: string;
  };
  contact: ContactConfig;
  legal: {
    vatNumber: string;
    regNumber: string;
    copyrightOverride: string;
  };
  privacyPolicy: string;
  ui: {
    navButton: string;
    servicesTitle: string;
    sinceLabel: string;
    inquiryButton: string;
    inquiryHeading: string;
    inquirySubtext: string;
    inventoryNote: string;
    calcButton: string;
    calcHeading: string;
    logisticsTitle: string;
    logisticsHighlight: string;
    logisticsDesc: string;
    logisticsImages: string[];
    branchDirectoryBtnText: string;
    modalCloseText: string;
    heroSection?: {
       title: string;
       subtitle: string;
    };
    vaultSubtext: string;
    vaultHeading: string;
    vaultSearchPlaceholder: string;
    // Global Metadata Labels
    hubStockLabel: string;
    hubStockValue: string;
    leadTimeLabel: string;
    leadTimeValue: string;
    techSummaryHeading: string;
    techSummaryText: string;
    // Catalog Hero Defaults
    catalogHeroTitle?: string;
    catalogHeroDesc?: string;
    // Certification Labels
    isoLabel?: string;
    qcLabel?: string;
    // New Form Config Fields
    formNoticeHeading: string;
    emergencyHeading: string;
    inquiryTypes: string[];
  };
  hero: {
    items: HeroItem[];
    autoPlay: boolean;
    interval: number;
    departmentHeroes: Record<MaterialDepartment, MaterialMedia[]>;
  };
  emergency: {
    label: string;
    number: string;
    desc: string;
  };
  company: {
    name: string;
    tagline: string;
    isoStatus: string;
    footerText: string;
    foundingYear: string;
    productAuditStatus: string;
  };
  footer: {
    socials: SocialLink[];
    privacyText: string;
    showIsoIcons: boolean;
  };
  divisions: Record<string, DivisionConfig>;
  seo: {
    metaDescription: string;
    pageTitle: string;
  };
}
