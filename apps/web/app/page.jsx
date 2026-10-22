import Link from 'next/link';
import { Sparkles, ArrowRight, TrendingDown, Flame, Laptop, Headphones, Shirt, Armchair, Gamepad2 } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CountdownTimer } from '../components/CountdownTimer';
import { getHomeDeals, getHomeBestsellers } from '@/lib/catalog';

export default async function HomePage() {
  const deals = await getHomeDeals();
  const bestsellers = await getHomeBestsellers();
  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO SECTION WITH SIGNATURE AI FINDER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#12151E] via-[#090A0F] to-[#090A0F] border-b border-[#1F2433] pt-12 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.08),transparent_40%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Next-Gen Precision Marketplace
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Intelligent commerce. <br />
              Direct from <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">top verified sellers.</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl">
              Skip the cluttered grid. Search 50,000+ products in plain English, track 90-day price trends, and checkout across multiple vendors in a single unified cart.
            </p>

            {/* AI Finder Interactive Prompt Box */}
            <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-[#12151E]/90 border border-cyan-500/40 shadow-2xl shadow-cyan-950/40 backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Ask the NEXUS AI Product Finder
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder='e.g. "a laptop under 60k for video editing" or "best ANC headphones for gym"'
                  className="flex-1 h-12 rounded-xl bg-slate-900/90 border border-slate-700 px-4 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <Link
                  href="/ai-finder"
                  className="h-12 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all flex-shrink-0"
                >
                  <span>Find Best Picks</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Quick suggestion pills */}
              <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-slate-400">
                <span className="text-slate-500 text-[11px]">Try queries:</span>
                <Link href="/ai-finder?q=laptop-under-60k" className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors">
                  "laptop under 60k"
                </Link>
                <Link href="/ai-finder?q=headphones-long-battery" className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors">
                  "ANC headphones 30h battery"
                </Link>
                <Link href="/ai-finder?q=heavyweight-cotton-tee" className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors">
                  "280 GSM cotton tees"
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY ICON TILES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Link href="/c/electronics" className="p-4 rounded-xl bg-[#12151E] border border-[#1F2433] hover:border-amber-500/50 flex flex-col items-center text-center gap-2.5 group transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-100 group-hover:text-amber-400 transition-colors">Electronics</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Laptops, Mics & Gear</p>
            </div>
          </Link>

          <Link href="/c/audio-wearables" className="p-4 rounded-xl bg-[#12151E] border border-[#1F2433] hover:border-amber-500/50 flex flex-col items-center text-center gap-2.5 group transition-all">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors">Audio & Earbuds</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Hi-Res & ANC</p>
            </div>
          </Link>

          <Link href="/c/fashion" className="p-4 rounded-xl bg-[#12151E] border border-[#1F2433] hover:border-amber-500/50 flex flex-col items-center text-center gap-2.5 group transition-all">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-100 group-hover:text-emerald-400 transition-colors">Fashion</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Supima Cotton & Outerwear</p>
            </div>
          </Link>

          <Link href="/c/home-living" className="p-4 rounded-xl bg-[#12151E] border border-[#1F2433] hover:border-amber-500/50 flex flex-col items-center text-center gap-2.5 group transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Armchair className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-100 group-hover:text-purple-400 transition-colors">Home & Living</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Desks & Studio Ceramics</p>
            </div>
          </Link>

          <Link href="/c/gaming" className="p-4 rounded-xl bg-[#12151E] border border-[#1F2433] hover:border-amber-500/50 flex flex-col items-center text-center gap-2.5 group transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-100 group-hover:text-rose-400 transition-colors">Gaming Setup</h4>
              <p className="text-[10px] text-slate-400 mt-0.5">PS5, Mechanical Keyboards</p>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. DEALS OF THE DAY WITH LIVE COUNTDOWN */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#12151E] to-[#12151E] border border-amber-500/30 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
                <Flame className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  Deals of the Day
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs font-semibold">
                    Up to 30% OFF
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verified lowest prices from official sellers. Refreshes every 24 hours.
                </p>
              </div>
            </div>

            {/* Live Countdown Badge */}
            <CountdownTimer variant="badge" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {deals.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS & CURATED PICKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Curated Bestsellers</h2>
            <p className="text-xs text-slate-400 mt-0.5">Top-rated tech and essentials with 4.7+ star verified reviews.</p>
          </div>
          <Link href="/c/electronics" className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
            <span>Explore All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>

      {/* 5. SIGNATURE DIFFERENTIATOR: PRICE DROP VAULT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-[#12151E] via-slate-900 to-cyan-950/40 border border-slate-800 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider">
              <TrendingDown className="w-3.5 h-3.5" />
              Automated Price History Tracker
            </div>
            <h3 className="text-2xl font-bold text-white">Never overpay again on high-ticket tech.</h3>
            <p className="text-sm text-slate-400">
              Every item has an open 30-day and 90-day price history chart. Set your target price, and NEXUS alerts you via SMS or WhatsApp the second a seller cuts prices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/ai-finder"
              className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20"
            >
              Explore AI Finder
            </Link>
            <Link
              href="/seller/register"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700"
            >
              Become a Seller
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
