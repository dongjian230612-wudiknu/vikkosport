import { Link, useLocation } from 'wouter';
import { ShoppingCart, Menu, X, Glasses, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { SPORTS } from '../../lib/sports';
import { SportMegaMenu } from './SportMegaMenu';

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
  const [sportOpen, setSportOpen] = useState(false);
  const [mobileSportOpen, setMobileSportOpen] = useState(false);
  const sportRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sportActive = location.startsWith('/shop') && location.includes('sport=');

  const openSport = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setSportOpen(true);
  };

  const scheduleCloseSport = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setSportOpen(false), 150);
  };

  useEffect(() => {
    setSportOpen(false);
    setMobileOpen(false);
    setMobileSportOpen(false);
  }, [location]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 relative bg-vikko-black/95 backdrop-blur-sm border-b border-vikko-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <Glasses className="w-7 h-7 text-vikko-accent group-hover:scale-110 transition-transform" />
            <span className="text-xl font-bold tracking-tight text-vikko-white">
              VIKKO<span className="text-vikko-accent">SPORT</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <div
              ref={sportRef}
              className="relative"
              onMouseEnter={openSport}
              onMouseLeave={scheduleCloseSport}
            >
              <button
                type="button"
                className={cn(
                  'flex items-center gap-1 text-sm font-medium transition-colors hover:text-vikko-accent',
                  sportOpen || sportActive ? 'text-vikko-accent' : 'text-vikko-muted'
                )}
                aria-expanded={sportOpen}
                aria-haspopup="true"
                onClick={() => setSportOpen(v => !v)}
              >
                Sport
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', sportOpen && 'rotate-180')} />
              </button>
              {(sportOpen || sportActive) && (
                <span className="absolute left-0 right-0 -bottom-[21px] h-0.5 bg-vikko-white" />
              )}
            </div>

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
              type="button"
              className="md:hidden p-2 text-vikko-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {sportOpen && (
        <div
          className="hidden md:block absolute left-0 right-0 top-full"
          onMouseEnter={openSport}
          onMouseLeave={scheduleCloseSport}
        >
          <SportMegaMenu onNavigate={() => setSportOpen(false)} />
        </div>
      )}

      {mobileOpen && (
        <div className="md:hidden bg-vikko-dark border-t border-vikko-gray">
          <nav className="px-4 py-3 space-y-1">
            <button
              type="button"
              className="flex w-full items-center justify-between py-2 text-sm font-medium text-vikko-muted"
              onClick={() => setMobileSportOpen(v => !v)}
            >
              Sport
              <ChevronDown className={cn('w-4 h-4 transition-transform', mobileSportOpen && 'rotate-180')} />
            </button>
            {mobileSportOpen && (
              <div className="pl-3 pb-2 space-y-1 border-l border-vikko-gray ml-1">
                {SPORTS.map(sport => (
                  <Link
                    key={sport.id}
                    href={sport.href}
                    className="block py-2 text-sm text-vikko-muted hover:text-vikko-accent"
                    onClick={() => setMobileOpen(false)}
                  >
                    {sport.label}
                  </Link>
                ))}
              </div>
            )}

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
