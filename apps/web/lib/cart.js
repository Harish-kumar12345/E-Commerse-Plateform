'use client';















const CART_STORAGE_KEY = 'nexus_user_cart_v1';

export function getStoredCart() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

export function saveCart(items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('nexus-cart-updated'));
  } catch (err) {}
}

export function addToCart(item) {
  const current = getStoredCart();
  const existingIdx = current.findIndex(
    (c) => c.slug === item.slug && c.variantTitle === item.variantTitle
  );

  let updated;
  if (existingIdx > -1) {
    updated = current.map((c, idx) =>
      idx === existingIdx ? { ...c, quantity: c.quantity + (item.quantity || 1) } : c
    );
  } else {
    const newItem = {
      ...item,
      id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      quantity: item.quantity || 1,
    };
    updated = [newItem, ...current];
  }

  saveCart(updated);
}

export function updateQuantity(id, delta) {
  const current = getStoredCart();
  const updated = current
    .map((item) => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : null;
      }
      return item;
    })
    .filter(Boolean) ;

  saveCart(updated);
}

export function removeFromCart(id) {
  const current = getStoredCart();
  const updated = current.filter((item) => item.id !== id);
  saveCart(updated);
}

export function clearCart() {
  saveCart([]);
}

export function getCartTotalCount() {
  const current = getStoredCart();
  return current.reduce((sum, item) => sum + item.quantity, 0);
}
