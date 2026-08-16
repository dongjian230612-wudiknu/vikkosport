import { Link } from 'wouter';
import { Button } from '../components/ui/Button';
import { ArrowRight, Shield, Truck, RotateCcw } from 'lucide-react';
import { ProductCard } from '../components/product/ProductCard';
import { getFeaturedProducts } from '../data/products';
import { useCatalog } from '../lib/catalog';
import heroSports from '../assets/hero-sports.jpg';
import mensSunglasses from '../assets/categories/mens-sunglasses.jpg';
import womensSunglasses from '../assets/categories/womens-sunglasses.jpg';
import bestsellers from '../assets/categories/bestsellers.jpg';
import newArrivals from '../assets/categories/new-arrivals.jpg';
import cyclingSport from '../assets/sports/cycling.jpg';
import runningSport from '../assets/sports/running.jpg';
import rxPrograms from '../assets/banners/rx-programs.jpg';

const categories = [
  { label: "Men's Sunglasses", href: '/shop?type=sunglasses&gender=men', image: mensSunglasses },
  { label: "Women's Sunglasses", href: '/shop?type=sunglasses&gender=women', image: womensSunglasses },
  { label: 'Best Sellers', href: '/shop?bestsellers=1', image: bestsellers },
  { label: 'New Arrivals', href: '/shop?new=1', image: newArrivals },
];

const sports = [
  {
    label: 'Cycling',
    tagline: 'Clarity at speed — frames built for the road and gravel.',
    cta: 'Shop cycling',
    href: '/shop?type=sunglasses&sport=cycling',
    image: cyclingSport,
  },
  {
    label: 'Running',
    tagline: 'Stay locked in — lightweight optics for every mile.',
    cta: 'Shop running',
    href: '/shop?type=sunglasses&sport=running',
    image: runningSport,
  },
];

export function Home() {
  const { products, loading } = useCatalog();
  const featuredProducts = getFeaturedProducts(3, products);

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
                {cat.image ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${cat.image}')` }}
                  />
                ) : null}
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

      {/* Shop by sport — two large tiles */}
      <section className="bg-vikko-canvas py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-vikko-black mb-2">
            Shop by Sport
          </h2>
          <p className="text-vikko-muted mb-8 text-sm md:text-base">
            Optics tuned for the demands of your discipline.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {sports.map(sport => (
              <Link
                key={sport.href}
                href={sport.href}
                className="group relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-lg bg-vikko-black cursor-pointer"
              >
                {sport.image ? (
                  <img
                    src={sport.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-vikko-black/70 via-vikko-black/25 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7 gap-3">
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-vikko-white">
                      {sport.label}
                    </h3>
                    <p className="mt-1 text-sm text-white/80 max-w-sm">{sport.tagline}</p>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-md bg-vikko-black px-4 py-2.5 text-sm font-semibold text-vikko-white">
                    {sport.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* RX Programs banner */}
      <section className="relative min-h-[420px] md:min-h-[520px] overflow-hidden bg-vikko-black">
        <img
          src={rxPrograms}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[center_20%]"
        />
        <div className="absolute inset-0 bg-vikko-black/45" />
        <div className="relative z-10 mx-auto flex min-h-[420px] md:min-h-[520px] max-w-7xl items-end px-4 sm:px-6 lg:px-8 pb-12 md:pb-16">
          <div className="max-w-lg">
            <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-wide text-vikko-white">
              RX Programs
            </h2>
            <p className="mt-3 text-base md:text-lg text-white/85">
              All optical solutions tailored to your needs
            </p>
            <Link href="/shop?type=sunglasses&rx=1" className="mt-6 inline-block">
              <span className="inline-flex items-center gap-2 rounded-md bg-vikko-white px-5 py-3 text-sm font-bold uppercase tracking-wide text-vikko-black hover:bg-vikko-canvas cursor-pointer">
                Discover Performance Sunglasses
                <ArrowRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
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
          {loading ? (
            <p className="text-vikko-muted py-12 text-center">Loading catalog…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
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
