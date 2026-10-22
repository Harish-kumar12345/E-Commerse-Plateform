'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  Truck,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Boxes,
  CheckCircle,
  Clock,

  ExternalLink,
  RefreshCw,


  Check,
  Building,
  CreditCard,

} from 'lucide-react';
import { formatPaiseToINR } from '@nexus/shared';














































































export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dispatchingId, setDispatchingId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Data states
  const [sellerInfo, setSellerInfo] = useState({
    id: 'seller-apex-01',
    storeName: 'Apex Electronics India',
    storeSlug: 'apex-electronics',
    gstin: '07AAAAA0000A1Z5',
    status: 'ACTIVE',
    rating: 4.8,
    totalRatings: 1840,
    commissionRatePercent: 10,
  });

  const [metrics, setMetrics] = useState({
    grossSalesPaise: 842000000, // ₹84,20,000
    platformCommissionPaise: 84200000, // ₹8,42,000
    netPayablePaise: 757800000, // ₹75,78,000
    totalSubOrders: 1840,
    pendingDispatchCount: 14,
    deliveredCount: 1790,
    lowStockAlertsCount: 3,
    activeCatalogCount: 12,
  });

  const [orders, setOrders] = useState([
    {
      id: 'suborder-demo-1',
      subOrderNumber: 'NX-SUB-2026-9011',
      parentOrderNumber: 'NX-ORD-2026-10492',
      customerName: 'Rahul Verma',
      destinationCity: 'Bengaluru, Karnataka (560001)',
      status: 'PLACED',
      subTotalInPaise: 6499900,
      commissionInPaise: 649990,
      sellerNetPayableInPaise: 5849910,
      createdAt: '2026-10-12T14:20:00Z',
      shipment: null,
      items: [
        {
          title: 'ASUS ROG Strix G16 Gaming Laptop',
          sku: 'ASUS-ROG-G16-16GB-1TB',
          variantTitle: '16GB RAM / 1TB SSD / RTX 4060',
          quantity: 1,
          unitPriceInPaise: 6499900,
          totalInPaise: 6499900,
          imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80',
        },
      ],
    },
    {
      id: 'suborder-demo-2',
      subOrderNumber: 'NX-SUB-2026-8944',
      parentOrderNumber: 'NX-ORD-2026-10410',
      customerName: 'Priya Sharma',
      destinationCity: 'Mumbai, Maharashtra (400001)',
      status: 'SHIPPED',
      subTotalInPaise: 1499900,
      commissionInPaise: 149990,
      sellerNetPayableInPaise: 1349910,
      createdAt: '2026-10-11T10:15:00Z',
      shipment: {
        courierName: 'Shiprocket Priority Air',
        awbCode: 'SR-NEXUS-IN-88219401',
        currentStatus: 'IN_TRANSIT',
      },
      items: [
        {
          title: 'Sony WH-1000XM5 ANC Headphones',
          sku: 'SONY-XM5-BLK',
          variantTitle: 'Midnight Black / High-Res Wireless',
          quantity: 1,
          unitPriceInPaise: 1499900,
          totalInPaise: 1499900,
          imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        },
      ],
    },
  ]);

  const [inventory, setInventory] = useState([
    {
      variantId: 'var-1',
      productId: 'prod-1',
      productTitle: 'ASUS ROG Strix G16 Gaming Laptop',
      sku: 'ASUS-ROG-G16-16GB-1TB',
      variantTitle: '16GB RAM / 1TB SSD',
      category: 'Laptops & Computers',
      priceInPaise: 6499900,
      quantityOnHand: 4,
      quantityReserved: 1,
      lowStockThreshold: 5,
      isLowStock: true,
    },
    {
      variantId: 'var-2',
      productId: 'prod-2',
      productTitle: 'Sony WH-1000XM5 ANC Headphones',
      sku: 'SONY-XM5-BLK',
      variantTitle: 'Midnight Black',
      category: 'Audio & Wearables',
      priceInPaise: 1499900,
      quantityOnHand: 18,
      quantityReserved: 2,
      lowStockThreshold: 5,
      isLowStock: false,
    },
    {
      variantId: 'var-3',
      productId: 'prod-3',
      productTitle: 'Apple MacBook Air M3',
      sku: 'MBA-M3-16-512-SLV',
      variantTitle: '16GB RAM / 512GB SSD / Silver',
      category: 'Laptops & Computers',
      priceInPaise: 11490000,
      quantityOnHand: 3,
      quantityReserved: 1,
      lowStockThreshold: 5,
      isLowStock: true,
    },
  ]);

  const [payouts, setPayouts] = useState([
    {
      id: 'payout-1',
      payoutRefNumber: 'NEXUS-NEFT-202610-0914',
      amountInPaise: 48920000,
      periodStart: '2026-10-01T00:00:00Z',
      periodEnd: '2026-10-07T23:59:59Z',
      status: 'SETTLED',
      processedAt: '2026-10-08T10:30:00Z',
      bankAccountMasked: 'HDFC Bank •••• 9102',
    },
    {
      id: 'payout-2',
      payoutRefNumber: 'NEXUS-NEFT-202609-2811',
      amountInPaise: 61450000,
      periodStart: '2026-09-24T00:00:00Z',
      periodEnd: '2026-09-30T23:59:59Z',
      status: 'SETTLED',
      processedAt: '2026-10-01T11:15:00Z',
      bankAccountMasked: 'HDFC Bank •••• 9102',
    },
  ]);

  // Fetch real data on load
  const fetchData = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

      // Overview
      const resOverview = await fetch(`${apiUrl}/seller/overview`).catch(() => null);
      if (resOverview && resOverview.ok) {
        const json = await resOverview.json();
        if (json.data) {
          setSellerInfo(json.data.sellerInfo);
          setMetrics(json.data.metrics);
        }
      }

      // Orders
      const resOrders = await fetch(`${apiUrl}/seller/orders`).catch(() => null);
      if (resOrders && resOrders.ok) {
        const json = await resOrders.json();
        if (json.data && json.data.length > 0) {
          setOrders(json.data);
        }
      }

      // Inventory
      const resInv = await fetch(`${apiUrl}/seller/inventory`).catch(() => null);
      if (resInv && resInv.ok) {
        const json = await resInv.json();
        if (json.data && json.data.length > 0) {
          setInventory(json.data);
        }
      }

      // Payouts
      const resPayouts = await fetch(`${apiUrl}/seller/payouts`).catch(() => null);
      if (resPayouts && resPayouts.ok) {
        const json = await resPayouts.json();
        if (json.data && json.data.length > 0) {
          setPayouts(json.data);
        }
      }
    } catch (e) {
      console.warn('API error or running standalone:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Dispatch Package Action (calls Fastify API)
  const handleDispatch = async (subOrderId) => {
    setDispatchingId(subOrderId);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const res = await fetch(`${apiUrl}/seller/orders/${subOrderId}/dispatch`, {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to dispatch order');
      }

      const json = await res.json();
      const generatedAwb = json.data?.shipment?.awbCode || 'SR-NEXUS-IN-992144';

      setOrders((prev) =>
        prev.map((o) =>
          o.id === subOrderId
            ? {
                ...o,
                status: 'SHIPPED',
                shipment: {
                  courierName: 'Shiprocket Priority Air',
                  awbCode: generatedAwb,
                  currentStatus: 'DISPATCHED_FROM_ORIGIN',
                },
              }
            : o
        )
      );

      // Decrement pending dispatch
      setMetrics((prev) => ({
        ...prev,
        pendingDispatchCount: Math.max(0, prev.pendingDispatchCount - 1),
      }));

      showToast(`Package dispatched! Shiprocket AWB: ${generatedAwb}`);
    } catch (err) {
      showToast('Error dispatching package. Please check network.');
    } finally {
      setDispatchingId(null);
    }
  };

  // Inline Stock Update
  const handleStockUpdate = async (variantId, newQty) => {
    if (newQty < 0) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      await fetch(`${apiUrl}/seller/inventory/${variantId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantityOnHand: newQty }),
      });

      setInventory((prev) =>
        prev.map((item) =>
          item.variantId === variantId
            ? {
                ...item,
                quantityOnHand: newQty,
                isLowStock: newQty <= item.lowStockThreshold,
              }
            : item
        )
      );

      showToast(`Stock updated to ${newQty} units`);
    } catch (err) {
      showToast('Failed to update inventory');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl bg-cyan-950 border border-cyan-500/80 text-cyan-200 text-sm font-medium shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Bar with Merchant Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-950/60">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">{sellerInfo.storeName}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  {sellerInfo.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                  ★ {sellerInfo.rating} ({sellerInfo.totalRatings.toLocaleString()} ratings)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                <span>GSTIN: <code className="font-mono text-cyan-400">{sellerInfo.gstin}</code></span>
                <span>•</span>
                <span>Commission: <strong className="text-amber-400">{sellerInfo.commissionRatePercent}%</strong></span>
                <span>•</span>
                <span>Shiprocket Logistics Partner</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setRefreshing(true);
                fetchData();
              }}
              disabled={refreshing}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-2 transition"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
              Refresh
            </button>
            <Link
              href={`/c/electronics`}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-2 transition"
            >
              View Public Catalog
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* High-Level Financial & Operational Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Gross Merchandise Value</span>
              <DollarSign className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">
              {formatPaiseToINR(metrics.grossSalesPaise)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Across {metrics.totalSubOrders.toLocaleString()} customer sub-orders
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Net Settlement Receivable</span>
              <CreditCard className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">
              {formatPaiseToINR(metrics.netPayablePaise)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              After {formatPaiseToINR(metrics.platformCommissionPaise)} (10%) platform commission
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Pending Dispatch Queue</span>
              <Truck className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 tracking-tight">
              {metrics.pendingDispatchCount} Packages
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Awaiting packaging & Shiprocket AWB manifest
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium uppercase tracking-wider">Stock Alerts</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold text-rose-400 tracking-tight">
              {metrics.lowStockAlertsCount} SKUs Low
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Out of {metrics.activeCatalogCount} active catalog listings
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'orders'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            Fulfillment & Sub-Orders Queue ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'inventory'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Boxes className="w-4 h-4" />
            Stock & Inventory Control ({inventory.length})
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`pb-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
              activeTab === 'payouts'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Bank Settlements & Payouts ({payouts.length})
          </button>
        </div>

        {/* TAB 1: Sub-Orders & Fulfillment Queue */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Showing all customer package orders routed to your warehouse.</span>
              <span>Courier: Shiprocket Air Priority Pickup</span>
            </div>

            {orders.map((order) => {
              const isDispatched = order.status === 'SHIPPED' || order.status === 'DELIVERED';
              return (
                <div
                  key={order.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 transition hover:border-slate-700/80 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-white">
                        {order.subOrderNumber}
                      </span>
                      <span className="text-xs text-slate-500">
                        (Parent: {order.parentOrderNumber})
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          isDispatched
                            ? 'bg-blue-950/80 text-blue-400 border border-blue-800/60'
                            : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-white">
                        Gross: {formatPaiseToINR(order.subTotalInPaise)}
                      </div>
                      <div className="text-xs text-emerald-400">
                        Net Payout: {formatPaiseToINR(order.sellerNetPayableInPaise)}
                      </div>
                    </div>
                  </div>

                  {/* Customer & Destination Preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
                    <div>
                      <p>
                        <strong className="text-slate-300">Customer:</strong> {order.customerName}
                      </p>
                      <p className="mt-0.5">
                        <strong className="text-slate-300">Destination:</strong> {order.destinationCity}
                      </p>
                    </div>

                    <div>
                      {order.shipment ? (
                        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                          <p className="text-cyan-400 font-semibold flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5" />
                            {order.shipment.courierName}
                          </p>
                          <p className="text-slate-300 mt-1 font-mono">
                            AWB: <strong>{order.shipment.awbCode}</strong>
                          </p>
                          <p className="text-slate-400 mt-0.5">
                            Status: <span className="text-blue-300">{order.shipment.currentStatus}</span>
                          </p>
                        </div>
                      ) : (
                        <div className="text-amber-400/90 text-xs flex items-center gap-1.5 pt-1">
                          <Clock className="w-4 h-4 shrink-0" />
                          <span>Awaiting packaging. Generate Shiprocket shipping label below to dispatch.</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-2 pt-1">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/50"
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-800"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                          <p className="text-[11px] text-slate-400">{item.variantTitle}</p>
                          <p className="text-[11px] text-slate-500 font-mono">SKU: {item.sku}</p>
                        </div>
                        <div className="text-right text-xs">
                          <p className="text-slate-300 font-medium">Qty: {item.quantity}</p>
                          <p className="text-cyan-400 font-semibold">{formatPaiseToINR(item.totalInPaise)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex justify-end gap-3">
                    {!isDispatched ? (
                      <button
                        onClick={() => handleDispatch(order.id)}
                        disabled={dispatchingId === order.id}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs hover:from-cyan-400 hover:to-blue-500 transition flex items-center gap-2 shadow-lg shadow-cyan-950/50 disabled:opacity-50"
                      >
                        {dispatchingId === order.id ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Generating AWB...
                          </>
                        ) : (
                          <>
                            <Truck className="w-3.5 h-3.5" />
                            Generate AWB & Dispatch Package
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium px-3 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
                        <Check className="w-3.5 h-3.5" />
                        Dispatched with Shiprocket ({order.shipment?.awbCode})
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: Inventory & Stock Management */}
        {activeTab === 'inventory' && (
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Catalog & Stock Control</h3>
                <p className="text-xs text-slate-400">Live quantity-on-hand synchronized with storefront search & checkout.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-3 font-semibold">Product Title & Variant</th>
                    <th className="pb-3 font-semibold">SKU</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Price</th>
                    <th className="pb-3 font-semibold">Reserved</th>
                    <th className="pb-3 font-semibold">Stock on Hand</th>
                    <th className="pb-3 font-semibold text-right">Quick Stock Adjustment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {inventory.map((item) => (
                    <tr key={item.variantId} className="hover:bg-slate-800/20 transition">
                      <td className="py-3.5 pr-4">
                        <div className="font-semibold text-white">{item.productTitle}</div>
                        <div className="text-[11px] text-slate-400">{item.variantTitle}</div>
                      </td>
                      <td className="py-3.5 pr-4 font-mono text-slate-400">{item.sku}</td>
                      <td className="py-3.5 pr-4 text-slate-300">{item.category}</td>
                      <td className="py-3.5 pr-4 font-semibold text-cyan-400">
                        {formatPaiseToINR(item.priceInPaise)}
                      </td>
                      <td className="py-3.5 pr-4 text-amber-400 font-medium">
                        {item.quantityReserved} reserved
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold text-sm ${
                              item.isLowStock ? 'text-rose-400' : 'text-emerald-400'
                            }`}
                          >
                            {item.quantityOnHand}
                          </span>
                          {item.isLowStock && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-800">
                              Low Stock
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleStockUpdate(item.variantId, item.quantityOnHand - 1)}
                            disabled={item.quantityOnHand <= 0}
                            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold flex items-center justify-center transition disabled:opacity-40"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-mono font-bold text-white text-xs">
                            {item.quantityOnHand}
                          </span>
                          <button
                            onClick={() => handleStockUpdate(item.variantId, item.quantityOnHand + 5)}
                            className="px-2 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium text-[11px] flex items-center justify-center transition"
                            title="Add +5 units"
                          >
                            +5
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Settlements & Payouts */}
        {activeTab === 'payouts' && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-1">Direct Bank Settlement Ledger</h3>
              <p className="text-xs text-slate-400 mb-6">
                All payouts are transferred weekly via NEFT/RTGS to your registered account with tax deduction at source (TDS) and GST input credit tax certificates.
              </p>

              <div className="space-y-3">
                {payouts.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-white">
                          {p.payoutRefNumber}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {p.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Settled to: <strong className="text-slate-300">{p.bankAccountMasked || 'HDFC Bank •••• 9102'}</strong> on{' '}
                        {new Date(p.processedAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-extrabold text-emerald-400">
                        {formatPaiseToINR(p.amountInPaise)}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Net NEFT Transferred
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
