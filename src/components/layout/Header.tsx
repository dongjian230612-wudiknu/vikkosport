import { Link, useLocation } from 'wouter';
import { ShoppingCart, Menu, X, Glasses } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';

interface HeaderProps {
  cartCount?: number;
}

const navItems = [
  { label: 'Shop', href: '/shop' },
  { label: 'RX Sports', href: '/rx-sports' },
  { label: 'About', href: '/about' },
];

export function Header({ cartCount = 0 }: HeaderProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-vikko-black/95 backdrop-blur-sm border-b border-vikko-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Glasses className="w-7 h-7 text-vikko-accent group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold tracking-tight text-vikko-white">
              VIKKO<span className="text-vikko-accent">SPORT</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-vikko-accent',
                  location === item.href ? 'text-vikko-accent' : 'text-vikko-muted'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart" className="relative p-2 text-vikko-white hover:text-vikko-accent transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-vikko-accent text-vikko-black text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 text-vikko-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-vikko-dark border-t border-vikko-gray">
          <nav className="px-4 py-3 space-y-2">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block py-2 text-sm font-medium',
                  location === item.href ? 'text-vikko-accent' : 'text-vikko-muted'
                )}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
