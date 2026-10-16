'use client';

import React, { useState } from 'react';
import {
  Bell,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Mail,
  MessageSquare,
  Smartphone,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { formatPaiseToINR } from '@nexus/shared';

interface PriceDropModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  variantTitle: string;
  variantId: string;
  currentPricePaise: number;
}

export function PriceDropModal({
  isOpen,
  onClose,
  productTitle,
  variantTitle,
  variantId,
  currentPricePaise,
}: PriceDropModalProps) {
  const [selectedPercentage, setSelectedPercentage] = useState<number>(5);
  const [customPriceRupees, setCustomPriceRupees] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [channel, setChannel] = useState<'EMAIL' | 'WHATSAPP' | 'SMS'>('EMAIL');
  const [contactInfo, setContactInfo] = useState<string>('customer@example.com');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentPriceRupees = Math.round(currentPricePaise / 100);

  // Compute target price based on preset or custom
  let targetPriceRupees = Math.round(currentPriceRupees * (1 - selectedPercentage / 100));
  if (isCustom && customPriceRupees) {
    const parsed = parseInt(customPriceRupees.replace(/,/g, ''), 10);
    if (!isNaN(parsed) && parsed > 0) {
      targetPriceRupees = parsed;
    }
  }

  const potentialSavingsRupees = Math.max(0, currentPriceRupees - targetPriceRupees);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const targetPricePaise = targetPriceRupees * 100;

    try {
      await fetch('http://localhost:4000/api/v1/account/price-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId,
          targetPriceInPaise: targetPricePaise,
          channel,
          contactInfo,
        }),
      });
    } catch (e) {
      // Graceful offline mock handling
    }

    // Persist to localStorage for user review
    try {
      const existing = JSON.parse(localStorage.getItem('nexus_price_alerts') || '[]');
      existing.push({
        id: `alert-${Date.now()}`,
        productTitle,
        variantTitle,
        variantId,
        targetPricePaise,
        channel,
        contactInfo,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('nexus_price_alerts', JSON.stringify(existing));
    } catch (e) {}

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#12151E] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow accent header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-cyan-400 to-amber-500" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Bell className="w-3.5 h-3.5" />
                <span>Price-Drop Sentinel Vault</span>
              </div>
              <h3 className="text-xl font-bold text-white leading-snug">
                Set Price Drop Alert for {variantTitle}
              </h3>
              <p className="text-xs text-slate-400">
                We track price fluctuations across all verified sellers every 15 minutes. You will be
                notified the exact second it drops to your target.
              </p>
            </div>

            {/* Current Price vs Target Card */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#090A0F] border border-[#1F2433]">
              <div>
                <span className="text-[11px] text-slate-400 block">Current Price</span>
                <span className="text-lg font-black text-white font-mono">
                  {formatPaiseToINR(currentPricePaise)}
                </span>
              </div>
              <div className="border-l border-[#1F2433] pl-3">
                <span className="text-[11px] text-emerald-400 font-semibold block">Target Alert Price</span>
                <span className="text-lg font-black text-emerald-400 font-mono">
                  ₹{targetPriceRupees.toLocaleString('en-IN')}
                </span>
                {potentialSavingsRupees > 0 && (
                  <span className="text-[10px] text-slate-400 block">
                    Save ₹{potentialSavingsRupees.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            {/* Target Price Presets */}
            <div className="space-y-2">
              <span className="text-xs text-slate-300 font-semibold block">Choose Drop Threshold:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { pct: 5, label: '5% Drop' },
                  { pct: 10, label: '10% Drop' },
                  { pct: 15, label: '15% Drop' },
                ].map((preset) => (
                  <button
                    key={preset.pct}
                    type="button"
                    onClick={() => {
                      setSelectedPercentage(preset.pct);
                      setIsCustom(false);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      !isCustom && selectedPercentage === preset.pct
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-sm'
                        : 'bg-[#090A0F] border-[#1F2433] text-slate-400 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom input toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsCustom(!isCustom)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 underline font-medium"
                >
                  {isCustom ? 'Use percentage presets instead' : 'Or specify an exact rupee target'}
                </button>
                {isCustom && (
                  <div className="mt-2 relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-bold">₹</span>
                    <input
                      type="number"
                      value={customPriceRupees}
                      onChange={(e) => setCustomPriceRupees(e.target.value)}
                      placeholder="Enter custom target price in ₹"
                      className="w-full h-10 pl-8 pr-3 rounded-xl bg-[#090A0F] border border-[#1F2433] text-white text-sm focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Notification Channel */}
            <div className="space-y-2">
              <span className="text-xs text-slate-300 font-semibold block">Notification Channel:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'EMAIL', label: 'Email', icon: Mail },
                  { id: 'WHATSAPP', label: 'WhatsApp', icon: MessageSquare },
                  { id: 'SMS', label: 'SMS', icon: Smartphone },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setChannel(item.id as any)}
                      className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        channel === item.id
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'bg-[#090A0F] border-[#1F2433] text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder={channel === 'EMAIL' ? 'Enter email address' : 'Enter 10-digit mobile number'}
                className="w-full h-10 px-3 rounded-xl bg-[#090A0F] border border-[#1F2433] text-white text-xs focus:outline-none focus:border-cyan-500 mt-2"
                required
              />
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>{isSubmitting ? 'Locking Sentinel Alert...' : 'Activate Price Drop Vault Alert'}</span>
            </button>
          </form>
        ) : (
          /* Success Screen */
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Vault Sentinel Activated!</h3>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                We are actively tracking prices for <strong>{productTitle}</strong>. As soon as it drops to{' '}
                <strong className="text-emerald-400 font-mono">₹{targetPriceRupees.toLocaleString('en-IN')}</strong>, we will notify you via {channel}.
              </p>
            </div>

            <div className="p-3 bg-[#090A0F] rounded-xl border border-[#1F2433] text-xs text-slate-400 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Zero spam guarantee • 1-click unsubscribe anytime</span>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#1A1F2C] hover:bg-[#22293A] text-white font-semibold text-xs transition-colors"
            >
              Done & Return to Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
