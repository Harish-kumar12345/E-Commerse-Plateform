'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  CheckCircle2,
  ArrowLeft,
  Upload,
  AlertCircle,
  Truck,
  ShieldCheck,
} from 'lucide-react';

export default function AccountReturnsPage() {
  const [selectedSubOrder, setSelectedSubOrder] = useState('NX-2026-98124-S2');
  const [reasonCode, setReasonCode] = useState('SIZE_FIT_ISSUE');
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const existingReturns = [
    {
      id: 'RET-8921',
      orderNumber: 'NX-2026-98124-S2',
      productName: 'Heavyweight Supima Cotton Oversized Tee (Washed Charcoal / Medium)',
      sellerName: 'Urban Stitch Apparels',
      reason: 'Size / Fit Issue (Too large)',
      status: 'Pickup Scheduled',
      pickupDate: 'Wednesday, Oct 14 • Between 10 AM - 2 PM',
      refundAmount: '₹2,998',
    },
  ];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

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
          <RotateCcw className="w-6 h-6 text-emerald-400" />
          <span>Returns, Exchanges & RMA Portal</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          7-Day doorstep pickup guarantee with verified seller inspection and instant refund.
        </p>
      </div>

      {/* Active Return Status Card */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Active Return Claims
        </h2>

        {existingReturns.map((ret) => (
          <div key={ret.id} className="p-5 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-3 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">RMA #{ret.id}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300 font-mono">{ret.orderNumber}</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
                {ret.status}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <h3 className="font-semibold text-slate-200">{ret.productName}</h3>
              <p className="text-slate-400">Sold by {ret.sellerName} • Reason: {ret.reason}</p>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs mt-2">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Truck className="w-4 h-4" />
                  <span>{ret.pickupDate}</span>
                </div>
                <span className="text-amber-400 font-bold">Refund: {ret.refundAmount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Return Request Form */}
      <div className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-6 shadow-xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Initiate New Return / Exchange
        </h2>

        {submitted ? (
          <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">Return Request Received!</h3>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Our courier executive will arrive at your address within 48 hours for doorstep pickup and verification.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Submit Another Claim
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Select Sub-order */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Select Item to Return</label>
              <select
                value={selectedSubOrder}
                onChange={(e) => setSelectedSubOrder(e.target.value)}
                className="w-full h-10 rounded-xl bg-slate-900 border border-slate-700 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="NX-2026-98124-S2">Urban Stitch 280 GSM Supima Tee (Washed Charcoal / M) — ₹2,998</option>
                <option value="NX-2026-98124-S1">Sony WH-1000XM5 Wireless Headphones (Midnight Black) — ₹27,990</option>
              </select>
            </div>

            {/* Reason Code */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Reason for Return</label>
              <select
                value={reasonCode}
                onChange={(e) => setReasonCode(e.target.value)}
                className="w-full h-10 rounded-xl bg-slate-900 border border-slate-700 px-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="SIZE_FIT_ISSUE">Size or Fit Issue</option>
                <option value="DEFECTIVE_PRODUCT">Defective / Not working properly</option>
                <option value="DAMAGED_IN_TRANSIT">Damaged during courier transit</option>
                <option value="WRONG_ITEM_DELIVERED">Received different product or color</option>
                <option value="NOT_AS_DESCRIBED">Item does not match website specifications</option>
              </select>
            </div>

            {/* Comments */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Description of Issue</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                required
                placeholder="Please describe why you would like to return this item..."
                className="w-full rounded-xl bg-slate-900 border border-slate-700 p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Upload Photos slot */}
            <div className="p-4 rounded-xl border border-dashed border-slate-700 text-center space-y-1.5 bg-slate-900/40">
              <Upload className="w-5 h-5 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-300 font-medium">Upload photos of product & tag (Optional)</p>
              <p className="text-[11px] text-slate-500">Helps the seller approve your RMA request faster</p>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Submit Return Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
