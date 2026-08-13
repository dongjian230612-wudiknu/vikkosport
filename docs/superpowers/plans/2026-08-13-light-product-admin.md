# Light Product Admin (Phase 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a KV-backed product list / New Product modal / Edit page in `/admin`, plus a public `/api/catalog` so the storefront picks up price/copy/publish changes without rebuilding.

**Architecture:** Extend the existing `vikkosport-images-admin` Worker with a `PRODUCTS` KV namespace. Admin CRUD uses the same Bearer session as image upload. Storefront wraps catalog access in a React provider that fetches `/api/catalog` and falls back to `src/data/products.ts`.

**Tech Stack:** React 19, TypeScript, Vite, wouter, Cloudflare Workers + KV, Vitest

## Global Constraints

- Phase 1 includes New Product + Edit subset; **no** Options/Variants matrix, Attributes mm panel, or rich category checkboxes.
- SKU style for new items: `vs-00N` / `VS-00N` (normalize to `imageSku` like `vs-006`).
- Unpublished products omitted from public catalog; admin list shows all.
- Same admin auth as image upload (`ADMIN_PASSWORD` session).
- `/api/catalog` is public read-only.
- Cloudflare API tokens stay Worker-only.
- CORS: `https://dev.vikkosport.com`, `http://localhost:5173`, `http://127.0.0.1:5173`.
- Light retail admin UI (white cards, black primary buttons); not a pixel clone of Getooup.
- Image gallery remains `/admin/images` with Custom IDs `vikko-{imageSku}-{angle}`.

---

## File map

| Path | Responsibility |
|------|----------------|
| `src/types/product.ts` | Add `published?`, `imageSku?`, `stock?` |
| `src/lib/productAdmin.ts` | slugify, normalizeImageSku, buildCreatedProduct |
| `src/lib/productAdmin.test.ts` | Unit tests for helpers |
| `src/lib/adminApi.ts` | Catalog + product CRUD client |
| `src/lib/catalog.tsx` | CatalogProvider + `useCatalog()` |
| `src/data/products.ts` | Fallback seed only; keep exporting `products` |
| `src/pages/admin/AdminShell.tsx` | Login gate + nav Products \| Images |
| `src/pages/admin/ProductList.tsx` | Table + New Product modal |
| `src/pages/admin/ProductEdit.tsx` | Edit form |
| `src/pages/Admin.tsx` | Re-export or move image uploader to `AdminImages.tsx` |
| `src/pages/admin/AdminImages.tsx` | Existing uploader; dynamic SKU list |
| `src/App.tsx` | Routes + CatalogProvider |
| `workers/images-admin/wrangler.toml` | KV binding `PRODUCTS` |
| `workers/images-admin/src/seed.json` | Snapshot of current 5 products (+ published: true) |
| `workers/images-admin/src/products.ts` | KV helpers + CRUD handlers |
| `workers/images-admin/src/index.ts` | Wire routes |
| `workers/images-admin/README.md` | KV create + seed deploy steps |
| `docs/superpowers/specs/2026-08-13-light-product-admin-design.md` | Status → Approved |

---

### Task 1: Product fields + create helpers (TDD)

**Files:**
- Modify: `src/types/product.ts`
- Create: `src/lib/productAdmin.ts`
- Create: `src/lib/productAdmin.test.ts`

**Interfaces:**
- Consumes: `Product`, `ProductCategory` from types
- Produces:
  - `normalizeImageSku(sku: string): string`
  - `slugifyProductName(name: string): string`
  - `buildCreatedProduct(input: CreateProductInput): Product`
  - `CreateProductInput = { sku, name, category, price, stock?: number, published?: boolean }`

- [ ] **Step 1: Extend Product type**

```ts
// add to Product
published?: boolean; // default true when missing (seed compatibility)
imageSku?: string;   // e.g. vs-006 — used for CF Images ids
stock?: number;      // optional; inStock derived when stock provided
```

- [ ] **Step 2: Write failing tests**

```ts
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
```

- [ ] **Step 3: Run tests — expect FAIL**

```bash
npm test -- src/lib/productAdmin.test.ts
```

- [ ] **Step 4: Implement `productAdmin.ts`**

