import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useSearch } from 'wouter';
import { Button } from '../../components/ui/Button';
import { adminListProducts, createDirectUpload, uploadToCloudflare } from '../../lib/adminApi';
import { normalizeImageSku } from '../../lib/productAdmin';
import { fieldClass, useAdminToken } from './AdminShell';

const FALLBACK_SKUS = ['vs-001', 'vs-002', 'vs-003', 'vs-004', 'vs-005'];
const ANGLES: Array<'front' | '45' | 'side'> = ['front', '45', 'side'];
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/webp', 'image/png']);

export function AdminImages() {
  const token = useAdminToken();
  const search = useSearch();
  const querySku = new URLSearchParams(search).get('sku')?.trim() ?? '';

  const [skus, setSkus] = useState<string[]>(FALLBACK_SKUS);
  const [sku, setSku] = useState(querySku || FALLBACK_SKUS[0]);
  const [angle, setAngle] = useState<'front' | '45' | 'side'>('front');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadedId, setUploadedId] = useState('');

  useEffect(() => {
    if (querySku) setSku(querySku);
  }, [querySku]);

  useEffect(() => {
    let cancelled = false;
    adminListProducts(token)
      .then((list) => {
        if (cancelled) return;
        const next: string[] = [];
        const seen = new Set<string>();
        for (const p of list) {
          const value = p.imageSku || normalizeImageSku(p.sku);
          if (value && !seen.has(value)) {
            seen.add(value);
            next.push(value);
          }
        }
        setSkus(next.length ? next : FALLBACK_SKUS);
      })
      .catch(() => {
        if (!cancelled) setSkus(FALLBACK_SKUS);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const skuOptions = useMemo(() => {
    if (sku && !skus.includes(sku)) return [sku, ...skus];
    return skus;
  }, [sku, skus]);

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
    <div className="max-w-xl">
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-vikko-black">Image admin</h2>
        <p className="mt-2 text-sm text-vikko-muted">
          Upload product gallery images (replace by SKU + angle).
        </p>
      </div>

      <form
        onSubmit={onUpload}
        className="space-y-4 rounded-lg border border-vikko-border bg-vikko-white p-6"
      >
        <label className="block space-y-1.5">
          <span className="text-sm font-semibold text-vikko-black">SKU</span>
          <select
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            className={fieldClass}
          >
            {skuOptions.map((s) => (
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
          <div className="space-y-3 border-t border-vikko-border pt-4">
            <p className="text-sm text-vikko-ink">
              Uploaded <span className="font-semibold">{uploadedId}</span>
            </p>
            <p className="break-all text-xs text-vikko-muted">{previewUrl}</p>
            <img
              src={previewUrl}
              alt={`${sku} ${angle}`}
              className="w-full max-w-sm border border-vikko-border bg-vikko-white"
            />
          </div>
        ) : null}
      </form>
    </div>
  );
}
