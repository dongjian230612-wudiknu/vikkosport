import { Link } from 'wouter';
import { Tag } from 'lucide-react';
import { formatPrice } from '../../lib/utils';

export function CartSummaryPanel({
  title = 'Summary',
  subtotal,
  shipping = 0,
  onCheckoutHref,
  showCheckout = false,
}: {
  title?: string;
  subtotal: number;
  shipping?: number;
  onCheckoutHref?: string;
  showCheckout?: boolean;
}) {
  const total = subtotal + shipping;

  return (
    <aside className="rounded-lg border border-vikko-border bg-vikko-white p-5 sm:p-6">
      <h2 className="font-display text-2xl font-bold text-vikko-black mb-5">{title}</h2>
      <button
        type="button"
        className="mb-5 flex items-center gap-2 text-sm text-vikko-accent hover:underline cursor-pointer"
        onClick={() => window.alert('Promotion codes coming soon.')}
      >
        <Tag className="h-4 w-4" aria-hidden />
        Add Promotion Code(s)
      </button>
      <div className="space-y-2 text-sm border-t border-vikko-border pt-4">
        <div className="flex justify-between text-vikko-muted">
          <span>Subtotal</span>
          <span className="text-vikko-black">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-vikko-muted">
          <span>Shipping</span>
          <span className="text-vikko-black">{formatPrice(shipping)}</span>
        </div>
        <div className="flex justify-between border-t border-vikko-border pt-3 text-base font-bold text-vikko-black">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
      {showCheckout && onCheckoutHref ? (
        <Link href={onCheckoutHref}>
          <span className="mt-6 flex w-full cursor-pointer items-center justify-center rounded-md bg-vikko-black px-5 py-3.5 text-sm font-bold text-vikko-white hover:bg-vikko-ink">
            Go to checkout
          </span>
        </Link>
      ) : null}
    </aside>
  );
}
