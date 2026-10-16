'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Package,
  Truck,
  Download,
  ShieldCheck,
  ArrowRight,
  MapPin,
  Calendar,
} from 'lucide-react';
import { formatPaiseToINR } from '@nexus/shared';
import { getOrderById, Order } from '@/lib/orders';

interface Props {
  params: Promise<{ orderId: string }>;
}

export default function OrderConfirmedPage({ params }: Props) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setOrder(getOrderById(orderId));
  }, [orderId]);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400 text-xs">
        Loading confirmation...
      </div>
    );
  }

  const subOrders = order?.subOrders || [
    {
      id: `${orderId}-S1`,
      sellerName: 'Apex Electronics India',
      trackingNumber: 'SR982104928IN',
      courier: 'Shiprocket Express',
      status: 'Placed' as const,
      deliveryEstimate: 'In Transit • Arriving in 2-3 days',
      items: [
        {
          id: 'item-1',
          title: 'Sony WH-1000XM5 Wireless Headphones',
          variant: 'Midnight Black',
          priceInPaise: 2799000,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
          quantity: 1,
          sellerName: 'Apex Electronics India',
          slug: 'sony-wh-1000xm5-wireless-anc-headphones',
        },
      ],
      timeline: [],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Banner */}
      <div className="text-center space-y-3 p-8 rounded-3xl bg-gradient-to-b from-emerald-500/10 via-[#12151E] to-[#12151E] border border-emerald-500/30 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Order Placed Successfully!
        </h1>
        <p className="text-sm text-slate-300 max-w-lg mx-auto">
          Thank you, {order?.shippingAddress?.fullName?.split(' ')[0] || 'valued customer'}! Your order has been placed and partitioned into separate vendor shipments for expedited dispatch.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs text-amber-400 font-mono font-bold">
          Order ID: #{orderId}
        </div>
      </div>

      {/* Multi-Seller Partitioned Packages */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Package className="w-5 h-5 text-amber-400" />
          <span>Fulfillment & Shipment Status ({subOrders.length} Package{subOrders.length > 1 ? 's' : ''})</span>
        </h2>

        {subOrders.map((sub) => (
          <div key={sub.id} className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-4 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[#1F2433]">
              <div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-white">Sub-Order: #{sub.id}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {sub.sellerName}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tracking Number: {sub.trackingNumber} ({sub.courier})
                </p>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                {sub.deliveryEstimate}
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-200">
              {sub.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between">
                  <span>
                    <strong>{it.quantity}x {it.title}</strong> — {it.variant}
                  </span>
                  <span className="font-bold text-white">{formatPaiseToINR(it.priceInPaise * it.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Delivery & Tax Recap Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-2 text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-amber-400" />
            Shipping Destination
          </span>
          <p className="text-slate-300 font-semibold">{order?.shippingAddress?.fullName || 'Rahul Sharma'}</p>
          <p className="text-slate-400 leading-relaxed">
            {order?.shippingAddress?.line1 || 'B-402, Lodha Bellissimo, NM Joshi Marg, Mahalaxmi West'},{' '}
            {order?.shippingAddress?.city || 'Mumbai'}, {order?.shippingAddress?.state || 'Maharashtra'} — {order?.shippingAddress?.pincode || '400011'}
          </p>
          <p className="text-slate-500">Phone: {order?.shippingAddress?.phone || '+91 9892019283'}</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-2 text-xs">
          <span className="font-bold text-slate-200 flex items-center gap-2 uppercase tracking-wider">
            <Download className="w-4 h-4 text-cyan-400" />
            B2B Tax Invoices & Records
          </span>
          <p className="text-slate-300">
            All shipments include authorized GST input tax credit invoices issued by the respective verified vendors.
          </p>
          <button className="pt-2 text-amber-400 font-semibold hover:text-amber-300 flex items-center gap-1.5 transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span>Download Combined GST Tax Invoice (PDF)</span>
          </button>
        </div>
      </div>

      {/* Bottom Action Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          href={`/track/${orderId}`}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 text-center"
        >
          Track Live Courier Timeline
        </Link>
        <Link
          href="/account/orders"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition-all border border-slate-700 text-center"
        >
          View All Orders
        </Link>
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md text-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
