import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, CartRxExtras, Product } from '../types/product';

function newLineId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `line-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, colorId: string, rxExtras?: CartRxExtras) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product, colorId: string, rxExtras?: CartRxExtras) => {
    setItems(prev => {
      // Merge only plain (non-Rx) lines with same product+color
      if (!rxExtras) {
        const existing = prev.find(
          i => i.product.id === product.id && i.colorId === colorId && !i.rxInfo
        );
        if (existing) {
          return prev.map(i =>
            i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        }
      }
      return [
        ...prev,
        {
          id: newLineId(),
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

  const removeItem = useCallback((lineId: string) => {
    setItems(prev => prev.filter(i => i.id !== lineId));
  }, []);

  const updateQuantity = useCallback(
    (lineId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(lineId);
        return;
      }
      setItems(prev => prev.map(i => (i.id === lineId ? { ...i, quantity } : i)));
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => {
    const unit = i.product.price + (i.lensUpcharge ?? 0);
    return sum + unit * i.quantity;
  }, 0);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
