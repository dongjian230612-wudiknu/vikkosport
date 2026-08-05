import { useState, useCallback } from 'react';
import type { CartItem, Product } from '../types/product';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product, colorId: string) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.product.id === product.id && i.colorId === colorId
      );
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.colorId === colorId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, colorId, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string, colorId: string) => {
    setItems(prev =>
      prev.filter(i => !(i.product.id === productId && i.colorId === colorId))
    );
  }, []);

  const updateQuantity = useCallback((productId: string, colorId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, colorId);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.product.id === productId && i.colorId === colorId
          ? { ...i, quantity }
          : i
      )
    );
  }, [removeItem]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return { items, addItem, removeItem, updateQuantity, totalItems, totalPrice };
}
