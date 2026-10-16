'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  Building2,
  MapPin,
  Percent,
} from 'lucide-react';

interface SellerItem {
  id: string;
  storeName: string;
  storeSlug: string;
  ownerName: string;
  gstin: string;
  pan: string;
  bankAccount: string;
  bankIfsc: string;
  pincode: string;
  commission: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  rating: number;
  productsCount: number;
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<SellerItem[]>([
    {
      id: 's1',
      storeName: 'Apex Electronics India',
      storeSlug: 'apex-electronics',
      ownerName: 'Vikram Singhania',
      gstin: '27AABCU9603R1ZM',
      pan: 'AABCU9603R',
      bankAccount: '••••••••9283',
      bankIfsc: 'HDFC0001234',
      pincode: '400093 (Mumbai)',
      commission: 8,
      status: 'ACTIVE',
      rating: 4.8,
      productsCount: 8,
    },
    {
      id: 's2',
      storeName: 'Urban Stitch Apparels',
      storeSlug: 'urban-stitch',
      ownerName: 'Aanya Kapoor',
      gstin: '07AAECU4501F1ZW',
      pan: 'AAECU4501F',
      bankAccount: '••••••••8912',
      bankIfsc: 'ICIC0000104',
      pincode: '110020 (New Delhi)',
      commission: 12,
      status: 'ACTIVE',
      rating: 4.6,
      productsCount: 4,
    },
    {
      id: 's3',
      storeName: 'Aura Living & Home',
      storeSlug: 'aura-living',
      ownerName: 'Devendra Joshi',
      gstin: '29AABCL3409K1ZX',
      pan: 'AABCL3409K',
      bankAccount: '••••••••1239',
      bankIfsc: 'SBIN0004051',
      pincode: '560038 (Bengaluru)',
      commission: 10,
      status: 'ACTIVE',
      rating: 4.9,
      productsCount: 4,
    },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function toggleSellerStatus(id: string) {
    setSellers((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          setToastMessage(`Updated ${s.storeName} status to ${nextStatus}`);
          setTimeout(() => setToastMessage(null), 2500);
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Back button */}
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Operations Dashboard</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1F2433]">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Store className="w-6 h-6 text-amber-400" />
            <span>Multi-Vendor Merchant Directory & KYC</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audit merchant GSTIN, PAN, bank accounts, commission rates, and fulfillment standing.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          Total Registered: <strong className="text-white">{sellers.length} Verified Stores</strong>
        </div>
      </div>

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 gap-6">
        {sellers.map((s) => (
          <div
            key={s.id}
            className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] shadow-lg space-y-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-base font-bold text-white">{s.storeName}</h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      s.status === 'ACTIVE'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Merchant Contact: {s.ownerName}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleSellerStatus(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                    s.status === 'ACTIVE'
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {s.status === 'ACTIVE' ? 'Suspend Merchant' : 'Reactivate Merchant'}
                </button>
              </div>
            </div>

            {/* KYC & Financial Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[11px] block">GSTIN REGISTRATION</span>
                <span className="font-mono font-bold text-slate-200">{s.gstin}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[11px] block">COMMISSION RATE</span>
                <span className="font-bold text-amber-400">{s.commission}% Platform Fee</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[11px] block">BANK ACCOUNT & IFSC</span>
                <span className="font-mono text-slate-300">{s.bankIfsc} ({s.bankAccount})</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[11px] block">PICKUP WAREHOUSE</span>
                <span className="text-slate-300 font-medium">{s.pincode}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
