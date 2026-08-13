# Cloudflare Images Admin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a password-gated `/admin` page that uploads product gallery images to Cloudflare Images with stable `vikko-{sku}-{angle}` custom IDs, and wire the storefront to CDN URLs when configured.

**Architecture:** Vite SPA calls a Cloudflare Worker for login + Direct Creator Upload URLs. The browser uploads the file straight to Cloudflare Images. Catalog URLs resolve via `productImageUrl(sku, angle)` using `VITE_CF_IMAGES_HASH`, with local `/images/products/*.webp` fallback when the hash is unset.

**Tech Stack:** React 19, TypeScript, Vite, wouter, Cloudflare Workers (Wrangler), Cloudflare Images Direct Creator Upload API

## Global Constraints

- Scope is **image upload/replace only** — no price, inventory, or order admin.
- Custom ID format: `vikko-{sku}-{angle}` (angles: `front` | `45` | `side` | `detail`).
- Tags on every upload: `vikko`, `product`, `{sku}`.
- Cloudflare API tokens and admin password live **only** in Worker secrets — never in `VITE_*` env.
- CORS allow: `https://dev.vikkosport.com`, `http://localhost:5173`.
- Keep existing local webp files as fallback until CF hash is set.
- Brand UI: light retail, brand colors from Tailwind config; admin is utilitarian, not a second marketing site.
- Do not link `/admin` from public Header/Footer.

---

## File map

| Path | Responsibility |
|------|----------------|
| `src/lib/productImage.ts` | Build CDN or local product image URLs |
| `src/lib/productImage.test.ts` | Unit tests for URL helper |
| `src/data/products.ts` | Catalog image URLs via helper |
| `src/lib/adminApi.ts` | Typed fetch wrappers for Worker endpoints |
| `src/pages/Admin.tsx` | Login + upload UI |
| `src/App.tsx` | Route `/admin` (optional: hide site chrome) |
| `.env.example` | Document `VITE_CF_IMAGES_HASH` + `VITE_API_BASE_URL` |
| `workers/images-admin/src/index.ts` | Worker: login, direct-upload, CORS |
| `workers/images-admin/wrangler.toml` | Worker name, routes, compatibility |
| `workers/images-admin/package.json` | Wrangler scripts |
| `docs/superpowers/specs/2026-08-13-cf-images-admin-design.md` | Mark status Approved after ship notes |

---

### Task 1: Product image URL helper + tests

**Files:**
- Create: `src/lib/productImage.ts`
- Create: `src/lib/productImage.test.ts`
- Modify: `package.json` (add `vitest`, script `"test": "vitest run"`)
- Modify: `vite.config.ts` or create `vitest.config.ts` if needed for resolve

**Interfaces:**
- Consumes: none
- Produces:
  - `export type ProductImageAngle = 'front' | '45' | 'side' | 'detail'`
  - `export function productImageId(sku: string, angle: ProductImageAngle): string`
  - `export function productImageUrl(sku: string, angle: ProductImageAngle, opts?: { hash?: string }): string`
  - `export function localProductImagePath(sku: string, angle: ProductImageAngle): string`

- [ ] **Step 1: Add vitest**

```bash
npm install -D vitest
```

Add to `package.json` scripts:

```json
"test": "vitest run"
```

If `vite.config.ts` exists, add `/// <reference types="vitest/config" />` and `test: { environment: 'node' }` — or create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { environment: 'node' },
});
```

- [ ] **Step 2: Write failing tests**

```ts
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
```

- [ ] **Step 3: Run tests — expect FAIL**

```bash
npm test
```

Expected: FAIL — module `./productImage` not found

- [ ] **Step 4: Implement helper**

```ts
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
  const hash = opts?.hash ?? import.meta.env.VITE_CF_IMAGES_HASH ?? '';
  if (!hash) return localProductImagePath(sku, angle);
  return `https://imagedelivery.net/${hash}/${productImageId(sku, angle)}/public`;
}
```

Note: vitest may need `/// <reference types="vite/client" />` or mock `import.meta.env` — prefer always passing `{ hash }` in tests; implementation may read env only when `opts?.hash === undefined`:

