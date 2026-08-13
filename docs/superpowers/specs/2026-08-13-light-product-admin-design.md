# Vikko Sport — Light Product Admin (Phase 1)

**Date:** 2026-08-13  
**Status:** Approved  
**SKU style:** `vs-00N` / `VS-00N` (normalize to `imageSku` e.g. `vs-006`)

## Goal

Ship a Getooup-like **product admin** so ops can:

1. List products  
2. **Create** a new product (New Product modal)  
3. **Edit** title, slug, description, price, published, RX  
4. Jump to existing image upload for gallery angles  

Storefront reads the live catalog from the Worker (KV). Changes apply after refresh — no frontend rebuild required for copy/price.

## Non-goals (Phase 1)

- Color options UI / multi-variant matrix (reference “Options” / “Variants” tables)  
- Per-variant inventory ledger beyond a simple `inStock` / optional `stock` number  
- Frame measurement Attributes panel (height/width/bridge/temple mm)  
- Collections / rich category checkbox taxonomy (Best Sellers, Narrow PD, …)  
- Order / payment / prescription file CMS  

Those stay for Phase 2, matching the remaining reference screens.

## Architecture

```
[Admin UI /admin]
  login (existing)
  /admin/products          list + New Product modal
  /admin/products/:id      edit (General + Status + RX + Media link)
  /admin/images            existing image uploader (SKU + angle)

[Worker — extend vikkosport-images-admin]
  KV binding: PRODUCTS
  GET  /api/catalog                 public — full product list for storefront
  GET  /api/admin/products          auth — list
  POST /api/admin/products          auth — create
  GET  /api/admin/products/:id      auth — one product
  PUT  /api/admin/products/:id      auth — update
  (optional) POST /api/admin/products/seed  auth — copy seed from bundled defaults once

[Storefront]
  On app load: fetch `${VITE_API_BASE_URL}/api/catalog`
  Success → use as catalog source
  Fail / empty → fall back to src/data/products.ts
```

**Why KV:** Same Cloudflare account as Images Worker; no new vendor; enough for tens/hundreds of SKUs.

## Data model

Keep the existing `Product` TypeScript shape. Phase 1 admin edits a **subset**; create fills sensible defaults for the rest.

### Editable / create fields (Phase 1)

| Field | List | New Product | Edit |
|-------|------|-------------|------|
| `sku` | ✓ | ✓ required (e.g. `VS-006` or `vs-006`) | read-only after create |
| `name` / Title | ✓ | ✓ required | ✓ |
| `category` | ✓ | ✓ sunglasses \| eyeglasses \| accessories | ✓ |
| `price` | ✓ | ✓ required | ✓ |
| `slug` / Handle | | auto from name (editable on Edit) | ✓ |
| `description` | | optional (default `""`) | ✓ |
| `published` / Active | ✓ | ✓ default on → maps to visible in catalog | ✓ |
| `rxCompatible` | | default `false` (Edit can toggle) | ✓ |
| `stock` (optional number) | | optional, default `0` → `inStock = stock > 0` or keep `inStock` bool | ✓ simple |

### Defaults on create (not shown in New Product modal)

- `id`: generated (`crypto.randomUUID()` or incremental)  
- `slug`: slugify(`name`); ensure unique  
- `images`: empty array until ops upload via Images admin using image key `vs-NNN` derived from SKU  
- `colors`: `[{ id: 'default', name: 'Default', hex: '#1a1a1a' }]`  
- `features`: `[]`  
- `tags`: `[]`  
- `rating`: `0`, `reviewCount`: `0`  
- `rxType`: `null`  
- Image Custom ID prefix for uploads: derive `imageSku` = lowercase sku with non-alnum → `-`, prefer `vs-006` style so existing uploader works  

**Published:** unpublished products are omitted from `GET /api/catalog` (admin list still shows all).

## Admin UI (visual language)

Light retail admin (white cards, black primary buttons), layout inspired by references — not a pixel clone of Getooup.

### `/admin` after login

Redirect to `/admin/products` (or show a simple nav: Products | Images).

### Product list

- Table: Name, SKU, Category, Price, Status (Published/Draft), actions Edit  
- Primary button: **New product**

### New Product modal (reference 1)

Fields:

- SKU *  
- Category * (select)  
- Name *  
- Price (US$) *  
- Total stock (number, default 0) — helper: inventory detail later on edit  
- Active checkbox (default on)  

Actions: Cancel / Create → on success close modal and navigate to Edit page.

**Omit from Phase 1 modal:** Material dropdown (can be a free-text on Edit later or Phase 2).

### Edit Product page (reference 2, simplified)

**Header:** back link, Title, `ID` + `SKU`, buttons Preview (storefront `/product/:slug`), Save changes.

**Left — General card:**

- Title  
- SKU (read-only)  
- Handle (`/` + slug)  
- Description (textarea)  
- Frame price (US$)  

**Right — Status card:**

- Published toggle  

**Right — RX card (Vikko-specific):**

- Prescription ready toggle (`rxCompatible`)  
- Optional `rxType` select when on: direct | insert | clip-on  

**Media card:**

- Short note + link/button: “Manage gallery images” → `/admin/images?sku=vs-006`  
- Do not rebuild full media library in Phase 1  

**Defer on Edit:** Organize tags/collections/category checkboxes, Options/colors, Variants table, Attributes mm fields.

## Image key convention

Existing uploader uses `vikko-{imageSku}-{angle}` with `imageSku` like `vs-001`.

On create:

1. Normalize SKU → `imageSku` (e.g. `VS-006` → `vs-006`)  
2. Store `imageSku` on product (or derive always from `sku`)  
3. Prefill Images admin SKU dropdown from catalog (dynamic list, not hard-coded 5)

## Seed / migration

1. On first deploy, operator calls seed (or Worker auto-seeds if KV empty) from current `src/data/products.ts` snapshot bundled into Worker **or** POSTed once from admin.  
2. Prefer: Worker ships a `seed.json` copy of the 5 products; `GET /api/catalog` if KV miss → return seed and optionally write KV.  
3. `products.ts` remains fallback if API unreachable.

## Security

- Same `ADMIN_PASSWORD` / session token as image upload  
- `/api/catalog` is public read-only (published only)  
- Mutations require Bearer admin token  
- CORS unchanged (+ localhost / dev.vikkosport.com)

## Rollout

1. Add KV namespace + binding to Worker; implement catalog + CRUD routes  
2. Seed KV with current 5 products  
3. Build admin Products UI; keep Images route  
4. Storefront: catalog provider hook fetching `/api/catalog`  
5. Smoke: create product → edit price → publish → appears on `/shop` after refresh → upload front image → PDP shows CDN image when hash set  

## Success criteria

- Ops can create a product from New Product modal without editing git  
- Ops can edit price/name/description/published/RX and see storefront update after refresh  
- Unpublished products hidden from shop  
- Image upload still works for new SKUs via dynamic SKU list  
- No Cloudflare Images API token in the Vite bundle  

## Open items for you

1. Confirm SKU style for new items: keep `VS-00N` / `vs-00N` (recommended) vs free-form like `HM713`  
2. After you approve this doc, implementation plan → build  

## Approval

Reply **可以** to accept Phase 1 as written (New Product + Edit subset + KV + runtime catalog), or list changes.
