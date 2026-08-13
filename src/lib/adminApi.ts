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
