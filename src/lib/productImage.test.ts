// src/lib/productImage.test.ts
import { describe, expect, it } from 'vitest';
import {
  localProductImagePath,
  productImageId,
  productImageUrl,
} from './productImage';

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
