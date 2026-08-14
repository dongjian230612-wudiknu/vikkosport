import { useState } from 'react';
import { Link } from 'wouter';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useCart } from '../hooks/useCart';
import { formatPrice } from '../lib/utils';
import { CartRxModal } from '../features/checkout/CartRxModal';
import { CartSummaryPanel } from '../features/checkout/CartSummaryPanel';
import { colorName, lensSummary, lineTotal } from '../features/checkout/checkoutUtils';
import type { RxInfo } from '../types/product';

export function Cart() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();
  const [rxView, setRxView] = useState<RxInfo | null>(null);

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h1 className="font-display text-3xl font-bold text-vikko-black mb-3">Cart</h1>
        <p className="text-vikko-muted mb-8">Your cart is empty.</p>
        <Link href="/shop?type=sunglasses&rx=1">
          <Button size="lg">Browse frames</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="mb-8 flex flex-col gap-3 rounded-lg border border-vikko-border bg-vikko-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-vikko-muted">
          Already have an account? Sign in for a better experience.
        </p>
        <Button
          variant="primary"
          size="sm"
          type="button"
          onClick={() => window.alert('Sign in coming soon.')}
        >
          Sign in
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <section>
          <h1 className="font-display text-3xl font-bold text-vikko-black mb-6">Cart</h1>
          <div className="hidden sm:grid grid-cols-[1fr_140px_100px] gap-4 border-b border-vikko-border pb-2 text-xs font-semibold uppercase tracking-wide text-vikko-muted">
            <span>Item</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
          </div>

          <ul className="divide-y divide-vikko-border">
            {items.map(item => {
              const img = item.product.images[0]?.url;
              return (
                <li key={item.id} className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-[1fr_140px_100px] sm:items-start">
                  <div className="flex gap-4 min-w-0">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-vikko-border bg-vikko-canvas">
                      {img ? (
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="min-w-0 space-y-1 text-sm">
                      <p className="font-semibold text-vikko-black">{item.product.name}</p>
                      <p className="text-vikko-muted">Color: {colorName(item)}</p>
                      {lensSummary(item).map(line => (
                        <p key={line} className="text-vikko-muted">
                          {line}
                        </p>
                      ))}
                      {item.rxInfo ? (
                        <button
                          type="button"
                          className="mt-2 inline-flex cursor-pointer rounded border border-vikko-accent px-2.5 py-1 text-xs font-semibold text-vikko-accent hover:bg-vikko-accent/5"
                          onClick={() => setRxView(item.rxInfo!)}
                        >
                          Prescription
                        </button>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex flex-col items-start sm:items-center gap-2">
                    <div className="inline-flex items-center border border-vikko-border rounded-md">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        className="p-2 cursor-pointer text-vikko-muted hover:text-vikko-black"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        className="p-2 cursor-pointer text-vikko-muted hover:text-vikko-black"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      aria-label="Remove item"
                      className="p-1.5 text-vikko-muted hover:text-vikko-black cursor-pointer"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-left sm:text-right font-bold text-vikko-black tabular-nums">
                    {formatPrice(lineTotal(item))}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <CartSummaryPanel
          subtotal={totalPrice}
          shipping={0}
          showCheckout
          onCheckoutHref="/checkout"
        />
      </div>

      {rxView ? <CartRxModal rx={rxView} onClose={() => setRxView(null)} /> : null}
    </div>
  );
}
