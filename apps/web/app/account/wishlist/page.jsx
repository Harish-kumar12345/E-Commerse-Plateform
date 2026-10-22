'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ShoppingBag,
  Trash2,
  Share2,
  CheckCircle2,
  ArrowLeft,
  TrendingDown,
  ShieldCheck,
} from 'lucide-react';
import { formatPaiseToINR } from '@nexus/shared';













export default function AccountWishlistPage() {
  const [items, setItems] = useState([
    {
      id: 'w1',
      title: 'Sony WH-1000XM5 Wireless Active Noise Canceling Headphones',
      slug: 'sony-wh-1000xm5-wireless-anc-headphones',
      brand: 'Sony',
      sellerName: 'Apex Electronics India',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      priceInPaise: 2799000,
      compareAtInPaise: 3499000,
      priceDropPaise: 700000, // ₹7,000 price drop!
    },
    {
      id: 'w2',
      title: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard (QMK/VIA)',
      slug: 'keychron-q1-pro-wireless-custom-mechanical-keyboard',
      brand: 'Keychron',
      sellerName: 'Apex Electronics India',
      imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
      priceInPaise: 1849900,
      compareAtInPaise: 2199900,
    },
    {
      id: 'w3',
      title: 'Aura Studio Hand-Thrown Matte Ceramic Pour-Over Coffee Set',
      slug: 'aura-studio-matte-ceramic-pour-over-coffee-set',
      brand: 'Aura Living',
      sellerName: 'Aura Living & Home',
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
      priceInPaise: 289900,
      compareAtInPaise: 389900,
    },
  ]);

  const [shareToast, setShareToast] = useState(false);

  function removeItem(id) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function handleShare() {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Alert */}
      {shareToast && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>Shareable wishlist link copied to clipboard!</span>
        </div>
      )}

      {/* Back button */}
      <div>
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1F2433]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>My Wishlist ({items.length} items)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track price drops and save items across sessions.
          </p>
        </div>

        <button
          onClick={handleShare}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-all"
        >
          <Share2 className="w-4 h-4 text-cyan-400" />
          <span>Share Wishlist</span>
        </button>
      </div>

      {/* Wishlist Items Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-[#12151E] border border-[#1F2433] hover:border-slate-700 transition-all space-y-4 flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                {/* Thumbnail */}
                <div className="relative aspect-square w-full rounded-xl bg-slate-900 border border-slate-800 overflow-hidden">
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                  {item.priceDropPaise && (
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase flex items-center gap-1 shadow-md">
                      <TrendingDown className="w-3 h-3" />
                      Price Drop: {formatPaiseToINR(item.priceDropPaise)}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-slate-300 uppercase">{item.brand}</span>
                    <span className="flex items-center gap-1 text-[11px] text-cyan-400">
                      <ShieldCheck className="w-3 h-3" /> {item.sellerName}
                    </span>
                  </div>
                  <Link href={`/p/${item.slug}`}>
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-100 hover:text-amber-400 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                  </Link>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-bold text-white">{formatPaiseToINR(item.priceInPaise)}</span>
                    <span className="text-xs text-slate-500 line-through">
                      {formatPaiseToINR(item.compareAtInPaise)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
                <Link
                  href="/cart"
                  className="flex-1 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </Link>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-3">
          <Heart className="w-8 h-8 text-slate-600 mx-auto" />
          <h2 className="text-base font-bold text-white">Your wishlist is empty</h2>
          <p className="text-xs text-slate-400">Click the heart icon on any product to save it here.</p>
        </div>
      )}
    </div>
  );
}
