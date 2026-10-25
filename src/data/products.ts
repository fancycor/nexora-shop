
export interface Product {
  id: string;
  name: string;
  bengaliName: string;
  category: string;
  description: string;
  tagline: string;
  price: number;
  rating: number;
  image: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Multifunctional Cleaning Tool Set',
    bengaliName: 'মাল্টিফাংশনাল ক্লিনিং টুল সেট',
    category: 'Accessories',
    description: 'A handy cleaning tool set for everyday use.',
    tagline: 'Useful for home and office',
    price: 350,
    rating: 4.5,
    image: 'https://placehold.co/600x400?text=Cleaning+Tool',
  },
  {
    id: '2',
    name: 'LED Temperature Water Bottle',
    bengaliName: 'এলইডি তাপমাত্রা প্রদর্শন বোতল',
    category: 'Home & Lifestyle',
    description: 'A reusable bottle with an LED temperature display.',
    tagline: 'For everyday use',
    price: 550,
    rating: 4.5,
    image: 'https://placehold.co/600x400?text=Water+Bottle',
  },
];

