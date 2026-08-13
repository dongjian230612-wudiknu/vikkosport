// src/lib/productImage.ts
import type { Product } from '../types/product';
import { normalizeImageSku } from './productAdmin';

export type ProductImageAngle = 'front' | '45' | 'side' | 'detail';

export function productImageId(sku: string, angle: ProductImageAngle): string {
  return `vikko-${sku}-${angle}`;
}

export function localProductImagePath(sku: string, angle: ProductImageAngle): string {
  return `/images/products/${sku}-${angle}.webp`;
}

export function productImageUrl(
  sku: string,
  angle: ProductImageAngle,
  opts?: { hash?: string }
): string {
  const hash =
    opts && 'hash' in opts
      ? opts.hash ?? ''
      : (import.meta.env.VITE_CF_IMAGES_HASH as string | undefined) ?? '';
  if (!hash) return localProductImagePath(sku, angle);
  return `https://imagedelivery.net/${hash}/${productImageId(sku, angle)}/public`;
}

const GALLERY_ANGLES = ['front', '45', 'side'] as const;

/** Prefer CDN (or local fallback) URLs from imageSku so storefront never keeps empty/seed paths. */
export function resolveProductImages(product: Product): Product {
  const sku = product.imageSku || normalizeImageSku(product.sku);
  if (!sku) return product;
  return {
    ...product,
    images: GALLERY_ANGLES.map(angle => ({
      url: productImageUrl(sku, angle),
      alt: `${product.name} ${angle}`,
      angle,
    })),
  };
}
