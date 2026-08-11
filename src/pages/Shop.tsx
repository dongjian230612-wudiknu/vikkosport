import { useState } from 'react';
import { useSearch } from 'wouter';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/Button';
import { SlidersHorizontal } from 'lucide-react';
import { SPORTS } from '../lib/sports';
import type { Product } from '../types/product';

const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'VS-001-BLK',
    name: 'Vikko Velocity Black',
    slug: 'vikko-velocity-black',
    price: 149,
    description: 'Ultra-lightweight cycling sunglasses with interchangeable lenses.',
    features: ['Interchangeable lenses', 'TR90 frame', 'Rubber grip temples'],
    images: [{ url: '/images/vs-001-front.jpg', alt: 'Velocity Black Front', angle: 'front' }],
    colors: [
      { id: 'blk', name: 'Matte Black', hex: '#1a1a1a' },
      { id: 'wht', name: 'Arctic White', hex: '#f5f5f5' },
    ],
    category: 'sunglasses',
    gender: 'men',
    fit: 'medium',
    isNew: true,
    tags: ['road-cycling', 'gravel-cycling', 'cycling', 'running'],
    inStock: true,
    rxCompatible: true,
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: '2',
    sku: 'VS-002-BLU',
    name: 'Vikko Storm Blue',
    slug: 'vikko-storm-blue',
    price: 179,
    originalPrice: 199,
    description: 'Polarized sports sunglasses with hydrophobic coating.',
    features: ['Polarized lenses', 'Hydrophobic coating', 'Floatable frame'],
    images: [{ url: '/images/vs-002-front.jpg', alt: 'Storm Blue Front', angle: 'front' }],
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
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: '3',
    sku: 'VS-003-CLR',
    name: 'Vikko Apex Clear',
    slug: 'vikko-apex-clear',
    price: 159,
    description: 'Prescription-ready sport eyeglasses for training and daily wear.',
    features: ['Rx-ready', 'TR90 frame', 'Anti-slip nose pads'],
    images: [{ url: '/images/vs-003-front.jpg', alt: 'Apex Clear Front', angle: 'front' }],
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
    rating: 4.7,
    reviewCount: 56,
  },
];

const filterChips = ['All', 'Sunglasses', 'Eyeglasses', 'Accessories'];

function titleFromParams(params: URLSearchParams): { title: string; subtitle: string } {
  const type = params.get('type');
  const gender = params.get('gender');
  const sport = params.get('sport');
  const fit = params.get('fit');
  const rx = params.get('rx');
  const isNew = params.get('new');

  if (type === 'sunglasses') {
    if (rx === '1') return { title: 'Prescription Sunglasses', subtitle: 'Rx-ready performance sunglasses.' };
    if (gender === 'men') return { title: "Men's Sunglasses", subtitle: 'Sport sunglasses sized for men.' };
    if (gender === 'women') return { title: "Women's Sunglasses", subtitle: 'Sport sunglasses sized for women.' };
    if (isNew === '1') return { title: 'New Sunglasses', subtitle: 'Latest arrivals in performance eyewear.' };
    if (fit) return { title: `${fit[0].toUpperCase()}${fit.slice(1)} Fit Sunglasses`, subtitle: 'Find your ideal frame fit.' };
    if (sport && sport !== 'all') {
      const label = sport[0].toUpperCase() + sport.slice(1);
      return { title: `${label} Sunglasses`, subtitle: `Sunglasses built for ${sport}.` };
    }
    return { title: 'All Sunglasses', subtitle: 'Performance sunglasses for every condition.' };
  }

  if (type === 'eyeglasses') {
    if (gender === 'men') return { title: "Men's Eyeglasses", subtitle: 'Prescription sport eyeglasses for men.' };
    if (gender === 'women') return { title: "Women's Eyeglasses", subtitle: 'Prescription sport eyeglasses for women.' };
    if (isNew === '1') return { title: 'New Eyeglasses', subtitle: 'Latest prescription sport frames.' };
    if (sport) {
      const label = sport[0].toUpperCase() + sport.slice(1);
      return { title: `${label} Eyeglasses`, subtitle: `Prescription frames built for ${sport}.` };
    }
    return { title: 'All Eyeglasses', subtitle: 'Prescription sport eyeglasses — Rx by default.' };
  }

  const sportItem = SPORTS.find(s => s.id === sport);
  if (sportItem) {
    return {
      title: sportItem.label,
      subtitle: `Performance eyewear built for ${sportItem.label.toLowerCase()}.`,
    };
  }

  return { title: 'Shop', subtitle: 'Performance eyewear for every sport.' };
}

export function Shop() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const { title, subtitle } = titleFromParams(params);
  const [activeChip, setActiveChip] = useState('All');

  const type = params.get('type');
  const gender = params.get('gender');
  const sport = params.get('sport');
  const fit = params.get('fit');
  const rx = params.get('rx');
  const isNew = params.get('new');

  const filtered = (() => {
    let list = mockProducts;

    if (type === 'sunglasses' || type === 'eyeglasses' || type === 'accessories') {
      list = list.filter(p => p.category === type);
    }

    if (gender === 'men' || gender === 'women') {
      list = list.filter(p => p.gender === gender || p.gender === 'unisex');
    }

    if (fit === 'small' || fit === 'medium' || fit === 'large') {
      list = list.filter(p => p.fit === fit);
    }

    if (rx === '1') {
      list = list.filter(p => p.rxCompatible);
    }

    if (isNew === '1') {
      list = list.filter(p => p.isNew);
    }

    if (sport && sport !== 'all') {
      list = list.filter(p => p.tags.includes(sport));
    }

    if (activeChip !== 'All') {
      const key = activeChip.toLowerCase() as Product['category'];
      list = list.filter(p => p.category === key);
    }

    return list;
  })();

  return (
    <div className="animate-fade-in bg-vikko-white min-h-full">
      <div className="bg-vikko-canvas border-b border-vikko-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-vikko-black mb-3">{title}</h1>
          <p className="text-vikko-muted">{subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <SlidersHorizontal className="w-5 h-5 text-vikko-muted" />
          {filterChips.map(cat => (
            <Button
              key={cat}
              variant={activeChip === cat ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveChip(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-vikko-muted">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
