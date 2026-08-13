import { describe, expect, it } from 'vitest';
import { createProduct, updateProduct, type Product } from './productsKv';

function existingProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'existing-1',
    sku: 'VS-001',
    name: 'Vikko Velocity',
    slug: 'vikko-aero-pro',
    price: 149,
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

describe('createProduct slug uniqueness', () => {
  it('appends -2 when slugify(name) already exists', () => {
    const created = createProduct([existingProduct()], {
      sku: 'VS-006',
      name: 'Vikko Aero Pro',
      category: 'sunglasses',
      price: 129,
    });
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    expect(created.product.slug).toBe('vikko-aero-pro-2');
  });

  it('appends -3 when -2 is also taken', () => {
    const created = createProduct(
      [
        existingProduct(),
        existingProduct({ id: 'existing-2', sku: 'VS-002', slug: 'vikko-aero-pro-2' }),
      ],
      {
        sku: 'VS-006',
        name: 'Vikko Aero Pro',
        category: 'sunglasses',
        price: 129,
      }
    );
    expect(created.ok).toBe(true);
    if (!created.ok) return;
    expect(created.product.slug).toBe('vikko-aero-pro-3');
  });
});

describe('updateProduct slug uniqueness', () => {
  it('appends -2 when the requested slug belongs to another product', () => {
    const current = existingProduct({
      id: 'current',
      sku: 'VS-006',
      slug: 'vikko-storm',
    });
    const updated = updateProduct(
      current,
      { slug: 'vikko-aero-pro' },
      [existingProduct(), current]
    );
    expect(updated.ok).toBe(true);
    if (!updated.ok) return;
    expect(updated.product.slug).toBe('vikko-aero-pro-2');
  });

  it('keeps the same slug when it only belongs to the product being updated', () => {
    const current = existingProduct();
    const updated = updateProduct(current, { slug: 'vikko-aero-pro' }, [current]);
    expect(updated.ok).toBe(true);
    if (!updated.ok) return;
    expect(updated.product.slug).toBe('vikko-aero-pro');
  });
});
