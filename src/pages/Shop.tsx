import { useState } from 'react';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/ui/Button';
import { SlidersHorizontal } from 'lucide-react';
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
    tags: ['cycling', 'running'],
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
    tags: ['water sports', 'fishing'],
    inStock: true,
    rxCompatible: false,
    rating: 4.6,
    reviewCount: 89,
  },
];

const categories = ['All', 'Sunglasses', 'RX Sports', 'Accessories'];

export function Shop() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All'
    ? mockProducts
    : mockProducts.filter(p => p.category === activeCategory.toLowerCase().replace(' ', '-'));

  return (
    <div className="animate-fade-in">
      <div className="bg-vikko-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-vikko-white mb-4">Shop</h1>
          <p className="text-vikko-muted">Performance eyewear for every sport.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <SlidersHorizontal className="w-5 h-5 text-vikko-muted" />
          {categories.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
