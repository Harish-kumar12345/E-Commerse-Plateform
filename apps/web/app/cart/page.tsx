'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Trash2,
  ShieldCheck,
  Tag,
  ArrowRight,
  Truck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { formatPaiseToINR } from '@nexus/shared';
import {
  getStoredCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  CartItem,
} from '@/lib/cart';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setItems(getStoredCart());
    setIsLoaded(true);

    const handleUpdate = () => {
      setItems(getStoredCart());
    };

    window.addEventListener('nexus-cart-updated', handleUpdate);
    return () => window.removeEventListener('nexus-cart-updated', handleUpdate);
  }, []);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPaise: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  // Group items by seller
  const sellerGroups = items.reduce((acc, item) => {
    if (!acc[item.sellerId]) {
      acc[item.sellerId] = {
        sellerName: item.sellerName,
        items: [],
      };
    }
    acc[item.sellerId].items.push(item);
    return acc;
  }, {} as Record<string, { sellerName: string; items: CartItem[] }>);

  const subtotalPaise = items.reduce((sum, item) => sum + item.priceInPaise * item.quantity, 0);
  const taxPaise = Math.round(subtotalPaise * 0.18);
  const discountPaise = appliedCoupon ? appliedCoupon.discountPaise : 0;
  const totalAmountPaise = Math.max(0, subtotalPaise + taxPaise - discountPaise);

  function handleUpdateQuantity(id: string, delta: number) {
    updateQuantity(id, delta);
    setItems(getStoredCart());
  }

  function handleRemoveItem(id: string) {
    removeFromCart(id);
    setItems(getStoredCart());
  }

  function handleClearCart() {
    clearCart();
    setItems([]);
  }

  function handleApplyCoupon(e: React.FormEvent) {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.toUpperCase().trim();
    if (code === 'NEXUSFIRST') {
      setAppliedCoupon({ code, discountPaise: 75000 });
    } else if (code === 'SUPERDEAL') {
      setAppliedCoupon({ code, discountPaise: 50000 });
    } else if (code === 'PRIMECLUB') {
      setAppliedCoupon({ code, discountPaise: Math.round(subtotalPaise * 0.1) });
    } else {
      setCouponError('Invalid coupon. Try NEXUSFIRST, SUPERDEAL or PRIMECLUB.');
    }
  }

  if (isLoaded && items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto shadow-xl shadow-amber-500/5">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Your NEXUS Cart is Empty</h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            You don&apos;t have any products in your cart yet. Explore our verified sellers across India or browse flash deals.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Explore Today&apos;s Flash Deals</span>
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#161B26] hover:bg-[#1E2535] border border-[#2B3245] text-slate-200 font-semibold text-xs sm:text-sm transition-all"
          >
            <span>Browse 200+ Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#1F2433] mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-amber-400" />
            <span>Multi-Seller Cart ({items.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Orders are partitioned per merchant for independent statutory GST invoicing and tracking.
          </p>
        </div>

        {items.length > 0 && (
          <button
            type="button"
            onClick={handleClearCart}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium underline flex items-center gap-1 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Entire Cart
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items grouped by seller (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Free Shipping Alert Bar */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-[#12151E] border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
            <Truck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <strong>Free Express Shipping Unlocked!</strong> All items qualify for zero delivery fee with Nexus Prime.
            </div>
          </div>

          {/* Grouped by Seller */}
          {Object.entries(sellerGroups).map(([sellerId, group]) => (
            <div key={sellerId} className="rounded-2xl bg-[#12151E] border border-[#1F2433] p-5 space-y-4 shadow-lg">
              {/* Seller Sub-Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1F2433]">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Merchant:</span>
                  <span className="text-xs font-bold text-white flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                    {group.sellerName}
                  </span>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">Dispatches within 24h</span>
              </div>

              {/* Items in this seller group */}
              <div className="divide-y divide-slate-800/80">
                {group.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex-shrink-0">
                      <Image src={item.imageUrl} alt={item.title} fill unoptimized className="object-cover" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-1">
                      <Link href={`/p/${item.slug}`} className="hover:text-amber-400 transition-colors">
                        <h3 className="text-sm font-semibold text-slate-100 line-clamp-1">{item.title}</h3>
                      </Link>
                      <p className="text-xs text-slate-400">Variant: {item.variantTitle}</p>
                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-sm font-bold text-white">{formatPaiseToINR(item.priceInPaise)}</span>
                        {item.compareAtInPaise && (
                          <span className="text-xs text-slate-500 line-through">
                            {formatPaiseToINR(item.compareAtInPaise)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                      <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-900">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="px-2.5 py-1 text-slate-300 hover:bg-slate-800 text-xs font-bold"
                          title="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-white">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="px-2.5 py-1 text-slate-300 hover:bg-slate-800 text-xs font-bold"
                          title="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Price & Checkout Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl bg-[#12151E] border border-[#1F2433] p-6 space-y-5 shadow-xl">
            <h2 className="text-base font-bold text-white border-b border-[#1F2433] pb-3">Order Summary</h2>

            {/* Subtotal breakdown */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Items Subtotal:</span>
                <span className="font-mono font-medium text-white">{formatPaiseToINR(subtotalPaise)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated GST (18%):</span>
                <span className="font-mono text-white">{formatPaiseToINR(taxPaise)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Nexus Prime Delivery:</span>
                <span className="text-emerald-400 font-semibold uppercase">Free</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-amber-400 font-medium">
                  <span>Coupon ({appliedCoupon.code}):</span>
                  <span>-{formatPaiseToINR(appliedCoupon.discountPaise)}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="border-t border-[#1F2433] pt-4 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-white block">Total Amount</span>
                <span className="text-[10px] text-slate-500">Includes all taxes & delivery</span>
              </div>
              <span className="text-xl font-extrabold text-amber-400 font-mono">
                {formatPaiseToINR(totalAmountPaise)}
              </span>
            </div>

            {/* Coupon Box */}
            <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter Coupon (e.g. NEXUSFIRST)"
                    className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#0F121A] border border-[#2B3245] text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 uppercase font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 h-9 rounded-lg bg-[#161B26] hover:bg-[#1E2535] border border-[#2B3245] text-xs font-semibold text-amber-400 transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[11px] text-rose-400">{couponError}</p>}
              {appliedCoupon && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Coupon applied successfully!
                </p>
              )}
            </form>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
