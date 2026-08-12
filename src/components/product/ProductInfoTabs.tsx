import { useState } from 'react';
import { Link } from 'wouter';
import { cn } from '../../lib/utils';
import type { Product } from '../../types/product';

type TabId = 'details' | 'description' | 'shipping';

interface ProductInfoTabsProps {
  product: Product;
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'details', label: 'Details' },
  { id: 'description', label: 'Description' },
  { id: 'shipping', label: 'Shipping & Returns' },
];

export function ProductInfoTabs({ product }: ProductInfoTabsProps) {
  const [active, setActive] = useState<TabId>('details');

  return (
    <div className="border border-vikko-border rounded-lg overflow-hidden bg-vikko-white">
      <div className="flex flex-wrap border-b border-vikko-accent" role="tablist">
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              'px-4 sm:px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wide transition-colors cursor-pointer',
              active === tab.id
                ? 'bg-vikko-accent text-vikko-white'
                : 'bg-vikko-white text-vikko-black hover:bg-vikko-canvas'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-6 text-sm text-vikko-ink leading-relaxed" role="tabpanel">
        {active === 'details' && (
          <div className="space-y-5">
            {product.specs && (
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                <div>
                  <dt className="font-bold uppercase text-vikko-black text-xs tracking-wide mb-1">
                    Lens Material
                  </dt>
                  <dd>{product.specs.lensMaterial}</dd>
                </div>
                <div>
                  <dt className="font-bold uppercase text-vikko-black text-xs tracking-wide mb-1">
                    Frame Material
                  </dt>
                  <dd>{product.specs.frameMaterial}</dd>
                </div>
                <div>
                  <dt className="font-bold uppercase text-vikko-black text-xs tracking-wide mb-1">
                    Weight
                  </dt>
                  <dd>{product.specs.weight}</dd>
                </div>
                <div>
                  <dt className="font-bold uppercase text-vikko-black text-xs tracking-wide mb-1">
                    UV Protection
                  </dt>
                  <dd>{product.specs.uvProtection}</dd>
                </div>
              </dl>
            )}
            {product.features.length > 0 && (
              <div>
                <h3 className="font-bold uppercase text-vikko-black text-xs tracking-wide mb-2">
                  Features
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {product.features.map(f => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {active === 'description' && <p>{product.description}</p>}

        {active === 'shipping' && (
          <div className="space-y-5">
            <div>
              <h3 className="font-bold uppercase text-vikko-black tracking-wide mb-2">Shipping</h3>
              <p>
                Orders placed by 2pm EST Monday–Friday typically ship the same day. Standard
                delivery is 3–5 business days within the continental US. Expedited options are
                available at checkout.
              </p>
            </div>
            <div>
              <h3 className="font-bold uppercase text-vikko-black tracking-wide mb-2">
                Free Returns
              </h3>
              <p>
                Not the right fit? Return unworn frames within 30 days for a full refund. Start a
                return in our{' '}
                <Link href="/shop" className="text-vikko-accent font-semibold hover:underline">
                  Return Center
                </Link>
                .
              </p>
            </div>
            <div>
              <h3 className="font-bold uppercase text-vikko-black tracking-wide mb-2">
                Lifetime Warranty
              </h3>
              <p>
                Every Vikko Sport frame is covered by our lifetime manufacturing warranty against
                defects in materials and workmanship under normal use.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
