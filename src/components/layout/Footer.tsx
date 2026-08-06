import { Glasses, Camera, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-vikko-dark border-t border-vikko-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Glasses className="w-6 h-6 text-vikko-accent" />
              <span className="text-lg font-bold text-vikko-white">
                VIKKO<span className="text-vikko-accent">SPORT</span>
              </span>
            </div>
            <p className="text-vikko-muted text-sm max-w-sm">
              Performance eyewear engineered for athletes. Prescription-ready sports sunglasses designed in the USA.
            </p>
          </div>

          <div>
            <h4 className="text-vikko-white font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-vikko-muted">
              <li><a href="/shop" className="hover:text-vikko-accent transition-colors">All Sunglasses</a></li>
              <li><a href="/rx-sports" className="hover:text-vikko-accent transition-colors">RX Sports</a></li>
              <li><a href="/accessories" className="hover:text-vikko-accent transition-colors">Accessories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-vikko-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-vikko-muted">
              <li><a href="/shipping" className="hover:text-vikko-accent transition-colors">Shipping</a></li>
              <li><a href="/returns" className="hover:text-vikko-accent transition-colors">Returns</a></li>
              <li><a href="/contact" className="hover:text-vikko-accent transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-vikko-gray flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-vikko-muted text-sm">
            © 2026 Vikko Sport. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-vikko-muted hover:text-vikko-accent transition-colors">
              <Camera className="w-5 h-5" />
            </a>
            <a href="#" className="text-vikko-muted hover:text-vikko-accent transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
