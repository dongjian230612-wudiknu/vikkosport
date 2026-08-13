import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { products as fallbackProducts } from '../data/products';
import type { Product } from '../types/product';
import { fetchPublicCatalog } from './adminApi';

interface CatalogContextValue {
  products: Product[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPublicCatalog();
      if (!data.length) {
        setProducts(fallbackProducts);
        setError('Catalog empty; using local products');
      } else {
        setProducts(data);
      }
    } catch (err) {
      setProducts(fallbackProducts);
      setError(err instanceof Error ? err.message : 'Failed to load catalog');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return (
    <CatalogContext.Provider value={{ products, loading, error, reload }}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) {
    throw new Error('useCatalog must be used within CatalogProvider');
  }
  return ctx;
}
