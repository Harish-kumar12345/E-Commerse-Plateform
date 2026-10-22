'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Truck, Search, ShieldCheck, ArrowRight, Package } from 'lucide-react';
import { getStoredOrders, } from '@/lib/orders';
import { formatPaiseToINR } from '@nexus/shared';

export default function GeneralTrackingPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    setRecentOrders(getStoredOrders());
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (orderNumber.trim()) {
      router.push(`/track/${orderNumber.trim()}`);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
        <Truck className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Track Your NEXUS Order</h1>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Enter your NEXUS Order Number (e.g. NX-2026-98124) or courier AWB code to see real-time courier dispatch status.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="e.g. NX-2026-98124"
          className="flex-1 h-12 rounded-xl bg-slate-900 border border-slate-700 px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          type="submit"
          className="h-12 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center gap-1.5"
        >
          <Search className="w-4 h-4" />
          <span>Track</span>
        </button>
      </form>

      {/* Quick 1-click tracking for placed orders */}
      {recentOrders.length > 0 && (
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#12151E] border border-slate-800 text-left space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-amber-400" />
              Your Recent Orders
            </span>
            <Link href="/account/orders" className="text-amber-400 hover:underline text-[11px]">
              View All
            </Link>
          </div>
          <div className="space-y-2">
            {recentOrders.slice(0, 3).map((ord) => (
              <button
                key={ord.id}
                type="button"
                onClick={() => router.push(`/track/${ord.id}`)}
                className="w-full p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-white group-hover:text-amber-400">
                    #{ord.id}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {ord.date} • {formatPaiseToINR(ord.totalAmountInPaise)}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    ord.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {ord.status}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="pt-6 border-t border-[#1F2433] text-xs text-slate-500 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-cyan-400" />
        <span>Live integrations with Shiprocket, Delhivery & BlueDart Express</span>
      </div>
    </div>
  );
}
