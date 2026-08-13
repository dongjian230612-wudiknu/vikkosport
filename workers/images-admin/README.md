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

4. **Point the frontend at the Worker** — set `VITE_API_BASE_URL` to the Worker URL:
   - **Local:** copy `.env.example` to `.env.development` and set the value (do not commit).
   - **CI:** add `VITE_API_BASE_URL` to GitHub Actions secrets (see `.github/workflows/deploy.yml`).

5. **Set `VITE_CF_IMAGES_HASH`** — extract the account hash from any Cloudflare Images delivery URL:

   ```
   https://imagedelivery.net/<ACCOUNT_HASH>/vikko-vs-001-front/public
   ```

   Add to `.env.development` locally and to GitHub Actions secrets for production builds.

6. **Redeploy the frontend** so the new env vars take effect (`npm run build` locally or push to trigger CI).

7. **Smoke test:**
   - Visit `/admin`, log in with `ADMIN_PASSWORD`.
   - Upload SKU `vs-001`, angle `front`.
   - Confirm the image appears on the storefront PDP for that product.

## Local development

```bash
npm run dev
```

Use `.dev.vars` (gitignored) for local secrets — same keys as the `wrangler secret put` list above.

## Custom image IDs

Uploaded images use the pattern `vikko-{sku}-{angle}` (e.g. `vikko-vs-001-front`). Re-uploading with the same SKU and angle replaces the existing image without code changes.
