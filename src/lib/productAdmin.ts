import type { Product, ProductCategory } from '../types/product';

export type CreateProductInput = {
  sku: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock?: number;
  published?: boolean;
};

export function normalizeImageSku(sku: string): string {
  return sku
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function slugifyProductName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function buildCreatedProduct(input: CreateProductInput): Product {
  const stock = input.stock ?? 0;
  const imageSku = normalizeImageSku(input.sku);
  return {
    id: crypto.randomUUID(),
    sku: input.sku.trim(),
    name: input.name.trim(),
    slug: slugifyProductName(input.name),
    price: input.price,
    description: '',
    features: [],
    images: [],
    colors: [{ id: 'default', name: 'Default', hex: '#1a1a1a' }],
    category: input.category,
    tags: [],
    inStock: stock > 0,
    stock,
    published: input.published ?? true,
    imageSku,
    rxCompatible: false,
    rxType: null,
    rating: 0,
    reviewCount: 0,
  };
}
