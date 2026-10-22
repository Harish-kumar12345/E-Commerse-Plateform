'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  Heart,

  RotateCcw,
  ShieldCheck,
  Coins,
  ChevronRight,


  LogOut,
  LogIn,
  Sparkles,
} from 'lucide-react';
import { getStoredUser, logout, DEMO_USERS, setAuthSession } from '@/lib/auth';

export default function AccountDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentUser(getStoredUser());

    const handleAuthSync = () => {
      setCurrentUser(getStoredUser());
    };

    window.addEventListener('nexus-auth-updated', handleAuthSync);
    return () => window.removeEventListener('nexus-auth-updated', handleAuthSync);
  }, []);

  function handleLogout() {
    logout();
    router.push('/login');
  }

  function handleQuickLogin() {
    setAuthSession(DEMO_USERS.customer);
  }

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400 text-xs">
        Loading account details...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Account Profile Header or Sign-In Prompt */}
      {currentUser ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#12151E] via-slate-900 to-[#12151E] border border-[#1F2433] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
              {currentUser.name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'U'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{currentUser.name}</h1>
                {currentUser.isPrimeMember && (
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Nexus Prime
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {currentUser.email} {currentUser.phoneNumber ? `• ${currentUser.phoneNumber}` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Loyalty Balance Badge */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                  Nexus Coins Balance
                </div>
                <div className="text-lg font-black text-amber-400 font-mono">
                  {currentUser.coinsBalance ?? 100} Coins{' '}
                  <span className="text-xs text-slate-400 font-normal">
                    (Worth ₹{currentUser.coinsBalance ?? 100})
                  </span>
                </div>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#161B26] to-[#111420] border border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                Guest Mode
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white">Sign in to your NEXUS Account</h1>
            </div>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              Sign in to manage your vendor orders, view live GPS tracking, save favorites to your wishlist, and claim 100 welcome coins.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/login?redirect=/account"
              className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Register</span>
            </Link>
            <button
              onClick={handleQuickLogin}
              className="hidden md:flex px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Demo Login</span>
            </button>
          </div>
        </div>
      )}

      {/* Account Modules Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Module 1: Orders */}
        <Link
          href="/account/orders"
          className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] hover:border-amber-500/50 transition-all flex flex-col justify-between group shadow-lg hover:-translate-y-0.5"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
              Your Orders & Tracking
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track vendor shipments, download B2B GST tax invoices, and view order history.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-semibold text-amber-400 gap-1">
            <span>View All Orders</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Module 2: Wishlist */}
        <Link
          href="/account/wishlist"
          className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-lg hover:-translate-y-0.5"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
              Wishlist & Price Alerts
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Saved favorites with automated price-drop notifications and 1-click add to cart.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-semibold text-cyan-400 gap-1">
            <span>View Wishlist</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Module 3: Returns & RMA */}
        <Link
          href="/account/returns"
          className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] hover:border-emerald-500/50 transition-all flex flex-col justify-between group shadow-lg hover:-translate-y-0.5"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
              Returns & Replacements
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              7-day doorstep pickup requests, RMA claim statuses, and instant refund ledgers.
            </p>
          </div>
          <div className="pt-4 flex items-center text-xs font-semibold text-emerald-400 gap-1">
            <span>Manage Returns</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </Link>
      </div>
    </div>
  );
}
