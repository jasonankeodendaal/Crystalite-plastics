
import { Branch, Material } from './types';

export const BRANCHES: Branch[] = [
  { id: '1', name: 'HQ Warehouse', city: 'Johannesburg', lat: -26.2041, lng: 28.0473, address: '12 Industrial Way, Isando', phone: '+27 11 555 0100', mainHubImage: '' },
  { id: '2', name: 'Coastal Hub', city: 'Cape Town', lat: -33.9249, lng: 18.4241, address: '45 Harbour Road, Paarden Eiland', phone: '+27 21 555 0200', mainHubImage: '' },
  { id: '3', name: 'East Port', city: 'Durban', lat: -29.8587, lng: 31.0218, address: '88 Logistics Drive, Pinetown', phone: '+27 31 555 0300', mainHubImage: '' },
  { id: '4', name: 'Central Distribution', city: 'Bloemfontein', lat: -29.0852, lng: 26.1596, address: '15 Highview Ave, Hamilton', phone: '+27 51 555 0400', mainHubImage: '' },
];

export const MATERIALS: Material[] = [
  // HARDWARE - PRINTERS
  { 
    id: 'hdw-rol-vg3-640',
    sku: 'RD-VG3-640',
    name: 'Roland TrueVIS VG3-640',
    department: 'Hardware',
    category: 'Eco-Solvent Printer/Cutter',
    brand: 'Roland DG',
    brandId: 'b-roland',
    range: 'TrueVIS',
    rangeId: 'r-truevis',
    series: 'VG3 Series',
    seriesId: 's-vg3',
    modelNumber: 'VG3-640',
    density: 0,
    tempRange: '15 to 32°C', 
    description: 'The TrueVIS VG3-640 is the ultimate professional solution for signage, featuring integrated print and contour cut capabilities. Powered by the TR2 ink system including Orange and Green, it offers an expanded color gamut and superior image quality.',
    features: ['8-Color Ink Configuration (CMYKLcLmOrGr)', 'Integrated Piezo Variable Inkjet', 'Bluetooth-enabled Roland DG Mobile Panel', 'Automated Media Gap & Feed Compensation'],
    applications: ['Vehicle Wraps', 'Backlit Displays', 'Die-Cut Decals', 'Exhibition Graphics', 'Banners'],
    standardSizes: ['1625mm (64")'],
    variants: [{ type: 'model', value: 'VG3-640 Standard' }],
    media: [{ url: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=1200', type: 'image' }],
    pros: ['Industry-leading color accuracy', 'Efficient dual-mode cutting', 'Reliable unattended production'],
    cons: ['Significant floor space requirement', 'Strict environmental temperature control'],
    price: 315000,
    pricingType: 'unit',
    technicalSpecs: [
      { label: 'Max Print Speed', value: '21.0 m²/h (Standard)' },
      { label: 'Resolution', value: 'Max 1200 dpi' },
      { label: 'Ink Type', value: 'TR2 Eco-Solvent' },
      { label: 'Cutting Force', value: 'Up to 500gf' }
    ],
    tags: ['Roland', 'Printing', 'Cutting', 'Hardware'],
    documents: []
  },
  { 
    id: 'hdw-mim-ucjv300-160',
    sku: 'MK-UCJV300-160',
    name: 'Mimaki UCJV300-160',
    department: 'Hardware',
    category: 'UV-LED Printer/Cutter',
    brand: 'Mimaki',
    brandId: 'b-mimaki',
    range: 'UCJV Series',
    rangeId: 'r-ucjv',
    series: 'UCJV300',
    seriesId: 's-ucjv300',
    modelNumber: 'UCJV300-160',
    density: 0,
    tempRange: '20 to 30°C', 
    description: 'A versatile UV-LED inkjet printer/cutter that enables 4-layer printing for backlit graphics. It features instant-dry LUS-170 inks that allow for immediate finishing and lamination, significantly reducing turnaround times.',
    features: ['4-Layer Printing (Day/Night View)', 'LUS-170 GREENGUARD Gold Inks', 'ID Cut Function for automated cutting', 'White & Clear Ink Support'],
    applications: ['Backlit Displays', 'Window Graphics', 'Floor Decals', 'Packaging Prototypes'],
    standardSizes: ['1610mm'],
    variants: [],
    media: [{ url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200', type: 'image' }],
    pros: ['Instant curing for fast delivery', 'Unique multi-layer effects', 'Low heat emission for thin media'],
    cons: ['UV inks have limited stretch compared to cast vinyl inks'],
    price: 345000,
    pricingType: 'unit',
    technicalSpecs: [
      { label: 'Max Resolution', value: '1200 dpi' },
      { label: 'Curing Unit', value: 'UV-LED' },
      { label: 'Ink Type', value: 'LUS-170 / LUS-200' },
      { label: 'Max Media Thickness', value: '1.0mm' }
    ],
    tags: ['Mimaki', 'UV-LED', 'Backlit', 'Hardware'],
    documents: []
  },

  // ORACAL VINYLS
  {
    id: 'vnl-ora-651-gloss',
    sku: 'OR-651-G',
    name: 'Oracal 651 Intermediate Cal',
    department: 'Signage Materials',
    category: 'Vinyl',
    brand: 'Oracal',
    brandId: 'b-oracal',
    range: '651 Series',
    rangeId: 'r-651',
    series: '651 Gloss',
    seriesId: 's-651gloss',
    density: 0,
    tempRange: '-40 to +80°C',
    description: 'The global benchmark for intermediate vinyl. 2.5 mil thickness with a 5-year outdoor durability. Ideal for flat surfaces, lettering, and medium-term signage. Features a high-gloss finish and permanent solvent polyacrylate adhesive.',
    features: ['High dimensional stability', 'Excellent weeding properties', 'Permanent adhesive', 'UV-Resistant pigment'],
    applications: ['Retail Window Graphics', 'Indoor/Outdoor Directional Signs', 'Flat Vehicle Lettering', 'Hobby Decals'],
    standardSizes: ['1260mm x 50m', '630mm x 50m'],
    variants: [
      { id: 'v1', type: 'color', value: 'Gloss White', skuOverride: 'OR-651-010' },
      { id: 'v2', type: 'color', value: 'Gloss Black', skuOverride: 'OR-651-070' },
      { id: 'v3', type: 'color', value: 'Signal Red', skuOverride: 'OR-651-031' },
      { id: 'v4', type: 'color', value: 'Gentian Blue', skuOverride: 'OR-651-051' },
      { id: 'v5', type: 'color', value: 'Sulfur Yellow', skuOverride: 'OR-651-021' },
      { id: 'v6', type: 'color', value: 'Forest Green', skuOverride: 'OR-651-060' },
      { id: 'v7', type: 'color', value: 'Silver Grey (Met)', skuOverride: 'OR-651-090', priceOverride: 215 },
      { id: 'v8', type: 'color', value: 'Gold (Met)', skuOverride: 'OR-651-091', priceOverride: 215 }
    ],
    media: [
      { url: 'https://images.unsplash.com/photo-1626608322397-f4e507d10c73?auto=format&fit=crop&q=80&w=1200', type: 'image' },
      { url: 'https://images.unsplash.com/photo-1572375927902-1c0948957607?auto=format&fit=crop&q=80&w=1200', type: 'image' }
    ],
    pros: ['Industry standard reliability', 'Consistent color matching', 'Superior cutting response'],
    cons: ['Not for compound curves', 'Adhesive reach full cure in 24h'],
    price: 185,
    pricingType: 'meter',
    fullRollLength: 50,
    technicalSpecs: [
      { label: 'Thickness', value: '70 micron' },
      { label: 'Outdoor Durability', value: '5 Years' },
      { label: 'Adhesive', value: 'Solvent Polyacrylate' },
      { label: 'Release Paper', value: '137g/m²' }
    ],
    tags: ['Oracal', 'Vinyl', 'Intermediate', 'Gloss'],
    documents: []
  },
  {
    id: 'vnl-ora-970ra',
    sku: 'OR-970RA',
    name: 'Oracal 970RA Premium Wrapping Cast',
    department: 'Signage Materials',
    category: 'Wrapping Film',
    brand: 'Oracal',
    brandId: 'b-oracal',
    range: '970 Series',
    rangeId: 'r-970ra',
    series: 'RapidAir Cast',
    seriesId: 's-970ra',
    density: 0,
    tempRange: '-50 to +110°C',
    description: 'Multi-layered high-performance cast PVC film with RapidAir technology for air-release bubble-free application. Specifically developed for full vehicle wraps and corrugated surfaces without the need for lamination.',
    features: ['RapidAir air-release technology', 'Highly conformable', 'Repositional adhesive', 'Dual-layer pigment construction'],
    applications: ['Full Vehicle Wraps', 'Fleet Graphics', 'Marine Graphics', 'Architectural Wrapping'],
    standardSizes: ['1524mm x 25m'],
    variants: [
      { id: 'v1', type: 'color', value: 'Gloss Tangerine', skuOverride: 'OR-970RA-351' },
      { id: 'v2', type: 'color', value: 'Gloss Azure Blue', skuOverride: 'OR-970RA-537' },
      { id: 'v3', type: 'color', value: 'Matt Charcoal', skuOverride: 'OR-970RA-704' },
      { id: 'v4', type: 'color', value: 'Shift Effect Pearl', skuOverride: 'OR-970RA-SE', priceOverride: 950 }
    ],
    media: [
      { url: 'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?auto=format&fit=crop&q=80&w=1200', type: 'image' }
    ],
    pros: ['Fast application with RapidAir', 'Extreme outdoor durability', 'High gloss "paint" finish'],
    cons: ['Requires high-heat post-heating', 'Higher skilled labor required'],
    price: 785,
    pricingType: 'meter',
    fullRollLength: 25,
    technicalSpecs: [
      { label: 'Thickness', value: '110 micron' },
      { label: 'Elongation', value: 'min 150%' },
      { label: 'Adhesive Power', value: '18 N/25mm' },
      { label: 'Durability', value: '12 Years (Unprinted)' }
    ],
    tags: ['Oracal', 'Wrap', 'Cast', 'RapidAir'],
    documents: []
  },

  // AVERY DENNISON VINYLS
  {
    id: 'vnl-ave-1105',
    sku: 'AD-MPI-1105-EA',
    name: 'Avery MPI 1105 Easy Apply RS',
    department: 'Signage Materials',
    category: 'Digital Media',
    brand: 'Avery Dennison',
    brandId: 'b-avery',
    range: 'MPI 1100 Series',
    rangeId: 'r-mpi1100',
    series: 'MPI 1105 Series',
    seriesId: 's-mpi1105',
    density: 0,
    tempRange: '-45 to +82°C',
    description: 'The flagship print media for high-performance wraps. Features Easy Apply RS technology for repositionability and slideability, and ultimate conformability around deep recesses and rivets. Optimized for Eco-Solvent, UV, and Latex inks.',
    features: ['Superior print consistency', 'Easy Apply RS (Air Egress)', 'Clean long-term removability', 'Conformable to 3D surfaces'],
    applications: ['Full Vehicle Wraps', 'Public Transport Graphics', 'High-End Branding', 'Corrugated Shipping Containers'],
    standardSizes: ['1370mm x 50m', '1524mm x 50m'],
    variants: [
      { id: 'v1', type: 'size', value: '1370mm Standard', skuOverride: 'MPI-1105-54' },
      { id: 'v2', type: 'size', value: '1524mm Wide', skuOverride: 'MPI-1105-60', priceOverride: 545 }
    ],
    media: [
      { url: 'https://images.unsplash.com/photo-1626608322397-f4e507d10c73?auto=format&fit=crop&q=80&w=1200', type: 'image' }
    ],
    pros: ['Fastest application in class', 'Vibrant color saturation', 'Bubble-free result'],
    cons: ['Needs DOL 1460 lamination for warranty'],
    price: 495,
    pricingType: 'meter',
    fullRollLength: 50,
    technicalSpecs: [
      { label: 'Thickness', value: '50 micron' },
      { label: 'Finish', value: 'High Gloss' },
      { label: 'Adhesive', value: 'Permanent Grey Acrylic' },
      { label: 'Durability', value: '10 Years' }
    ],
    tags: ['Avery', 'Digital Print', 'Wrap', 'Easy Apply'],
    documents: []
  },
  {
    id: 'vnl-ave-swf',
    sku: 'AD-SWF',
    name: 'Avery Supreme Wrapping Film',
    department: 'Signage Materials',
    category: 'Wrapping Film',
    brand: 'Avery Dennison',
    brandId: 'b-avery',
    range: 'SWF Series',
    rangeId: 'r-swf',
    series: 'Supreme Wrap',
    seriesId: 's-swf',
    density: 0,
    tempRange: '-50 to +110°C',
    description: 'The industry favorite for color-change vehicle wraps. Combines a color film and protective layer into one construction. Features Easy Apply RS for rapid installation and long-term removability after the wrap period.',
    features: ['Dual-layer construction', 'Over 100 color options', 'Exceptional conformability', 'Easy Apply RS technology'],
    applications: ['High-end color changes', 'Luxury Vehicle Detailing', 'Automotive Personalization'],
    standardSizes: ['1524mm x 25m'],
    variants: [
      { id: 'v1', type: 'color', value: 'Satin Black', skuOverride: 'AD-SWF-SAT-BLK' },
      { id: 'v2', type: 'color', value: 'Gloss Rock Grey', skuOverride: 'AD-SWF-GR-GRY' },
      { id: 'v3', type: 'color', value: 'Diamond Blue', skuOverride: 'AD-SWF-DMD-BLU', priceOverride: 980 },
      { id: 'v4', type: 'color', value: 'ColorFlow Rising Sun', skuOverride: 'AD-SWF-CF-RS', priceOverride: 1150 }
    ],
    media: [
      { url: 'https://images.unsplash.com/photo-1572375927902-1c0948957607?auto=format&fit=crop&q=80&w=1200', type: 'image' }
    ],
    pros: ['Fastest install time', 'Superior paint-like finish', 'Highly conformable'],
    cons: ['Premium price point'],
    price: 845,
    pricingType: 'meter',
    fullRollLength: 25,
    technicalSpecs: [
      { label: 'Thickness', value: '80 micron' },
      { label: 'Adhesive', value: 'Easy Apply RS' },
      { label: 'Durability', value: '12 Years' },
      { label: 'Finish', value: 'Multi-Texture Available' }
    ],
    tags: ['Avery', 'SWF', 'Wrap', 'Color Change'],
    documents: []
  },

  // ENGINEERING RIGID SUBSTRATES
  { 
    id: 'eng-lx-pc-3mm',
    sku: 'IP-LX-PC-3MM',
    name: 'Lexan 9034 Polycarbonate (3mm)', 
    department: 'Engineering Materials',
    category: 'Polycarbonate', 
    brand: 'Lexan',
    brandId: 'b-lexan',
    range: '9034 Series',
    rangeId: 'r-9034',
    series: 'Lexan PC',
    seriesId: 's-lxpc',
    density: 1.20, 
    tempRange: '-40 to +120°C', 
    description: 'LEXAN 9034 is the standard general-purpose polycarbonate sheet. It is virtually unbreakable and 250 times stronger than glass. It offers high impact resistance and optical clarity for industrial safety and security applications.',
    features: ['Impact Strength (250x Glass)', 'High Light Transmission (88%)', 'UL 94 V-2 Flammability Rating', 'Excellent Thermal Stability'],
    applications: ['Safety Guards', 'Machine Viewing Panels', 'Anti-Vandal Glazing', 'Industrial Skylights'],
    standardSizes: ['2440 x 1220mm', '3050 x 2030mm'],
    variants: [
      { id: 't1', type: 'thickness', value: '3mm', priceOverride: 2850 },
      { id: 't2', type: 'thickness', value: '5mm', priceOverride: 4500 },
      { id: 't3', type: 'thickness', value: '10mm', priceOverride: 8900 }
    ],
    media: [{ url: 'https://images.unsplash.com/photo-1504148455328-497c5efdf13a?auto=format&fit=crop&q=80&w=1200', type: 'image' }],
    pros: ['Incredible toughness', 'Lightweight compared to glass', 'Easy to cold-curve'],
    cons: ['Prone to surface scratches without hard-coat'],
    price: 2850,
    pricingType: 'unit',
    engineeringSpecs: { length: 2440, width: 1220, thickness: 3, weight: 10.7 },
    technicalSpecs: [
      { label: 'Light Transmission', value: '88%' },
      { label: 'Impact Strength', value: '900 J/m' },
      { label: 'Tensile Strength', value: '62 MPa' }
    ],
    tags: ['Safety', 'Impact', 'Industrial', 'Lexan'],
    documents: []
  },
  { 
    id: 'eng-px-cl-5mm',
    sku: 'PX-AC-CAST-CL-5',
    name: 'Perspex Clear Cast Acrylic (5mm)', 
    department: 'Engineering Materials',
    category: 'Acrylic', 
    brand: 'Perspex',
    brandId: 'b-perspex',
    range: 'Cast Series',
    rangeId: 'r-pxcast',
    series: 'Perspex Cast',
    seriesId: 's-pxcast',
    density: 1.19, 
    tempRange: '-40 to +80°C', 
    description: 'Genuine PERSPEX cast acrylic sheet. Known for its exceptional quality, clarity, and consistency. This 5mm sheet provides 92% light transmission, higher than that of glass, with a surface finish that is naturally UV stable.',
    features: ['92% Light Transmission', 'Natural UV Resistance', '10 Year Weathering Guarantee', 'Excellent Chemical Resistance'],
    applications: ['Premium POS Displays', 'Skylights', 'Furniture Fabrication', 'Corporate Signage'],
    standardSizes: ['2440 x 1220mm', '3050 x 2030mm'],
    variants: [
      { id: 't1', type: 'thickness', value: '3mm', priceOverride: 1450 },
      { id: 't2', type: 'thickness', value: '5mm', priceOverride: 2400 },
      { id: 't3', type: 'thickness', value: '10mm', priceOverride: 4950 }
    ],
    media: [{ url: 'https://images.unsplash.com/photo-1590483736622-39da8af75620?auto=format&fit=crop&q=80&w=1200', type: 'image' }],
    pros: ['Superior optical clarity', 'Easy to thermoform and glue', 'High surface hardness'],
    cons: ['More brittle than Polycarbonate'],
    price: 2400,
    pricingType: 'unit',
    engineeringSpecs: { length: 2440, width: 1220, thickness: 5, weight: 17.6 },
    technicalSpecs: [
        { label: 'Refractive Index', value: '1.49' },
        { label: 'Rockwell Hardness', value: 'M 102' },
        { label: 'Flexural Strength', value: '116 MPa' }
    ],
    tags: ['Acrylic', 'Perspex', 'Display', 'Clarity'],
    documents: []
  }
];
