import { useRoute, Link } from 'wouter';
import { useEffect, useState } from 'react';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { cn, formatPrice } from '../lib/utils';
import { getProductBySlug } from '../data/products';

export function ProductDetail() {
  const [match, params] = useRoute('/product/:slug');
  const product = match && params?.slug ? getProductBySlug(params.slug) : undefined;
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImage, setActiveImage] = useState(0);

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
    <div className="animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-vikko-canvas rounded-lg overflow-hidden border border-vikko-border">
              <img
                src={product.images[activeImage]?.url}
                alt={product.images[activeImage]?.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    'w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors cursor-pointer',
                    activeImage === idx ? 'border-vikko-black' : 'border-vikko-border'
                  )}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

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
    </div>
  );
}
