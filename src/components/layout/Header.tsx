import { Link, useLocation, useSearch } from 'wouter';
import { ShoppingCart, Menu, X, Glasses, ChevronDown, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { EYEGLASSES_NAV, flattenNav, SUNGLASSES_NAV } from '../../lib/nav';
import { MegaMenuColumns } from './MegaMenuColumns';

interface HeaderProps {
  cartCount?: number;
}

type MegaKey = 'sunglasses' | 'eyeglasses' | null;

export function Header({ cartCount = 0 }: HeaderProps) {
  const [location] = useLocation();
  const search = useSearch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMega, setOpenMega] = useState<MegaKey>(null);
  const [mobileSection, setMobileSection] = useState<MegaKey>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const params = new URLSearchParams(search);
  const typeParam = params.get('type');

  const sunglassesActive = location.startsWith('/shop') && typeParam === 'sunglasses';
  const eyeglassesActive = location.startsWith('/shop') && typeParam === 'eyeglasses';

  const openMenu = (key: MegaKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMega(key);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMega(null), 150);
  };

  useEffect(() => {
    setOpenMega(null);
    setMobileOpen(false);
    setMobileSection(null);
  }, [location]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const megaTrigger = (
    key: Exclude<MegaKey, null>,
    label: string,
    active: boolean,
  ) => (
    <div
      className="relative"
      onMouseEnter={() => openMenu(key)}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className={cn(
          'flex items-center gap-1 text-sm font-semibold uppercase tracking-wide transition-colors cursor-pointer',
          openMega === key || active ? 'text-vikko-black' : 'text-vikko-ink hover:text-vikko-black'
        )}
        aria-expanded={openMega === key}
        aria-haspopup="true"
        onClick={() => setOpenMega(v => (v === key ? null : key))}
      >
        {label}
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', openMega === key && 'rotate-180')} />
      </button>
      {(openMega === key || active) && (
        <span className="absolute left-0 right-0 -bottom-[17px] h-0.5 bg-vikko-black" />
      )}
    </div>
  );

  const mobileAccordion = (
    key: Exclude<MegaKey, null>,
    label: string,
    links: { id: string; label: string; href: string }[],
  ) => (
    <div>
      <button
        type="button"
        className="flex w-full items-center justify-between py-3 text-sm font-semibold uppercase tracking-wide text-vikko-ink cursor-pointer"
        onClick={() => setMobileSection(v => (v === key ? null : key))}
      >
        {label}
        <ChevronDown className={cn('w-4 h-4 transition-transform', mobileSection === key && 'rotate-180')} />
      </button>
      {mobileSection === key && (
        <div className="pl-3 pb-2 space-y-1 border-l border-vikko-border ml-1">
          {links.map(item => (
            <Link
              key={item.id}
              href={item.href}
              className="block py-2 text-sm text-vikko-muted hover:text-vikko-black cursor-pointer"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 relative bg-vikko-white/95 backdrop-blur-sm border-b border-vikko-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <Glasses className="w-7 h-7 text-vikko-black group-hover:scale-105 transition-transform" />
            <span className="font-display text-xl font-bold tracking-tight text-vikko-black">
              VIKKO<span className="text-vikko-accent">SPORT</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {megaTrigger('sunglasses', 'Sunglasses', sunglassesActive)}
            {megaTrigger('eyeglasses', 'Eyeglasses', eyeglassesActive)}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/shop"
              className="hidden sm:inline-flex p-2 text-vikko-ink hover:text-vikko-black transition-colors cursor-pointer"
              aria-label="Search shop"
            >
              <Search className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="relative p-2 text-vikko-ink hover:text-vikko-black transition-colors cursor-pointer">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-vikko-black text-vikko-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              type="button"
              className="md:hidden p-2 text-vikko-ink cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {openMega && (
        <div
          className="hidden md:block absolute left-0 right-0 top-full"
          onMouseEnter={() => openMenu(openMega)}
          onMouseLeave={scheduleClose}
        >
          {openMega === 'sunglasses' && (
            <MegaMenuColumns columns={SUNGLASSES_NAV} onNavigate={() => setOpenMega(null)} />
          )}
          {openMega === 'eyeglasses' && (
            <MegaMenuColumns columns={EYEGLASSES_NAV} onNavigate={() => setOpenMega(null)} />
          )}
        </div>
      )}

      {mobileOpen && (
        <div className="md:hidden bg-vikko-white border-t border-vikko-border">
          <nav className="px-4 py-2">
            {mobileAccordion('sunglasses', 'Sunglasses', flattenNav(SUNGLASSES_NAV))}
            {mobileAccordion('eyeglasses', 'Eyeglasses', flattenNav(EYEGLASSES_NAV))}
          </nav>
        </div>
      )}
    </header>
  );
}