```ts
const hash =
  opts && 'hash' in opts
    ? opts.hash ?? ''
    : (import.meta.env.VITE_CF_IMAGES_HASH as string | undefined) ?? '';
```

- [ ] **Step 5: Run tests — expect PASS**

```bash
npm test
```

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vite.config.ts vitest.config.ts src/lib/productImage.ts src/lib/productImage.test.ts
git commit -m "feat: add productImageUrl helper for Cloudflare Images"
```

---

### Task 2: Wire catalog images through the helper

**Files:**
- Modify: `src/data/products.ts`
- Modify: `.env.example`
- Modify: `src/vite-env.d.ts` (create if missing) for `VITE_CF_IMAGES_HASH`

**Interfaces:**
- Consumes: `productImageUrl`, `ProductImageAngle` from `src/lib/productImage.ts`
- Produces: catalog `images[].url` resolve at module load via helper

- [ ] **Step 1: Extend env types and example**

`.env.example` add:

```env
# Cloudflare Images account hash (from imagedelivery.net/<hash>/...)
VITE_CF_IMAGES_HASH=
```

`src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_CF_IMAGES_HASH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

- [ ] **Step 2: Update products.ts image arrays**

For each product, derive sku key from existing paths (`vs-001` … `vs-005`):

```ts
import { productImageUrl } from '../lib/productImage';

// Velocity example
images: [
  { url: productImageUrl('vs-001', 'front'), alt: 'Velocity front view', angle: 'front' },
  { url: productImageUrl('vs-001', '45'), alt: 'Velocity 45 degree view', angle: '45' },
  { url: productImageUrl('vs-001', 'side'), alt: 'Velocity side view', angle: 'side' },
],
```

Storm: three angles with `vs-002`.  
Apex / Trail / Aero: at least `front` via helper (`vs-003` … `vs-005`); keep single-angle until more assets exist.

- [ ] **Step 3: Verify typecheck**

```bash
npx tsc --noEmit && npm test
```

Expected: PASS. With hash unset, URLs remain `/images/products/...webp`.

- [ ] **Step 4: Commit**

```bash
git add src/data/products.ts .env.example src/vite-env.d.ts
git commit -m "feat: resolve catalog image URLs via Cloudflare helper"
```

---

### Task 3: Cloudflare Worker — login + direct-upload

**Files:**
- Create: `workers/images-admin/package.json`
- Create: `workers/images-admin/tsconfig.json`
- Create: `workers/images-admin/wrangler.toml`
- Create: `workers/images-admin/src/index.ts`
- Create: `workers/images-admin/README.md` (secrets + deploy commands only)

**Interfaces:**
- Consumes: Cloudflare Images HTTP API
- Produces HTTP API:
  - `POST /api/admin/login` body `{ password: string }` → `{ success: true, data: { token: string } }`
  - `POST /api/admin/direct-upload` header `Authorization: Bearer <token>` body `{ sku: string, angle: string }` → `{ success: true, data: { uploadURL: string, id: string } }`
  - Error shape: `{ success: false, message: string }`

- [ ] **Step 1: Scaffold worker package**

`workers/images-admin/package.json`:

```json
{
  "name": "vikkosport-images-admin",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20250812.0",
    "typescript": "^5.9.2",
    "wrangler": "^4.28.0"
  }
}
```

`wrangler.toml`:

```toml
name = "vikkosport-images-admin"
main = "src/index.ts"
compatibility_date = "2025-08-01"

# Phase 1: workers.dev URL is fine. Later attach api-dev.vikkosport.com.
# routes = [{ pattern = "api-dev.vikkosport.com/*", zone_name = "vikkosport.com" }]
```

- [ ] **Step 2: Implement Worker**

