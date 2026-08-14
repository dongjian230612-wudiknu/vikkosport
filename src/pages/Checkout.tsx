import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Check, Lock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useCart } from '../hooks/useCart';
import { formatPrice, cn } from '../lib/utils';
import { CartSummaryPanel } from '../features/checkout/CartSummaryPanel';
import {
  US_STATES,
  emptyAddress,
  formatShipTo,
  newOrderId,
  validateAddress,
  type CheckoutAddress,
} from '../features/checkout/checkoutUtils';

type Step = 1 | 2 | 3;

const fieldClass =
  'w-full rounded-md border border-vikko-border bg-vikko-white px-3 pt-5 pb-2 text-sm text-vikko-black outline-none focus:border-vikko-accent';
const labelClass =
  'pointer-events-none absolute left-3 top-2 text-[11px] font-medium text-vikko-muted';

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn('relative block', className)}>
      <span className={labelClass}>
        {label}
        {required ? ' *' : ''}
      </span>
      {children}
    </label>
  );
}

function Stepper({ step }: { step: Step }) {
  const items: { n: Step; label: string }[] = [
    { n: 1, label: 'Address' },
    { n: 2, label: 'Delivery' },
    { n: 3, label: 'Payment' },
  ];
  return (
    <ol className="mb-8 flex flex-wrap items-center gap-2 text-sm">
      {items.map((item, idx) => {
        const done = step > item.n;
        const active = step === item.n;
        return (
          <li key={item.n} className="flex items-center gap-2">
            {idx > 0 ? <span className="text-vikko-muted px-1">&gt;</span> : null}
            <span
              className={cn(
                'inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold',
                done || active
                  ? 'bg-vikko-black text-vikko-white'
                  : 'bg-vikko-border text-vikko-muted'
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : item.n}
            </span>
            <span
              className={cn(
                'font-medium',
                active ? 'text-vikko-black' : 'text-vikko-muted'
              )}
            >
              {item.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>(1);
  const [address, setAddress] = useState<CheckoutAddress>(emptyAddress);
  const [error, setError] = useState<string | null>(null);
  const [shipping] = useState(0);
  const [paying, setPaying] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      setLocation('/cart');
    }
  }, [items.length, setLocation, orderPlaced]);

  const shipLabel = useMemo(() => formatShipTo(address), [address]);

  const patch = (p: Partial<CheckoutAddress>) => {
    setAddress(prev => ({ ...prev, ...p }));
    setError(null);
  };

  const goDelivery = () => {
    const err = validateAddress(address);
    if (err) {
      setError(err);
      return;
    }
    setStep(2);
  };

  const payDemo = () => {
    setPaying(true);
    const orderId = newOrderId();
    try {
      sessionStorage.setItem(
        'vikko-last-order',
        JSON.stringify({
          id: orderId,
          total: totalPrice + shipping,
          email: address.email,
        })
      );
    } catch {
      /* ignore quota */
    }
    setOrderPlaced(true);
    window.setTimeout(() => {
      clearCart();
      setPaying(false);
      setLocation('/checkout/success');
    }, 600);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_300px]">
        <div>
          <Stepper step={step} />

          {step === 1 && (
            <div className="space-y-4 max-w-xl">
              <h1 className="font-display text-3xl font-bold text-vikko-black mb-2">
                Shipping Address
              </h1>
              <Field label="Country/Region">
                <select
                  className={fieldClass}
                  value={address.country}
                  onChange={e => patch({ country: e.target.value })}
                >
                  <option>United States</option>
                  <option>Canada</option>
                </select>
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="First name" required>
                  <input
                    className={fieldClass}
                    value={address.firstName}
                    onChange={e => patch({ firstName: e.target.value })}
                    autoComplete="given-name"
                  />
                </Field>
                <Field label="Last name" required>
                  <input
                    className={fieldClass}
                    value={address.lastName}
                    onChange={e => patch({ lastName: e.target.value })}
                    autoComplete="family-name"
                  />
                </Field>
              </div>
              <Field label="Address" required>
                <input
                  className={fieldClass}
                  value={address.address}
                  onChange={e => patch({ address: e.target.value })}
                  autoComplete="street-address"
                />
              </Field>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Postal code" required>
                  <input
                    className={fieldClass}
                    value={address.postalCode}
                    onChange={e => patch({ postalCode: e.target.value })}
                    autoComplete="postal-code"
                  />
                </Field>
                <Field label="City" required>
                  <input
                    className={fieldClass}
                    value={address.city}
                    onChange={e => patch({ city: e.target.value })}
                    autoComplete="address-level2"
                  />
                </Field>
              </div>
              <Field label="State / Province">
                <select
                  className={fieldClass}
                  value={address.state}
                  onChange={e => patch({ state: e.target.value })}
                >
                  <option value="">Select state / province</option>
                  {US_STATES.map(s => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <label className="flex items-center gap-2 text-sm text-vikko-ink cursor-pointer">
                <input
                  type="checkbox"
                  checked={address.billingSame}
                  onChange={e => patch({ billingSame: e.target.checked })}
                />
                Billing address same as shipping address
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Email" required>
                  <input
                    type="email"
                    className={fieldClass}
                    value={address.email}
                    onChange={e => patch({ email: e.target.value })}
                    autoComplete="email"
                  />
                </Field>
                <Field label="Phone" required>
                  <input
                    type="tel"
                    className={fieldClass}
                    value={address.phone}
                    onChange={e => patch({ phone: e.target.value })}
                    autoComplete="tel"
                  />
                </Field>
              </div>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <Button className="w-full" size="lg" type="button" onClick={goDelivery}>
                Continue to delivery
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5 max-w-xl">
              <h1 className="font-display text-3xl font-bold text-vikko-black">Delivery</h1>
              <p className="text-sm text-vikko-muted">
                Shipping to: <span className="text-vikko-black">{shipLabel}</span>{' '}
                <button
                  type="button"
                  className="text-vikko-accent font-medium hover:underline cursor-pointer"
                  onClick={() => setStep(1)}
                >
                  Edit
                </button>
              </p>
              <label className="flex cursor-pointer items-center gap-3 rounded-md border border-vikko-black bg-vikko-white px-4 py-4">
                <input type="radio" name="delivery" defaultChecked className="accent-vikko-black" />
                <span className="flex-1 text-sm font-medium text-vikko-black">
                  Free Delivery: 7–10 working days
                </span>
                <span className="text-sm font-semibold tabular-nums">$0</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button variant="outline" size="lg" type="button" onClick={() => setStep(1)}>
                  Back to address
                </Button>
                <Button size="lg" type="button" onClick={() => setStep(3)}>
                  Continue to payment
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl font-bold text-vikko-black">Payment</h1>
                <span className="inline-flex items-center gap-1 text-xs text-vikko-muted">
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  All transactions are secure and encrypted.
                </span>
              </div>

              <div className="overflow-hidden rounded-md border border-vikko-border">
                <div className="bg-vikko-canvas px-4 py-3 font-semibold text-vikko-black">
                  Order Summary
                </div>
                <div className="space-y-2 px-4 py-3 text-sm">
                  <p>
                    <span className="text-vikko-muted">Ship to </span>
                    {address.firstName} {address.lastName}, {address.city},{' '}
                    {address.country === 'United States' ? 'US' : address.country}
                  </p>
                  <p>
                    <span className="text-vikko-muted">Method </span>
                    Free delivery
                  </p>
                </div>
                <div className="flex justify-between bg-vikko-canvas/80 px-4 py-3 text-sm font-bold">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice + shipping)} USD</span>
                </div>
              </div>

              <div className="rounded-md border border-vikko-border p-4 space-y-3">
                <p className="font-semibold text-[#003087]">PayPal</p>
                <p className="text-sm text-vikko-muted">
                  Demo checkout — you will not be charged. Click below to simulate a successful
                  PayPal payment.
                </p>
                <button
                  type="button"
                  disabled={paying}
                  onClick={payDemo}
                  className="w-full cursor-pointer rounded-full bg-[#ffc439] px-4 py-3 text-sm font-bold text-vikko-black hover:brightness-95 disabled:opacity-60"
                >
                  {paying
                    ? 'Processing…'
                    : `Pay ${formatPrice(totalPrice + shipping)} USD with PayPal`}
                </button>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full"
                type="button"
                onClick={() => setStep(2)}
              >
                Back to delivery
              </Button>
            </div>
          )}
        </div>

        <CartSummaryPanel
          title="In your Cart"
          subtotal={totalPrice}
          shipping={shipping}
        />
      </div>

      <p className="mt-8 text-center text-sm text-vikko-muted">
        <Link href="/cart" className="text-vikko-accent hover:underline">
          Return to cart
        </Link>
      </p>
    </div>
  );
}
