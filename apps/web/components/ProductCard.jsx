import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ShieldCheck, Zap } from 'lucide-react';
import { formatPaiseToINR, calculateDiscountPercent } from '@nexus/shared';
















export function ProductCard({
  title,
  slug,
  brand,
  sellerName,
  primaryImage,
  priceInPaise,
  compareAtInPaise,
  avgRating,
  reviewCount,
  isDealOfTheDay = false,
  isInStock = true,
}) {
  const discountPct = calculateDiscountPercent(compareAtInPaise, priceInPaise);

  return (
    <div className="group relative rounded-xl bg-[#12151E] border border-[#1F2433] hover:border-slate-700 p-3.5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-black/50 hover:-translate-y-0.5">
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-slate-900 mb-3">
          <Image
            src={primaryImage}
            alt={title}
            fill
            unoptimized
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />

          {/* Deal badge */}
          {isDealOfTheDay && (
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-md">
              <Zap className="w-3 h-3 fill-slate-950" />
              Deal of Day
            </div>
          )}

          {/* Discount Tag */}
          {discountPct > 0 && !isDealOfTheDay && (
            <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-rose-500/90 text-white font-bold text-[10px] tracking-wide">
              {discountPct}% OFF
            </div>
          )}
        </div>

        {/* Brand & Seller Info */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
          <span className="font-semibold text-slate-300 uppercase tracking-wider">{brand}</span>
          <span className="flex items-center gap-1 text-[10px] text-slate-500">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            {sellerName}
          </span>
        </div>

        {/* Title */}
        <Link href={`/p/${slug}`} className="block">
          <h3 className="text-xs sm:text-sm font-medium text-slate-100 line-clamp-2 group-hover:text-amber-400 transition-colors leading-snug">
            {title}
          </h3>
        </Link>

        {/* Ratings & Verified Buyer Count */}
        <div className="flex items-center gap-1.5 mt-2">
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <span>{avgRating.toFixed(1)}</span>
            <Star className="w-3 h-3 fill-emerald-400" />
          </div>
          <span className="text-[11px] text-slate-400 font-mono">({reviewCount})</span>
        </div>
      </div>

      {/* Pricing & Add to Cart */}
      <div className="mt-3 pt-3 border-t border-[#1F2433]">
        <div className="flex items-baseline gap-2">
          <span className="text-base sm:text-lg font-bold text-slate-50 tracking-tight">
            {formatPaiseToINR(priceInPaise)}
          </span>
          {compareAtInPaise && compareAtInPaise > priceInPaise && (
            <span className="text-xs text-slate-500 line-through">
              {formatPaiseToINR(compareAtInPaise)}
            </span>
          )}
        </div>

        <div className="mt-2.5">
          {isInStock ? (
            <Link
              href={`/p/${slug}`}
              className="w-full h-8 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition-all border border-slate-700 hover:border-amber-500"
            >
              View Options
            </Link>
          ) : (
            <div className="w-full h-8 flex items-center justify-center rounded-lg bg-slate-900 text-slate-500 text-xs font-medium cursor-not-allowed">
              Out of Stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
