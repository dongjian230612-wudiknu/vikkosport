// src/lib/productImage.test.ts
import { describe, expect, it } from 'vitest';
import type { Product } from '../types/product';
import {
  localProductImagePath,
  productImageId,
  productImageUrl,
  resolveProductImages,
} from './productImage';

function baseProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: '1',
    sku: 'VS-006',
    name: 'Vikko Aero Pro',
    slug: 'vikko-aero-pro',
    price: 129,
    description: '',
    features: [],
    images: [],
    colors: [],
    category: 'sunglasses',
    tags: [],
    inStock: true,
    rxCompatible: false,
    rating: 0,
    reviewCount: 0,
    ...overrides,
  };
}

describe('productImageId', () => {
  it('builds vikko custom id', () => {
    expect(productImageId('vs-001', 'front')).toBe('vikko-vs-001-front');
    expect(productImageId('vs-002', '45')).toBe('vikko-vs-002-45');
  });
});

describe('localProductImagePath', () => {
  it('points at public webp path', () => {
    expect(localProductImagePath('vs-001', 'side')).toBe(
      '/images/products/vs-001-side.webp'
    );
  });
});

describe('productImageUrl', () => {
  it('uses imagedelivery when hash provided', () => {
    expect(productImageUrl('vs-001', 'front', { hash: 'abcHASH' })).toBe(
      'https://imagedelivery.net/abcHASH/vikko-vs-001-front/public'
    );
  });

  it('falls back to local path when hash empty', () => {
    expect(productImageUrl('vs-001', 'front', { hash: '' })).toBe(
      '/images/products/vs-001-front.webp'
    );
  });
});

describe('resolveProductImages', () => {
  it('fills front/45/side from imageSku when images are empty', () => {
    const resolved = resolveProductImages(
      baseProduct({ imageSku: 'vs-006', images: [] })
    );
    expect(resolved.images).toEqual([
      { url: productImageUrl('vs-006', 'front'), alt: 'Vikko Aero Pro front', angle: 'front' },
      { url: productImageUrl('vs-006', '45'), alt: 'Vikko Aero Pro 45', angle: '45' },
      { url: productImageUrl('vs-006', 'side'), alt: 'Vikko Aero Pro side', angle: 'side' },
    ]);
  });

  it('rewrites seed local paths through productImageUrl when imageSku is set', () => {
    const resolved = resolveProductImages(
      baseProduct({
        name: 'Vikko Velocity',
        imageSku: 'vs-001',
        images: [
          { url: '/images/products/vs-001-front.webp', alt: 'Velocity front view', angle: 'front' },
        ],
      })
    );
    expect(resolved.images.map(img => img.url)).toEqual([
      productImageUrl('vs-001', 'front'),
      productImageUrl('vs-001', '45'),
      productImageUrl('vs-001', 'side'),
    ]);
  });

  it('derives sku from product.sku when imageSku is missing', () => {
    const resolved = resolveProductImages(baseProduct({ sku: 'VS-007', imageSku: undefined }));
    expect(resolved.images[0]?.url).toBe(productImageUrl('vs-007', 'front'));
  });

  it('returns the product unchanged when no sku can be derived', () => {
    const product = baseProduct({ sku: '', imageSku: undefined, images: [] });
    expect(resolveProductImages(product)).toBe(product);
  });
});
