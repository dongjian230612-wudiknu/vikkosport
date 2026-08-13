import {
  createContext,
  useContext,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react';
import { Link, Redirect, useLocation } from 'wouter';
import { Button } from '../../components/ui/Button';
import { adminLogin } from '../../lib/adminApi';

export const TOKEN_KEY = 'vikko_admin_token';

export const fieldClass =
  'w-full rounded-md border border-vikko-border bg-vikko-white px-3 py-2 text-sm text-vikko-ink';

const AdminTokenContext = createContext<string | null>(null);

export function useAdminToken(): string {
  const token = useContext(AdminTokenContext);
  if (!token) {
    throw new Error('useAdminToken must be used within AdminShell');
  }
  return token;
}

interface AdminShellProps {
  children?: ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const [location] = useLocation();
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) ?? '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken('');
    setPassword('');
    setError('');
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

  const productsActive =
    location === '/admin/products' || location.startsWith('/admin/products/');
  const imagesActive = location.startsWith('/admin/images');

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-vikko-black">Admin</h1>
          <p className="mt-2 text-sm text-vikko-muted">
            Manage catalog products and gallery images.
          </p>
        </div>
        {token ? (
          <Button type="button" variant="outline" size="sm" onClick={logout}>
            Log out
          </Button>
        ) : null}
      </div>

      {!token ? (
        <div className="max-w-md rounded-lg border border-vikko-border bg-vikko-white p-6">
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
        </div>
      ) : (
        <AdminTokenContext.Provider value={token}>
          {location === '/admin' ? (
            <Redirect to="/admin/products" />
          ) : (
            <>
              <nav className="mb-8 flex gap-6 border-b border-vikko-border">
                <Link
                  href="/admin/products"
                  className={`pb-3 text-sm font-semibold cursor-pointer ${
                    productsActive
                      ? 'border-b-2 border-vikko-black text-vikko-black'
                      : 'text-vikko-muted hover:text-vikko-black'
                  }`}
                >
                  Products
                </Link>
                <Link
                  href="/admin/images"
                  className={`pb-3 text-sm font-semibold cursor-pointer ${
                    imagesActive
                      ? 'border-b-2 border-vikko-black text-vikko-black'
                      : 'text-vikko-muted hover:text-vikko-black'
                  }`}
                >
                  Images
                </Link>
              </nav>
              {children}
            </>
          )}
        </AdminTokenContext.Provider>
      )}
    </div>
  );
}
