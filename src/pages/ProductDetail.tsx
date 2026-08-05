import { useRoute } from 'wouter';
import { useState } from 'react';
import { Star, ShoppingCart, Shield, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn, formatPrice } from '../lib/utils';
import type { Product } from '../types/product';

const mockProduct: Product = {
  id: '1',
  sku: 'VS-001-BLK',
  name: 'Vikko Velocity Black',
  slug: 'vikko-velocity-black',
  price: 149,
  description: 'Ultra-lightweight cycling sunglasses with interchangeable lenses. The Velocity frame weighs just 24g and features adjustable nose pads for a secure fit during high-intensity rides.',
  features: [
    'Interchangeable PC lenses (clear, smoke, revo red)',
    'TR90 ultra-lightweight frame (24g)',
    'Adjustable rubber nose pads',
    'Anti-slip temple tips',
    'UV400 protection',
  ],
  images: [
    { url: '/images/vs-001-front.jpg', alt: 'Front view', angle: 'front' },
    { url: '/images/vs-001-45.jpg', alt: '45 degree view', angle: '45' },
    { url: '/images/vs-001-side.jpg', alt: 'Side view', angle: 'side' },
  ],
  colors: [
    { id: 'blk', name: 'Matte Black', hex: '#1a1a1a' },
    { id: 'wht', name: 'Arctic White', hex: '#f5f5f5' },
    { id: 'blu', name: 'Deep Blue', hex: '#1e3a5f' },
  ],
  category: 'sunglasses',
  tags: ['cycling', 'running'],
  inStock: true,
  rxCompatible: true,
  rating: 4.8,
  reviewCount: 124,
};

export function ProductDetail() {
  const [match, params] = useRoute('/product/:slug');
  const [selectedColor, setSelectedColor] = useState(mockProduct.colors[0].id);
  const [activeImage, setActiveImage] = useState(0);

  if (!match) return null;

  const color = mockProduct.colors.find(c => c.id === selectedColor) || mockProduct.colors[0];

  return (
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-vikko-dark rounded-lg overflow-hidden">
              <img
                src={mockProduct.images[activeImage]?.url}
                alt={mockProduct.images[activeImage]?.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3">
              {mockProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    'w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors',
                    activeImage === idx ? 'border-vikko-accent' : 'border-vikko-gray'
                  )}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-vikko-white mb-2">{mockProduct.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < Math.floor(mockProduct.rating)
                          ? 'text-vikko-accent fill-vikko-accent'
                          : 'text-vikko-gray'
                      )}
                    />
                  ))}
                </div>
                <span className="text-vikko-muted text-sm">{mockProduct.rating} ({mockProduct.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-vikko-white">
              {formatPrice(mockProduct.price)}
            </div>

            <p className="text-vikko-muted leading-relaxed">{mockProduct.description}</p>

            <div>
              <h3 className="text-vikko-white font-semibold mb-3">Color: <span className="text-vikko-muted font-normal">{color.name}</span></h3>
              <div className="flex gap-3">
                {mockProduct.colors.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.id)}
                    className={cn(
                      'w-10 h-10 rounded-full border-2 transition-all',
                      selectedColor === c.id ? 'border-vikko-accent scale-110' : 'border-vikko-gray'
                    )}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {mockProduct.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-vikko-muted">
                  <Check className="w-4 h-4 text-vikko-accent flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="flex-1 gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>
              {mockProduct.rxCompatible && (
                <Button variant="outline" size="lg" className="flex-1 gap-2">
                  <Shield className="w-5 h-5" />
                  Add RX Lenses
                </Button>
              )}
            </div>

            {mockProduct.rxCompatible && (
              <p className="text-vikko-accent text-sm flex items-center gap-1">
                <Check className="w-4 h-4" />
                Prescription lenses available for this frame
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
