import { describe, expect, it } from 'vitest';
import { buildCreatedProduct, normalizeImageSku, slugifyProductName } from './productAdmin';

describe('normalizeImageSku', () => {
  it('normalizes VS-006', () => {
    expect(normalizeImageSku('VS-006')).toBe('vs-006');
  });
  it('strips junk', () => {
    expect(normalizeImageSku(' VS_006 ')).toBe('vs-006');
  });
});

describe('slugifyProductName', () => {
  it('slugifies', () => {
    expect(slugifyProductName('Vikko Aero Pro')).toBe('vikko-aero-pro');
  });
});

describe('buildCreatedProduct', () => {
  it('fills defaults', () => {
    const p = buildCreatedProduct({
      sku: 'VS-006',
      name: 'Vikko Aero Pro',
      category: 'sunglasses',
      price: 129,
      stock: 0,
      published: true,
    });
    expect(p.imageSku).toBe('vs-006');
    expect(p.slug).toBe('vikko-aero-pro');
    expect(p.inStock).toBe(false);
    expect(p.published).toBe(true);
    expect(p.rxCompatible).toBe(false);
    expect(p.images).toEqual([]);
    expect(p.colors[0]?.id).toBe('default');
  });
});
