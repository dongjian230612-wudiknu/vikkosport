import { useRoute, Link } from 'wouter';
import { useEffect, useState } from 'react';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ProductGallery } from '../components/product/ProductGallery';
import { cn, formatPrice } from '../lib/utils';
import { getProductBySlug } from '../data/products';

export function ProductDetail() {
  const [match, params] = useRoute('/product/:slug');
  const product = match && params?.slug ? getProductBySlug(params.slug) : undefined;
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

          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl font-bold text-vikko-black mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        'w-4 h-4',
                        i < Math.floor(product.rating)
                          ? 'text-vikko-black fill-vikko-black'
                          : 'text-vikko-border'
                      )}
                    />
                  ))}
                </div>
                <span className="text-vikko-muted text-sm">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            <div className="text-3xl font-bold text-vikko-black">{formatPrice(product.price)}</div>

            <p className="text-vikko-muted leading-relaxed">{product.description}</p>

            {product.specs && (
              <dl className="grid grid-cols-2 gap-3 text-sm border border-vikko-border rounded-lg p-4 bg-vikko-canvas">
                <div>
                  <dt className="text-vikko-muted">Lens</dt>
                  <dd className="font-medium text-vikko-black">{product.specs.lensMaterial}</dd>
                </div>
                <div>
                  <dt className="text-vikko-muted">Frame</dt>
                  <dd className="font-medium text-vikko-black">{product.specs.frameMaterial}</dd>
                </div>
                <div>
                  <dt className="text-vikko-muted">Weight</dt>
                  <dd className="font-medium text-vikko-black">{product.specs.weight}</dd>
                </div>
                <div>
                  <dt className="text-vikko-muted">UV</dt>
                  <dd className="font-medium text-vikko-black">{product.specs.uvProtection}</dd>
                </div>
              </dl>
            )}

            <div>
              <h3 className="text-vikko-black font-semibold mb-3">
                Color: <span className="text-vikko-muted font-normal">{color?.name}</span>
              </h3>
              <div className="flex gap-3">
                {product.colors.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.id)}
                    className={cn(
                      'w-10 h-10 rounded-full border-2 transition-all cursor-pointer',
                      colorId === c.id ? 'border-vikko-black scale-110' : 'border-vikko-border'
                    )}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {product.features.map(feature => (
                <div key={feature} className="flex items-center gap-2 text-sm text-vikko-muted">
                  <Check className="w-4 h-4 text-vikko-accent flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-4">
              {product.rxCompatible ? (
                <Link href={`/rx-sports?frame=${product.slug}&color=${colorId}`}>
                  <Button size="lg" className="w-full uppercase tracking-wide">
                    Select Lenses and Purchase
                  </Button>
                </Link>
              ) : (
                <Button size="lg" className="w-full gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
              )}
              {product.rxCompatible && (
                <Button size="lg" variant="outline" className="w-full gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Add Frame Only
                </Button>
              )}
            </div>

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
