import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '../../components/ui/Button';
import { adminCreateProduct, adminListProducts } from '../../lib/adminApi';
import type { CreateProductInput } from '../../lib/productAdmin';
import type { Product, ProductCategory } from '../../types/product';
import { formatPrice } from '../../lib/utils';
import { fieldClass, useAdminToken } from './AdminShell';

const CATEGORIES: ProductCategory[] = ['sunglasses', 'eyeglasses', 'accessories'];

const emptyForm = {
  sku: '',
  category: 'sunglasses' as ProductCategory,
  name: '',
  price: '',
  stock: '0',
  published: true,
};

export function ProductList() {
  const token = useAdminToken();
  const [, navigate] = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    adminListProducts(token)
      .then((list) => {
        if (!cancelled) setProducts(list);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load products');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  function closeModal() {
    setModalOpen(false);
    setForm(emptyForm);
    setError('');
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError('');
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!form.sku.trim() || !form.name.trim()) {
      setError('SKU and name are required.');
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError('Enter a valid price.');
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      setError('Enter a valid stock quantity.');
      return;
    }

    const input: CreateProductInput = {
      sku: form.sku.trim(),
      name: form.name.trim(),
      category: form.category,
      price,
      stock,
      published: form.published,
    };

    setSaving(true);
    try {
      const created = await adminCreateProduct(token, input);
      closeModal();
      navigate(`/admin/products/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-vikko-black">Products</h2>
        <Button type="button" onClick={() => { setError(''); setModalOpen(true); }}>
          New product
        </Button>
      </div>

      <ol className="rounded-lg border border-vikko-border bg-vikko-white px-4 py-3 text-sm text-vikko-muted space-y-1 list-decimal list-inside">
        <li>Create or edit product (price, published, RX, stock).</li>
        <li>
          Open <span className="text-vikko-ink">Manage gallery images</span> and upload front / 45 /
          side.
        </li>
        <li>Keep Published on — storefront catalog only shows published items.</li>
        <li>Refresh the shop to see copy/price/image updates (no rebuild).</li>
      </ol>

      {error && !modalOpen ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="overflow-x-auto rounded-lg border border-vikko-border bg-vikko-white">
        {loading ? (
          <p className="px-4 py-8 text-sm text-vikko-muted">Loading products…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-vikko-border text-vikko-muted">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">SKU</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold"> </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-vikko-muted">
                    No products yet.
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const published = p.published !== false;
                  return (
                    <tr key={p.id} className="border-b border-vikko-border last:border-0">
                      <td className="px-4 py-3 font-medium text-vikko-black">{p.name}</td>
                      <td className="px-4 py-3 text-vikko-ink">{p.sku}</td>
                      <td className="px-4 py-3 capitalize text-vikko-ink">{p.category}</td>
                      <td className="px-4 py-3 text-vikko-ink">{formatPrice(p.price)}</td>
                      <td className="px-4 py-3 tabular-nums text-vikko-ink">
                        {p.stock ?? (p.inStock ? '—' : 0)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            published
                              ? 'font-semibold text-vikko-black'
                              : 'text-vikko-muted'
                          }
                        >
                          {published ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="text-sm font-semibold text-vikko-black hover:text-vikko-accent cursor-pointer"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-vikko-black/40 px-4"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-lg rounded-lg border border-vikko-border bg-vikko-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display text-lg font-bold text-vikko-black">New product</h3>
            <form onSubmit={onCreate} className="mt-5 space-y-4">
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-vikko-black">SKU *</span>
                <input
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className={fieldClass}
                  placeholder="VS-006"
                  required
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-vikko-black">Category *</span>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as ProductCategory })
                  }
                  className={fieldClass}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-vikko-black">Name *</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={fieldClass}
                  required
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-vikko-black">Price (US$) *</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className={fieldClass}
                  required
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-vikko-black">Total stock</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className={fieldClass}
                />
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-vikko-black">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="h-4 w-4 accent-vikko-black"
                />
                Active
              </label>
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Creating…' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
