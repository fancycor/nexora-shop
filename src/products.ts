export interface Product {
  id: string;
  name: string;
  bengaliName: string;
  category: 'Electronics' | 'Traditional Fashion' | 'Pantry & Grocery';
  price: number;
  originalPrice: number;
  image: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  tagline: string;
  description: string;
  specifications: string[];
  unitOrWarranty?: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Wireless Earbuds',
    bengaliName: 'ওয়্যারলেস এয়ারবাডস',
    category: 'Electronics',
    price: 1850,
    originalPrice: 2450,
    image: '/src/assets/images/earbuds_wireless_1792914497822.jpg',
    rating: 4.8,
    reviewsCount: 142,
    inStock: true,
    stockCount: 28,
    tagline: 'Deep bass, active noise reduction & 32-hour total playback',
    description: 'Ultra-low latency wireless earbuds with environmental noise cancellation (ENC) for crystal clear voice calls, deep responsive bass, and IPX5 sweat resistance. Ideal for everyday commutes in Dhaka.',
    specifications: [
      'Bluetooth 5.3 Quick-Pairing',
      '32 Hours Battery with Type-C Case',
      'Dual-Mic Environmental Noise Cancellation',
      'IPX5 Splash & Sweat Resistant'
    ],
    unitOrWarranty: '6 Months Replacement Warranty'
  },
  {
    id: 'prod-2',
    name: "Men's Panjabi",
    bengaliName: "এক্সক্লুসিভ মেনস পাঞ্জাবি",
    category: 'Traditional Fashion',
    price: 2250,
    originalPrice: 2950,
    image: '/src/assets/images/mens_panjabi_1792914499489.jpg',
    rating: 4.9,
    reviewsCount: 96,
    inStock: true,
    stockCount: 19,
    tagline: 'Tailored 100% fine cotton with detailed neck embroidery',
    description: 'Crafted from breathable premium combed cotton featuring exquisite neck and cuff embroidery with metallic-finish buttons. Perfect for Jummah prayers, Eid festivals, and family celebrations.',
    specifications: [
      '100% Pure Combed Cotton Fabric',
      'Intricate Mandarin Collar Embroidery',
      'Comfort Semi-Slim Tailored Silhouette',
      'Side Pockets with reinforced stitching'
    ],
    unitOrWarranty: 'Size: 40, 42, 44 Available'
  },
  {
    id: 'prod-3',
    name: 'Smartwatch',
    bengaliName: 'স্মার্টওয়াচ প্রো',
    category: 'Electronics',
    price: 3450,
    originalPrice: 4200,
    image: '/src/assets/images/smartwatch_pro_1792914500568.jpg',
    rating: 4.7,
    reviewsCount: 88,
    inStock: true,
    stockCount: 14,
    tagline: 'Vibrant HD display, SpO2 & Heart Rate monitor with BD call alert',
    description: 'Sleek curved full-touch smartwatch featuring real-time biometric tracking, step counter, blood oxygen saturation monitor, sleep analysis, and Bluetooth incoming caller display.',
    specifications: [
      '1.85-inch Ultra HD Curved Color Display',
      '24/7 Heart Rate & SpO2 Monitoring',
      '7-10 Days Active Battery Life',
      'Magnetic Fast Charger included'
    ],
    unitOrWarranty: '1 Year Brand Warranty'
  },
  {
    id: 'prod-4',
    name: 'Jamdani Saree',
    bengaliName: 'ঐতিহ্যবাহী জামদানি শাড়ি',
    category: 'Traditional Fashion',
    price: 4800,
    originalPrice: 6200,
    image: '/src/assets/images/jamdani_saree_1792914500136.jpg',
    rating: 5.0,
    reviewsCount: 73,
    inStock: true,
    stockCount: 8,
    tagline: 'Authentic handwoven Dhakai Jamdani in emerald and gold zari',
    description: 'Genuine handloom Dhakai Jamdani woven by skilled artisans in Narayanganj. Soft lightweight feel with rich floral motifs and golden thread borders that drape with timeless grace.',
    specifications: [
      'Traditional Handloom Craftsmanship',
      'Dhakai Resham Cotton-Silk Blend',
      'Full 12-Hand (14 Haath) Length with Blouse Piece',
      'Dry Clean Recommended'
    ],
    unitOrWarranty: 'Artisan Certified Handloom'
  },
  {
    id: 'prod-5',
    name: 'Power Bank',
    bengaliName: 'হাই-স্পিড পাওয়ার ব্যাংক',
    category: 'Electronics',
    price: 1650,
    originalPrice: 2200,
    image: '/src/assets/images/power_bank_slim_1792914502941.jpg',
    rating: 4.8,
    reviewsCount: 115,
    inStock: true,
    stockCount: 35,
    tagline: '20,000mAh 22.5W Fast Charging with Dual USB & Type-C Output',
    description: 'Pocket-friendly high-density lithium polymer power bank capable of charging modern smartphones 3-4 times. Features smart overheat protection and LED battery indicator.',
    specifications: [
      '20,000mAh High-Density Capacity',
      '22.5W QC 3.0 & PD Fast Charging',
      'Dual USB-A + Type-C Bidirectional Port',
      'Multi-protection against surge & heat'
    ],
    unitOrWarranty: '6 Months Replacement Guarantee'
  },
  {
    id: 'prod-6',
    name: 'Pure Mustard Oil',
    bengaliName: 'খাঁটি ঘানি-ভাঙা সরিষার তেল',
    category: 'Pantry & Grocery',
    price: 360,
    originalPrice: 420,
    image: '/src/assets/images/mustard_oil_pure_1792914501238.jpg',
    rating: 4.9,
    reviewsCount: 204,
    inStock: true,
    stockCount: 42,
    tagline: '100% Cold-pressed wood ghani mustard oil with authentic pungency',
    description: 'Traditionally pressed from prime Bangladeshi mustard seeds using conventional wooden ghani. Free from adulteration, synthetic aromas, and preservatives. Gives authentic flavor to bhortas, hilsa fish, and pickles.',
    specifications: [
      'Traditional Cold Wood-Ghani Pressed',
      'Naturally Pungent (ঝাঁঝালো) & Aromatic',
      'Zero Preservatives or Chemicals',
      'Net Volume: 1 Litre Food-Grade Bottle'
    ],
    unitOrWarranty: '100% Purity Guaranteed (১ লিটার)'
  }
];

export const DELIVERY_OPTIONS = {
  dhaka: {
    id: 'inside_dhaka',
    name: 'Inside Dhaka',
    bengaliName: 'ঢাকার ভেতরে',
    charge: 60,
    estimatedDays: '1-2 Days (24-48 Hours)'
  },
  outside: {
    id: 'outside_dhaka',
    name: 'Outside Dhaka',
    bengaliName: 'ঢাকার বাইরে',
    charge: 120,
    estimatedDays: '2-4 Days (Courier Service)'
  }
} as const;
