import React from 'react';
import Link from 'next/link';
import { Flame, Zap, ShieldCheck } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';
import { CountdownTimer } from '@/components/CountdownTimer';
import { fetchDynamicCatalog } from '@/lib/catalog';

export default async function DealsPage() {
  const allProducts = await fetchDynamicCatalog();
  const deals = allProducts.filter((p) => p.isDealOfTheDay);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#12151E] to-[#12151E] border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>Limited 24-Hour Flash Sale</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Deals of the Day
          </h1>
          <p className="text-xs text-slate-400 max-w-lg">
            Guaranteed lowest prices directly authorized by verified manufacturers. Refreshes daily at midnight.
          </p>
        </div>

        {/* Live Real-Time Countdown Clock (Ticking down to midnight) */}
        <CountdownTimer variant="card" />
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {deals.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </div>
  );
}
