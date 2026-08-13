import { useEffect, useState, type FormEvent } from 'react';
import { Link, useRoute } from 'wouter';
import { Button } from '../../components/ui/Button';
import { adminGetProduct, adminUpdateProduct } from '../../lib/adminApi';
import { normalizeImageSku } from '../../lib/productAdmin';
import type { ProductCategory, RxType } from '../../types/product';
import { fieldClass, useAdminToken } from './AdminShell';

const CATEGORIES: ProductCategory[] = ['sunglasses', 'eyeglasses', 'accessories'];
const RX_TYPES: RxType[] = ['direct', 'insert', 'clip-on'];

const cardClass = 'rounded-lg border border-vikko-border bg-vikko-white p-6';

function resolvedRxType(rxCompatible: boolean, rxType: RxType | null | undefined): RxType | null {
  if (!rxCompatible) return null;
  return rxType ?? 'direct';
}

export function ProductEdit() {
  const token = useAdminToken();
  const [match, params] = useRoute('/admin/products/:id');
  const id = match ? params?.id ?? '' : '';

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<ProductCategory>('sunglasses');
  const [published, setPublished] = useState(true);
  const [rxCompatible, setRxCompatible] = useState(false);
  const [rxType, setRxType] = useState<RxType | null>(null);
  const [sku, setSku] = useState('');
  const [imageSku, setImageSku] = useState('');
  const [productId, setProductId] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError('');
    setSaved(false);
    adminGetProduct(token, id)
      .then((p) => {
        if (cancelled) return;
        setProductId(p.id);
        setSku(p.sku);
        setName(p.name);
        setSlug(p.slug);
        setDescription(p.description ?? '');
        setPrice(String(p.price));
        setCategory(p.category);
        setPublished(p.published !== false);
        setRxCompatible(p.rxCompatible);
        setRxType(resolvedRxType(p.rxCompatible, p.rxType));
        setImageSku(p.imageSku || normalizeImageSku(p.sku));
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load product');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, id]);

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSaved(false);
    const parsedPrice = Number(price);
    if (!name.trim() || !slug.trim()) {
      setError('Name and slug are required.');
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setError('Enter a valid price.');
      return;
    }

    setSaving(true);
    try {
      const next = await adminUpdateProduct(token, id, {
        name: name.trim(),
        slug: slug.trim(),
        description,
        price: parsedPrice,
        category,
        published,
        rxCompatible,
        rxType: resolvedRxType(rxCompatible, rxType),
      });
      setName(next.name);
      setSlug(next.slug);
      setDescription(next.description ?? '');
      setPrice(String(next.price));
      setCategory(next.category);
      setPublished(next.published !== false);
      setRxCompatible(next.rxCompatible);
      setRxType(resolvedRxType(next.rxCompatible, next.rxType));
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  function onPreview() {
    if (!slug.trim()) return;
    window.open(`/product/${slug.trim()}`, '_blank', 'noopener,noreferrer');
  }

  if (!match) return null;

  if (loading) {
    return <p className="text-sm text-vikko-muted">Loading product…</p>;
  }

  if (error && !sku) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/products"
          className="text-sm font-semibold text-vikko-black hover:text-vikko-accent cursor-pointer"
        >
          ← Back to products
        </Link>
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSave} className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/products"
            className="text-sm font-semibold text-vikko-black hover:text-vikko-accent cursor-pointer"
          >
            ← Back to products
          </Link>
          <h2 className="mt-2 font-display text-xl font-bold text-vikko-black">
            {name || 'Edit product'}
          </h2>
          <p className="mt-1 text-xs text-vikko-muted">
            ID {productId} · SKU {sku}
          </p>
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={onPreview}>
            Preview
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </div>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {saved ? <p className="text-sm text-vikko-ink">Saved.</p> : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className={`${cardClass} lg:col-span-2 space-y-4`}>
          <h3 className="font-display text-base font-bold text-vikko-black">General</h3>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-vikko-black">Title</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
              required
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-vikko-black">SKU</span>
            <input value={sku} readOnly className={`${fieldClass} bg-vikko-canvas`} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-vikko-black">Handle</span>
            <div className="flex items-center gap-1">
              <span className="text-sm text-vikko-muted">/</span>
              <input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className={fieldClass}
                required
              />
            </div>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-vikko-black">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className={fieldClass}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-vikko-black">Frame price (US$)</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={fieldClass}
              required
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-semibold text-vikko-black">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className={fieldClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="space-y-6">
          <div className={`${cardClass} space-y-3`}>
            <h3 className="font-display text-base font-bold text-vikko-black">Status</h3>
            <label className="flex items-center gap-2 text-sm font-semibold text-vikko-black">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 accent-vikko-black"
              />
              Published
            </label>
          </div>

          <div className={`${cardClass} space-y-3`}>
            <h3 className="font-display text-base font-bold text-vikko-black">RX</h3>
            <label className="flex items-center gap-2 text-sm font-semibold text-vikko-black">
              <input
                type="checkbox"
                checked={rxCompatible}
                onChange={(e) => {
                  const on = e.target.checked;
                  setRxCompatible(on);
                  if (on && !rxType) setRxType('direct');
                  if (!on) setRxType(null);
                }}
                className="h-4 w-4 accent-vikko-black"
              />
              Prescription ready
            </label>
            {rxCompatible ? (
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-vikko-black">RX type</span>
                <select
                  value={rxType ?? 'direct'}
                  onChange={(e) => setRxType(e.target.value as RxType)}
                  className={fieldClass}
                >
                  {RX_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>

          <div className={`${cardClass} space-y-3`}>
            <h3 className="font-display text-base font-bold text-vikko-black">Media</h3>
            <p className="text-sm text-vikko-muted">
              Upload gallery angles for this SKU in Images admin.
            </p>
            <Link
              href={`/admin/images?sku=${encodeURIComponent(imageSku)}`}
              className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-semibold rounded border border-vikko-black text-vikko-black hover:bg-vikko-black hover:text-vikko-white cursor-pointer"
            >
              Manage gallery images
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
