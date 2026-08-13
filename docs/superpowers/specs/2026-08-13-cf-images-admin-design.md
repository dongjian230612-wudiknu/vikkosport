# Vikko Sport — Product Image Admin (Cloudflare Images)

**Date:** 2026-08-13  
**Status:** Draft — awaiting user review  
**Scope:** Upload / replace product gallery images only (no price, inventory, or order admin)

## Goal

Let ops upload product photos from a simple `/admin` page into **Cloudflare Images**, without committing files to git or relying on `public/images/products` surviving deploys. Coexist safely with another site that already uses the same Cloudflare Images account.

## Non-goals (this phase)

- Full CMS (prices, copy, SKUs, inventory)
- Order / prescription file storage
- Virtual try-on media
- Migrating historical non-Vikko images

## Architecture

```
[Browser /admin]
    │  1. login (shared password)
    │  2. request one-time upload URL
    ▼
[Upload API — Cloudflare Worker]
    │  holds CF API token + admin password hash
    │  POST /api/admin/direct-upload → { uploadURL, id }
    ▼
[Browser uploads file directly to Cloudflare Images]
    │  custom id: vikko-vs-001-front
    │  metadata tags: vikko, product, vs-001
    ▼
[CDN delivery]
    https://imagedelivery.net/<ACCOUNT_HASH>/vikko-vs-001-front/public
```

- **Why Worker, not SPA-only:** Cloudflare Images API tokens must never ship in the Vite bundle.
- **Why Direct Creator Upload:** Browser → Images; Worker only mints short-lived upload URLs.
- **Why Custom ID:** Stable public URL; re-upload with the same id replaces the image without editing `products.ts`.

## Naming convention (avoids cross-site clashes)

| Piece | Rule | Example |
|-------|------|---------|
| Custom ID | `vikko-{sku}-{angle}` | `vikko-vs-001-front` |
| Angles | `front` \| `45` \| `side` \| `detail` | `vikko-vs-002-45` |
| Tags | `vikko`, `product`, `{sku}` | `vikko`, `product`, `vs-001` |

Other sites keep their own prefixes (or no custom id). Same account, no overwrite risk if prefixes differ.

## Frontend catalog wiring

1. Add `VITE_CF_IMAGES_HASH` (account hash from Images delivery URL).
2. Add helper `productImageUrl(sku, angle)` →  
   `https://imagedelivery.net/${hash}/vikko-${sku}-${angle}/public`
3. Update `src/data/products.ts` image `url` fields to use the helper (or store `{ sku, angle }` and resolve at render).
4. **Dev fallback:** if hash unset, keep current `/images/products/...webp` local paths so local UI still works.

## Admin UI (`/admin`)

Minimal light-retail page (no Header mega-nav chrome required; simple shell):

1. **Login** — single shared password (Phase 1). Session token in `sessionStorage` (or httpOnly cookie from Worker later).
2. **Upload form**
   - Product select (from catalog SKUs: vs-001 … vs-005)
   - Angle select: front / 45 / side
   - File input: `image/jpeg`, `image/webp`, `image/png` (max ~10MB)
   - Preview + Upload
3. After success: show delivery URL + thumbnail; note that same custom id was overwritten if it already existed.
4. Optional Phase 1.1: list Images filtered by tag `vikko` (Worker proxy to CF list API).

Route: `/admin` (and `/admin/login` if split). Not linked from public footer/header.

## Upload API (Cloudflare Worker)

Base URL e.g. `https://api-dev.vikkosport.com` (already in `.env.example` as `VITE_API_BASE_URL`).

| Endpoint | Auth | Purpose |
|----------|------|---------|
| `POST /api/admin/login` | password body | Returns short-lived admin session token |
| `POST /api/admin/direct-upload` | admin token | Body: `{ sku, angle }` → creates Direct Upload with custom id + tags → `{ uploadURL, id }` |
| `GET /api/admin/images` | admin token | Optional: list tag=`vikko` |

Worker secrets (not in git):

- `CF_ACCOUNT_ID`
- `CF_IMAGES_API_TOKEN` (Images edit permission)
- `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET`

CORS: allow `https://dev.vikkosport.com` (and localhost for dev).

## Security

- API token only on Worker.
- Admin password required for minting upload URLs.
- No public anonymous upload.
- Phase 2 hardening (out of scope now): Cloudflare Access, per-user accounts, rate limits.

## Rollout plan

1. Create Images variant `public` (already exists in screenshot).
2. Deploy Worker + set secrets; point `VITE_API_BASE_URL` at Worker.
3. Ship `/admin` + `productImageUrl` helper; switch catalog URLs to CF when hash is set.
4. Re-upload existing Velocity / Storm assets via admin (or dashboard with custom ids).
5. Keep local webp in repo as optional fallback until CF is verified, then can delete later.

## Success criteria

- Ops can replace `vikko-vs-001-front` from `/admin` without a git commit.
- Storefront shows the new image after refresh (CDN; may need short cache wait).
- Another site’s Images assets remain untouched.
- Deploy of the Vite app does not wipe product photos.

## Open items (need from you before build)

1. Cloudflare Images **account hash** (from any delivery URL).
2. Confirm Worker host: reuse `api-dev.vikkosport.com` or a workers.dev subdomain for Phase 1.
3. Choose admin password (set as Worker secret; do not paste into chat if possible — set in dashboard).
