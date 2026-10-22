'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Coins,

  Copy,
  CheckCircle2,
  ArrowLeft,

  Gift,
  ArrowUpRight,
} from 'lucide-react';

export default function LoyaltyPage() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const transactions = [
    {
      id: 'tx-1',
      title: 'Order Reward Cashback (NX-2026-98124)',
      date: 'Oct 11, 2026',
      amount: '+350 Coins',
      isCredit: true,
    },
    {
      id: 'tx-2',
      title: 'Welcome Joining Bonus',
      date: 'Oct 01, 2026',
      amount: '+100 Coins',
      isCredit: true,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
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
      <div className="pb-6 border-b border-[#1F2433]">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Coins className="w-6 h-6 text-amber-400" />
          <span>Nexus Coins & Referral Rewards</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          1 Nexus Coin = 1 INR discount. Spend coins directly at checkout on any order.
        </p>
      </div>

      {/* Balance Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/15 via-[#12151E] to-[#12151E] border border-amber-500/30 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Available Coins Balance
          </span>
          <div className="text-4xl font-extrabold text-white font-mono">
            450 Coins
          </div>
          <p className="text-xs text-slate-300">
            Equivalent to <strong>₹450.00</strong> instant cash discount at checkout.
          </p>
        </div>

        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
        >
          <span>Redeem on Next Purchase</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Referral Card */}
      <div className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Give ₹150, Get 200 Nexus Coins</h2>
            <p className="text-xs text-slate-400">
              Share your referral link with friends. They receive ₹150 off their first order; you get 200 coins after delivery.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
          <span className="text-xs font-mono font-bold text-amber-400 tracking-wider">
            RAHUL99
          </span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Referral Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Coins Ledger History
        </h2>

        <div className="divide-y divide-slate-800 rounded-2xl bg-[#12151E] border border-[#1F2433] overflow-hidden text-xs">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-100">{tx.title}</p>
                <p className="text-[11px] text-slate-500">{tx.date}</p>
              </div>
              <span className="font-mono font-bold text-emerald-400">
                {tx.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
