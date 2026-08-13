import seedProducts from './seed.json';

export interface ProductsEnv {
  PRODUCTS: KVNamespace;
}

export type ProductCategory = 'sunglasses' | 'eyeglasses' | 'accessories';
export type RxType = 'direct' | 'insert' | 'clip-on';

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  images: { url: string; alt: string; angle: 'front' | '45' | 'side' | 'detail' }[];
  colors: { id: string; name: string; hex: string; imageUrl?: string }[];
  category: ProductCategory;
  gender?: 'men' | 'women' | 'unisex';
  fit?: 'small' | 'medium' | 'large';
  isNew?: boolean;
  tags: string[];
  inStock: boolean;
  stock?: number;
  published?: boolean;
  imageSku?: string;
  rxCompatible: boolean;
  rxType?: RxType | null;
  specs?: {
    lensMaterial: string;
    frameMaterial: string;
    weight: string;
    uvProtection: string;
  };
  lensOptions?: {
    colors: string[];
    photochromic: boolean;
    polarized: boolean;
  };
  rating: number;
  reviewCount: number;
}

export type CreateProductBody = {
  sku?: string;
  name?: string;
  category?: string;
  price?: number;
  stock?: number;
  published?: boolean;
};

export type UpdateProductBody = {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  category?: string;
  published?: boolean;
  rxCompatible?: boolean;
  rxType?: RxType | null;
  stock?: number;
  inStock?: boolean;
  sku?: unknown;
  id?: unknown;
};

const CATALOG_KEY = 'catalog';
const CATEGORIES = new Set<ProductCategory>(['sunglasses', 'eyeglasses', 'accessories']);
const RX_TYPES = new Set<RxType>(['direct', 'insert', 'clip-on']);

export function normalizeImageSku(sku: string): string {
  return sku
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function slugifyProductName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function readAll(env: ProductsEnv): Promise<Product[]> {
  const raw = await env.PRODUCTS.get(CATALOG_KEY, 'json');
  if (!Array.isArray(raw)) return [];
  return raw as Product[];
}

export async function writeAll(env: ProductsEnv, products: Product[]): Promise<void> {
  await env.PRODUCTS.put(CATALOG_KEY, JSON.stringify(products));
}

export async function ensureSeed(env: ProductsEnv): Promise<Product[]> {
  const existing = await readAll(env);
  if (existing.length > 0) return existing;
  const seeded = seedProducts as Product[];
  await writeAll(env, seeded);
  return seeded;
}

export async function seedCatalog(
  env: ProductsEnv,
  force = false
): Promise<{ products: Product[]; seeded: boolean; message: string }> {
  const existing = await readAll(env);
  if (existing.length > 0 && !force) {
    return {
      products: existing,
      seeded: false,
      message: 'Catalog already has products; pass { "force": true } to overwrite',
    };
  }
  const seeded = seedProducts as Product[];
  await writeAll(env, seeded);
  return {
    products: seeded,
    seeded: true,
    message: force ? 'Catalog overwritten from seed' : 'Catalog seeded',
  };
}

export function createProduct(
  existing: Product[],
  body: CreateProductBody
): { ok: true; product: Product } | { ok: false; message: string } {
  const sku = typeof body.sku === 'string' ? body.sku.trim() : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const category = body.category;
  const price = body.price;

  if (!sku) return { ok: false, message: 'sku is required' };
  if (!name) return { ok: false, message: 'name is required' };
  if (typeof price !== 'number' || Number.isNaN(price)) {
    return { ok: false, message: 'price is required' };
  }
  if (typeof category !== 'string' || !CATEGORIES.has(category as ProductCategory)) {
    return { ok: false, message: 'category must be sunglasses, eyeglasses, or accessories' };
  }
  if (existing.some(p => p.sku.toLowerCase() === sku.toLowerCase())) {
    return { ok: false, message: 'sku already exists' };
  }

  const stock = typeof body.stock === 'number' && !Number.isNaN(body.stock) ? body.stock : 0;
  const product: Product = {
    id: crypto.randomUUID(),
    sku,
    name,
    slug: slugifyProductName(name),
    price,
    description: '',
    features: [],
    images: [],
    colors: [{ id: 'default', name: 'Default', hex: '#1a1a1a' }],
    category: category as ProductCategory,
    tags: [],
    inStock: stock > 0,
    stock,
    published: body.published ?? true,
    imageSku: normalizeImageSku(sku),
    rxCompatible: false,
    rxType: null,
    rating: 0,
    reviewCount: 0,
  };

  return { ok: true, product };
}

export function updateProduct(
  current: Product,
  body: UpdateProductBody
): { ok: true; product: Product } | { ok: false; message: string } {
  if ('sku' in body && body.sku !== undefined && String(body.sku) !== current.sku) {
    return { ok: false, message: 'sku cannot be changed' };
  }
  if ('id' in body && body.id !== undefined && String(body.id) !== current.id) {
    return { ok: false, message: 'id cannot be changed' };
  }

  const next: Product = { ...current };

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || !body.name.trim()) {
      return { ok: false, message: 'name cannot be empty' };
    }
    next.name = body.name.trim();
  }

  if (body.slug !== undefined) {
    if (typeof body.slug !== 'string' || !body.slug.trim()) {
      return { ok: false, message: 'slug cannot be empty' };
    }
    next.slug = body.slug.trim();
  }

  if (body.description !== undefined) {
    if (typeof body.description !== 'string') {
      return { ok: false, message: 'description must be a string' };
    }
    next.description = body.description;
  }

  if (body.price !== undefined) {
    if (typeof body.price !== 'number' || Number.isNaN(body.price)) {
      return { ok: false, message: 'price must be a number' };
    }
    next.price = body.price;
  }

  if (body.category !== undefined) {
    if (typeof body.category !== 'string' || !CATEGORIES.has(body.category as ProductCategory)) {
      return { ok: false, message: 'category must be sunglasses, eyeglasses, or accessories' };
    }
    next.category = body.category as ProductCategory;
  }

  if (body.published !== undefined) {
    if (typeof body.published !== 'boolean') {
      return { ok: false, message: 'published must be a boolean' };
    }
    next.published = body.published;
  }

  if (body.rxCompatible !== undefined) {
    if (typeof body.rxCompatible !== 'boolean') {
      return { ok: false, message: 'rxCompatible must be a boolean' };
    }
    next.rxCompatible = body.rxCompatible;
  }

  if (body.rxType !== undefined) {
    if (body.rxType !== null && (typeof body.rxType !== 'string' || !RX_TYPES.has(body.rxType))) {
      return { ok: false, message: 'rxType must be direct, insert, clip-on, or null' };
    }
    next.rxType = body.rxType;
  }

  if (body.stock !== undefined) {
    if (typeof body.stock !== 'number' || Number.isNaN(body.stock)) {
      return { ok: false, message: 'stock must be a number' };
    }
    next.stock = body.stock;
    next.inStock = body.stock > 0;
  }

  if (body.inStock !== undefined) {
    if (typeof body.inStock !== 'boolean') {
      return { ok: false, message: 'inStock must be a boolean' };
    }
    next.inStock = body.inStock;
  }

  return { ok: true, product: next };
}

export function publishedOnly(products: Product[]): Product[] {
  return products.filter(p => p.published !== false);
}
