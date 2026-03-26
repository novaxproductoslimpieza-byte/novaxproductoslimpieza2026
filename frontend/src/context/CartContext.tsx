'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  id: number;
  nombre: string;
  precio_minorista: number;
  imagen?: string;
  cantidad: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: any, cantidad?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, cantidad: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = sessionStorage.getItem('novax_cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    sessionStorage.setItem('novax_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product: any, cantidad = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, cantidad: i.cantidad + cantidad } : i);
      }
      return [...prev, { id: product.id, nombre: product.nombre, precio_minorista: Number(product.precio_minorista), imagen: product.imagen, cantidad }];
    });
  };

  const removeItem = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

  const updateQuantity = (id: number, cantidad: number) => {
    if (cantidad <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, cantidad } : i));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + i.precio_minorista * i.cantidad, 0);
  const itemCount = items.reduce((sum, i) => sum + i.cantidad, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
