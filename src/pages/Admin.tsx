import { useState, type FormEvent } from 'react';
import { Button } from '../components/ui/Button';
import { adminLogin, createDirectUpload, uploadToCloudflare } from '../lib/adminApi';
const TOKEN_KEY = 'vikko_admin_token';
const SKUS = ['vs-001', 'vs-002', 'vs-003', 'vs-004', 'vs-005'] as const;
const ANGLES: Array<'front' | '45' | 'side'> = ['front', '45', 'side'];
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/webp', 'image/png']);

const fieldClass =
  'w-full rounded-md border border-vikko-border bg-vikko-white px-3 py-2 text-sm text-vikko-ink';

export function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) ?? '');
  const [password, setPassword] = useState('');
  const [sku, setSku] = useState<(typeof SKUS)[number]>('vs-001');
  const [angle, setAngle] = useState<'front' | '45' | 'side'>('front');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedId, setUploadedId] = useState('');

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken('');
    setPassword('');
    setError('');
    setPreviewUrl('');
    setUploadedId('');
    setFile(null);
  }

  async function onLogin(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const next = await adminLogin(password);
      sessionStorage.setItem(TOKEN_KEY, next);
      setToken(next);
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  async function onUpload(e: FormEvent) {
    e.preventDefault();
    setError('');
    setPreviewUrl('');
    setUploadedId('');

    if (!file) {
      setError('Choose an image file.');
      return;
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      setError('Only JPEG, WebP, or PNG files are allowed.');
      return;
    }
    if (file.size > MAX_BYTES) {
      setError('File must be 10MB or smaller.');
      return;
    }

    setBusy(true);
    try {
      const { uploadURL, id } = await createDirectUpload(token, sku, angle);
      await uploadToCloudflare(uploadURL, file);
      // Prefer CDN when hash is set; otherwise preview the selected file locally
      // (local /images/products path often does not exist after CF-only upload).
      const hash = (import.meta.env.VITE_CF_IMAGES_HASH as string | undefined)?.trim() ?? '';
      const url = hash
        ? `https://imagedelivery.net/${hash}/${id}/public?t=${Date.now()}`
        : URL.createObjectURL(file);
      setPreviewUrl(url);
      setUploadedId(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-vikko-black">Image admin</h1>
          <p className="mt-2 text-sm text-vikko-muted">
            Upload product gallery images (replace by SKU + angle).
          </p>
        </div>
        {token ? (
          <Button type="button" variant="outline" size="sm" onClick={logout}>
            Log out
          </Button>
        ) : null}
      </div>

      {!token ? (
        <form onSubmit={onLogin} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-vikko-black">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass}
              required
            />
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" disabled={busy || !password}>
            {busy ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      ) : (
        <form onSubmit={onUpload} className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-vikko-black">SKU</span>
            <select
              value={sku}
              onChange={(e) => setSku(e.target.value as (typeof SKUS)[number])}
              className={fieldClass}
            >
              {SKUS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-vikko-black">Angle</span>
            <select
              value={angle}
              onChange={(e) => setAngle(e.target.value as 'front' | '45' | 'side')}
              className={fieldClass}
            >
              {ANGLES.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-vikko-black">Image file</span>
            <input
              type="file"
              accept="image/jpeg,image/webp,image/png"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-vikko-ink file:mr-3 file:rounded-md file:border-0 file:bg-vikko-black file:px-3 file:py-2 file:text-sm file:font-semibold file:text-vikko-white"
            />
            <span className="text-xs text-vikko-muted">JPEG, WebP, or PNG · max 10MB</span>
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button type="submit" disabled={busy || !file}>
            {busy ? 'Uploading…' : 'Upload'}
          </Button>

          {previewUrl ? (
            <div className="pt-4 space-y-3 border-t border-vikko-border">
              <p className="text-sm text-vikko-ink">
                Uploaded <span className="font-semibold">{uploadedId}</span>
              </p>
              <p className="text-xs break-all text-vikko-muted">{previewUrl}</p>
              <img
                src={previewUrl}
                alt={`${sku} ${angle}`}
                className="w-full max-w-sm border border-vikko-border bg-vikko-white"
              />
            </div>
          ) : null}
        </form>
      )}
    </div>
  );
}
