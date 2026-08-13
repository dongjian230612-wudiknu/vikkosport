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

    if (url.pathname === '/api/admin/login') {
      if (request.method === 'GET' || request.method === 'HEAD') {
        return json(
          {
            success: false,
            message: 'Use POST with JSON body { "password": "..." } — opening this URL in a browser sends GET and will 404.',
          },
          405,
          origin
        );
      }
      if (request.method !== 'POST') {
        return json({ success: false, message: 'Method not allowed' }, 405, origin);
      }
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
