import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, CartRxExtras, Product } from '../types/product';

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, colorId: string, rxExtras?: CartRxExtras) => void;
  removeItem: (productId: string, colorId: string) => void;
  updateQuantity: (productId: string, colorId: string, quantity: number) => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product, colorId: string, rxExtras?: CartRxExtras) => {
    setItems(prev => {
      const existing = prev.find(
        i =>
          i.product.id === product.id &&
          i.colorId === colorId &&
          !i.rxInfo &&
          !rxExtras
      );
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.colorId === colorId && !i.rxInfo
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [
        ...prev,
        {
          product,
          colorId,
          quantity: 1,
          rxInfo: rxExtras?.rxInfo,
          lensUpcharge: rxExtras?.lensUpcharge,
          lensColor: rxExtras?.lensColor,
          photochromic: rxExtras?.photochromic,
          polarized: rxExtras?.polarized,
          scene: rxExtras?.scene,
          uploadName: rxExtras?.uploadName,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: string, colorId: string) => {
    setItems(prev => prev.filter(i => !(i.product.id === productId && i.colorId === colorId)));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, colorId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId, colorId);
        return;
      }
      setItems(prev =>
        prev.map(i =>
          i.product.id === productId && i.colorId === colorId ? { ...i, quantity } : i
        )
      );
    },
    [removeItem]
  );

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const unit = i.product.price + (i.lensUpcharge ?? 0);
    return sum + unit * i.quantity;
  }, 0);

  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, totalItems, totalPrice }),
    [items, addItem, removeItem, updateQuantity, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
