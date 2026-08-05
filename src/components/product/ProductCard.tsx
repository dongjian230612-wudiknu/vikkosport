import { Link } from 'wouter';
import { Star } from 'lucide-react';
import { cn, formatPrice } from '../../lib/utils';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const mainImage = product.images.find(i => i.angle === 'front') || product.images[0];

  return (
    <Link href={`/product/${product.slug}`} className={cn('group block', className)}>
      <div className="relative aspect-[4/3] bg-vikko-dark rounded-lg overflow-hidden mb-3">
        <img
          src={mainImage?.url}
          alt={mainImage?.alt || product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.originalPrice && (
          <span className="absolute top-2 left-2 bg-vikko-accent text-vikko-black text-xs font-bold px-2 py-1 rounded">
            SALE
          </span>
        )}
        {product.rxCompatible && (
          <span className="absolute top-2 right-2 bg-vikko-dark/80 text-vikko-accent text-xs font-medium px-2 py-1 rounded border border-vikko-accent/30">
            RX Ready
          </span>
        )}
      </div>

      <h3 className="text-vikko-white font-semibold text-sm group-hover:text-vikko-accent transition-colors">
        {product.name}
      </h3>

      <div className="flex items-center gap-1 mt-1">
        <Star className="w-3.5 h-3.5 text-vikko-accent fill-vikko-accent" />
        <span className="text-vikko-white text-sm font-medium">{product.rating}</span>
        <span className="text-vikko-muted text-xs">({product.reviewCount})</span>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <span className="text-vikko-white font-bold">{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <span className="text-vikko-muted text-sm line-through">{formatPrice(product.originalPrice)}</span>
        )}
      </div>

      <div className="flex items-center gap-1.5 mt-2">
        {product.colors.map(color => (
          <span
            key={color.id}
            className="w-4 h-4 rounded border border-vikko-gray"
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />
        ))}
      </div>
    </Link>
  );
}