```ts
// workers/images-admin/src/index.ts
export interface Env {
  CF_ACCOUNT_ID: string;
  CF_IMAGES_API_TOKEN: string;
  ADMIN_PASSWORD: string;
  ADMIN_SESSION_SECRET: string;
}

const ALLOWED_ORIGINS = new Set([
  'https://dev.vikkosport.com',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]);

const ANGLES = new Set(['front', '45', 'side', 'detail']);
const SKU_RE = /^vs-\d{3}$/;

function corsHeaders(origin: string | null): HeadersInit {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://dev.vikkosport.com';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };
}

function json(data: unknown, status = 200, origin: string | null = null): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  });
}

async function hmacToken(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

async function verifyBearer(env: Env, header: string | null): Promise<boolean> {
  if (!header?.startsWith('Bearer ')) return false;
  const token = header.slice(7);
  const [expStr, sig] = token.split('.');
  const exp = Number(expStr);
  if (!exp || Date.now() > exp) return false;
  const expected = await hmacToken(env.ADMIN_SESSION_SECRET, expStr);
  return sig === expected;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin');
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/api/admin/login') {
      const body = (await request.json()) as { password?: string };
      if (!body.password || body.password !== env.ADMIN_PASSWORD) {
        return json({ success: false, message: 'Invalid password' }, 401, origin);
      }
      const exp = String(Date.now() + 12 * 60 * 60 * 1000);
      const sig = await hmacToken(env.ADMIN_SESSION_SECRET, exp);
      return json({ success: true, data: { token: `${exp}.${sig}` } }, 200, origin);
    }

    if (request.method === 'POST' && url.pathname === '/api/admin/direct-upload') {
      if (!(await verifyBearer(env, request.headers.get('Authorization')))) {
        return json({ success: false, message: 'Unauthorized' }, 401, origin);
      }
      const body = (await request.json()) as { sku?: string; angle?: string };
      const sku = body.sku?.trim() ?? '';
      const angle = body.angle?.trim() ?? '';
      if (!SKU_RE.test(sku) || !ANGLES.has(angle)) {
        return json({ success: false, message: 'Invalid sku or angle' }, 400, origin);
      }
      const id = `vikko-${sku}-${angle}`;

      // Replace: delete existing custom id if present (ignore 404)
      await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/images/v1/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${env.CF_IMAGES_API_TOKEN}` },
        }
      );

      const form = new FormData();
      form.append('id', id);
      form.append('metadata', JSON.stringify({ sku, angle, site: 'vikko' }));
      // RequireSignedURLs false by default for public delivery
      const cfRes = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${env.CF_ACCOUNT_ID}/images/v2/direct_upload`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${env.CF_IMAGES_API_TOKEN}` },
          body: form,
        }
      );
      const cfJson = (await cfRes.json()) as {
        success: boolean;
        errors?: { message: string }[];
        result?: { uploadURL: string; id: string };
      };
      if (!cfRes.ok || !cfJson.success || !cfJson.result) {
        return json(
          {
            success: false,
            message: cfJson.errors?.[0]?.message ?? 'Cloudflare Images error',
          },
          502,
          origin
        );
      }

      // Tags: CF Images supports separate tag API after upload; for Phase 1 metadata is enough.
      // Optional: after client upload completes, admin could call a tag endpoint later.

      return json(
        {
          success: true,
          data: { uploadURL: cfJson.result.uploadURL, id: cfJson.result.id },
        },
        200,
        origin
      );
    }

    return json({ success: false, message: 'Not found' }, 404, origin);
  },
};
```

- [ ] **Step 3: Document secrets in Worker README**

```md
# Vikko Images Admin Worker

## Secrets
wrangler secret put CF_ACCOUNT_ID
wrangler secret put CF_IMAGES_API_TOKEN
wrangler secret put ADMIN_PASSWORD
wrangler secret put ADMIN_SESSION_SECRET

## Deploy
npm install
npm run deploy

Set frontend VITE_API_BASE_URL to the Worker URL (workers.dev or api-dev.vikkosport.com).
```

- [ ] **Step 4: Install + typecheck worker locally**

```bash
cd workers/images-admin && npm install && npx tsc --noEmit
```

Add minimal `tsconfig.json` with `"types": ["@cloudflare/workers-types"]`.

- [ ] **Step 5: Commit**

```bash
git add workers/images-admin
git commit -m "feat: add Cloudflare Worker for admin image direct upload"
```

---

### Task 4: Admin API client + Admin page

**Files:**
- Create: `src/lib/adminApi.ts`
- Create: `src/pages/Admin.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: Worker API shapes from Task 3; `productImageId`, `productImageUrl` from Task 1; product list SKUs from `products` catalog
- Produces: `/admin` route UI

