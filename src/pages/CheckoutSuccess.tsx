import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '../components/ui/Button';
import { formatPrice } from '../lib/utils';

type LastOrder = { id: string; total: number; email?: string };

export function CheckoutSuccess() {
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('vikko-last-order');
      if (raw) setOrder(JSON.parse(raw) as LastOrder);
    } catch {
      setOrder(null);
    }
  }, []);

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-vikko-muted mb-3">
        Order confirmed
      </p>
      <h1 className="font-display text-3xl font-bold text-vikko-black mb-3">Thank you</h1>
      <p className="text-vikko-muted mb-6">
        This was a demo checkout — no real payment was processed.
        {order?.id ? (
          <>
            {' '}
            Reference <span className="font-semibold text-vikko-black">{order.id}</span>
            {order.total != null ? <> · {formatPrice(order.total)}</> : null}.
          </>
        ) : null}
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/shop">
          <Button size="lg">Continue shopping</Button>
        </Link>
        <Link href="/">
          <Button variant="outline" size="lg">
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
