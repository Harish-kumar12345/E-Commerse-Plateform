'use client';

export interface CartItem {
  id: string;
  variantId: string;
  title: string;
  variantTitle: string;
  imageUrl: string;
  priceInPaise: number;
  compareAtInPaise?: number;
  quantity: number;
  sellerId: string;
  sellerName: string;
  slug: string;
}

const CART_STORAGE_KEY = 'nexus_user_cart_v1';

export function getStoredCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('nexus-cart-updated'));
  } catch (err) {}
}

export function addToCart(item: Omit<CartItem, 'id'>): void {
  const current = getStoredCart();
  const existingIdx = current.findIndex(
    (c) => c.slug === item.slug && c.variantTitle === item.variantTitle
  );

  let updated: CartItem[];
  if (existingIdx > -1) {
    updated = current.map((c, idx) =>
      idx === existingIdx ? { ...c, quantity: c.quantity + (item.quantity || 1) } : c
    );
  } else {
    const newItem: CartItem = {
      ...item,
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      quantity: item.quantity || 1,
    };
    updated = [newItem, ...current];
  }

  saveCart(updated);
}

export function updateQuantity(id: string, delta: number): void {
  const current = getStoredCart();
  const updated = current
    .map((item) => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : null;
      }
      return item;
    })
    .filter(Boolean) as CartItem[];

  saveCart(updated);
}

export function removeFromCart(id: string): void {
  const current = getStoredCart();
  const updated = current.filter((item) => item.id !== id);
  saveCart(updated);
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartTotalCount(): number {
  const current = getStoredCart();
  return current.reduce((sum, item) => sum + item.quantity, 0);
}
