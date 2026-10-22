'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Store,
  ShieldCheck,
  Building2,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Truck,
  Percent,
} from 'lucide-react';

export default function SellerRegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    storeName: '',
    businessEmail: '',
    businessPhone: '',
    gstin: '',
    pan: '',
    bankAccountNo: '',
    confirmAccountNo: '',
    bankIfsc: '',
    pickupAddress: '',
    pickupPincode: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'gstin' || name === 'pan' || name === 'bankIfsc' ? value.toUpperCase() : value,
    }));
    setErrorMsg(null);
  };

  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (!formData.storeName || !formData.businessEmail || !formData.businessPhone || !formData.pickupAddress || !formData.pickupPincode) {
      setErrorMsg('Please complete all business identity fields');
      return;
    }
    if (!/^[6-9]\d{9}$/.test(formData.businessPhone)) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    if (!/^[1-9][0-9]{5}$/.test(formData.pickupPincode)) {
      setErrorMsg('Please enter a valid 6-digit Indian PIN code');
      return;
    }
    setStep(2);
  };

  const handleNextStep2 = (e) => {
    e.preventDefault();
    if (!formData.gstin || !formData.pan) {
      setErrorMsg('GSTIN and PAN are mandatory for commercial selling in India');
      return;
    }
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstinRegex.test(formData.gstin)) {
      setErrorMsg('Invalid GSTIN format (e.g. 29ABCDE1234F1Z5)');
      return;
    }
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.pan)) {
      setErrorMsg('Invalid PAN format (e.g. ABCDE1234F)');
      return;
    }
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.bankAccountNo || !formData.bankIfsc) {
      setErrorMsg('Please provide your bank settlement details');
      return;
    }
    if (formData.bankAccountNo !== formData.confirmAccountNo) {
      setErrorMsg('Bank Account Numbers do not match');
      return;
    }
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    if (!ifscRegex.test(formData.bankIfsc)) {
      setErrorMsg('Invalid 11-character Indian IFSC code (e.g. HDFC0001234)');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const res = await fetch(`${apiUrl}/seller/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: formData.storeName,
          businessEmail: formData.businessEmail,
          businessPhone: formData.businessPhone,
          gstin: formData.gstin,
          pan: formData.pan,
          bankAccountNo: formData.bankAccountNo,
          bankIfsc: formData.bankIfsc,
          pickupAddress: formData.pickupAddress,
          pickupPincode: formData.pickupPincode,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Registration failed');
      }

      setSuccess(true);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4 shadow-lg shadow-cyan-950/40">
            <Sparkles className="w-4 h-4" />
            Nexus Merchant Hub
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Sell to Millions Across Bharat
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Zero setup fees, daily automated bank settlements, pan-India Shiprocket courier pickup, and dedicated vendor analytics.
          </p>
        </div>

        {/* Value Proposition Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Percent className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Flat 10% Commission</h4>
              <p className="text-xs text-slate-400 mt-0.5">Transparent fees with zero hidden charges or onboarding costs.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Doorstep Pickup</h4>
              <p className="text-xs text-slate-400 mt-0.5">Shiprocket courier fleet collects orders directly from your warehouse.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Weekly Payouts</h4>
              <p className="text-xs text-slate-400 mt-0.5">Automated direct NEFT/RTGS bank transfers with full GST invoices.</p>
            </div>
          </div>
        </div>

        {/* Step Progression Bar */}
        <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
          <div className={`flex items-center gap-2 text-xs font-medium ${step >= 1 ? 'text-cyan-400' : 'text-slate-500'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center border font-bold ${step >= 1 ? 'border-cyan-500 bg-cyan-950/80 text-cyan-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
              1
            </span>
            Identity
          </div>
          <div className={`h-0.5 flex-1 mx-3 ${step >= 2 ? 'bg-cyan-500/60' : 'bg-slate-800'}`} />
          <div className={`flex items-center gap-2 text-xs font-medium ${step >= 2 ? 'text-cyan-400' : 'text-slate-500'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center border font-bold ${step >= 2 ? 'border-cyan-500 bg-cyan-950/80 text-cyan-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
              2
            </span>
            Tax & GST
          </div>
          <div className={`h-0.5 flex-1 mx-3 ${step >= 3 ? 'bg-cyan-500/60' : 'bg-slate-800'}`} />
          <div className={`flex items-center gap-2 text-xs font-medium ${step >= 3 ? 'text-cyan-400' : 'text-slate-500'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center border font-bold ${step >= 3 ? 'border-cyan-500 bg-cyan-950/80 text-cyan-300' : 'border-slate-800 bg-slate-900 text-slate-500'}`}>
              3
            </span>
            Banking
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative">
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Merchant Verification Approved!</h3>
              <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
                Congratulations, <strong className="text-cyan-400">{formData.storeName}</strong>! Your seller account is active on Nexus Bazaar with GSTIN <code className="text-xs bg-slate-800 px-2 py-0.5 rounded text-amber-300">{formData.gstin}</code>.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/seller/dashboard"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50"
                >
                  <Store className="w-4 h-4" />
                  Launch Seller Operations Dashboard
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-700 transition-all"
                >
                  Return to Storefront
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* STEP 1: Store & Warehouse Details */}
              {step === 1 && (
                <form onSubmit={handleNextStep1} className="space-y-5">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Store className="w-5 h-5 text-cyan-400" />
                      Store & Warehouse Identity
                    </h3>
                    <p className="text-xs text-slate-400">Your brand name and dispatch address for courier pickups.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Store / Merchant Brand Name *
                    </label>
                    <input
                      type="text"
                      name="storeName"
                      value={formData.storeName}
                      onChange={handleChange}
                      placeholder="e.g. Apex Electronics India"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Business Email Address *
                      </label>
                      <input
                        type="email"
                        name="businessEmail"
                        value={formData.businessEmail}
                        onChange={handleChange}
                        placeholder="merchant@yourbrand.in"
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Business Phone Number (10 digits) *
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-800 bg-slate-900 text-slate-400 text-sm">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="businessPhone"
                          value={formData.businessPhone}
                          onChange={handleChange}
                          placeholder="9876543210"
                          maxLength={10}
                          required
                          className="w-full px-4 py-2.5 rounded-r-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Warehouse / Dispatch Address *
                    </label>
                    <textarea
                      name="pickupAddress"
                      value={formData.pickupAddress}
                      onChange={handleChange}
                      placeholder="Plot 42, Okhla Industrial Area Phase III, New Delhi"
                      rows={2}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Pickup Indian PIN Code *
                    </label>
                    <input
                      type="text"
                      name="pickupPincode"
                      value={formData.pickupPincode}
                      onChange={handleChange}
                      placeholder="110020"
                      maxLength={6}
                      required
                      className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-cyan-950/50"
                    >
                      Next: Tax & Compliance
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: GST & PAN Compliance */}
              {step === 2 && (
                <form onSubmit={handleNextStep2} className="space-y-5">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-amber-400" />
                      Taxation & Statutory Compliance
                    </h3>
                    <p className="text-xs text-slate-400">Required by the Ministry of Finance & GST Council for Indian e-commerce operators.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      GSTIN (Goods & Services Tax Identification Number) *
                    </label>
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      placeholder="07AAAAA0000A1Z5"
                      maxLength={15}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white uppercase placeholder-slate-500 outline-none tracking-widest font-mono transition"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">15-digit alphanumeric identifier allocated by GSTN portal.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Permanent Account Number (PAN) *
                    </label>
                    <input
                      type="text"
                      name="pan"
                      value={formData.pan}
                      onChange={handleChange}
                      placeholder="AAAAA0000A"
                      maxLength={10}
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white uppercase placeholder-slate-500 outline-none tracking-widest font-mono transition"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">10-character business or proprietor PAN card number.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Your statutory details are securely cross-referenced against the GSTN sandbox. Tax invoices with proper HSN codes will be generated automatically.</span>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all flex items-center gap-2 shadow-lg shadow-cyan-950/50"
                    >
                      Next: Banking Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: Settlement Bank Account */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-slate-800 pb-4 mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-emerald-400" />
                      Direct Bank Settlement Account
                    </h3>
                    <p className="text-xs text-slate-400">Weekly payouts will be credited to this current or savings account.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Bank Account Number *
                      </label>
                      <input
                        type="password"
                        name="bankAccountNo"
                        value={formData.bankAccountNo}
                        onChange={handleChange}
                        placeholder="••••••••••••"
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Confirm Bank Account Number *
                      </label>
                      <input
                        type="text"
                        name="confirmAccountNo"
                        value={formData.confirmAccountNo}
                        onChange={handleChange}
                        placeholder="Re-enter Account No."
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Bank IFSC Code *
                    </label>
                    <input
                      type="text"
                      name="bankIfsc"
                      value={formData.bankIfsc}
                      onChange={handleChange}
                      placeholder="HDFC0001234"
                      maxLength={11}
                      required
                      className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white uppercase placeholder-slate-500 outline-none tracking-widest font-mono transition"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">11-character Indian Financial System Code printed on your chequebook.</p>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/50 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting KYC...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          Verify & Activate Merchant Account
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
