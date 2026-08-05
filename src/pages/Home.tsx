import { Link } from 'wouter';
import { Button } from '../components/ui/Button';
import { ArrowRight, Shield, Truck, RotateCcw } from 'lucide-react';

export function Home() {
  return (
    <div className="animate-fade-in">
      <section className="relative bg-vikko-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-vikko-black via-vikko-black/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('/images/hero-sports.jpg')] bg-cover bg-center opacity-40" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-vikko-white leading-tight mb-6">
              Performance Eyewear<br />
              <span className="text-vikko-accent">Built for Speed</span>
            </h1>
            <p className="text-vikko-muted text-lg mb-8 max-w-lg">
              Prescription-ready sports sunglasses engineered for cyclists, runners, and outdoor athletes. Lightweight. Impact-resistant. Crystal clear.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop">
                <Button size="lg" className="gap-2">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/rx-sports">
                <Button variant="outline" size="lg">
                  RX Configurator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-vikko-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-vikko-accent flex-shrink-0" />
              <div>
                <h3 className="text-vikko-white font-semibold mb-1">Impact Resistant</h3>
                <p className="text-vikko-muted text-sm">ANSI Z87.1 certified lenses for maximum protection during high-intensity sports.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Truck className="w-8 h-8 text-vikko-accent flex-shrink-0" />
              <div>
                <h3 className="text-vikko-white font-semibold mb-1">Free Shipping</h3>
                <p className="text-vikko-muted text-sm">Free standard shipping on all orders over $75. Express options available.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <RotateCcw className="w-8 h-8 text-vikko-accent flex-shrink-0" />
              <div>
                <h3 className="text-vikko-white font-semibold mb-1">30-Day Returns</h3>
                <p className="text-vikko-muted text-sm">Not satisfied? Full refund within 30 days, no questions asked.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-vikko-black py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-vikko-white mb-4">
            Need Prescription Lenses?
          </h2>
          <p className="text-vikko-muted text-lg mb-8">
            Our RX configurator supports single vision, progressive, and bifocal lenses. Upload your prescription and we'll handle the rest.
          </p>
          <Link href="/rx-sports">
            <Button size="lg">Configure RX Lenses</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
