'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Search,
  Sliders,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowRight,

  Star,

  Zap,
  RefreshCw,
  Cpu,
  Layers,

} from 'lucide-react';
import { formatPaiseToINR, calculateDiscountPercent } from '@nexus/shared';





















export default function AiFinderPage() {
  const [query, setQuery] = useState('');
  const [maxBudget, setMaxBudget] = useState(100000); // in Rupees (default 1 Lakh)
  const [useMaxBudget, setUseMaxBudget] = useState(false);
  const [priority, setPriority] = useState('balanced');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearching, setIsSearching] = useState(false);
  const [searchStep, setSearchStep] = useState(0);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [addedItems, setAddedItems] = useState({});

  const samplePrompts = [
    'Wireless noise-canceling headphones under ₹30,000 for work & long flights',
    'Fast coding laptop with 16GB RAM and long battery life',
    'Ergonomic wireless mouse with quiet clicks for multi-monitor setup',
    'Custom mechanical keyboard with tactile switches for software developers',
    'Height-adjustable standing desk for home office to relieve back pain',
    'Weatherproof utility jacket with Cordura fabric and waterproof zippers',
    'Heavyweight oversized Supima cotton tee for streetwear style',
    'Next-gen 4K gaming console with 1TB SSD storage',
  ];

  // Auto-run default curated search on mount
  useEffect(() => {
    handleSearch('Wireless noise-canceling headphones for deep work and travel under 30k');
  }, []);

  const handleSearch = async (overrideQuery) => {
    const q = (overrideQuery !== undefined ? overrideQuery : query).trim();
    if (!q) return;

    if (overrideQuery) setQuery(overrideQuery);
    setIsSearching(true);
    setSearchStep(1);

    // Multi-stage thinking animation
    const stepTimer1 = setTimeout(() => setSearchStep(2), 400);
    const stepTimer2 = setTimeout(() => setSearchStep(3), 800);

    try {
      const budgetPaise = useMaxBudget ? maxBudget * 100 : undefined;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const res = await fetch(`${apiUrl.replace(/\/+$/, '')}/ai-finder/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          maxBudgetPaise: budgetPaise,
          categorySlug: selectedCategory !== 'all' ? selectedCategory : undefined,
          priority,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data.results) {
          setResults(json.data.results);
        }
      } else {
        // Fallback simulation if API server is not running during static build
        fallbackLocalMatching(q);
      }
    } catch (e) {
      fallbackLocalMatching(q);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setTimeout(() => {
        setIsSearching(false);
        setHasSearched(true);
        setSearchStep(0);
      }, 950);
    }
  };

  const fallbackLocalMatching = (q) => {
    const qLower = q.toLowerCase();
    const mockData = [
      {
        id: 'prod-1',
        title: 'Sony WH-1000XM5 Wireless Active Noise Canceling Headphones',
        slug: 'sony-wh-1000xm5-wireless-anc-headphones',
        brand: 'Sony',
        categoryName: 'Audio & Wearables',
        categorySlug: 'audio-wearables',
        priceInPaise: 2799000,
        compareAtInPaise: 3499000,
        avgRating: 4.8,
        reviewCount: 328,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        matchScore: 98,
        fitsBudget: true,
        verdict: 'Industry-leading Auto NC Optimizer completely isolates ambient office noise and flight drone, while the 30-hour battery satisfies long flights.',
        specHighlights: ['30-Hour Battery with 3-Min Fast Charge', 'Dual V1/QN1 Processors with 8 Microphones', 'Multipoint Bluetooth 5.2 & Wired 3.5mm'],
        tradeoffs: 'Non-folding earcups; requires the included structured carrying case for compact travel.',
        pros: ['Highest noise reduction benchmark', 'Crystal-clear 4-mic beamforming audio', 'Ultra-soft protein leather'],
      },
      {
        id: 'prod-2',
        title: 'Apple MacBook Air 15-inch M3 Chip (16GB Unified Memory, 512GB SSD)',
        slug: 'apple-macbook-air-15-m3-16gb-512gb',
        brand: 'Apple',
        categoryName: 'Electronics & Gadgets',
        categorySlug: 'electronics',
        priceInPaise: 15490000,
        compareAtInPaise: 17490000,
        avgRating: 4.9,
        reviewCount: 194,
        imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
        matchScore: 94,
        fitsBudget: maxBudget >= 150000 || !useMaxBudget,
        verdict: 'Silent, fanless architecture with massive 18-hour battery endurance. 16GB memory effortlessly handles multiple IDEs, Docker, and 4K renders.',
        specHighlights: ['Apple M3 8-Core CPU / 10-Core GPU', '16GB Unified High-Bandwidth RAM', '15.3-inch Liquid Retina Display (500 nits)'],
        tradeoffs: 'Premium upfront investment; internal components are factory-soldered and cannot be upgraded later.',
        pros: ['Completely silent zero-fan operation', 'Industry-benchmark battery life', 'Spacious high-res display'],
      },
      {
        id: 'prod-3',
        title: 'Logitech MX Master 3S Wireless Performance Mouse',
        slug: 'logitech-mx-master-3s-wireless-mouse',
        brand: 'Logitech',
        categoryName: 'Electronics & Gadgets',
        categorySlug: 'electronics',
        priceInPaise: 899500,
        compareAtInPaise: 1099500,
        avgRating: 4.7,
        reviewCount: 512,
        imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
        matchScore: 91,
        fitsBudget: true,
        verdict: 'Quiet clicks reduce acoustic fatigue in shared office environments. MagSpeed wheel scrolls 1,000 lines/sec across codebases.',
        specHighlights: ['8,000 DPI Darkfield Track-on-Glass Sensor', 'MagSpeed Electromagnetic Wheel', '70-Day Battery with USB-C Quick Charge'],
        tradeoffs: 'Ergonomically contoured strictly for right-handed users.',
        pros: ['Zero click noise', 'Instant multi-device Flow switching', 'Exceptional wrist support'],
      },
    ];

    if (qLower.includes('laptop') || qLower.includes('macbook') || qLower.includes('code') || qLower.includes('programming')) {
      // Re-order to put laptop first
      const [first, second, ...rest] = mockData;
      setResults([second, first, ...rest]);
    } else {
      setResults(mockData);
    }
  };

  const handleAddToCart = (item) => {
    setAddedItems((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item.id]: false }));
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold tracking-wide uppercase shadow-lg shadow-cyan-500/10 animate-pulse">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>NEXUS Cognitive Discovery Engine v1.0</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Find Exactly What You Need with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-400">
              Natural Language
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            State your real-world requirement, budget constraints, or specific use-case. Our neural matching algorithm
            evaluates spec trade-offs, price histories, and verified buyer reviews.
          </p>
        </div>

        {/* Interactive Query Box */}
        <div className="bg-[#12151E] border border-[#1F2433] rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle Cyber Glow Line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-amber-500" />

          <div className="space-y-5">
            {/* Main Input Row */}
            <div className="relative flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="e.g. Wireless noise-canceling headphones for gym workouts under ₹10,000..."
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-[#090A0F] border border-[#1F2433] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-sm sm:text-base transition-all"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4.5" />
              </div>

              <button
                onClick={() => handleSearch()}
                disabled={isSearching || !query.trim()}
                className="h-14 px-8 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Analyze & Match</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Inspiration Prompt Chips */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-medium">Try asking for:</span>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.slice(0, 5).map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(prompt)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-[#090A0F] hover:bg-[#1A1F2C] border border-[#1F2433] hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-all text-left truncate max-w-xs sm:max-w-none"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Faceted Parameter Tuning Controls */}
            <div className="pt-4 border-t border-[#1F2433]/70 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Budget Limit Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-400" />
                    Max Budget Ceiling
                  </span>
                  <button
                    onClick={() => setUseMaxBudget(!useMaxBudget)}
                    className={`font-mono text-xs px-2 py-0.5 rounded ${
                      useMaxBudget ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-500'
                    }`}
                  >
                    {useMaxBudget ? `₹${maxBudget.toLocaleString('en-IN')}` : 'Any Budget (Auto)'}
                  </button>
                </div>
                {useMaxBudget && (
                  <input
                    type="range"
                    min="2000"
                    max="200000"
                    step="1000"
                    value={maxBudget}
                    onChange={(e) => setMaxBudget(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                )}
                <div className="flex gap-1.5 text-[11px] text-slate-400">
                  <button
                    onClick={() => {
                      setUseMaxBudget(true);
                      setMaxBudget(10000);
                    }}
                    className="px-2 py-0.5 rounded bg-[#090A0F] hover:text-white border border-[#1F2433]"
                  >
                    ≤ ₹10k
                  </button>
                  <button
                    onClick={() => {
                      setUseMaxBudget(true);
                      setMaxBudget(30000);
                    }}
                    className="px-2 py-0.5 rounded bg-[#090A0F] hover:text-white border border-[#1F2433]"
                  >
                    ≤ ₹30k
                  </button>
                  <button
                    onClick={() => {
                      setUseMaxBudget(true);
                      setMaxBudget(75000);
                    }}
                    className="px-2 py-0.5 rounded bg-[#090A0F] hover:text-white border border-[#1F2433]"
                  >
                    ≤ ₹75k
                  </button>
                  <button
                    onClick={() => {
                      setUseMaxBudget(true);
                      setMaxBudget(160000);
                    }}
                    className="px-2 py-0.5 rounded bg-[#090A0F] hover:text-white border border-[#1F2433]"
                  >
                    ≤ ₹1.6L
                  </button>
                </div>
              </div>

              {/* Priority Objective */}
              <div className="space-y-2">
                <span className="text-xs text-slate-300 font-semibold block">Decision Priority</span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {[
                    { id: 'balanced', label: 'Balanced Spec' },
                    { id: 'performance', label: 'Top Performance' },
                    { id: 'value', label: 'Max Discount / Deal' },
                    { id: 'rating', label: 'Highest Rated' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPriority(p.id )}
                      className={`px-2.5 py-1.5 rounded-lg border text-left transition-all ${
                        priority === p.id
                          ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300 font-semibold'
                          : 'bg-[#090A0F] border-[#1F2433] text-slate-400 hover:text-white'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Category */}
              <div className="space-y-2">
                <span className="text-xs text-slate-300 font-semibold block">Target Category</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-[#090A0F] border border-[#1F2433] text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="all">All Product Categories</option>
                  <option value="electronics">Electronics & Gadgets</option>
                  <option value="audio-wearables">Audio & Wearables</option>
                  <option value="fashion">Fashion & Apparel</option>
                  <option value="home-living">Home & Living</option>
                  <option value="gaming">Gaming & Custom Setups</option>
                </select>
                <span className="text-[11px] text-slate-500 block">
                  Scans all verified merchants with real-time stock sync
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic AI Reasoning Stage Visualizer */}
        {isSearching && (
          <div className="bg-[#12151E] border border-cyan-500/30 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center animate-spin">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Synthesizing Decision Vector...</h3>
                <p className="text-xs text-slate-400">Evaluating multi-seller inventory against semantic prompt</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div
                className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                  searchStep >= 1
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                    : 'bg-[#090A0F] border-[#1F2433] text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>1. Parsing Intent</span>
                </div>
                <p className="text-[11px] text-slate-400">Extracted budget constraints & domain keywords</p>
              </div>

              <div
                className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                  searchStep >= 2
                    ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300'
                    : 'bg-[#090A0F] border-[#1F2433] text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Layers className="w-3.5 h-3.5" />
                  <span>2. Filtering Catalog</span>
                </div>
                <p className="text-[11px] text-slate-400">Auditing active variants, stock availability & GST compliance</p>
              </div>

              <div
                className={`p-3 rounded-xl border text-xs space-y-1 transition-all ${
                  searchStep >= 3
                    ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                    : 'bg-[#090A0F] border-[#1F2433] text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>3. Explainability Verdict</span>
                </div>
                <p className="text-[11px] text-slate-400">Computing match confidence scores and trade-off points</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Container */}
        {hasSearched && !isSearching && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#1F2433] pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span>Ranked AI Recommendations</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    {results.length} Found
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Ranked by contextual fit, verified reviews, and price-to-performance ratio
                </p>
              </div>
            </div>

            {results.length === 0 ? (
              <div className="text-center py-12 bg-[#12151E] rounded-2xl border border-[#1F2433] space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <h3 className="text-base font-bold text-white">No Direct Matches Found</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Try broadening your budget threshold or modifying search terms (e.g., &quot;wireless headphones&quot; or &quot;coding laptop&quot;).
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {results.map((item, index) => {
                  const discountPct = item.compareAtInPaise
                    ? calculateDiscountPercent(item.compareAtInPaise, item.priceInPaise)
                    : null;
                  const isAdded = addedItems[item.id];

                  return (
                    <div
                      key={item.id}
                      className="bg-[#12151E] border border-[#1F2433] hover:border-cyan-500/50 rounded-2xl p-5 sm:p-7 shadow-xl transition-all duration-300 relative group overflow-hidden"
                    >
                      {/* Top Rank + Match Score Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-mono font-bold text-xs flex items-center justify-center border border-amber-500/30">
                            #{index + 1}
                          </span>
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {item.brand} • {item.categoryName}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-cyan-500/10">
                            <Zap className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{item.matchScore}% Match Confidence</span>
                          </div>

                          {item.fitsBudget && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Within Budget
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Product Image & Fast Links */}
                        <div className="lg:col-span-3 flex flex-col items-center">
                          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#090A0F] border border-[#1F2433] group-hover:scale-105 transition-transform duration-300">
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 300px"
                            />
                            {discountPct && (
                              <div className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-xs font-extrabold px-2 py-0.5 rounded shadow">
                                {discountPct}% OFF
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-2 mt-3 text-xs text-amber-400">
                            <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span className="font-bold">{item.avgRating.toFixed(1)}</span>
                            </div>
                            <span className="text-slate-500">({item.reviewCount} verified reviews)</span>
                          </div>
                        </div>

                        {/* Middle Details & AI Explainability Verdict */}
                        <div className="lg:col-span-6 space-y-4">
                          <div>
                            <Link
                              href={`/p/${item.slug}`}
                              className="text-base sm:text-lg font-bold text-white hover:text-cyan-400 transition-colors line-clamp-2"
                            >
                              {item.title}
                            </Link>
                          </div>

                          {/* "Why this fits your query" Explainability Callout */}
                          <div className="bg-gradient-to-r from-cyan-950/40 via-[#12151E] to-[#12151E] border border-cyan-500/30 rounded-xl p-3.5 space-y-1.5">
                            <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Why Nexus Recommends This:</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                              {item.verdict}
                            </p>
                          </div>

                          {/* Key Spec Highlights */}
                          <div className="space-y-1.5">
                            <span className="text-xs text-slate-400 font-semibold block">Spec Highlights:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                              {item.specHighlights.map((spec, sIdx) => (
                                <div
                                  key={sIdx}
                                  className="flex items-center gap-2 text-slate-300 bg-[#090A0F] px-2.5 py-1.5 rounded-lg border border-[#1F2433]"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                  <span className="truncate">{spec}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Trade-offs to Consider */}
                          {item.tradeoffs && (
                            <div className="flex items-start gap-2 text-xs text-slate-400 bg-amber-500/5 border border-amber-500/20 rounded-lg p-2.5">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                              <span>
                                <strong className="text-amber-300">Trade-off to consider:</strong> {item.tradeoffs}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Right Pricing & Direct Actions */}
                        <div className="lg:col-span-3 bg-[#090A0F] border border-[#1F2433] rounded-xl p-4 flex flex-col justify-between space-y-4 h-full">
                          <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl sm:text-2xl font-black text-white font-mono">
                                {formatPaiseToINR(item.priceInPaise)}
                              </span>
                              {item.compareAtInPaise && (
                                <span className="text-xs text-slate-500 line-through font-mono">
                                  {formatPaiseToINR(item.compareAtInPaise)}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-emerald-400 font-medium block">
                              Free Express Delivery with Prime
                            </span>
                          </div>

                          <div className="space-y-2 pt-2">
                            <button
                              onClick={() => handleAddToCart(item)}
                              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                                isAdded
                                  ? 'bg-emerald-500 text-slate-950 scale-95'
                                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
                              }`}
                            >
                              <ShoppingBag className="w-4 h-4" />
                              <span>{isAdded ? 'Added to Cart!' : 'Add to Cart'}</span>
                            </button>

                            <Link
                              href={`/p/${item.slug}`}
                              className="w-full py-2.5 px-4 rounded-xl bg-[#12151E] hover:bg-[#1A1F2C] border border-[#1F2433] hover:border-cyan-500/50 text-slate-200 hover:text-cyan-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                            >
                              <span>360° Studio & Specs</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
