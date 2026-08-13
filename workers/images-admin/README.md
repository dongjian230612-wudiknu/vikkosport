# Vikko Images Admin Worker

Cloudflare Worker that mints Direct Creator Upload URLs for the `/admin` product image uploader. Holds the Cloudflare Images API token and admin credentials — never expose these in the Vite bundle.

## Operator deploy checklist

Complete these steps in order:

1. **Create a Cloudflare API token** with **Cloudflare Images → Edit** permission for the Vikko account. Copy the token and account ID from the Cloudflare dashboard.

2. **Set Worker secrets** (from this directory):

   ```bash
   cd workers/images-admin
   npm install
   wrangler secret put CF_ACCOUNT_ID
   wrangler secret put CF_IMAGES_API_TOKEN
   wrangler secret put ADMIN_PASSWORD
   wrangler secret put ADMIN_SESSION_SECRET
   ```

   Use a strong random value for `ADMIN_SESSION_SECRET` (e.g. `openssl rand -hex 32`).

3. **Deploy the Worker:**

   ```bash
   npm run deploy
   ```

   Note the deployed URL (e.g. `https://vikkosport-images-admin.<subdomain>.workers.dev`).

4. **Point the frontend at the Worker** — set `VITE_API_BASE_URL` to the Worker URL (leave `VITE_CF_IMAGES_HASH` empty for now):
   - **Local:** copy `.env.example` to `.env.development` and set `VITE_API_BASE_URL` (do not commit).
   - **CI:** add GitHub Actions repository secret `VITE_API_BASE_URL` (wired in `.github/workflows/deploy.yml` build step). Redeploy the frontend if needed so `/admin` can reach the Worker.

5. **Upload catalog images** before enabling CDN URLs. Use `/admin` (login with `ADMIN_PASSWORD`) or the Cloudflare Images dashboard with custom IDs `vikko-{sku}-{angle}` (e.g. `vikko-vs-001-front`). Upload does **not** require `VITE_CF_IMAGES_HASH`. Cover every SKU/angle wired in the catalog (Velocity/Storm multi-angle + Apex/Trail/Aero `front`).

6. **Set `VITE_CF_IMAGES_HASH`** only after the uploads above exist — extract the account hash from any Cloudflare Images delivery URL:

   ```
   https://imagedelivery.net/<ACCOUNT_HASH>/vikko-vs-001-front/public
   ```

   - **Local:** add to `.env.development` (do not commit).
   - **CI:** add GitHub Actions repository secret `VITE_CF_IMAGES_HASH` (same `deploy.yml` build step passes it into `npm run build`).

   **Cutover warning:** A non-empty hash switches the catalog to `imagedelivery.net` for all wired SKU/angle URLs. There is no per-image existence check and no local `/images/products/*.webp` fallback once the hash is set. Missing custom IDs will 404 on the storefront.

7. **Redeploy the frontend** so the hash (and API URL) take effect (`npm run build` locally or push to trigger CI).

8. **Smoke test:**
   - Confirm PDP/shop images load from `imagedelivery.net` for uploaded SKUs.
   - Re-upload via `/admin` if needed and verify the new asset appears (cache-bust / hard refresh).

## Local development

```bash
npm run dev
```

Use `.dev.vars` (gitignored at repo root) for local secrets — same keys as the `wrangler secret put` list above.

## Custom image IDs

Uploaded images use the pattern `vikko-{sku}-{angle}` (e.g. `vikko-vs-001-front`). Re-uploading with the same SKU and angle replaces the existing image without code changes.
