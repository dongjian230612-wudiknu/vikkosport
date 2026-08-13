import type { Product, ProductCategory, RxType } from '../types/product';
import type { CreateProductInput } from './productAdmin';

const base = () => import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';

type ApiOk<T> = { success: true; data: T };
type ApiErr = { success: false; message?: string };

export type AdminUpdateProductInput = {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  category?: ProductCategory;
  published?: boolean;
  rxCompatible?: boolean;
  rxType?: RxType | null;
  stock?: number;
  inStock?: boolean;
};

async function parseJson<T>(res: Response): Promise<T> {
  const body = (await res.json()) as ApiOk<T> | ApiErr;
  if (!res.ok || !('success' in body) || !body.success) {
    throw new Error((body as ApiErr).message || `Request failed (${res.status})`);
  }
  return body.data;
}

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function adminLogin(password: string): Promise<string> {
  const res = await fetch(`${base()}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await parseJson<{ token: string }>(res);
  return data.token;
}

export async function createDirectUpload(
  token: string,
  sku: string,
  angle: string
): Promise<{ uploadURL: string; id: string }> {
  const res = await fetch(`${base()}/api/admin/direct-upload`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ sku, angle }),
  });
  return parseJson<{ uploadURL: string; id: string }>(res);
}

export async function uploadToCloudflare(uploadURL: string, file: File): Promise<void> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(uploadURL, { method: 'POST', body: form });
  if (!res.ok) {
    throw new Error(`Upload failed (${res.status})`);
  }
}

/** Public published catalog for the storefront. */
export async function fetchPublicCatalog(): Promise<Product[]> {
  const res = await fetch(`${base()}/api/catalog`);
  return parseJson<Product[]>(res);
}

export async function adminListProducts(token: string): Promise<Product[]> {
  const res = await fetch(`${base()}/api/admin/products`, {
    headers: authHeaders(token),
  });
  return parseJson<Product[]>(res);
}

export async function adminCreateProduct(
  token: string,
  input: CreateProductInput
): Promise<Product> {
  const res = await fetch(`${base()}/api/admin/products`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });
  return parseJson<Product>(res);
}

export async function adminGetProduct(token: string, id: string): Promise<Product> {
  const res = await fetch(`${base()}/api/admin/products/${encodeURIComponent(id)}`, {
    headers: authHeaders(token),
  });
  return parseJson<Product>(res);
}

export async function adminUpdateProduct(
  token: string,
  id: string,
  input: AdminUpdateProductInput
): Promise<Product> {
  const res = await fetch(`${base()}/api/admin/products/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });
  return parseJson<Product>(res);
}