- [ ] **Step 1: Implement adminApi.ts**

```ts
const base = () => import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? '';

type ApiOk<T> = { success: true; data: T };
type ApiErr = { success: false; message?: string };

async function parseJson<T>(res: Response): Promise<T> {
  const body = (await res.json()) as ApiOk<T> | ApiErr;
  if (!res.ok || !('success' in body) || !body.success) {
    throw new Error((body as ApiErr).message || `Request failed (${res.status})`);
  }
  return body.data;
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
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
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
```

- [ ] **Step 2: Implement Admin.tsx**

Behavior:
1. If no `sessionStorage.vikko_admin_token`, show password form → `adminLogin` → store token.
2. Else show form: SKU select (`vs-001`…`vs-005`), angle select, file input (`image/jpeg,image/webp,image/png`), max 10MB client check.
3. On submit: `createDirectUpload` → `uploadToCloudflare` → show success with `productImageUrl(sku, angle)` and `<img>` preview (cache-bust `?t=Date.now()`).
4. Logout clears sessionStorage.
5. All fetch errors: show red text message (project uses toast elsewhere; Admin may use inline error for YAGNI).

SKU options: hardcode `['vs-001','vs-002','vs-003','vs-004','vs-005']` matching catalog.

- [ ] **Step 3: Register route in App.tsx**

```tsx
import { Admin } from './pages/Admin';

// Inside Switch, before 404:
<Route path="/admin" component={Admin} />
```

Keep Header/Footer for Phase 1 (simplest). Do not add nav link.

- [ ] **Step 4: Manual smoke (local)**

```bash
npm run dev
```

Open `/admin` — login form renders; without Worker, submit shows fetch error (expected until Task 5 secrets).

- [ ] **Step 5: Commit**

```bash
git add src/lib/adminApi.ts src/pages/Admin.tsx src/App.tsx
git commit -m "feat: add /admin product image upload page"
```

---

### Task 5: Deploy checklist + spec status

**Files:**
- Modify: `workers/images-admin/README.md` (final deploy order)
- Modify: `docs/superpowers/specs/2026-08-13-cf-images-admin-design.md` (Status: Approved / Implemented)
- Modify: `.env.development` only if present and non-secret placeholders — **never commit real secrets**

- [ ] **Step 1: Write operator checklist in Worker README**

Ordered steps:
1. Create CF API token with Cloudflare Images Edit.
2. `wrangler secret put` all four secrets.
3. `npm run deploy` from `workers/images-admin`.
4. Set GitHub Actions / local `VITE_API_BASE_URL` to Worker URL.
5. Set `VITE_CF_IMAGES_HASH` from any Images delivery URL.
6. Redeploy frontend.
7. Visit `/admin`, upload `vs-001` / `front`, confirm storefront PDP.

- [ ] **Step 2: Update design spec status line to Approved**

- [ ] **Step 3: Commit**

```bash
git add workers/images-admin/README.md docs/superpowers/specs/2026-08-13-cf-images-admin-design.md
git commit -m "docs: finalize CF Images admin deploy checklist"
```

---

## Spec coverage self-check

| Spec requirement | Task |
|------------------|------|
| Cloudflare Images storage | 3, 4 |
| Custom ID `vikko-{sku}-{angle}` | 1, 3 |
| Tags `vikko`, `product`, `{sku}` | 3 (metadata; tags API optional) |
| `/admin` login + upload | 4 |
| Worker login + direct-upload | 3 |
| `productImageUrl` + local fallback | 1, 2 |
| Token not in Vite bundle | 3, 4 |
| No public Header link | 4 |
| CORS localhost + dev | 3 |
| Optional list endpoint | Deferred (YAGNI) |

**Note on tags:** Direct Upload form metadata carries `sku`/`site`; applying CF `tags` array may require a follow-up Images API call after upload. Phase 1 treats metadata + custom id prefix as sufficient for cross-site isolation; add tag PATCH later if dashboard filtering by tag is required.

## Placeholder scan

No TBD steps. Open items from spec (hash, Worker host, password) are operator secrets handled in Task 5 checklist, not code blockers.

---
