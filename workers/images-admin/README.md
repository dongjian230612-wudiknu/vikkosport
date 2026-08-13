# Vikko Images Admin Worker

## Secrets
wrangler secret put CF_ACCOUNT_ID
wrangler secret put CF_IMAGES_API_TOKEN
wrangler secret put ADMIN_PASSWORD
wrangler secret put ADMIN_SESSION_SECRET

## Deploy
npm install
npm run deploy

Set frontend `VITE_API_BASE_URL` to the Worker URL (workers.dev or api-dev.vikkosport.com).
