import type { Product } from '../types/product';
import { productImageUrl } from '../lib/productImage';

/**
 * Central product catalog for Vikko Sport.
 * Edit prices / copy / RX flags here — Shop, Home, and PDP all import from this file.
 */
export const products: Product[] = [
  {
    id: '1',
    sku: 'VS-001-BLK',
    name: 'Vikko Velocity',
    slug: 'vikko-velocity-black',
    price: 149,
    description:
      'Ultra-lightweight cycling sunglasses with interchangeable lenses. The Velocity frame weighs just 24g and features adjustable nose pads for a secure fit during high-intensity rides.',
    features: [
      'Interchangeable PC lenses (clear, smoke, revo red)',
      'TR90 ultra-lightweight frame (24g)',
      'Adjustable rubber nose pads',
      'Anti-slip temple tips',
      'UV400 protection',
    ],
    images: [
      { url: productImageUrl('vs-001', 'front'), alt: 'Velocity front view', angle: 'front' },
      { url: productImageUrl('vs-001', '45'), alt: 'Velocity 45 degree view', angle: '45' },
      { url: productImageUrl('vs-001', 'side'), alt: 'Velocity side view', angle: 'side' },
    ],
    colors: [
      { id: 'blk', name: 'Matte Black', hex: '#1a1a1a' },
      { id: 'wht', name: 'Arctic White', hex: '#f5f5f5' },
      { id: 'blu', name: 'Deep Blue', hex: '#1e3a5f' },
    ],
    category: 'sunglasses',
    gender: 'men',
    fit: 'medium',
    isNew: true,
    tags: ['road-cycling', 'gravel-cycling', 'cycling', 'running'],
    inStock: true,
    rxCompatible: true,
    rxType: 'direct',
    specs: {
      lensMaterial: 'Polycarbonate',
      frameMaterial: 'TR90',
      weight: '24g',
      uvProtection: 'UV400',
    },
    lensOptions: {
      colors: ['Clear', 'Smoke', 'Revo Red'],
      photochromic: false,
      polarized: false,
    },
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: '2',
    sku: 'VS-002-BLU',
    name: 'Vikko Storm',
    slug: 'vikko-storm-blue',
    price: 179,
    originalPrice: 199,
    description:
      'Polarized sports sunglasses with hydrophobic coating for trail running and mountain bike.',
    features: ['Polarized lenses', 'Hydrophobic coating', 'Floatable frame'],
    images: [
      { url: productImageUrl('vs-002', 'front'), alt: 'Storm front view', angle: 'front' },
      { url: productImageUrl('vs-002', '45'), alt: 'Storm 45 degree view', angle: '45' },
      { url: productImageUrl('vs-002', 'side'), alt: 'Storm side view', angle: 'side' },
    ],
    colors: [
      { id: 'blu', name: 'Deep Blue', hex: '#1e3a5f' },
      { id: 'red', name: 'Racing Red', hex: '#c41e3a' },
    ],
    category: 'sunglasses',
    gender: 'women',
    fit: 'small',
    isNew: false,
    tags: ['trail-running', 'mountain-bike', 'running', 'cycling'],
    inStock: true,
    rxCompatible: false,
    rxType: null,
    specs: {
      lensMaterial: 'Polarized polycarbonate',
      frameMaterial: 'Grilamid',
      weight: '29g',
      uvProtection: 'UV400',
    },
    lensOptions: {
      colors: ['Smoke', 'Blue Mirror'],
      photochromic: false,
      polarized: true,
    },
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: '3',
    sku: 'VS-003-CLR',
    name: 'Vikko Apex',
    slug: 'vikko-apex-clear',
    price: 159,
    description:
      'Prescription-ready sport eyeglasses for training and daily wear. Rx by default.',
    features: ['Rx-ready', 'TR90 frame', 'Anti-slip nose pads'],
    images: [
      { url: productImageUrl('vs-003', 'front'), alt: 'Apex front view', angle: 'front' },
    ],
    colors: [
      { id: 'clr', name: 'Crystal', hex: '#e8e8e8' },
      { id: 'blk', name: 'Matte Black', hex: '#1a1a1a' },
    ],
    category: 'eyeglasses',
    gender: 'men',
    fit: 'large',
    isNew: true,
    tags: ['cycling', 'running'],
    inStock: true,
    rxCompatible: true,
    rxType: 'direct',
    specs: {
      lensMaterial: 'Rx-ready demo lenses',
      frameMaterial: 'TR90',
      weight: '26g',
      uvProtection: 'UV400 with tint options',
    },
    lensOptions: {
      colors: ['Clear', 'Light Tint'],
      photochromic: true,
      polarized: false,
    },
    rating: 4.7,
    reviewCount: 56,
  },
  {
    id: '4',
    sku: 'VS-004-GRY',
    name: 'Vikko Trail Insert',
    slug: 'vikko-trail-insert',
    price: 189,
    description:
      'Performance sunglasses with optical insert dock for high-Rx athletes on trail and gravel.',
    features: ['Optical insert compatible', 'Ventilated lens', 'Adjustable temple tips'],
    images: [
      { url: productImageUrl('vs-004', 'front'), alt: 'Trail Insert front view', angle: 'front' },
    ],
    colors: [
      { id: 'gry', name: 'Graphite', hex: '#4a4a4a' },
      { id: 'olv', name: 'Olive', hex: '#556b2f' },
    ],
    category: 'sunglasses',
    gender: 'unisex',
    fit: 'medium',
    isNew: true,
    tags: ['trail-running', 'gravel-cycling', 'mountain-bike', 'running'],
    inStock: true,
    rxCompatible: true,
    rxType: 'insert',
    specs: {
      lensMaterial: 'Impact-rated polycarbonate',
      frameMaterial: 'TR90 + TPU',
      weight: '31g',
      uvProtection: 'UV400',
    },
    lensOptions: {
      colors: ['Smoke', 'Amber'],
      photochromic: true,
      polarized: false,
    },
    rating: 4.5,
    reviewCount: 38,
  },
  {
    id: '5',
    sku: 'VS-005-WHT',
    name: 'Vikko Aero Clip',
    slug: 'vikko-aero-clip',
    price: 129,
    description:
      'Lightweight road frames with magnetic clip-on sun shield for commute-to-ride athletes.',
    features: ['Magnetic clip-on shield', 'Rx-ready base frame', 'Anti-fog vents'],
    images: [
      { url: productImageUrl('vs-005', 'front'), alt: 'Aero Clip front view', angle: 'front' },
    ],
    colors: [
      { id: 'wht', name: 'Arctic White', hex: '#f5f5f5' },
      { id: 'blk', name: 'Matte Black', hex: '#1a1a1a' },
    ],
    category: 'eyeglasses',
    gender: 'women',
    fit: 'small',
    isNew: false,
    tags: ['road-cycling', 'cycling', 'running'],
    inStock: true,
    rxCompatible: true,
    rxType: 'clip-on',
    specs: {
      lensMaterial: 'CR-39 / polycarbonate options',
      frameMaterial: 'TR90',
      weight: '22g (+ clip)',
      uvProtection: 'UV400 with clip-on',
    },
    lensOptions: {
      colors: ['Clear', 'Smoke Clip'],
      photochromic: false,
      polarized: true,
    },
    rating: 4.4,
    reviewCount: 27,
  },
];

export function getProductBySlug(
  slug: string,
  list: Product[] = products
): Product | undefined {
  return list.find(p => p.slug === slug);
}

export function getFeaturedProducts(
  limit = 3,
  list: Product[] = products
): Product[] {
  return list.filter(p => p.isNew || p.rxCompatible).slice(0, limit);
}

export function getRxCompatibleProducts(list: Product[] = products): Product[] {
  return list.filter(p => p.rxCompatible);
}

export function getProductsByCategory(
  category: Product['category'],
  list: Product[] = products
): Product[] {
  return list.filter(p => p.category === category);
}

/** Related products for PDP — same category first, then fill from catalog. */
export function getRelatedProducts(
  slug: string,
  limit = 4,
  list: Product[] = products
): Product[] {
  const current = getProductBySlug(slug, list);
  if (!current) return list.slice(0, limit);

  const sameCategory = list.filter(
    p => p.slug !== slug && p.category === current.category
  );
  const rest = list.filter(
    p => p.slug !== slug && p.category !== current.category
  );
  return [...sameCategory, ...rest].slice(0, limit);
}
