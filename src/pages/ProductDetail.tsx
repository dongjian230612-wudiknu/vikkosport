import { useRoute, Link } from 'wouter';
import { useEffect, useState } from 'react';
import { Star, Check, Truck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProductGallery } from '../components/product/ProductGallery';
import { cn, formatPrice } from '../lib/utils';
import { getProductBySlug } from '../data/products';
import { useCart } from '../hooks/useCart';

export function ProductDetail() {
  const [match, params] = useRoute('/product/:slug');
  const product = match && params?.slug ? getProductBySlug(params.slug) : undefined;
  const { addItem } = useCart();
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [tryOnOpen, setTryOnOpen] = useState(false);

  useEffect(() => {
    if (!product) return;
    setSelectedColor(product.colors[0]?.id ?? '');
    setActiveImage(0);
  }, [product]);

  if (!match) return null;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold text-vikko-black mb-4">Product not found</h1>
        <Link href="/shop" className="text-vikko-accent font-semibold hover:underline cursor-pointer">
          Back to shop
        </Link>
      </div>
    );
  }

  const colorId = selectedColor || product.colors[0]?.id;
  const color = product.colors.find(c => c.id === colorId) || product.colors[0];
  const rxHref = `/rx-sports?frame=${product.slug}&color=${colorId}`;

  return (
    <div className="animate-fade-in bg-vikko-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          <ProductGallery
            images={product.images}
            activeIndex={activeImage}
            onSelect={setActiveImage}
            onTryOn={() => setTryOnOpen(true)}
          />

          <div className="space-y-5">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-vikko-black tracking-tight uppercase">
                {product.name}
              </h1>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < Math.floor(product.rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-vikko-border'
                      )}
                    />
                  ))}
                </div>
                <span className="text-vikko-muted text-sm">{product.reviewCount} reviews</span>
              </div>
            </div>

            <div className="text-2xl font-bold text-vikko-accent">{formatPrice(product.price)}</div>

            <div className="border-t border-vikko-border pt-5">
              <h3 className="text-vikko-black text-sm mb-3">
                {color?.name} Frame
                {product.rxCompatible ? ' — Interchangeable' : ''}
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.id)}
                    className={cn(
                      'h-12 w-12 overflow-hidden rounded-md border-2 transition-colors cursor-pointer bg-vikko-canvas',
                      colorId === c.id ? 'border-vikko-accent' : 'border-vikko-border hover:border-vikko-muted'
                    )}
                    title={c.name}
                    aria-label={c.name}
                  >
                    <span
                      className="block h-full w-full"
                      style={{ backgroundColor: c.hex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <Button
                size="lg"
                className="w-full uppercase tracking-wide"
                onClick={() => addItem(product, colorId)}
              >
                Add to Cart
              </Button>
              {product.rxCompatible && (
                <Link href={rxHref}>
                  <Button
                    size="lg"
                    className="w-full uppercase tracking-wide bg-vikko-accent hover:bg-vikko-accent/90"
                  >
                    Buy Prescription
                  </Button>
                </Link>
              )}
            </div>

            <p className="text-vikko-muted text-sm italic flex items-start gap-2">
              <Truck className="w-4 h-4 mt-0.5 flex-shrink-0 text-vikko-ink" />
              <span>
                Order by <strong className="font-semibold text-vikko-ink not-italic">2pm EST (Mon–Fri)</strong> for same-day shipping!
              </span>
            </p>

            {product.rxCompatible && (
              <p className="text-vikko-muted text-sm flex items-center gap-1">
                <Check className="w-4 h-4 text-vikko-accent" />
                Prescription lenses available for this frame
                {product.rxType ? ` — ${product.rxType}` : ''}
              </p>
            )}
          </div>
        </div>
      </div>

      {tryOnOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-vikko-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Virtual try-on"
          onClick={() => setTryOnOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-lg bg-vikko-white p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="font-display text-xl font-bold text-vikko-black mb-2">Virtual try-on</h2>
            <p className="text-sm text-vikko-muted mb-6">
              Camera try-on is coming soon. For now, use the gallery angles to preview {product.name}.
            </p>
            <Button className="w-full" onClick={() => setTryOnOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
