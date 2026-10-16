'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Package,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { formatPaiseToINR } from '@nexus/shared';
import {
  getStoredOrders,
  cancelOrder,
  loadSampleOrder,
  clearAllOrders,
  Order,
} from '@/lib/orders';

const CANCELLATION_REASONS = [
  'Ordered by mistake',
  'Found a better price on another website',
  'Estimated delivery date is too late',
  'Need to change shipping address or phone number',
  'Order processing is taking longer than expected',
  'Want to change variant / color / size',
  'Other reason',
];

export default function AccountOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [mounted, setMounted] = useState(false);

  // Cancellation Modal State
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [selectedReason, setSelectedReason] = useState(CANCELLATION_REASONS[0]);
  const [cancelNotes, setCancelNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setOrders(getStoredOrders());

    const handleOrdersSync = () => {
      setOrders(getStoredOrders());
    };

    window.addEventListener('nexus-orders-updated', handleOrdersSync);
    return () => window.removeEventListener('nexus-orders-updated', handleOrdersSync);
  }, []);

  function handleOpenCancelModal(order: Order) {
    setOrderToCancel(order);
    setSelectedReason(CANCELLATION_REASONS[0]);
    setCancelNotes('');
  }

  function handleConfirmCancel() {
    if (!orderToCancel) return;
    const finalReason = cancelNotes.trim()
      ? `${selectedReason} - ${cancelNotes.trim()}`
      : selectedReason;

    const success = cancelOrder(orderToCancel.id, finalReason);
    if (success) {
      setToastMessage(`Order #${orderToCancel.id} has been cancelled successfully.`);
      setTimeout(() => setToastMessage(null), 4000);
    }
    setOrderToCancel(null);
  }

  function handleLoadSample() {
    loadSampleOrder();
    setToastMessage('Sample demo order loaded! You can now test tracking and cancellation.');
    setTimeout(() => setToastMessage(null), 3500);
  }

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 text-xs">
        Loading your orders...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Back button & Action controls */}
      <div className="flex items-center justify-between">
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account</span>
        </Link>

        {orders.length > 0 && (
          <button
            onClick={handleLoadSample}
            className="text-xs text-amber-400/80 hover:text-amber-300 flex items-center gap-1 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Order</span>
          </button>
        )}
      </div>

      {/* Header */}
      <div className="pb-6 border-b border-[#1F2433] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Package className="w-6 h-6 text-amber-400" />
            <span>Order History & Shipments</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review your orders, track multi-vendor packages, cancel active orders, or download GST invoices.
          </p>
        </div>

        {orders.length > 0 && (
          <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto">
            {orders.length} Total Order{orders.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="p-12 sm:p-16 rounded-3xl bg-[#12151E] border border-dashed border-slate-800 text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h2 className="text-lg font-bold text-white">No Orders Placed Yet</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              You haven&apos;t placed any orders yet. Explore 50,000+ curated products from verified Indian vendors with 1-click checkout!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              Start Shopping Now
            </Link>
            <button
              onClick={handleLoadSample}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Load Sample Demo Order</span>
            </button>
          </div>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-6">
          {orders.map((order) => {
            const isCancelled = order.status === 'Cancelled';

            return (
              <div
                key={order.id}
                className={`rounded-2xl bg-[#12151E] border ${
                  isCancelled ? 'border-rose-500/30' : 'border-[#1F2433]'
                } overflow-hidden shadow-xl transition-all`}
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-5 bg-slate-900/60 border-b border-[#1F2433] flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className="text-slate-500 block text-[11px] font-mono">ORDER PLACED</span>
                      <span className="text-slate-200 font-semibold">{order.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px] font-mono">TOTAL AMOUNT</span>
                      <span className="text-white font-bold">
                        {formatPaiseToINR(order.totalAmountInPaise)}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px] font-mono">SHIP TO</span>
                      <span className="text-slate-200 font-semibold truncate max-w-[150px] block">
                        {order.shippingAddress?.fullName || 'Customer'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-300 font-semibold">#{order.id}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        isCancelled
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}
                    >
                      {order.status}
                    </span>
                    <Link
                      href={`/order/confirmed/${order.id}`}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-400 border border-slate-700 transition-colors"
                    >
                      Invoice
                    </Link>
                  </div>
                </div>

                {/* Cancelled Banner */}
                {isCancelled && (
                  <div className="p-4 bg-rose-500/10 border-b border-rose-500/20 text-xs text-rose-300 space-y-1">
                    <div className="flex items-center gap-2 font-bold text-rose-400">
                      <XCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Order Cancelled</span>
                      {order.cancelledAt && <span className="text-slate-400 text-[11px]">• {order.cancelledAt}</span>}
                    </div>
                    {order.cancellationReason && (
                      <p className="text-slate-300 pl-6">
                        <strong>Reason:</strong> {order.cancellationReason}
                      </p>
                    )}
                    {order.refundStatus && (
                      <p className="text-emerald-400 pl-6 font-medium text-[11px]">
                        ✓ {order.refundStatus}
                      </p>
                    )}
                  </div>
                )}

                {/* Sub-Orders Partitioned */}
                <div className="p-5 space-y-4">
                  {order.subOrders.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-4"
                    >
                      {/* Sub-order status banner */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">Vendor: {sub.sellerName}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400 font-mono text-[11px]">
                            AWB: {sub.trackingNumber} ({sub.courier})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                              sub.status === 'Cancelled'
                                ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                                : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                            }`}
                          >
                            {sub.status}
                          </span>
                          {sub.status !== 'Cancelled' && (
                            <span className="text-emerald-400 font-medium">
                              {sub.deliveryEstimate}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Items in this sub-order */}
                      <div className="space-y-3">
                        {sub.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.imageUrl}
                                  alt={item.title}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              </div>
                              <div className="space-y-0.5">
                                <Link
                                  href={`/p/${item.slug}`}
                                  className="text-xs font-semibold text-slate-100 hover:text-amber-400 transition-colors line-clamp-1"
                                >
                                  {item.title}
                                </Link>
                                <p className="text-[11px] text-slate-400">{item.variant}</p>
                                <p className="text-xs font-bold text-white pt-1">
                                  {formatPaiseToINR(item.priceInPaise)} × {item.quantity}
                                </p>
                              </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2 w-full sm:w-auto self-end sm:self-center">
                              <Link
                                href={`/track/${order.id}`}
                                className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                              >
                                <Truck className="w-3.5 h-3.5" />
                                <span>Track</span>
                              </Link>

                              {!isCancelled ? (
                                <button
                                  onClick={() => handleOpenCancelModal(order)}
                                  className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Cancel Order</span>
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-500 font-semibold px-2 py-1">
                                  Refunded
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancel Order Confirmation Modal */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl bg-[#121622] border border-rose-500/30 shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Cancel Order #{orderToCancel.id}</h3>
                <p className="text-xs text-slate-400">
                  Total amount: <strong>{formatPaiseToINR(orderToCancel.totalAmountInPaise)}</strong>
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 text-xs text-rose-300">
              <p>
                100% of your payment will be refunded immediately back to your original payment mode or Nexus wallet with zero penalty.
              </p>
            </div>

            {/* Reason selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Please select a reason for cancellation *
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full h-11 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                {CANCELLATION_REASONS.map((reason) => (
                  <option key={reason} value={reason} className="bg-slate-900 text-white">
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {/* Optional Comment */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Additional Comments (Optional)
              </label>
              <textarea
                rows={2}
                value={cancelNotes}
                onChange={(e) => setCancelNotes(e.target.value)}
                placeholder="Help us improve our service..."
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOrderToCancel(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                No, Keep Order
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
