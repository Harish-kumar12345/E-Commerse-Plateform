'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  CreditCard,

  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Phone,
  QrCode,
  Building2,

} from 'lucide-react';
import { formatPaiseToINR } from '@nexus/shared';
import { getStoredCart, clearCart } from '@/lib/cart';
import { createOrderFromCart } from '@/lib/orders';

export default function CheckoutPage() {
  const router = useRouter();

  // Selected address state
  const [selectedAddressId, setSelectedAddressId] = useState('addr-1');
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY_UPI');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codOtpModalOpen, setCodOtpModalOpen] = useState(false);
  const [codOtp, setCodOtp] = useState('');
  const [codOtpError, setCodOtpError] = useState('');

  // Sample multi-seller order items
  const subtotalPaise = 3098800;
  const taxPaise = 557784;
  const discountPaise = 75000;
  const totalAmountPaise = subtotalPaise + taxPaise - discountPaise;

  const savedAddresses = [
    {
      id: 'addr-1',
      fullName: 'Rahul Sharma',
      phone: '+91 9892019283',
      line1: 'B-402, Lodha Bellissimo, NM Joshi Marg',
      line2: 'Mahalaxmi West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400011',
      isDefault: true,
    },
    {
      id: 'addr-2',
      fullName: 'Rahul Sharma (Office)',
      phone: '+91 9892019283',
      line1: 'Floor 18, One World Center, Tower 2',
      line2: 'Lower Parel',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400013',
      isDefault: false,
    },
  ];

  function processFinalOrder() {
    const currentCart = getStoredCart();
    const targetAddress = savedAddresses.find((a) => a.id === selectedAddressId) || savedAddresses[0];

    const newOrder = createOrderFromCart(
      currentCart.length > 0
        ? currentCart
        : [
            {
              id: 'cart-default-1',
              variantId: 'var-sony-xm5',
              title: 'Sony WH-1000XM5 Wireless Headphones',
              variantTitle: 'Midnight Black',
              imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
              priceInPaise: 2799000,
              quantity: 1,
              sellerId: 'apex-1',
              sellerName: 'Apex Electronics India',
              slug: 'sony-wh-1000xm5-wireless-anc-headphones',
            },
          ],
      {
        fullName: targetAddress.fullName,
        phone: targetAddress.phone,
        line1: `${targetAddress.line1}, ${targetAddress.line2}`,
        city: targetAddress.city,
        state: targetAddress.state,
        pincode: targetAddress.pincode,
      },
      paymentMethod
    );

    clearCart();
    router.push(`/order/confirmed/${newOrder.id}`);
  }

  async function handlePlaceOrder() {
    setIsSubmitting(true);
    // If COD, show OTP verification modal
    if (paymentMethod === 'COD') {
      setTimeout(() => {
        setIsSubmitting(false);
        setCodOtpModalOpen(true);
      }, 600);
      return;
    }

    // Payment simulation
    setTimeout(() => {
      setIsSubmitting(false);
      processFinalOrder();
    }, 1000);
  }

  function handleVerifyCodOtp(e) {
    e.preventDefault();
    if (codOtp === '123456' || codOtp.length === 6) {
      setCodOtpModalOpen(false);
      processFinalOrder();
    } else {
      setCodOtpError('Please enter the 6-digit OTP sent to your phone (test OTP: 123456)');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Checkout Security Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#1F2433] mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-400" />
            <span>Secure 256-Bit SSL Checkout</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Single-page checkout with instant multi-vendor order partitioning
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold bg-cyan-500/10 px-3 py-1.5 rounded-xl border border-cyan-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Razorpay Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Steps (8 Cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* STEP 1: DELIVERY ADDRESS */}
          <section className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">
                  1
                </span>
                <span>Select Delivery Address</span>
              </h2>
              <button className="text-xs font-semibold text-amber-400 hover:text-amber-300">
                + Add New Address
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-1.5 ${
                    selectedAddressId === addr.id
                      ? 'bg-amber-500/10 border-amber-500 text-slate-100 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-200">{addr.fullName}</span>
                    {selectedAddressId === addr.id && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400" />
                    )}
                  </div>
                  <p className="text-xs leading-relaxed">
                    {addr.line1}, {addr.line2}
                  </p>
                  <p className="text-xs">
                    {addr.city}, {addr.state} — <strong className="text-slate-300 font-mono">{addr.pincode}</strong>
                  </p>
                  <p className="text-xs text-slate-500 pt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {addr.phone}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* STEP 2: MULTI-SELLER SHIPMENT SCHEDULE */}
          <section className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-4 shadow-lg">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">
                2
              </span>
              <span>Multi-Vendor Shipment Breakdown</span>
            </h2>

            <div className="space-y-3">
              {/* Shipment 1 */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-200">Package 1 of 2</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Apex Electronics India
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Sony WH-1000XM5 Wireless Headphones (Midnight Black)
                  </p>
                </div>
                <div className="text-xs text-right">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Delivery by Oct 15
                  </span>
                  <span className="text-[11px] text-slate-500">Shiprocket Express</span>
                </div>
              </div>

              {/* Shipment 2 */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-200">Package 2 of 2</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Urban Stitch Apparels
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    2x Heavyweight Supima Oversized Tee (Washed Charcoal)
                  </p>
                </div>
                <div className="text-xs text-right">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> Delivery by Oct 16
                  </span>
                  <span className="text-[11px] text-slate-500">Delhivery Surface</span>
                </div>
              </div>
            </div>
          </section>

          {/* STEP 3: PAYMENT METHOD */}
          <section className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-4 shadow-lg">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">
                3
              </span>
              <span>Payment Method (Razorpay India)</span>
            </h2>

            <div className="space-y-3">
              {/* Razorpay UPI */}
              <label
                onClick={() => setPaymentMethod('RAZORPAY_UPI')}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'RAZORPAY_UPI'
                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                    : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-amber-400">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Instant UPI (Recommended)</h4>
                    <p className="text-[11px] text-slate-400">Google Pay, PhonePe, Paytm, CRED & BHIM UPI</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'RAZORPAY_UPI'} readOnly className="text-amber-500" />
              </label>

              {/* Cards */}
              <label
                onClick={() => setPaymentMethod('RAZORPAY_CARD')}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'RAZORPAY_CARD'
                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                    : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-cyan-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Credit / Debit Card</h4>
                    <p className="text-[11px] text-slate-400">Visa, Mastercard, RuPay & American Express</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'RAZORPAY_CARD'} readOnly className="text-amber-500" />
              </label>

              {/* Cash On Delivery */}
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'bg-amber-500/10 border-amber-500 text-white shadow-md'
                    : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-slate-400">Requires mobile OTP verification before dispatch</p>
                  </div>
                </div>
                <input type="radio" checked={paymentMethod === 'COD'} readOnly className="text-amber-500" />
              </label>
            </div>
          </section>
        </div>

        {/* Right Column: Order Review & Place Order Button (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-4 shadow-xl sticky top-24">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Order Review
            </h2>

            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="text-slate-200 font-medium">{formatPaiseToINR(subtotalPaise)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated GST (18%)</span>
                <span className="text-slate-200 font-medium">{formatPaiseToINR(taxPaise)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-emerald-400 font-semibold">FREE</span>
              </div>
              <div className="flex justify-between text-amber-400 font-medium">
                <span>NEXUSFIRST Coupon</span>
                <span>-{formatPaiseToINR(discountPaise)}</span>
              </div>
              <div className="pt-3 border-t border-slate-800 flex justify-between text-base font-bold text-white">
                <span>Total Payable</span>
                <span className="text-xl text-amber-400">{formatPaiseToINR(totalAmountPaise)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full h-12 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <span>Place Order & Pay {formatPaiseToINR(totalAmountPaise)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="text-[11px] text-slate-500 text-center leading-relaxed">
              By placing this order, you agree to NEXUS Bazaar's Terms of Sale and Privacy Policy.
            </div>
          </div>
        </div>
      </div>

      {/* COD OTP Verification Modal */}
      {codOtpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#12151E] border border-amber-500/40 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">COD Mobile Verification</h3>
                <p className="text-xs text-slate-400">Enter the 6-digit OTP sent to +91 9892019283</p>
              </div>
            </div>

            <form onSubmit={handleVerifyCodOtp} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={codOtp}
                onChange={(e) => setCodOtp(e.target.value)}
                placeholder="Enter 6-digit OTP (e.g. 123456)"
                className="w-full h-12 text-center text-lg font-mono font-bold tracking-widest rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />

              {codOtpError && <p className="text-xs text-rose-400">{codOtpError}</p>}

              <p className="text-[11px] text-slate-500 text-center">
                For demo testing, enter <strong className="text-amber-400">123456</strong>
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setCodOtpModalOpen(false)}
                  className="flex-1 h-10 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 shadow-md"
                >
                  Confirm COD Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
