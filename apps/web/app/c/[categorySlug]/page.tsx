import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Filter, SlidersHorizontal, Star, ShieldCheck, Zap } from 'lucide-react';
import { ProductCard } from '../../../components/ProductCard';
import { fetchDynamicCatalog, searchCatalog } from '@/lib/catalog';

interface Props {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const categoryMeta: Record<string, { name: string; description: string; parent?: string }> = {
  electronics: {
    name: 'Electronics & Gadgets',
    description: 'Precision computing, flagship laptops, smartphones, and cutting-edge productivity gear.',
  },
  'audio-wearables': {
    name: 'Audio & Wearables',
    description: 'Audiophile active noise-canceling headphones, smart watches, true wireless earbuds, and acoustic monitors.',
    parent: 'Electronics',
  },
  fashion: {
    name: 'Fashion & Apparel',
    description: 'Architectural streetwear, premium cotton tees, footwear, bags, fragrances, and modern lifestyle essentials.',
  },
  'home-living': {
    name: 'Home & Living',
    description: 'Minimalist furniture, home decoration, ergonomic executive chairs, and artisanal kitchenware.',
  },
  gaming: {
    name: 'Gaming & Setup',
    description: 'Next-gen consoles, mechanical keyboards, esports peripherals, and gaming setup gear.',
  },
};

export default async function CategoryPage({ params, searchParams }: Props) {
  const { categorySlug } = await params;
  const currentCategory = categoryMeta[categorySlug];

  if (!currentCategory) {
    notFound();
  }

  const queryParams = await searchParams;
  const brand = queryParams.brand;
  const minPrice = queryParams.minPrice ? parseInt(queryParams.minPrice, 10) : undefined;
  const maxPrice = queryParams.maxPrice ? parseInt(queryParams.maxPrice, 10) : undefined;
  const minRating = queryParams.minRating ? parseFloat(queryParams.minRating) : undefined;
  const sort = (queryParams.sort as any) || 'relevance';
  const dealsOnly = queryParams.dealsOnly === 'true';

  // 1. Fetch live dynamic catalog (219+ products)
  const fullCatalog = await fetchDynamicCatalog();

  // 2. Filter products dynamically for this category
  const searchResult = searchCatalog(
    {
      category: categorySlug,
      brand,
      minPrice,
      maxPrice,
      minRating,
      sort,
      dealsOnly,
    },
    fullCatalog
  );

  const products = searchResult.items;
  const facets = searchResult.facets;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link href="/" className="hover:text-amber-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        {currentCategory.parent && (
          <>
            <span className="text-slate-400">{currentCategory.parent}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          </>
        )}
        <span className="text-slate-200 font-semibold">{currentCategory.name}</span>
      </nav>

      {/* Category Header */}
      <div className="border-b border-[#1F2433] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {currentCategory.name}
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
            {currentCategory.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/search?category=${categorySlug}`}
            className="text-xs px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold hover:bg-amber-500/20 transition-colors"
          >
            Open in Advanced Search &rarr;
          </Link>
        </div>
      </div>

      {/* Layout: Filters Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="space-y-6 bg-[#12151E] border border-[#1F2433] rounded-2xl p-5 sticky top-24 hidden lg:block">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F2433]">
            <span className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-400" />
              Faceted Filters
            </span>
            <Link
              href={`/c/${categorySlug}`}
              className="text-xs text-slate-400 hover:text-amber-400 transition-colors"
            >
              Reset All
            </Link>
          </div>

          {/* Delivery & Prime */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Fulfillment
            </h4>
            <label className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer select-none">
              <input type="checkbox" defaultChecked className="rounded border-slate-700 text-amber-500 focus:ring-amber-500/30" />
              <span className="text-cyan-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Nexus Prime Only
              </span>
            </label>
          </div>

          {/* Top Brands in this Category */}
          {facets.brands.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
                Brands ({facets.brands.length})
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                {facets.brands.slice(0, 10).map((b) => (
                  <Link
                    key={b.name}
                    href={`/c/${categorySlug}?brand=${encodeURIComponent(b.name)}`}
                    className="flex items-center justify-between py-1 px-1.5 rounded-lg hover:bg-[#161B26] text-slate-300 hover:text-amber-400 transition-colors"
                  >
                    <span className="truncate">{b.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({b.count})</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Price Range Filters */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Price (INR)
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <Link href={`/c/${categorySlug}?maxPrice=2000`} className="block hover:text-amber-400">
                Under ₹2,000
              </Link>
              <Link href={`/c/${categorySlug}?minPrice=2000&maxPrice=10000`} className="block hover:text-amber-400">
                ₹2,000 - ₹10,000
              </Link>
              <Link href={`/c/${categorySlug}?minPrice=10000&maxPrice=50000`} className="block hover:text-amber-400">
                ₹10,000 - ₹50,000
              </Link>
              <Link href={`/c/${categorySlug}`} className="block text-amber-400 font-semibold">
                All Prices
              </Link>
            </div>
          </div>

          {/* Customer Ratings */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Customer Rating
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              <Link href={`/c/${categorySlug}?minRating=4`} className="flex items-center gap-2 hover:text-amber-400">
                <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <span>4★ & above</span>
                  <Star className="w-3.5 h-3.5 fill-emerald-400" />
                </div>
              </Link>
              <Link href={`/c/${categorySlug}?minRating=3`} className="flex items-center gap-2 text-slate-400 hover:text-amber-400">
                <span>3★ & above</span>
              </Link>
            </div>
          </div>

          {/* Deals of the Day */}
          <div>
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Special Offers
            </h4>
            <Link
              href={`/c/${categorySlug}?dealsOnly=true`}
              className="flex items-center gap-1.5 text-xs text-amber-400 font-medium hover:underline"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Deals of the Day Only</span>
            </Link>
          </div>
        </aside>

        {/* Right Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#12151E] border border-[#1F2433]">
            <div className="text-xs text-slate-400">
              Showing <strong className="text-slate-100">{products.length} live products</strong> in {currentCategory.name}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Sort:
              </span>
              <div className="flex items-center gap-2 text-xs">
                <Link
                  href={`/c/${categorySlug}?sort=relevance`}
                  className={`px-2.5 py-1 rounded-lg ${sort === 'relevance' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Featured
                </Link>
                <Link
                  href={`/c/${categorySlug}?sort=price_asc`}
                  className={`px-2.5 py-1 rounded-lg ${sort === 'price_asc' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Price: Low &uarr;
                </Link>
                <Link
                  href={`/c/${categorySlug}?sort=rating`}
                  className={`px-2.5 py-1 rounded-lg ${sort === 'rating' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Top Rated
                </Link>
              </div>
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
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
        </div>
      </div>
    </div>
  );
}
