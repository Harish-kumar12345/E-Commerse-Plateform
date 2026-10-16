'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Sparkles,
  Filter,
  ChevronRight,
  Star,
  Zap,
  ShieldCheck,
  Check,
  X,
  SlidersHorizontal,
  RotateCcw,
  Package,
} from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';
import { searchCatalog, MASTER_CATALOG, CatalogItem } from '@/lib/catalog';
import { formatPaiseToINR } from '@nexus/shared';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read URL search params
  const query = searchParams.get('q') || '';
  const currentCategory = searchParams.get('category') || 'all';
  const brandParam = searchParams.get('brand') || '';
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const minRatingParam = searchParams.get('minRating');
  const sortParam = (searchParams.get('sort') as any) || 'relevance';
  const dealsOnlyParam = searchParams.get('dealsOnly') === 'true';
  const inStockParam = searchParams.get('inStock') === 'true';
  const primeParam = searchParams.get('prime') === 'true';
  const minDiscountParam = searchParams.get('minDiscount');

  // Local state for custom price inputs
  const [customMin, setCustomMin] = useState(minPriceParam || '');
  const [customMax, setCustomMax] = useState(maxPriceParam || '');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Parse active selected brands into array
  const activeBrands = useMemo(() => {
    return brandParam ? brandParam.split(',').map((b) => b.trim()).filter(Boolean) : [];
  }, [brandParam]);

  // Initial instantaneous search from master catalog
  const initialResult = useMemo(() => {
    return searchCatalog({
      q: query,
      category: currentCategory !== 'all' ? currentCategory : undefined,
      brand: brandParam || undefined,
      minPrice: minPriceParam ? parseInt(minPriceParam, 10) : undefined,
      maxPrice: maxPriceParam ? parseInt(maxPriceParam, 10) : undefined,
      minRating: minRatingParam ? parseFloat(minRatingParam) : undefined,
      sort: sortParam,
      dealsOnly: dealsOnlyParam,
      inStockOnly: inStockParam,
      primeOnly: primeParam,
      minDiscount: minDiscountParam ? parseInt(minDiscountParam, 10) : undefined,
    });
  }, [
    query,
    currentCategory,
    brandParam,
    minPriceParam,
    maxPriceParam,
    minRatingParam,
    sortParam,
    dealsOnlyParam,
    inStockParam,
    primeParam,
    minDiscountParam,
  ]);

  // Dynamic async search result fetched from DummyJSON + local catalog
  const [dynamicResult, setDynamicResult] = useState<{
    items: CatalogItem[];
    total: number;
    facets: {
      brands: { name: string; count: number }[];
      categories: { slug: string; name: string; count: number }[];
      priceBounds: { min: number; max: number };
      totalMatching: number;
    };
  } | null>(null);

  useEffect(() => {
    let active = true;
    const url = `/api/search?${searchParams.toString()}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (active && data.success && data.items) {
          setDynamicResult({
            items: data.items,
            total: data.total,
            facets: data.facets,
          });
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [searchParams]);

  const searchResult = dynamicResult || initialResult;
  const { items: results, total, facets } = searchResult;

  // Helper to update URL search parameters
  const updateFilter = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, val] of Object.entries(updates)) {
      if (val === null || val === '' || val === 'all') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    }
    router.push(`/search?${params.toString()}`);
  };

  // Toggle brand selection
  const handleToggleBrand = (brandName: string) => {
    let nextBrands: string[];
    if (activeBrands.includes(brandName)) {
      nextBrands = activeBrands.filter((b) => b !== brandName);
    } else {
      nextBrands = [...activeBrands, brandName];
    }
    updateFilter({ brand: nextBrands.length > 0 ? nextBrands.join(',') : null });
  };

  // Apply custom price filter
  const handleApplyPrice = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter({
      minPrice: customMin.trim() ? customMin.trim() : null,
      maxPrice: customMax.trim() ? customMax.trim() : null,
    });
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setCustomMin('');
    setCustomMax('');
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : '/search');
  };

  // Check if any filter is active
  const hasActiveFilters = Boolean(
    brandParam ||
    minPriceParam ||
    maxPriceParam ||
    minRatingParam ||
    dealsOnlyParam ||
    inStockParam ||
    primeParam ||
    minDiscountParam ||
    (currentCategory && currentCategory !== 'all')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
        <Link href="/" className="hover:text-amber-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link href="/search" className="hover:text-amber-400 transition-colors">
          Search
        </Link>
        {query && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-medium truncate max-w-xs">&quot;{query}&quot;</span>
          </>
        )}
      </nav>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-[#1F2433] gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            {query ? (
              <>
                <span>Results for</span>
                <span className="text-amber-400">&quot;{query}&quot;</span>
              </>
            ) : (
              <span>All Products & Catalog</span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Showing <strong className="text-slate-200">{total}</strong> products across verified sellers with express delivery
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#161B26] border border-[#2B3245] text-xs font-semibold text-slate-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span>Filters {hasActiveFilters && '(Active)'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 hidden sm:inline">Sort by:</span>
            <select
              value={sortParam}
              onChange={(e) => updateFilter({ sort: e.target.value })}
              className="bg-[#12151E] border border-[#2B3245] text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="relevance">Featured & Relevant</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Avg. Customer Review</option>
              <option value="discount">Highest Discount %</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips / Pills */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-xl bg-[#12151E]/60 border border-[#1F2433]">
          <span className="text-xs text-slate-400 font-medium">Active Filters:</span>

          {currentCategory && currentCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs">
              Category: {currentCategory}
              <button type="button" onClick={() => updateFilter({ category: null })} title="Remove">
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}

          {activeBrands.map((b) => (
            <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs">
              Brand: {b}
              <button type="button" onClick={() => handleToggleBrand(b)} title="Remove">
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          ))}

          {(minPriceParam || maxPriceParam) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs">
              Price: ₹{minPriceParam || '0'} - ₹{maxPriceParam || 'Any'}
              <button type="button" onClick={() => updateFilter({ minPrice: null, maxPrice: null })} title="Remove">
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}

          {minRatingParam && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs">
              Rating: {minRatingParam}★ & up
              <button type="button" onClick={() => updateFilter({ minRating: null })} title="Remove">
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}

          {dealsOnlyParam && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs">
              Deals of the Day
              <button type="button" onClick={() => updateFilter({ dealsOnly: null })} title="Remove">
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}

          {primeParam && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-semibold">
              ⚡ NEXUS Prime
              <button type="button" onClick={() => updateFilter({ prime: null })} title="Remove">
                <X className="w-3 h-3 hover:text-white" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleClearAllFilters}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline ml-auto"
          >
            Clear All
          </button>
        </div>
      )}

      {/* 2-Column Amazon / Flipkart Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* LEFT SIDEBAR: FILTERS */}
        <aside className={`${mobileFilterOpen ? 'block' : 'hidden'} md:block md:col-span-1 space-y-6`}>
          <div className="rounded-xl bg-[#0F121A] border border-[#1F2433] p-4 divide-y divide-[#1F2433] space-y-5">
            {/* Category Filter */}
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                <span>Department</span>
                {currentCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => updateFilter({ category: null })}
                    className="text-[10px] text-amber-400 hover:underline capitalize font-normal"
                  >
                    All
                  </button>
                )}
              </h3>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <button
                    type="button"
                    onClick={() => updateFilter({ category: null })}
                    className={`w-full text-left py-1 px-2 rounded-lg transition-colors flex items-center justify-between ${
                      currentCategory === 'all'
                        ? 'bg-amber-500/10 text-amber-400 font-bold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-[#161B26]'
                    }`}
                  >
                    <span>All Departments</span>
                  </button>
                </li>
                {[
                  { slug: 'electronics', name: 'Electronics & Laptops' },
                  { slug: 'audio-wearables', name: 'Audio & Wearables' },
                  { slug: 'gaming', name: 'Gaming & Setup' },
                  { slug: 'fashion', name: 'Fashion & Apparel' },
                  { slug: 'home-living', name: 'Home & Living' },
                ].map((cat) => (
                  <li key={cat.slug}>
                    <button
                      type="button"
                      onClick={() => updateFilter({ category: cat.slug })}
                      className={`w-full text-left py-1 px-2 rounded-lg transition-colors flex items-center justify-between ${
                        currentCategory === cat.slug
                          ? 'bg-amber-500/10 text-amber-400 font-bold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#161B26]'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Delivery / Prime Toggle */}
            <div className="pt-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5">
                Delivery Day
              </h3>
              <label className="flex items-center gap-2 cursor-pointer group text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={primeParam}
                  onChange={(e) => updateFilter({ prime: e.target.checked ? 'true' : null })}
                  className="rounded border-[#2B3245] bg-[#161B26] text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                />
                <span className="flex items-center gap-1 font-semibold text-amber-400">
                  <Zap className="w-3.5 h-3.5 fill-amber-400" />
                  NEXUS Prime
                </span>
                <span className="text-[10px] text-slate-500">(Same Day)</span>
              </label>
            </div>

            {/* Customer Rating Filter */}
            <div className="pt-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5">
                Customer Reviews
              </h3>
              <div className="space-y-1.5 text-xs">
                {[4, 3, 2].map((stars) => (
                  <button
                    key={stars}
                    type="button"
                    onClick={() =>
                      updateFilter({ minRating: minRatingParam === String(stars) ? null : String(stars) })
                    }
                    className={`w-full text-left py-1 px-2 rounded-lg flex items-center gap-2 transition-colors ${
                      minRatingParam === String(stars)
                        ? 'bg-amber-500/10 text-amber-400 font-semibold'
                        : 'text-slate-300 hover:bg-[#161B26]'
                    }`}
                  >
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < stars ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span>& Up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter (Presets & Custom Inputs) */}
            <div className="pt-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5">
                Price Range (₹)
              </h3>
              <div className="space-y-1 text-xs mb-3">
                {[
                  { label: 'Under ₹2,000', min: null, max: '2000' },
                  { label: '₹2,000 - ₹10,000', min: '2000', max: '10000' },
                  { label: '₹10,000 - ₹30,000', min: '1000', max: '30000' },
                  { label: '₹30,000 - ₹1,00,000', min: '30000', max: '100000' },
                  { label: 'Over ₹1,00,000', min: '100000', max: null },
                ].map((tier, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => updateFilter({ minPrice: tier.min, maxPrice: tier.max })}
                    className="w-full text-left py-0.5 px-2 text-slate-400 hover:text-amber-400 rounded transition-colors"
                  >
                    {tier.label}
                  </button>
                ))}
              </div>

              {/* Custom Min / Max inputs */}
              <form onSubmit={handleApplyPrice} className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={customMin}
                  onChange={(e) => setCustomMin(e.target.value)}
                  className="w-full h-8 px-2 rounded-lg bg-[#161B26] border border-[#2B3245] text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
                <span className="text-slate-500 text-xs">-</span>
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={customMax}
                  onChange={(e) => setCustomMax(e.target.value)}
                  className="w-full h-8 px-2 rounded-lg bg-[#161B26] border border-[#2B3245] text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="h-8 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors flex-shrink-0"
                >
                  Go
                </button>
              </form>
            </div>

            {/* Dynamic Brands Filter */}
            <div className="pt-4">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2.5">
                Brands
              </h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                {facets.brands.map((b: { name: string; count: number }) => {
                  const isChecked = activeBrands.includes(b.name);
                  return (
                    <label
                      key={b.name}
                      className="flex items-center justify-between cursor-pointer py-1 px-1.5 rounded-lg hover:bg-[#161B26] text-slate-300 group transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleBrand(b.name)}
                          className="rounded border-[#2B3245] bg-[#161B26] text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                        />
                        <span className={`group-hover:text-white ${isChecked ? 'text-amber-400 font-semibold' : ''}`}>
                          {b.name}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">({b.count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Special Deals & Availability */}
            <div className="pt-4 space-y-2.5">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Deals & Availability
              </h3>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={dealsOnlyParam}
                  onChange={(e) => updateFilter({ dealsOnly: e.target.checked ? 'true' : null })}
                  className="rounded border-[#2B3245] bg-[#161B26] text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-rose-400 font-medium">Deals of the Day</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={inStockParam}
                  onChange={(e) => updateFilter({ inStock: e.target.checked ? 'true' : null })}
                  className="rounded border-[#2B3245] bg-[#161B26] text-amber-500 focus:ring-amber-500 focus:ring-offset-0 cursor-pointer"
                />
                <span>Exclude Out of Stock</span>
              </label>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN AREA: PRODUCT RESULTS GRID */}
        <main className="md:col-span-3 lg:col-span-4">
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  slug={product.slug}
                  brand={product.brand}
                  sellerName={product.sellerName}
                  primaryImage={product.primaryImage}
                  priceInPaise={product.priceInPaise}
                  compareAtInPaise={product.compareAtInPaise}
                  avgRating={product.avgRating}
                  reviewCount={product.reviewCount}
                  isDealOfTheDay={product.isDealOfTheDay}
                  isInStock={product.isInStock}
                />
              ))}
            </div>
          ) : (
            /* ZERO RESULTS EMPTY STATE (Amazon / Flipkart smart recommendation fallback) */
            <div className="rounded-2xl border border-[#1F2433] bg-[#0E121B] p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-100">
                No matching products found for &quot;{query || 'your filters'}&quot;
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 mb-6">
                Try loosening your filters, checking for spelling errors, or browsing our top trending Indian categories below.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-lg shadow-amber-500/20"
                >
                  Clear All Filters
                </button>
                <Link
                  href="/ai-finder"
                  className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-medium text-xs hover:bg-cyan-500/20 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Try AI Product Finder
                </Link>
              </div>

              {/* Recommended Top Sellers */}
              <div className="pt-6 border-t border-[#1F2433] text-left">
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Popular Trending Products You Might Like</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MASTER_CATALOG.slice(0, 4).map((item) => (
                    <ProductCard
                      key={item.id}
                      id={item.id}
                      title={item.title}
                      slug={item.slug}
                      brand={item.brand}
                      sellerName={item.sellerName}
                      primaryImage={item.primaryImage}
                      priceInPaise={item.priceInPaise}
                      compareAtInPaise={item.compareAtInPaise}
                      avgRating={item.avgRating}
                      reviewCount={item.reviewCount}
                      isDealOfTheDay={item.isDealOfTheDay}
                      isInStock={item.isInStock}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400">
          <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-xs">Loading search results...</p>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
