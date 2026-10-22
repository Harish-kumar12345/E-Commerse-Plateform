'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Truck,




  ArrowLeft,

  XCircle,
  AlertTriangle,

} from 'lucide-react';
import { formatPaiseToINR } from '@nexus/shared';
import { getOrderById, cancelOrder, } from '@/lib/orders';





export default function OrderTrackingPage({ params }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Ordered by mistake');

  useEffect(() => {
    setMounted(true);
    setOrder(getOrderById(orderId));

    const handleOrdersSync = () => {
      setOrder(getOrderById(orderId));
    };

    window.addEventListener('nexus-orders-updated', handleOrdersSync);
    return () => window.removeEventListener('nexus-orders-updated', handleOrdersSync);
  }, [orderId]);

  function handleConfirmCancel() {
    if (!order) return;
    cancelOrder(order.id, cancelReason);
    setShowCancelModal(false);
  }

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-slate-400 text-xs">
        Loading live tracking status...
      </div>
    );
  }

  const isCancelled = order?.status === 'Cancelled';
  const subOrder = order?.subOrders?.[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Order History</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#1F2433]">
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Truck className="w-4 h-4" />
            Live Courier Tracking
          </span>
          <h1 className="text-2xl font-bold text-white mt-1">Order #{orderId}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Courier: <strong className="text-slate-200">{subOrder?.courier || 'Shiprocket Express'}</strong> • AWB:{' '}
            <strong className="text-slate-200 font-mono">{subOrder?.trackingNumber || 'SR982104928IN'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${
              isCancelled
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {isCancelled ? 'Order Cancelled' : subOrder?.deliveryEstimate || 'Estimated Delivery: In 2-3 Days'}
          </div>

          {!isCancelled && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-3 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs font-bold transition-all"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Cancelled Banner */}
      {isCancelled && (
        <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-200 space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-rose-400">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span>This Order Has Been Cancelled</span>
          </div>
          {order?.cancelledAt && <p className="text-slate-300 pl-7">{order.cancelledAt}</p>}
          {order?.cancellationReason && (
            <p className="text-slate-300 pl-7">
              <strong>Reason:</strong> {order.cancellationReason}
            </p>
          )}
          {order?.refundStatus && (
            <p className="text-emerald-400 pl-7 font-semibold">
              ✓ {order.refundStatus}
            </p>
          )}
        </div>
      )}

      {/* Items in this Shipment */}
      {order && (
        <div className="p-5 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-3">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Items in this Shipment
          </h2>
          <div className="divide-y divide-slate-800">
            {order.subOrders.flatMap((s) => s.items).map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex-shrink-0">
                    <Image src={item.imageUrl} alt={item.title} fill unoptimized className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-white">{item.title}</h3>
                    <p className="text-[11px] text-slate-400">{item.variant}</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold text-white">{formatPaiseToINR(item.priceInPaise)}</div>
                  <div className="text-slate-400 text-[11px]">Qty: {item.quantity}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Visual Tracking Stepper */}
      <div className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-8 shadow-xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center justify-between">
          <span>Courier Dispatch Milestones</span>
          <span className="text-xs font-mono text-cyan-400 font-semibold">Live GPS Status</span>
        </h2>

        {/* Timeline */}
        <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {isCancelled ? (
            <>
              {/* Cancelled Step */}
              <div className="relative space-y-1">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-rose-500 border-4 border-[#12151E]" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-400">Order Cancelled by Customer</span>
                  <span className="text-slate-500">Just now</span>
                </div>
                <p className="text-xs text-slate-400">
                  Shipment halted. Refund processing initiated with partner bank.
                </p>
              </div>

              {/* Order Placed */}
              <div className="relative space-y-1 opacity-60">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-slate-600 border-4 border-[#12151E]" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Order Placed & Confirmed</span>
                  <span className="text-slate-500">{order?.date || 'Earlier'}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Original order was placed with {order?.paymentMethod || 'Online Payment'}.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Step 1 */}
              <div className="relative space-y-1">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#12151E]" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">In Transit (Regional Sorting Hub)</span>
                  <span className="text-slate-500">Today, 2:45 PM</span>
                </div>
                <p className="text-xs text-slate-400">
                  Package arrived at regional distribution hub and scanned for local dispatch.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative space-y-1">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#12151E]" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Picked Up by Courier Logistics</span>
                  <span className="text-slate-500">Yesterday, 6:15 PM</span>
                </div>
                <p className="text-xs text-slate-400">
                  Picked up from vendor facility with secure sealed barcode scan.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative space-y-1">
                <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-4 border-[#12151E]" />
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">Order Placed & Confirmed</span>
                  <span className="text-slate-500">{order?.date || 'Yesterday'}</span>
                </div>
                <p className="text-xs text-slate-400">
                  Order verified and inventory allocated in vendor warehouse.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[#121622] border border-rose-500/30 shadow-2xl p-6 space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Cancel Order #{orderId}</h3>
                <p className="text-xs text-slate-400">
                  Are you sure you want to cancel this order?
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Reason for cancellation *
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Ordered by mistake">Ordered by mistake</option>
                <option value="Found a better price on another website">Found a better price on another website</option>
                <option value="Estimated delivery date is too late">Estimated delivery date is too late</option>
                <option value="Need to change shipping address">Need to change shipping address</option>
                <option value="Other reason">Other reason</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold transition-all shadow-lg shadow-rose-500/20 active:scale-95"
              >
                Yes, Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
