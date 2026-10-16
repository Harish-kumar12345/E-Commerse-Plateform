'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  User,
  Sparkles,
  Zap,
  ShieldCheck,
  X,
  TrendingUp,
  ChevronDown,
  ArrowRight,
  Star,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { formatPaiseToINR } from '@nexus/shared';
import { getCartTotalCount } from '@/lib/cart';
import { getStoredUser, logout, AuthUser } from '@/lib/auth';

interface AutocompleteProduct {
  id: string;
  title: string;
  slug: string;
  brand: string;
  priceInPaise: number;
  compareAtInPaise?: number | null;
  primaryImage: string;
  avgRating: number;
  isDealOfTheDay?: boolean;
}

interface AutocompleteCategory {
  slug: string;
  name: string;
  count: number;
}

export function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestedCategories, setSuggestedCategories] = useState<AutocompleteCategory[]>([]);
  const [suggestedProducts, setSuggestedProducts] = useState<AutocompleteProduct[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([
    'MacBook Air M3',
    'Sony WH-1000XM5',
    'iPhone 16 Pro',
    'Logitech MX Master',
    'Nike Air Force 1',
    'PlayStation 5',
  ]);
  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  // Sync cart count & auth user session
  useEffect(() => {
    setCartCount(getCartTotalCount());
    setCurrentUser(getStoredUser());

    const handleCartSync = () => setCartCount(getCartTotalCount());
    const handleAuthSync = () => setCurrentUser(getStoredUser());

    window.addEventListener('nexus-cart-updated', handleCartSync);
    window.addEventListener('nexus-auth-updated', handleAuthSync);

    return () => {
      window.removeEventListener('nexus-cart-updated', handleCartSync);
      window.removeEventListener('nexus-auth-updated', handleAuthSync);
    };
  }, []);

  // Debounced autocomplete fetch
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setSuggestedCategories([]);
      setSuggestedProducts([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const catParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
        const res = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(searchQuery.trim())}${catParam}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setSuggestions(data.suggestions || []);
            setSuggestedCategories(data.categories || []);
            setSuggestedProducts(data.products || []);
            setTotalMatches(data.totalCount || 0);
          }
        }
      } catch (err) {
        // Silent catch for autocomplete
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  // Click outside listener to close suggestions & account menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent, customQuery?: string, customCategory?: string) => {
    if (e) e.preventDefault();
    const queryToUse = customQuery !== undefined ? customQuery : searchQuery;
    const catToUse = customCategory !== undefined ? customCategory : selectedCategory;

    setIsFocused(false);
    if (!queryToUse.trim() && catToUse === 'all') {
      router.push('/search');
      return;
    }

    const params = new URLSearchParams();
    if (queryToUse.trim()) params.set('q', queryToUse.trim());
    if (catToUse && catToUse !== 'all') params.set('category', catToUse);

    router.push(`/search?${params.toString()}`);
  };

  const handleSelectSuggestion = (text: string) => {
    setSearchQuery(text);
    handleSearchSubmit(undefined, text);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1F2433] bg-[#090A0F]/95 backdrop-blur-md">
      {/* Top Prime announcement bar */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-cyan-500/10 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-300 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>
            <strong>NEXUS Prime Days:</strong> Free same-day delivery on 50,000+ items across India with instant warranty.
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-slate-400 text-xs">
          <Link href="/seller/register" className="hover:text-amber-400 transition-colors">
            Sell on NEXUS
          </Link>
          <span>|</span>
          <Link href="/account" className="hover:text-amber-400 transition-colors">
            Track Order
          </Link>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center font-black text-slate-950 text-xl tracking-tighter shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              N
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-wider text-slate-100 flex items-center gap-1">
                NEXUS
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </span>
              <span className="text-[10px] text-slate-400 tracking-widest uppercase -mt-1 font-mono">
                Bazaar
              </span>
            </div>
          </Link>

          {/* Amazon / Flipkart Style Dynamic Search Bar */}
          <div className="flex-1 max-w-3xl mx-2 relative" ref={dropdownRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              {/* Category selector on left (Amazon style) */}
              <div className="hidden md:flex items-center h-10 px-3 bg-[#161B26] border-y border-l border-[#2B3245] rounded-l-xl text-xs text-slate-300 font-medium hover:bg-[#1E2433] cursor-pointer transition-colors">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent text-slate-300 focus:outline-none cursor-pointer pr-1"
                >
                  <option value="all" className="bg-[#12151E] text-slate-200">All</option>
                  <option value="electronics" className="bg-[#12151E] text-slate-200">Electronics</option>
                  <option value="audio-wearables" className="bg-[#12151E] text-slate-200">Audio</option>
                  <option value="fashion" className="bg-[#12151E] text-slate-200">Fashion</option>
                  <option value="gaming" className="bg-[#12151E] text-slate-200">Gaming</option>
                  <option value="home-living" className="bg-[#12151E] text-slate-200">Home</option>
                </select>
              </div>

              {/* Main Search Input */}
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  placeholder="Search 50,000+ products (e.g. MacBook, Sony ANC, Nike, PS5)..."
                  aria-label="Search 50,000+ products, electronics, sneakers, audio"
                  className="w-full h-10 pl-3 md:pl-4 pr-16 md:rounded-none rounded-l-xl bg-[#12151E] border border-[#2B3245] text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />

                {/* Clear button */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      inputRef.current?.focus();
                    }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* AI Finder Icon in Search */}
                <Link
                  href="/ai-finder"
                  aria-label="AI Natural Language Product Finder"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-cyan-400 hover:text-cyan-300"
                  title="Ask AI Product Finder"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </Link>
              </div>

              {/* Submit Search Button (Amazon Yellow Button) */}
              <button
                type="submit"
                aria-label="Submit Search"
                className="h-10 px-4 rounded-r-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center justify-center transition-colors shadow-md shadow-amber-500/20 flex-shrink-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* LIVE AUTOCOMPLETE DROPDOWN (Amazon / Flipkart Style) */}
            {isFocused && (
              <div className="absolute top-12 left-0 right-0 rounded-xl bg-[#0F121A] border border-[#2B3245] shadow-2xl shadow-black/80 z-50 overflow-hidden divide-y divide-[#1F2433] animate-in fade-in-50 zoom-in-95 duration-150">
                {/* 1. If Query is empty: Show Trending Searches */}
                {!searchQuery.trim() && (
                  <div className="p-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-2.5 px-2">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Trending on NEXUS Bazaar</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 px-1">
                      {trendingSearches.map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => handleSelectSuggestion(term)}
                          className="px-2.5 py-1 rounded-lg bg-[#161B26] hover:bg-amber-500/10 hover:text-amber-400 border border-[#242B3D] text-xs text-slate-300 transition-colors flex items-center gap-1"
                        >
                          <Search className="w-3 h-3 text-slate-500" />
                          <span>{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. When Query is typed: Category suggestions */}
                {searchQuery.trim() && suggestedCategories.length > 0 && (
                  <div className="p-2 bg-[#12151E]/60">
                    {suggestedCategories.map((cat) => (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => handleSearchSubmit(undefined, searchQuery, cat.slug)}
                        className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 flex items-center justify-between group transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400" />
                          <span>
                            Search &quot;<strong className="text-white">{searchQuery}</strong>&quot; in{' '}
                            <span className="text-amber-400 font-semibold">{cat.name}</span>
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">({cat.count} items)</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 3. Keyword Autocomplete suggestions */}
                {searchQuery.trim() && suggestions.length > 0 && (
                  <div className="py-1">
                    {suggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => handleSelectSuggestion(sug)}
                        className="w-full text-left px-4 py-2 text-xs text-slate-200 hover:bg-[#161B26] hover:text-amber-400 flex items-center gap-2.5 transition-colors"
                      >
                        <Search className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                        <span className="truncate">{sug}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 4. Live Product Matches Preview (Flipkart / Amazon instant cards) */}
                {searchQuery.trim() && suggestedProducts.length > 0 && (
                  <div className="p-3 bg-[#0A0D14]">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-1 flex items-center justify-between">
                      <span>Matching Products</span>
                      <span className="text-cyan-400 font-mono text-[10px]">{totalMatches} found</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {suggestedProducts.map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/p/${prod.slug}`}
                          onClick={() => setIsFocused(false)}
                          className="flex items-center gap-2.5 p-2 rounded-lg bg-[#121622] hover:bg-[#1A2030] border border-[#22283A] transition-all group"
                        >
                          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-slate-900 flex-shrink-0">
                            <Image
                              src={prod.primaryImage}
                              alt={prod.title}
                              fill
                              unoptimized
                              sizes="48px"
                              className="object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs text-slate-200 font-medium truncate group-hover:text-amber-400 transition-colors">
                              {prod.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs font-bold text-slate-100">
                                {formatPaiseToINR(prod.priceInPaise)}
                              </span>
                              <div className="flex items-center gap-0.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-1 rounded">
                                <span>{prod.avgRating}</span>
                                <Star className="w-2.5 h-2.5 fill-emerald-400" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Bottom CTA to View all results */}
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="w-full mt-2 py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>See all {totalMatches} results for &quot;{searchQuery}&quot;</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* If nothing matches */}
                {searchQuery.trim() && suggestedProducts.length === 0 && suggestions.length === 0 && (
                  <div className="p-4 text-center text-xs text-slate-400">
                    <p>No quick suggestions for &quot;{searchQuery}&quot;.</p>
                    <button
                      type="button"
                      onClick={() => handleSearchSubmit()}
                      className="mt-2 text-amber-400 hover:underline font-semibold"
                    >
                      Press Enter to search entire catalog &rarr;
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <Link
              href="/ai-finder"
              aria-label="AI Product Finder"
              className="sm:hidden p-2 rounded-lg text-cyan-400 bg-cyan-500/10 border border-cyan-500/30"
              title="AI Product Finder"
            >
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </Link>

            {/* Account & Auth Dropdown */}
            <div className="relative" ref={accountMenuRef}>
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                  aria-label="Customer Account and Profile"
                  className="flex items-center gap-2 p-1.5 sm:p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#12151E] transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center shadow-md shadow-amber-500/20">
                    {currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase() || 'U'}
                  </div>
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-[11px] text-amber-400 font-medium leading-none flex items-center gap-1">
                      Hello, {currentUser.name.split(' ')[0]}
                      {currentUser.isPrimeMember && (
                        <span className="px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">
                          PRIME
                        </span>
                      )}
                    </span>
                    <span className="text-xs font-semibold text-slate-200 mt-0.5 flex items-center gap-1">
                      Account & Orders
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </span>
                  </div>
                </button>
              ) : (
                <Link
                  href="/login"
                  aria-label="Sign In to Nexus"
                  className="flex items-center gap-2 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#12151E] transition-colors"
                >
                  <User className="w-5 h-5 text-amber-400" aria-hidden="true" />
                  <div className="hidden lg:flex flex-col text-left">
                    <span className="text-[11px] text-slate-400 leading-none">Hello, Sign In</span>
                    <span className="text-xs font-semibold text-slate-200 mt-0.5">Account & Orders</span>
                  </div>
                </Link>
              )}

              {/* Account Dropdown Menu */}
              {currentUser && isAccountMenuOpen && (
                <div className="absolute right-0 top-12 w-64 rounded-2xl bg-[#0F121A] border border-[#2B3245] shadow-2xl shadow-black/90 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                  <div className="p-3 rounded-xl bg-[#161B26] border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                      {currentUser.isPrimeMember && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          Prime Member
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <Link
                      href="/account"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-[#161B26] hover:text-amber-400 transition-colors"
                    >
                      <span>Your Account</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </Link>
                    <Link
                      href="/account/orders"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-[#161B26] hover:text-amber-400 transition-colors"
                    >
                      <span>Your Orders & Tracking</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </Link>
                    <Link
                      href="/account/wishlist"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-[#161B26] hover:text-amber-400 transition-colors"
                    >
                      <span>Wishlist & Saved Items</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </Link>
                    <Link
                      href="/account/returns"
                      onClick={() => setIsAccountMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-200 hover:bg-[#161B26] hover:text-amber-400 transition-colors"
                    >
                      <span>Returns & Replacements</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 text-xs font-bold transition-all active:scale-95"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/cart"
              aria-label={`Shopping Cart with ${cartCount} items`}
              className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-medium transition-all group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" />
              <span className="hidden md:inline text-xs font-semibold">Cart</span>
              <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold bg-amber-500 text-slate-950 rounded-full min-w-[20px]" aria-label={`${cartCount} items in cart`}>
                {cartCount}
              </span>
            </Link>
          </div>
        </div>

        {/* Secondary Category Navigation Bar */}
        <nav className="flex items-center gap-6 py-2.5 overflow-x-auto text-xs text-slate-300 border-t border-[#1F2433]/60 scrollbar-none">
          <Link href="/deals" className="flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300 whitespace-nowrap">
            <Zap className="w-3.5 h-3.5" />
            Deals of the Day
          </Link>
          <Link href="/c/electronics" className="hover:text-white whitespace-nowrap">
            Electronics & Laptops
          </Link>
          <Link href="/c/audio-wearables" className="hover:text-white whitespace-nowrap">
            Audio & Wearables
          </Link>
          <Link href="/c/fashion" className="hover:text-white whitespace-nowrap">
            Fashion & Apparel
          </Link>
          <Link href="/c/home-living" className="hover:text-white whitespace-nowrap">
            Home & Living
          </Link>
          <Link href="/c/gaming" className="hover:text-white whitespace-nowrap">
            Gaming & Consoles
          </Link>
          <Link href="/prime" className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 whitespace-nowrap font-medium ml-auto">
            <ShieldCheck className="w-3.5 h-3.5" />
            Nexus Prime Benefits
          </Link>
        </nav>
      </div>
    </header>
  );
}
