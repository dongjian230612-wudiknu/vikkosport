import { Link } from 'wouter';
import { Button } from '../components/ui/Button';
import { ArrowRight, Shield, Truck, RotateCcw } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import type { Product } from '../types/product';
import heroSports from '../assets/hero-sports.jpg';

const featuredProducts: Product[] = [
  {
    id: '1',
    sku: 'VS-001-BLK',
    name: 'Vikko Velocity',
    slug: 'vikko-velocity-black',
    price: 149,
    description: 'Ultra-lightweight cycling sunglasses.',
    features: [],
    images: [{ url: '/images/vs-001-front.jpg', alt: 'Velocity', angle: 'front' }],
    colors: [
      { id: 'blk', name: 'Matte Black', hex: '#1a1a1a' },
      { id: 'wht', name: 'Arctic White', hex: '#f5f5f5' },
    ],
    category: 'sunglasses',
    tags: ['cycling'],
    inStock: true,
    rxCompatible: true,
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
  },
  {
    id: '2',
    sku: 'VS-002-BLU',
    name: 'Vikko Storm',
    slug: 'vikko-storm-blue',
    price: 179,
    originalPrice: 199,
    description: 'Polarized sports sunglasses.',
    features: [],
    images: [{ url: '/images/vs-002-front.jpg', alt: 'Storm', angle: 'front' }],
    colors: [
      { id: 'blu', name: 'Deep Blue', hex: '#1e3a5f' },
      { id: 'red', name: 'Racing Red', hex: '#c41e3a' },
    ],
    category: 'sunglasses',
    tags: ['running'],
    inStock: true,
    rxCompatible: false,
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: '3',
    sku: 'VS-003-CLR',
    name: 'Vikko Apex',
    slug: 'vikko-apex-clear',
    price: 159,
    description: 'Prescription sport eyeglasses.',
    features: [],
    images: [{ url: '/images/vs-003-front.jpg', alt: 'Apex', angle: 'front' }],
    colors: [
      { id: 'clr', name: 'Crystal', hex: '#e8e8e8' },
      { id: 'blk', name: 'Matte Black', hex: '#1a1a1a' },
    ],
    category: 'eyeglasses',
    tags: ['cycling'],
    inStock: true,
    rxCompatible: true,
    rating: 4.7,
    reviewCount: 56,
    isNew: true,
  },
];

const categories = [
  { label: "Men's Sunglasses", href: '/shop?type=sunglasses&gender=men', image: '/images/categories/mens-sunglasses.jpg' },
  { label: "Women's Sunglasses", href: '/shop?type=sunglasses&gender=women', image: '/images/categories/womens-sunglasses.jpg' },
  { label: 'Eyeglasses', href: '/shop?type=eyeglasses', image: '/images/categories/eyeglasses.jpg' },
  { label: 'Prescription', href: '/shop?type=sunglasses&rx=1', image: '/images/categories/rx.jpg' },
];

const sports = [
  { label: 'Cycling', href: '/shop?type=sunglasses&sport=cycling', image: '/images/sports/cycling.jpg' },
  { label: 'Running', href: '/shop?type=sunglasses&sport=running', image: '/images/sports/running.jpg' },
  { label: 'Mountain Bike', href: '/shop?sport=mountain-bike', image: '/images/sports/mountain-bike.jpg' },
  { label: 'Trail Running', href: '/shop?sport=trail-running', image: '/images/sports/trail-running.jpg' },
];

export function Home() {
  return (
    <div className="animate-fade-in">
      {/* Full-bleed hero — brand + one headline + one line + CTAs */}
      <section className="relative min-h-[72vh] md:min-h-[78vh] flex items-end overflow-hidden bg-vikko-canvas">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroSports})` }}
        />
        <div className="absolute inset-0 bg-vikko-black/45" />
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24 pt-32">
          <p className="font-display text-sm font-semibold tracking-[0.2em] uppercase text-white/80 mb-4">
            Vikko Sport
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-vikko-white leading-[1.05] max-w-xl mb-5">
            See every mile clearly
          </h1>
          <p className="text-white/80 text-base md:text-lg max-w-md mb-8">
            Prescription-ready performance eyewear for cycling, running, and the trail.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/shop?type=sunglasses">
              <Button size="lg" className="gap-2 bg-vikko-white text-vikko-black hover:bg-vikko-canvas">
                Shop Sunglasses <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/shop?type=eyeglasses">
              <Button size="lg" variant="outline" className="border-vikko-white text-vikko-white hover:bg-vikko-white hover:text-vikko-black">
                Shop Eyeglasses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section className="bg-vikko-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-vikko-black">Shop by Category</h2>
              <p className="text-vikko-muted mt-2 text-sm md:text-base">Find frames built for how you move.</p>
            </div>
            <Link href="/shop" className="hidden sm:inline-flex text-sm font-semibold text-vikko-black hover:text-vikko-accent transition-colors cursor-pointer">
              Shop all
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {categories.map(cat => (
              <Link key={cat.href} href={cat.href} className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-vikko-canvas cursor-pointer">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${cat.image}')` }}
                />
                <div className="absolute inset-0 bg-vikko-black/25 group-hover:bg-vikko-black/15 transition-colors" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <span className="font-display text-sm md:text-base font-semibold text-vikko-white">
                    {cat.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by sport */}
      <section className="bg-vikko-canvas py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-vikko-black mb-2">Shop by Sport</h2>
          <p className="text-vikko-muted mb-8 text-sm md:text-base">Optics tuned for the demands of your discipline.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {sports.map(sport => (
              <Link
                key={sport.href}
                href={sport.href}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-vikko-white border border-vikko-border cursor-pointer"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-80 transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${sport.image}')` }}
                />
                <div className="absolute inset-0 bg-vikko-black/20" />
                <div className="absolute inset-0 flex items-end p-4">
                  <span className="font-display text-sm font-semibold text-vikko-white uppercase tracking-wide">
                    {sport.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-vikko-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-vikko-black">Top Picks</h2>
              <p className="text-vikko-muted mt-2 text-sm md:text-base">Bestsellers and new arrivals.</p>
            </div>
            <Link href="/shop?type=sunglasses&new=1" className="hidden sm:inline-flex text-sm font-semibold text-vikko-black hover:text-vikko-accent transition-colors cursor-pointer">
              New arrivals
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Rx band */}
      <section className="bg-vikko-black text-vikko-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Need prescription lenses?</h2>
            <p className="text-white/70 text-sm md:text-base">
              Add single vision, progressive, or bifocal lenses to performance frames — Rx starts under Prescription Sunglasses.
            </p>
          </div>
          <Link href="/shop?type=sunglasses&rx=1">
            <Button size="lg" className="bg-vikko-white text-vikko-black hover:bg-vikko-canvas gap-2">
              Shop Prescription <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust */}
      <section className="bg-vikko-white border-t border-vikko-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-vikko-black flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-semibold text-vikko-black mb-1">Impact Resistant</h3>
                <p className="text-vikko-muted text-sm">ANSI Z87.1 certified lenses for high-intensity sports.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Truck className="w-6 h-6 text-vikko-black flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-semibold text-vikko-black mb-1">Free Shipping</h3>
                <p className="text-vikko-muted text-sm">Free standard shipping on orders over $75.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <RotateCcw className="w-6 h-6 text-vikko-black flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-semibold text-vikko-black mb-1">30-Day Returns</h3>
                <p className="text-vikko-muted text-sm">Full refund within 30 days if it is not right.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
