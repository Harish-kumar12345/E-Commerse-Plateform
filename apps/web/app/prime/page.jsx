'use client';

import React, { useState } from 'react';

import {
  ShieldCheck,
  Zap,
  Truck,
  Coins,
  CheckCircle2,




} from 'lucide-react';

export default function PrimeMembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState('ANNUAL');
  const [isSubscribed, setIsSubscribed] = useState(true);

  return (
    <div className="space-y-16 pb-20">
      {/* Prime Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cyan-950/40 via-[#12151E] to-[#090A0F] border-b border-[#1F2433] py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(6,182,212,0.2),transparent_60%)]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            NEXUS Prime Membership Club
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Elevate your shopping experience. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-300">
              Zero delivery fees, 4% cashback & VIP drops.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            One simple membership unlocks unlimited free same-day & 1-day express shipping across India, exclusive access to Deals of the Day, and double Nexus Coins.
          </p>

          {isSubscribed ? (
            <div className="p-4 max-w-md mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-between text-xs text-cyan-300">
              <span className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                You are currently an active Prime Member!
              </span>
              <span className="text-slate-400">Renews Oct 2027</span>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button className="h-12 px-8 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all">
                Join Prime for ₹1,499 / Year
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-white text-center mb-10 tracking-tight">
          Exclusive Prime Member Privileges
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Unlimited Free 1-Day Delivery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No minimum cart values. Enjoy free priority express delivery on 50,000+ items across 26,000+ Indian PIN codes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">4% Nexus Coins Cashback</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Earn double reward coins on every completed purchase. Redeem coins directly as instant rupees discount at checkout.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">30-Min Early Access to Flash Deals</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Snag high-demand electronics and limited drops 30 minutes before non-members, with locked lowest pricing guarantees.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#12151E] border border-[#1F2433] overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-[#1F2433]">
            <h3 className="text-lg font-bold text-white">Standard Shopper vs Nexus Prime</h3>
          </div>

          <div className="divide-y divide-slate-800 text-xs">
            <div className="grid grid-cols-3 p-4 font-semibold text-slate-400 bg-slate-900/40">
              <span>Perk</span>
              <span className="text-center">Standard</span>
              <span className="text-center text-cyan-400 font-bold">Nexus Prime</span>
            </div>

            <div className="grid grid-cols-3 p-4 items-center">
              <span className="text-slate-200">Delivery Fee</span>
              <span className="text-center text-slate-400">₹49 (Free over ₹499)</span>
              <span className="text-center text-emerald-400 font-bold">100% Free on All Orders</span>
            </div>

            <div className="grid grid-cols-3 p-4 items-center">
              <span className="text-slate-200">Delivery Speed</span>
              <span className="text-center text-slate-400">3 - 5 Days Standard</span>
              <span className="text-center text-cyan-400 font-bold">Same-Day / Next-Day Express</span>
            </div>

            <div className="grid grid-cols-3 p-4 items-center">
              <span className="text-slate-200">Coins Cashback</span>
              <span className="text-center text-slate-400">2% on eligible items</span>
              <span className="text-center text-amber-400 font-bold">4% on Every Order</span>
            </div>

            <div className="grid grid-cols-3 p-4 items-center">
              <span className="text-slate-200">Doorstep Returns Window</span>
              <span className="text-center text-slate-400">7 Days</span>
              <span className="text-center text-emerald-400 font-bold">14 Days Hassle-Free</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
