'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Star,
  Check,
  Zap,
  HelpCircle,
  ChevronDown,
  ExternalLink,
  ShoppingCart,
  Package,
} from 'lucide-react';
import { formatPaiseToINR, calculateDiscountPercent } from '@nexus/shared';
import { MASTER_CATALOG, fetchDynamicCatalog, CatalogItem } from '@/lib/catalog';
import { addToCart, getStoredCart, getCartTotalCount, CartItem } from '@/lib/cart';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  products?: CatalogItem[];
  cartItems?: CartItem[];
  actionLink?: { label: string; href: string };
}

const QUICK_PROMPTS = [
  '🛒 What is in my cart?',
  '🔥 Best deals under ₹30,000',
  '🎧 Best noise cancelling headphones',
  '💻 Best laptop for work & coding',
  '📦 What is your return & delivery policy?',
];

export function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [catalog, setCatalog] = useState<CatalogItem[]>(MASTER_CATALOG);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemSlug, setAddedItemSlug] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load dynamic catalog on mount
  useEffect(() => {
    fetchDynamicCatalog()
      .then((items) => {
        if (items && items.length > 0) {
          setCatalog(items);
        }
      })
      .catch(() => {});
  }, []);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: 'Namaste! 🙏 I am your Nexus AI Shopping Copilot.\n\nAsk me anything in English or Hindi — check what is in your cart, find top products under any budget, or ask about delivery, returns, and deals!',
          timestamp: 'Just now',
        },
      ]);
    }
  }, [messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  function handleQuickPrompt(promptText: string) {
    setInputValue('');
    processUserQuery(promptText);
  }

  function handleSend(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const query = inputValue.trim();
    if (!query) return;
    setInputValue('');
    processUserQuery(query);
  }

  function processUserQuery(query: string) {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const lower = query.toLowerCase().trim();

      // -------------------------------------------------------------
      // 1. CART QUERIES (how many items in cart, what is in my cart, etc.)
      // -------------------------------------------------------------
      const isCartQuery =
        lower.includes('cart') ||
        lower.includes('bag') ||
        lower.includes('trolley') ||
        lower.includes('tokri') ||
        lower.includes('basket');

      if (isCartQuery) {
        const currentCart = getStoredCart();
        const totalCount = getCartTotalCount();
        const totalPaise = currentCart.reduce(
          (sum, item) => sum + item.priceInPaise * item.quantity,
          0
        );

        if (totalCount === 0) {
          respondWithText(
            '🛒 **Your Cart is Currently Empty (0 Products)**\n\nYou have not added any items to your cart yet.\n\nWould you like me to recommend some top trending gadgets, bestsellers, or flash deals for you?',
            {
              actionLink: { label: 'Explore Trending Deals →', href: '/#deals' },
            }
          );
          return;
        }

        const itemsSummary = currentCart
          .map(
            (item, idx) =>
              `**${idx + 1}. ${item.title}**\n   • Quantity: **${item.quantity}** | Price: **${formatPaiseToINR(item.priceInPaise * item.quantity)}** (${item.variantTitle || 'Standard'})`
          )
          .join('\n\n');

        respondWithText(
          `🛒 **You currently have ${totalCount} product${totalCount > 1 ? 's' : ''} in your cart!**\n\n**Subtotal Cart Value:** ${formatPaiseToINR(totalPaise)}\n\n${itemsSummary}`,
          {
            cartItems: currentCart,
            actionLink: { label: 'Go to Cart & Checkout →', href: '/cart' },
          }
        );
        return;
      }

      // -------------------------------------------------------------
      // 2. GREETINGS & INTRODUCTIONS
      // -------------------------------------------------------------
      const isGreeting =
        /^(hi|hello|hey|namaste|hola|hlo|helo|sup)\b/i.test(lower) ||
        lower.includes('who are you') ||
        lower.includes('kaise ho') ||
        lower.includes('what can you do') ||
        lower.includes('kya kar sakte ho') ||
        lower === 'help' ||
        lower === 'madad';

      if (isGreeting) {
        respondWithText(
          'Namaste! 🙏 I am your **Nexus AI Shopping Copilot**.\n\nHere is how I can assist you right now:\n• **Check Cart**: Ask *"how many products are in my cart?"* or *"show cart"*\n• **Login / Account**: Ask *"how to login?"* or *"sign in"*\n• **Smart Recommendations**: Ask *"best laptop under 60k"* or *"noise cancelling headphones"*\n• **Order Status**: Ask *"where is my order?"*\n• **Support**: Ask about 7-day replacements, Prime delivery, or GST invoicing.\n\nWhat would you like to explore today?'
        );
        return;
      }

      // -------------------------------------------------------------
      // 2.5 LOGIN, LOGOUT & AUTH INQUIRIES
      // -------------------------------------------------------------
      if (
        lower.includes('login') ||
        lower.includes('sign in') ||
        lower.includes('signin') ||
        lower.includes('register') ||
        lower.includes('signup') ||
        lower.includes('create account')
      ) {
        respondWithText(
          '🔐 **NEXUS Account Login & Registration**:\n\n• Sign in to view your orders, live tracking, and save favorites to your wishlist.\n• New members get **100 Nexus Coins (Worth ₹100)** and 30 days of free Nexus Prime benefits!',
          {
            actionLink: { label: 'Go to Sign In / Register →', href: '/login' },
          }
        );
        return;
      }

      if (
        lower.includes('logout') ||
        lower.includes('sign out') ||
        lower.includes('signout')
      ) {
        respondWithText(
          '👋 **Sign Out of NEXUS**:\n\nYou can sign out anytime by clicking your profile name in the top navbar or from your account dashboard.',
          {
            actionLink: { label: 'Go to Account Dashboard →', href: '/account' },
          }
        );
        return;
      }

      // -------------------------------------------------------------
      // 3. ORDER CANCELLATION & TRACKING
      // -------------------------------------------------------------
      if (
        lower.includes('cancel') ||
        lower.includes('cancellation') ||
        lower.includes('order cancel')
      ) {
        respondWithText(
          '❌ **NEXUS 1-Click Order Cancellation**:\n\n• You can cancel active orders directly from your Orders page.\n• 100% instant refund will be initiated to your original payment mode with zero penalty!\n\n👉 Click below to view your orders and cancel anytime:',
          {
            actionLink: { label: 'Go to Orders & Cancel →', href: '/account/orders' },
          }
        );
        return;
      }

      if (
        lower.includes('order') ||
        lower.includes('track') ||
        lower.includes('parcel') ||
        lower.includes('kaha hai')
      ) {
        respondWithText(
          '📦 **Real-Time Order Tracking & Shipments**:\n\nYou can track all your active orders, carrier milestones, and delivery estimates directly in your account dashboard.\n\n• Live tracking updates every 2 hours\n• OTP verified secure doorstep delivery for all orders',
          {
            actionLink: { label: 'View Your Orders & Shipments →', href: '/account/orders' },
          }
        );
        return;
      }

      // -------------------------------------------------------------
      // 4. RETURNS, REFUNDS & REPLACEMENTS
      // -------------------------------------------------------------
      if (
        lower.includes('return') ||
        lower.includes('refund') ||
        lower.includes('exchange') ||
        lower.includes('wapsi') ||
        lower.includes('replace')
      ) {
        respondWithText(
          '🛡️ **Nexus 7-Day Hassle-Free Returns & Replacements**:\n\n• **7-Day Window**: Easy replacements on all verified electronics and lifestyle products.\n• **Zero Fees**: Free doorstep pickup across all Indian PIN codes.\n• **Instant Refunds**: Processed back to your source payment method or Nexus Wallet.',
          {
            actionLink: { label: 'Manage Returns & Replacements →', href: '/account/returns' },
          }
        );
        return;
      }

      // -------------------------------------------------------------
      // 5. DELIVERY & SHIPPING INQUIRIES
      // -------------------------------------------------------------
      if (
        lower.includes('delivery') ||
        lower.includes('shipping') ||
        lower.includes('prime') ||
        lower.includes('kab aayega') ||
        lower.includes('dispatch') ||
        lower.includes('pincode')
      ) {
        respondWithText(
          '⚡ **Nexus Prime Express Delivery**:\n\n• **Same-Day & Next-Day Delivery** available in top 20 metro cities across India.\n• **Standard Express Delivery** (2-4 days) across 19,000+ PIN codes.\n• All Prime-eligible products include 100% free shipping and transit insurance!'
        );
        return;
      }

      // -------------------------------------------------------------
      // 6. GST & BUSINESS TAX INVOICING
      // -------------------------------------------------------------
      if (
        lower.includes('gst') ||
        lower.includes('invoice') ||
        lower.includes('b2b') ||
        lower.includes('input tax credit')
      ) {
        respondWithText(
          '💼 **B2B GST Tax Invoicing & Input Credit**:\n\n• Enter your 15-digit GSTIN at checkout.\n• Receive an official GST tax invoice with valid HSN codes (e.g. HSN 8471, 8518).\n• Claim 18% to 28% GST input tax credit for your registered business!'
        );
        return;
      }

      // -------------------------------------------------------------
      // 7. COUPONS, PROMOS & DISCOUNTS
      // -------------------------------------------------------------
      if (
        lower.includes('coupon') ||
        lower.includes('promo') ||
        lower.includes('discount code') ||
        lower.includes('offer code') ||
        lower.includes('voucher')
      ) {
        respondWithText(
          '🎟️ **Active Nexus Discount Coupons Today**:\n\n• **NEXUS10**: Flat 10% instant discount on orders above ₹9,999\n• **PRIME500**: Flat ₹500 discount on your first order\n• **AUDIO15**: Extra 15% discount on premium audio & headphones\n• **BANKOFFER**: 10% instant discount on HDFC and Axis bank cards\n\nYou can apply any of these codes at the checkout screen!'
        );
        return;
      }

      // -------------------------------------------------------------
      // 8. PAYMENT OPTIONS
      // -------------------------------------------------------------
      if (
        lower.includes('payment') ||
        lower.includes('cod') ||
        lower.includes('cash on delivery') ||
        lower.includes('upi') ||
        lower.includes('emi')
      ) {
        respondWithText(
          '💳 **Accepted Payment Methods**:\n\n• **UPI**: Google Pay, PhonePe, Paytm, BHIM\n• **Cards**: Visa, Mastercard, RuPay, Amex\n• **Cash on Delivery (COD)**: Available with OTP verification\n• **No-Cost EMI**: 3, 6, 9 & 12 month tenures with leading Indian banks.'
        );
        return;
      }

      // -------------------------------------------------------------
      // 9. PRODUCT RECOMMENDATION & CATALOG SEARCH
      // -------------------------------------------------------------
      let maxBudgetRupees: number | null = null;
      const kMatch = lower.match(/(\d+)\s*k\b/);
      const numMatch =
        lower.match(/under\s*(?:rs\.?|inr|₹)?\s*(\d{2,7})/i) ||
        lower.match(/(?:below|budget|less than)\s*(\d{2,7})/i) ||
        lower.match(/(\d{4,7})/);

      if (kMatch) {
        maxBudgetRupees = parseInt(kMatch[1], 10) * 1000;
      } else if (numMatch) {
        maxBudgetRupees = parseInt(numMatch[1], 10);
      }

      let filtered = [...catalog];
      if (maxBudgetRupees) {
        const maxPaise = maxBudgetRupees * 100;
        filtered = filtered.filter((p) => p.priceInPaise <= maxPaise);
      }

      let topicMatches: CatalogItem[] = [];

      if (
        lower.includes('headphone') ||
        lower.includes('audio') ||
        lower.includes('earphone') ||
        lower.includes('earbuds') ||
        lower.includes('airpods') ||
        lower.includes('anc') ||
        lower.includes('sony')
      ) {
        topicMatches = filtered.filter(
          (p) =>
            p.categorySlug === 'audio-wearables' ||
            p.title.toLowerCase().includes('headphone') ||
            p.title.toLowerCase().includes('earbuds') ||
            p.title.toLowerCase().includes('sony') ||
            p.title.toLowerCase().includes('airpods')
        );
      } else if (
        lower.includes('laptop') ||
        lower.includes('macbook') ||
        lower.includes('computer') ||
        lower.includes('pc') ||
        lower.includes('coding') ||
        lower.includes('thinkpad')
      ) {
        topicMatches = filtered.filter(
          (p) =>
            p.title.toLowerCase().includes('laptop') ||
            p.title.toLowerCase().includes('macbook') ||
            p.title.toLowerCase().includes('thinkpad') ||
            p.title.toLowerCase().includes('notebook')
        );
      } else if (
        lower.includes('phone') ||
        lower.includes('mobile') ||
        lower.includes('smartphone') ||
        lower.includes('5g') ||
        lower.includes('iphone') ||
        lower.includes('samsung')
      ) {
        topicMatches = filtered.filter(
          (p) =>
            p.categorySlug === 'electronics' &&
            (p.title.toLowerCase().includes('phone') ||
              p.title.toLowerCase().includes('iphone') ||
              p.title.toLowerCase().includes('samsung') ||
              p.title.toLowerCase().includes('galaxy') ||
              p.keywords.some((k) => k.includes('phone') || k.includes('smartphone')))
        );
      } else if (
        lower.includes('shoe') ||
        lower.includes('sneaker') ||
        lower.includes('running') ||
        lower.includes('fashion') ||
        lower.includes('jacket') ||
        lower.includes('shirt')
      ) {
        topicMatches = filtered.filter(
          (p) =>
            p.categorySlug === 'fashion' ||
            p.title.toLowerCase().includes('shoes') ||
            p.title.toLowerCase().includes('sneakers') ||
            p.title.toLowerCase().includes('running')
        );
      } else if (
        lower.includes('deal') ||
        lower.includes('discount') ||
        lower.includes('offer') ||
        lower.includes('sasta') ||
        lower.includes('sale')
      ) {
        topicMatches = filtered.filter(
          (p) =>
            p.isDealOfTheDay ||
            (p.compareAtInPaise && p.compareAtInPaise > p.priceInPaise)
        );
      } else {
        // Multi-word keyword tokens match
        const ignoredTokens = new Set([
          'how',
          'many',
          'what',
          'where',
          'which',
          'show',
          'give',
          'best',
          'top',
          'good',
          'product',
          'products',
          'item',
          'items',
          'there',
          'have',
          'want',
          'need',
          'with',
          'under',
          'about',
        ]);
        const tokens = lower
          .split(/[\s,?.!]+/)
          .filter((t) => t.length > 2 && !ignoredTokens.has(t));

        if (tokens.length > 0) {
          topicMatches = filtered.filter((p) => {
            const blob = `${p.title} ${p.brand} ${p.categoryName} ${p.description} ${p.keywords.join(' ')}`.toLowerCase();
            return tokens.some((t) => blob.includes(t));
          });
        }
      }

      if (topicMatches.length > 0) {
        const sorted = topicMatches.sort((a, b) => b.avgRating - a.avgRating);
        const topPicks = sorted.slice(0, 3);

        const responseText = maxBudgetRupees
          ? `Here are the top-rated recommendations under ₹${maxBudgetRupees.toLocaleString('en-IN')}:`
          : `Here are the best verified options matching "${query}":`;

        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            text: responseText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            products: topPicks,
          },
        ]);
        setIsTyping(false);
        return;
      }

      // If no product matches found
      respondWithText(
        `I couldn't find specific products matching "${query}".\n\nTry asking for:\n• **"Best laptop under 60k"**\n• **"Sony noise cancelling headphones"**\n• **"Top deals of the day"**\n• Or check your cart by asking **"show my cart"**!`,
        {
          actionLink: { label: 'Browse All Categories →', href: '/#categories' },
        }
      );
    }, 600);
  }

  function respondWithText(
    text: string,
    extra?: { cartItems?: CartItem[]; actionLink?: { label: string; href: string } }
  ) {
    setMessages((prev) => [
      ...prev,
      {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cartItems: extra?.cartItems,
        actionLink: extra?.actionLink,
      },
    ]);
    setIsTyping(false);
  }

  function handleAddToCartFromChat(product: CatalogItem) {
    addToCart({
      variantId: `${product.id}-default`,
      title: product.title,
      variantTitle: 'Standard Edition',
      imageUrl: product.primaryImage,
      priceInPaise: product.priceInPaise,
      compareAtInPaise: product.compareAtInPaise || undefined,
      quantity: 1,
      sellerId: product.sellerName || 'Nexus Prime Seller',
      sellerName: product.sellerName || 'Apex Electronics India',
      slug: product.slug,
    });

    setAddedItemSlug(product.slug);
    setTimeout(() => setAddedItemSlug(null), 2500);
  }

  function clearHistory() {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        text: 'Chat history cleared. How else can I assist you with your shopping today? ✨',
        timestamp: 'Just now',
      },
    ]);
  }

  return (
    <>
      {/* Floating Trigger Button (Bottom-Right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-400 hover:via-rose-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-2xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95 group"
          aria-label="Open Nexus AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
          </div>
          <span className="text-white font-extrabold tracking-wide hidden sm:inline">Ask Nexus AI</span>
          <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-amber-200 text-[10px] uppercase font-mono">
            Copilot
          </span>
        </button>
      )}

      {/* Chat Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[600px] max-h-[85vh] rounded-3xl bg-[#0B0E17]/95 backdrop-blur-xl border border-amber-500/30 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#141A29] to-[#111420] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-extrabold text-white tracking-wide">Nexus AI Copilot</h3>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-mono border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Precision Shopping & Cart Assistant</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={clearHistory}
                title="Clear chat history"
                className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-2`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 leading-relaxed whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-none shadow-md'
                      : 'bg-[#151A27] text-slate-200 border border-slate-800 rounded-tl-none shadow-md'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Render cart preview cards if available */}
                {msg.cartItems && msg.cartItems.length > 0 && (
                  <div className="w-full space-y-2 mt-1">
                    {msg.cartItems.map((cItem) => (
                      <div
                        key={cItem.id}
                        className="p-2.5 rounded-xl bg-[#121622] border border-amber-500/30 flex items-center gap-3"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
                          <Image
                            src={cItem.imageUrl}
                            alt={cItem.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-amber-400 font-semibold truncate">
                            {cItem.sellerName}
                          </div>
                          <Link
                            href={`/p/${cItem.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="text-xs font-bold text-white hover:text-cyan-400 line-clamp-1 block transition-colors"
                          >
                            {cItem.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-300">
                            <span className="text-amber-300 font-semibold">Qty: {cItem.quantity}</span>
                            <span>•</span>
                            <span className="font-extrabold text-white">
                              {formatPaiseToINR(cItem.priceInPaise * cItem.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Render action link CTA button if available */}
                {msg.actionLink && (
                  <Link
                    href={msg.actionLink.href}
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 mt-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
                  >
                    <span>{msg.actionLink.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}

                {/* Render product recommendation cards if available */}
                {msg.products && msg.products.length > 0 && (
                  <div className="w-full space-y-2 mt-1">
                    {msg.products.map((item) => (
                      <div
                        key={item.id}
                        className="p-2.5 rounded-xl bg-[#121622] border border-slate-800/90 hover:border-amber-500/40 transition-all flex items-center gap-3"
                      >
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
                          <Image
                            src={item.primaryImage}
                            alt={item.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] text-amber-400 font-semibold truncate">{item.brand}</div>
                          <Link
                            href={`/p/${item.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="text-xs font-bold text-white hover:text-cyan-400 line-clamp-1 block transition-colors"
                          >
                            {item.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-extrabold text-white text-xs">
                              {formatPaiseToINR(item.priceInPaise)}
                            </span>
                            <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 fill-emerald-400" />
                              {item.avgRating}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <button
                            onClick={() => handleAddToCartFromChat(item)}
                            className={`p-2 rounded-lg text-slate-950 font-bold transition-all ${
                              addedItemSlug === item.slug
                                ? 'bg-emerald-400'
                                : 'bg-amber-500 hover:bg-amber-400'
                            }`}
                            title="Add to Cart"
                          >
                            {addedItemSlug === item.slug ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <ShoppingBag className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-slate-500 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#151A27] border border-slate-800 w-fit rounded-tl-none">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-[#0E121D] border-t border-slate-800/80 overflow-x-auto flex gap-1.5 scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-[11px] transition-colors flex-shrink-0"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-[#111420] border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything (e.g. show my cart, 50k ke andar laptop)..."
              className="flex-1 h-10 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-slate-950 font-bold flex items-center justify-center transition-all shadow-md active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
