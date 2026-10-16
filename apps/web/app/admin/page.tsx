import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Store,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const metrics = [
    {
      title: 'Gross Merchandise Value (GMV)',
      value: '₹1,48,20,000',
      change: '+24.5% vs last month',
      isPositive: true,
      icon: DollarSign,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Platform Net Commissions (10%)',
      value: '₹14,82,000',
      change: '+18.2% vs last month',
      isPositive: true,
      icon: TrendingUp,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Total Processed Orders',
      value: '3,420',
      change: 'AOV: ₹4,280',
      isPositive: true,
      icon: Package,
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Active Verified Sellers',
      value: '48 Stores',
      change: '3 Pending KYC Review',
      isPositive: true,
      icon: Store,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
  ];

  const topSellers = [
    { name: 'Apex Electronics India', gmv: '₹84,20,000', orders: 1840, rating: 4.8, commission: '8%' },
    { name: 'Urban Stitch Apparels', gmv: '₹38,10,000', orders: 1120, rating: 4.6, commission: '12%' },
    { name: 'Aura Living & Home', gmv: '₹25,90,000', orders: 460, rating: 4.9, commission: '10%' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1F2433]">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            Platform Master Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            NEXUS Executive Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time multi-vendor performance, commissions ledger, and seller KYC audit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/sellers"
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Manage Sellers & KYC</span>
          </Link>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{m.title}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${m.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">{m.value}</div>
              <p className="text-[11px] text-slate-400 font-medium">{m.change}</p>
            </div>
          );
        })}
      </div>

      {/* Top Sellers Table & Commission Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2433]">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Top Vendor Throughput Leaderboard
            </h2>
            <Link href="/admin/sellers" className="text-xs text-amber-400 font-semibold hover:underline">
              View All 48 Stores →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Store Name</th>
                  <th className="pb-3 font-semibold">Gross GMV</th>
                  <th className="pb-3 font-semibold">Orders</th>
                  <th className="pb-3 font-semibold">Commission</th>
                  <th className="pb-3 font-semibold">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {topSellers.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 font-bold text-slate-200">{s.name}</td>
                    <td className="py-3.5 text-white font-mono font-bold">{s.gmv}</td>
                    <td className="py-3.5 text-slate-300 font-mono">{s.orders}</td>
                    <td className="py-3.5 text-amber-400 font-semibold">{s.commission}</td>
                    <td className="py-3.5 text-emerald-400 font-semibold">{s.rating} ★</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational Quick Actions */}
        <div className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-4 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-[#1F2433]">
              Operations Queue
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 block">Pending KYC Approvals</span>
                  <span className="text-[11px] text-slate-500">3 new merchant applications</span>
                </div>
                <Link href="/admin/sellers" className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-bold">
                  Audit
                </Link>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 block">Active Returns Queue</span>
                  <span className="text-[11px] text-slate-500">1 doorstep pickup scheduled</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-bold">
                  On Track
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-200 block">Bi-Weekly Settlement Run</span>
                  <span className="text-[11px] text-slate-500">Next payout: Oct 15, 2026</span>
                </div>
                <span className="px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 font-bold">
                  Scheduled
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Automated Integrity Protocol
            </span>
            <p className="text-[11px] leading-relaxed">
              All financial settlements are locked inside transactional database isolation with signed Razorpay webhooks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
