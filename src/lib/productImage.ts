// src/lib/productImage.ts
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
