# Vikko Images Admin Worker

Cloudflare Worker that mints Direct Creator Upload URLs for the `/admin` product image uploader. Holds the Cloudflare Images API token and admin credentials — never expose these in the Vite bundle.

## Operator deploy checklist

Complete these steps in order:

1. **Create a Cloudflare API token** with **Cloudflare Images → Edit** permission for the Vikko account. Copy the token and account ID from the Cloudflare dashboard.

2. **Create the PRODUCTS KV namespace** and bind it in `wrangler.toml`:

   ```bash
   cd workers/images-admin
   npx wrangler kv namespace create PRODUCTS
   # paste the printed id into wrangler.toml under [[kv_namespaces]] binding = "PRODUCTS"
   ```

   Deploy will fail until the placeholder `REPLACE_AFTER_wrangler_kv_namespace_create` is replaced with the real id.

3. **Set Worker secrets** (from this directory):

   ```bash
   cd workers/images-admin
   npm install
   wrangler secret put CF_ACCOUNT_ID
   wrangler secret put CF_IMAGES_API_TOKEN
   wrangler secret put ADMIN_PASSWORD
   wrangler secret put ADMIN_SESSION_SECRET
   ```

   Use a strong random value for `ADMIN_SESSION_SECRET` (e.g. `openssl rand -hex 32`).

4. **Deploy the Worker:**

   ```bash
   npm run deploy
   ```

   Note the deployed URL (e.g. `https://vikkosport-images-admin.<subdomain>.workers.dev`).

5. **Seed the product catalog** (optional — `GET /api/catalog` also auto-seeds when KV is empty):

   ```bash
   WORKER_URL=https://vikkosport-images-admin.<subdomain>.workers.dev
   TOKEN=$(curl -s -X POST "$WORKER_URL/api/admin/login" \
     -H "Content-Type: application/json" \
     -d '{"password":"<ADMIN_PASSWORD>"}' | jq -r '.data.token')
   curl -s -X POST "$WORKER_URL/api/admin/products/seed" \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{}'   # or { "force": true } to overwrite
   ```

6. **Point the frontend at the Worker** — set `VITE_API_BASE_URL` to the Worker URL (leave `VITE_CF_IMAGES_HASH` empty for now):
   - **Local:** copy `.env.example` to `.env.development` and set `VITE_API_BASE_URL` (do not commit).
   - **CI:** add GitHub Actions repository secret `VITE_API_BASE_URL` (wired in `.github/workflows/deploy.yml` build step). Redeploy the frontend if needed so `/admin` can reach the Worker.

7. **Upload catalog images** before enabling CDN URLs. Use `/admin` (login with `ADMIN_PASSWORD`) or the Cloudflare Images dashboard with custom IDs `vikko-{sku}-{angle}` (e.g. `vikko-vs-001-front`). Upload does **not** require `VITE_CF_IMAGES_HASH`. Cover every SKU/angle wired in the catalog (Velocity/Storm multi-angle + Apex/Trail/Aero `front`).

8. **Set `VITE_CF_IMAGES_HASH`** only after the uploads above exist — extract the account hash from any Cloudflare Images delivery URL:

   ```
   https://imagedelivery.net/<ACCOUNT_HASH>/vikko-vs-001-front/public
   ```

   - **Local:** add to `.env.development` (do not commit).
   - **CI:** add GitHub Actions repository secret `VITE_CF_IMAGES_HASH` (same `deploy.yml` build step passes it into `npm run build`).

   **Cutover warning:** A non-empty hash switches the catalog to `imagedelivery.net` for all wired SKU/angle URLs. There is no per-image existence check and no local `/images/products/*.webp` fallback once the hash is set. Missing custom IDs will 404 on the storefront.

9. **Redeploy the frontend** so the hash (and API URL) take effect (`npm run build` locally or push to trigger CI).

10. **Smoke test — catalog + product admin:**
   - **Public catalog:** `curl -s "$WORKER_URL/api/catalog"` returns `{ "success": true, "data": [ ... ] }` with published products only.
   - **Product admin UI:** open `/admin/products` on the frontend (login with `ADMIN_PASSWORD`). List loads from `GET /api/admin/products`; use **New Product** to create, then edit General / Status / RX / Media link on `/admin/products/:id`.
   - **Images (optional):** confirm PDP/shop images load from `imagedelivery.net` for uploaded SKUs; re-upload via `/admin` if needed (hard refresh).

## Product catalog API

| Method | Path | Auth | Notes |
|--------|------|------|--------|
| `GET` | `/api/catalog` | public | Published products only (`published !== false`); auto-seeds KV if empty |
| `GET` | `/api/admin/products` | Bearer | All products |
| `POST` | `/api/admin/products` | Bearer | Create (SKU unique) |
| `GET` | `/api/admin/products/:id` | Bearer | One product |
| `PUT` | `/api/admin/products/:id` | Bearer | Partial update; `sku` / `id` immutable |
| `POST` | `/api/admin/products/seed` | Bearer | Seed if empty; `{ "force": true }` overwrites |

KV layout: binding `PRODUCTS`, key `catalog` → `Product[]` JSON. Seed snapshot: `src/seed.json`.

## Local development

```bash
npm run dev
```

Use `.dev.vars` (gitignored at repo root) for local secrets — same keys as the `wrangler secret put` list above.

## Custom image IDs

Uploaded images use the pattern `vikko-{sku}-{angle}` (e.g. `vikko-vs-001-front`). Re-uploading with the same SKU and angle replaces the existing image without code changes.
