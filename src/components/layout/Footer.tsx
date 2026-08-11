import { Glasses } from 'lucide-react';
import { Link } from 'wouter';

export function Footer() {
  return (
    <footer className="bg-vikko-black text-vikko-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Glasses className="w-6 h-6 text-vikko-white" />
              <span className="font-display text-lg font-bold text-vikko-white">
                VIKKO<span className="text-vikko-accent">SPORT</span>
              </span>
            </div>
            <p className="text-white/60 text-sm max-w-sm leading-relaxed">
              Prescription-ready performance eyewear for cyclists, runners, and outdoor athletes.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide mb-4">Shop</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li>
                <Link href="/shop?type=sunglasses" className="hover:text-vikko-white transition-colors cursor-pointer">
                  Sunglasses
                </Link>
              </li>
              <li>
                <Link href="/shop?type=sunglasses&rx=1" className="hover:text-vikko-white transition-colors cursor-pointer">
                  Prescription Sunglasses
                </Link>
              </li>
              <li>
                <Link href="/shop?type=eyeglasses" className="hover:text-vikko-white transition-colors cursor-pointer">
                  Eyeglasses
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide mb-4">Support</h4>
            <ul className="space-y-2.5 text-sm text-white/60">
              <li><a href="/shipping" className="hover:text-vikko-white transition-colors">Shipping</a></li>
              <li><a href="/returns" className="hover:text-vikko-white transition-colors">Returns</a></li>
              <li><a href="/contact" className="hover:text-vikko-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm">© 2026 Vikko Sport. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
