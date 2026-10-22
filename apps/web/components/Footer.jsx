import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#090A0F] border-t border-[#1F2433] mt-20 text-slate-400 text-xs">
      {/* Trust Guarantee Badges */}
      <div className="border-b border-[#1F2433] bg-[#12151E]/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 text-sm">100% Genuine</h4>
                <p className="text-slate-400 mt-0.5">Verified sellers with official brand warranty.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 text-sm">Express Shipping</h4>
                <p className="text-slate-400 mt-0.5">Shiprocket courier tracking across 26,000+ PIN codes.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 text-sm">Hassle-Free Returns</h4>
                <p className="text-slate-400 mt-0.5">7-day doorstep pickup & instant refund.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 text-sm">Secure Payments</h4>
                <p className="text-slate-400 mt-0.5">UPI, Cards, Netbanking & COD with OTP check.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Links Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h5 className="font-semibold text-slate-200 text-sm uppercase tracking-wider mb-4">
              Shop Categories
            </h5>
            <ul className="space-y-2.5">
              <li><Link href="/c/electronics" className="hover:text-amber-400 transition-colors">Laptops & Computers</Link></li>
              <li><Link href="/c/audio-wearables" className="hover:text-amber-400 transition-colors">Studio Headphones & Earbuds</Link></li>
              <li><Link href="/c/fashion" className="hover:text-amber-400 transition-colors">Heavyweight Cotton Apparel</Link></li>
              <li><Link href="/c/home-living" className="hover:text-amber-400 transition-colors">Ceramics & Work Desks</Link></li>
              <li><Link href="/c/gaming" className="hover:text-amber-400 transition-colors">Gaming Consoles & Gear</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-slate-200 text-sm uppercase tracking-wider mb-4">
              Seller Services
            </h5>
            <ul className="space-y-2.5">
              <li><Link href="/seller/register" className="hover:text-amber-400 transition-colors">Sell on NEXUS</Link></li>
              <li><Link href="/seller/dashboard" className="hover:text-amber-400 transition-colors">Seller Central Login</Link></li>
              <li><Link href="/seller/rates" className="hover:text-amber-400 transition-colors">Commission Structure & Payouts</Link></li>
              <li><Link href="/seller/fulfillment" className="hover:text-amber-400 transition-colors">Fulfillment by NEXUS</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-slate-200 text-sm uppercase tracking-wider mb-4">
              Customer Care
            </h5>
            <ul className="space-y-2.5">
              <li><Link href="/account/orders" className="hover:text-amber-400 transition-colors">Your Orders</Link></li>
              <li><Link href="/track" className="hover:text-amber-400 transition-colors">Track Package</Link></li>
              <li><Link href="/returns" className="hover:text-amber-400 transition-colors">Return Policy & RMA</Link></li>
              <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Help & Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-slate-200 text-sm uppercase tracking-wider mb-4">
              NEXUS Intelligence
            </h5>
            <ul className="space-y-2.5">
              <li><Link href="/ai-finder" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">AI Natural Language Finder</Link></li>
              <li><Link href="/deals" className="hover:text-amber-400 transition-colors">Deals of the Day</Link></li>
              <li><Link href="/prime" className="hover:text-amber-400 transition-colors">Nexus Prime Membership</Link></li>
              <li><Link href="/price-history" className="hover:text-amber-400 transition-colors">Price History Tracker</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1F2433] mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 NEXUS Bazaar Technologies India Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/legal/terms" className="hover:text-slate-400">Terms of Service</Link>
            <Link href="/legal/privacy" className="hover:text-slate-400">Privacy Policy</Link>
            <Link href="/legal/grievance" className="hover:text-slate-400">Grievance Officer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