```ts
export function normalizeImageSku(sku: string): string {
  return sku.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function slugifyProductName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function buildCreatedProduct(input: {
  sku: string;
  name: string;
  category: ProductCategory;
  price: number;
  stock?: number;
  published?: boolean;
}): Product {
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
```

- [ ] **Step 5: Run tests — expect PASS**

- [ ] **Step 6: Commit**

```bash
git add src/types/product.ts src/lib/productAdmin.ts src/lib/productAdmin.test.ts
git commit -m "feat: add product create helpers for admin Phase 1"
```

---

### Task 2: Worker KV + catalog/CRUD API

**Files:**
- Modify: `workers/images-admin/wrangler.toml`
- Create: `workers/images-admin/src/seed.json` (copy of current 5 products with `"published": true`, `imageSku` from paths)
- Create: `workers/images-admin/src/productsKv.ts`
- Modify: `workers/images-admin/src/index.ts`
- Modify: `workers/images-admin/README.md`

**Interfaces:**
- Consumes: existing `verifyBearer`, `json`, `corsHeaders`, `Env`
- Produces HTTP:
  - `GET /api/catalog` → `{ success: true, data: Product[] }` published only
  - `GET /api/admin/products` auth → all products
  - `POST /api/admin/products` auth body create fields → created product
  - `GET /api/admin/products/:id` auth
  - `PUT /api/admin/products/:id` auth body partial editable fields
  - `POST /api/admin/products/seed` auth → seed if empty / force flag

KV layout: single key `catalog` → `Product[]` JSON.

- [ ] **Step 1: Add KV to wrangler.toml**

```toml
[[kv_namespaces]]
binding = "PRODUCTS"
id = "REPLACE_AFTER_wrangler_kv_namespace_create"
# preview_id optional
```

Document:

```bash
npx wrangler kv namespace create PRODUCTS
# paste id into wrangler.toml
```

- [ ] **Step 2: Build seed.json from current catalog**

Include `published: true` and `imageSku` (`vs-001` … `vs-005`) for each product. Keep full Product fields.

- [ ] **Step 3: Implement productsKv.ts**

Functions:

```ts
async function readAll(env: Env): Promise<Product[]>
async function writeAll(env: Env, products: Product[]): Promise<void>
async function ensureSeed(env: Env): Promise<Product[]> // if empty, write seed.json
```

Create validation: sku unique; reject empty name/price; normalize imageSku.

PUT allows: `name`, `slug`, `description`, `price`, `category`, `published`, `rxCompatible`, `rxType`, `stock`/`inStock` — not `sku`/`id`.

- [ ] **Step 4: Wire routes in index.ts**

Extend `Env` with `PRODUCTS: KVNamespace`.

On `GET /api/catalog`: `ensureSeed`, filter `published !== false`, return.

On admin routes: require bearer; implement CRUD.

- [ ] **Step 5: Local typecheck**

```bash
cd workers/images-admin && npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add workers/images-admin
git commit -m "feat: add KV product catalog CRUD to images-admin Worker"
```

---

### Task 3: Admin API client + CatalogProvider

**Files:**
- Modify: `src/lib/adminApi.ts`
- Create: `src/lib/catalog.tsx`
- Modify: `src/App.tsx` (wrap provider)

**Interfaces:**
- Consumes: Worker API shapes; `Product` type; fallback `products` from data
- Produces:
  - `fetchPublicCatalog(): Promise<Product[]>`
  - `adminListProducts(token)`, `adminCreateProduct(token, input)`, `adminGetProduct`, `adminUpdateProduct`
  - `CatalogProvider`, `useCatalog(): { products, loading, error, reload }`

- [ ] **Step 1: Extend adminApi.ts** with typed fetch helpers matching Worker responses (`{ success, data, message? }`).

- [ ] **Step 2: Implement CatalogProvider**

```tsx
// On mount: fetchPublicCatalog(); on failure use static products from ../data/products
// Expose reload() for admin preview optional
```

- [ ] **Step 3: Wrap App with CatalogProvider inside CartProvider (or outside — either works; prefer outside Cart so both see catalog).**

