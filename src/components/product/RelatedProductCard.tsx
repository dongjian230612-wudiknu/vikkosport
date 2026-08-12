import { Link } from 'wouter';
import { Star } from 'lucide-react';
import { cn, formatPrice } from '../../lib/utils';
import type { Product } from '../../types/product';

interface RelatedProductCardProps {
  product: Product;
  className?: string;
}

export function RelatedProductCard({ product, className }: RelatedProductCardProps) {
  const mainImage = product.images.find(i => i.angle === 'front') || product.images[0];

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        'group block border border-vikko-border bg-vikko-white overflow-hidden cursor-pointer',
        className
      )}
    >
      <div className="relative aspect-square bg-vikko-canvas overflow-hidden">
        <img
          src={mainImage?.url}
          alt={mainImage?.alt || product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="font-display text-vikko-black font-bold text-sm uppercase tracking-wide group-hover:text-vikko-accent transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'w-3.5 h-3.5',
                  i < Math.floor(product.rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-vikko-border'
                )}
              />
            ))}
          </div>
          <span className="text-vikko-muted text-xs">{product.reviewCount} reviews</span>
        </div>

        {product.rxCompatible && (
          <span className="mt-2 inline-block rounded-full bg-vikko-accent px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-vikko-white">
            Prescription Ready
          </span>
        )}

        <div className="mt-2 flex items-baseline gap-1.5">
          {product.rxCompatible && (
            <span className="text-[10px] font-semibold uppercase tracking-wide text-vikko-muted">
              From
            </span>
          )}
          <span className="text-vikko-accent font-bold">{formatPrice(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