- [ ] **Step 4: `npx tsc --noEmit`**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add catalog client and CatalogProvider"
```

---

### Task 4: Admin Products UI (list, New Product, edit)

**Files:**
- Create: `src/pages/admin/AdminShell.tsx`
- Create: `src/pages/admin/ProductList.tsx`
- Create: `src/pages/admin/ProductEdit.tsx`
- Create: `src/pages/admin/AdminImages.tsx` (move from Admin.tsx)
- Modify: `src/App.tsx` routes
- Delete or thin: `src/pages/Admin.tsx` → re-export shell entry

**Interfaces:**
- Consumes: adminApi CRUD, `buildCreatedProduct` optional client-side preview, session token `vikko_admin_token`
- Produces routes:
  - `/admin` → redirect products if logged in else login
  - `/admin/products`
  - `/admin/products/:id`
  - `/admin/images`

- [ ] **Step 1: AdminShell** — shared login form (extract from current Admin), nav links Products | Images, outlet via wouter nested routes or separate pages with shared layout component.

- [ ] **Step 2: ProductList** — fetch `adminListProducts`; table; New Product modal fields per spec; on Create call API then `navigate(/admin/products/${id})`.

- [ ] **Step 3: ProductEdit** — load by id; General + Status + RX + Media link to `/admin/images?sku=${imageSku}`; Save → PUT; Preview opens `/product/${slug}` in new tab.

- [ ] **Step 4: Move image uploader to AdminImages**; SKU dropdown from `adminListProducts` `imageSku` list (fallback hard-coded if fetch fails); honor `?sku=` query.

- [ ] **Step 5: Wire App.tsx routes**; keep Header/Footer for Phase 1.

- [ ] **Step 6: Manual smoke locally against `wrangler dev`** (document if secrets missing).

- [ ] **Step 7: Commit**

```bash
git commit -m "feat: add admin product list, create modal, and edit page"
```

---

### Task 5: Storefront reads CatalogProvider

**Files:**
- Modify: `src/pages/Shop.tsx`, `src/pages/Home.tsx`, `src/pages/ProductDetail.tsx`, any `getProductBySlug` / `getRelatedProducts` call sites
- Modify: `src/data/products.ts` — keep helpers but accept optional list parameter OR move helpers to `src/lib/catalogQueries.ts`

**Interfaces:**
- Consumes: `useCatalog().products`
- Produces: shop/home/PDP render from live list; `getProductBySlug(slug, list)`

- [ ] **Step 1: Refactor helpers**

```ts
export function getProductBySlug(slug: string, list: Product[] = products): Product | undefined
export function getRelatedProducts(slug: string, limit = 4, list: Product[] = products): Product[]
```

- [ ] **Step 2: Update pages to use `useCatalog()`** and pass `products` into helpers. Show simple loading state if `loading`.

- [ ] **Step 3: Filter published on client only if API already filters — do not double-hide incorrectly.** Trust `/api/catalog`; fallback static list treats missing `published` as visible.

- [ ] **Step 4: `npm test && npx tsc --noEmit`**

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: drive shop and PDP from live catalog provider"
```

---

### Task 6: Docs, design status, operator checklist

**Files:**
- Modify: `workers/images-admin/README.md`
- Modify: `docs/superpowers/specs/2026-08-13-light-product-admin-design.md` (Status: Approved)
- Modify: `.env.example` if new vars (none expected beyond existing API URL)

- [ ] **Step 1: README steps** — create KV, set id in wrangler.toml, deploy, seed, verify `/api/catalog`, use `/admin/products`.

- [ ] **Step 2: Mark design Approved**

- [ ] **Step 3: Commit**

```bash
git commit -m "docs: approve light product admin spec and KV operator steps"
```

---

## Spec coverage self-check

| Spec item | Task |
|-----------|------|
| New Product modal | 4 |
| Edit General/Status/RX/Media link | 4 |
| KV + CRUD + public catalog | 2 |
| Runtime storefront fetch | 3, 5 |
| Dynamic image SKU list | 4 |
| Seed + fallback products.ts | 2, 5 |
| No variants/attributes Phase 1 | — deferred |
| vs-00N imageSku | 1 |

## Placeholder scan

KV namespace `id = "REPLACE_AFTER_..."` is an operator step in Task 2 README — not a code TBD. SKU style locked to `vs-00N`.

---
