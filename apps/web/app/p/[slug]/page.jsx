'use client';

import React, { useState, use, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  TrendingDown,
  Bell,


  ChevronRight,
  CheckCircle2,
  MapPin,
  Clock,
  ThumbsUp,
  MessageSquare,

  Layers,
  Sparkles,
  PenLine,
  Send,
  Check,
} from 'lucide-react';
import { formatPaiseToINR, calculateDiscountPercent } from '@nexus/shared';
import { Interactive360Viewer } from '@/components/Interactive360Viewer';
import { PriceDropModal } from '@/components/PriceDropModal';
import { MASTER_CATALOG } from '@/lib/catalog';
import { addToCart } from '@/lib/cart';

// Comprehensive product database for story-led PDP
const productCatalog = {
  'sony-wh-1000xm5-wireless-anc-headphones': {
    id: 'prod-1',
    title: 'Sony WH-1000XM5 Wireless Active Noise Canceling Headphones',
    slug: 'sony-wh-1000xm5-wireless-anc-headphones',
    brand: 'Sony',
    hsnCode: '85183000',
    taxRatePercent: 18.0,
    categoryName: 'Audio & Wearables',
    categorySlug: 'audio-wearables',
    shortDescription: 'Industry-leading noise cancellation with Auto NC Optimizer, 30-hour battery life, and crystal-clear hands-free calling.',
    description: `The Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality. With a newly developed driver, DSEE - Extreme and Hi-Res audio support, the WH-1000XM5 provides awe-inspiring audio quality.
    
Engineered with lightweight soft-fit leather, step-less slider, and silent joints, they fit snugly around the ears with zero pinching pressure for all-day comfort.`,
    isDealOfTheDay: true,
    dealDiscountPct: 20.0,
    dealEndsAt: '24h : 15m : 30s',
    avgRating: 4.8,
    reviewCount: 328,
    seller: {
      storeName: 'Apex Electronics India',
      rating: 4.8,
      totalRatings: 1420,
      pickupPincode: '400093',
      isGstVerified: true,
      dispatchTime: 'Dispatches within 4 hours',
    },
    media: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1000&q=80',
    ],
    variants: [
      {
        id: 'var-1',
        title: 'Midnight Black',
        sku: 'SONY-XM5-BLK',
        priceInPaise: 2799000,
        compareAtInPaise: 3499000,
        stock: 45,
        colorHex: '#181A20',
      },
      {
        id: 'var-2',
        title: 'Platinum Silver',
        sku: 'SONY-XM5-SLV',
        priceInPaise: 2799000,
        compareAtInPaise: 3499000,
        stock: 3, // Low stock test!
        colorHex: '#E2E8F0',
      },
    ],
    specs: [
      { label: 'Driver Unit', value: '30mm, Carbon Fiber Composite Dome' },
      { label: 'Frequency Response', value: '4 Hz - 40,000 Hz (Hi-Res LDAC)' },
      { label: 'Battery Life', value: '30 Hours (NC On) / 40 Hours (NC Off)' },
      { label: 'Fast Charging', value: '3 min charge gives 3 hours playback' },
      { label: 'Weight', value: 'Approx. 250 g' },
      { label: 'Bluetooth Version', value: 'v5.2 (Multipoint Connection)' },
      { label: 'Warranty', value: '1 Year Comprehensive Brand Warranty' },
    ],
    priceHistory: [
      { day: 'Day 1', price: 34990 },
      { day: 'Day 10', price: 32990 },
      { day: 'Day 20', price: 30990 },
      { day: 'Day 25', price: 29990 },
      { day: 'Today', price: 27990 },
    ],
    reviews: [
      {
        author: 'Rahul Sharma',
        rating: 5,
        date: 'Verified Purchase • 2 days ago',
        title: 'Best noise cancellation on the market, hands down.',
        comment: 'I fly frequently between Mumbai and Delhi. These completely silence jet engine drone. Call quality on Microsoft Teams is stellar thanks to the beamforming mics.',
        helpfulVotes: 42,
      },
      {
        author: 'Tanvi Iyer',
        rating: 5,
        date: 'Verified Purchase • 1 week ago',
        title: 'Super light and comfortable for long coding sessions.',
        comment: 'Does not hurt my ears even with glasses on. Multipoint seamless connection between MacBook and iPhone works flawlessly.',
        helpfulVotes: 18,
      },
    ],
    questions: [
      {
        q: 'Does it support lossless wired connection?',
        a: 'Yes, an audiophile 3.5mm headphone cable is included in the premium carrying case.',
      },
      {
        q: 'Can I claim GST input tax credit with this purchase?',
        a: 'Yes! Enter your GSTIN at checkout to receive an official B2B GST tax invoice with HSN code 85183000.',
      },
    ],
  },
  'apple-macbook-air-15-m3-16gb-512gb': {
    id: 'prod-2',
    title: 'Apple MacBook Air 15-inch M3 Chip (16GB Unified Memory, 512GB SSD)',
    slug: 'apple-macbook-air-15-m3-16gb-512gb',
    brand: 'Apple',
    hsnCode: '84713010',
    taxRatePercent: 18.0,
    categoryName: 'Electronics & Gadgets',
    categorySlug: 'electronics',
    shortDescription: 'Strikingly thin and fast with the power of M3 chip, Liquid Retina display, and up to 18 hours of battery life.',
    description: `The 15-inch MacBook Air is impossibly thin and has a stunning Liquid Retina display. Supercharged by the M3 chip with an 8-core CPU and 10-core GPU, it breezes through intense workloads.`,
    avgRating: 4.9,
    reviewCount: 194,
    seller: {
      storeName: 'Apex Electronics India',
      rating: 4.8,
      totalRatings: 1420,
      pickupPincode: '400093',
      isGstVerified: true,
      dispatchTime: 'Dispatches today',
    },
    media: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1000&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=1000&q=80',
    ],
    variants: [
      {
        id: 'var-201',
        title: 'Midnight (Dark Navy)',
        sku: 'MBA-15-M3-MIDNIGHT',
        priceInPaise: 15490000,
        compareAtInPaise: 17490000,
        stock: 22,
        colorHex: '#1E293B',
      },
      {
        id: 'var-202',
        title: 'Starlight (Champagne Gold)',
        sku: 'MBA-15-M3-STARLIGHT',
        priceInPaise: 15490000,
        compareAtInPaise: 17490000,
        stock: 14,
        colorHex: '#FDE68A',
      },
    ],
    specs: [
      { label: 'Processor', value: 'Apple M3 (8-core CPU / 10-core GPU)' },
      { label: 'Unified Memory', value: '16GB High-Bandwidth RAM' },
      { label: 'Solid State Drive', value: '512GB NVMe SSD' },
      { label: 'Screen', value: '15.3-inch Liquid Retina Display (500 nits)' },
      { label: 'Battery', value: 'Up to 18 hours battery life' },
    ],
    priceHistory: [
      { day: 'Day 1', price: 174900 },
      { day: 'Day 15', price: 164900 },
      { day: 'Today', price: 154900 },
    ],
    reviews: [
      {
        author: 'Arjun Mehta',
        rating: 5,
        date: 'Verified Purchase',
        title: 'The sweet spot for productivity and battery.',
        comment: 'Upgraded from an older Intel Mac. The silence (fanless design) and 16 hours real-world battery life are mindblowing.',
        helpfulVotes: 29,
      },
    ],
    questions: [
      {
        q: 'Does it support two external displays with lid closed?',
        a: 'Yes! The M3 MacBook Air supports dual external monitors when the laptop lid is closed.',
      },
    ],
  },
};

export default function ProductDetailPage({
  params,
}

) {
  const { slug } = use(params);
  const defaultProduct = useMemo(() => {
    let p = productCatalog[slug];
    if (!p) {
      const masterItem = MASTER_CATALOG.find((m) => m.slug === slug);
      if (masterItem) {
        p = {
          id: masterItem.id,
          title: masterItem.title,
          slug: masterItem.slug,
          brand: masterItem.brand,
          hsnCode: '85171300',
          taxRatePercent: 18.0,
          categoryName: masterItem.categoryName,
          categorySlug: masterItem.categorySlug,
          shortDescription: masterItem.description,
          description: masterItem.description,
          isDealOfTheDay: masterItem.isDealOfTheDay,
          dealDiscountPct: masterItem.isDealOfTheDay ? 20.0 : 0,
          dealEndsAt: '24h : 15m : 30s',
          avgRating: masterItem.avgRating,
          reviewCount: masterItem.reviewCount,
          seller: {
            storeName: masterItem.sellerName,
            rating: 4.8,
            totalRatings: 1120,
            pickupPincode: '400093',
            isGstVerified: true,
            dispatchTime: 'Dispatches within 4 hours',
          },
          media: [
            masterItem.primaryImage,
            'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1000&q=80',
            'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1000&q=80',
          ],
          variants: [
            {
              id: `${masterItem.id}-v1`,
              title: 'Standard Edition',
              sku: `${masterItem.brand.toUpperCase()}-STD`,
              priceInPaise: masterItem.priceInPaise,
              compareAtInPaise: masterItem.compareAtInPaise || Math.round(masterItem.priceInPaise * 1.2),
              stock: 25,
              attributes: { Edition: 'Standard' },
            },
          ],
          specs: [
            { label: 'Brand', value: masterItem.brand },
            { label: 'Category', value: masterItem.categoryName },
            { label: 'Prime Delivery', value: 'Same Day / Next Day Free' },
            { label: 'Warranty', value: '1 Year Brand Domestic Warranty' },
          ],
          priceHistory30d: [
            { day: 'Day 1', price: Math.round(masterItem.priceInPaise * 1.05 / 100) },
            { day: 'Day 10', price: Math.round(masterItem.priceInPaise * 1.02 / 100) },
            { day: 'Day 20', price: Math.round(masterItem.priceInPaise / 100) },
            { day: 'Day 30', price: Math.round(masterItem.priceInPaise / 100) },
          ],
          reviews: [
            {
              id: 'rev-1',
              authorName: 'Arjun Verma',
              rating: 5,
              date: 'Oct 2, 2026',
              verifiedBuyer: true,
              title: 'Outstanding quality and super fast delivery',
              body: `Ordered through Nexus Prime and received within 18 hours in Mumbai. Phenomenal product performance from ${masterItem.brand}.`,
              helpfulCount: 42,
            },
          ],
          questions: [
            {
              q: 'Is this product covered by official brand warranty?',
              a: 'Yes, 100% genuine sealed unit covered by official manufacturer warranty across India.',
            },
          ],
        };
      } else {
        p = productCatalog['sony-wh-1000xm5-wireless-anc-headphones'];
      }
    }
    return p;
  }, [slug]);

  const [product, setProduct] = useState(defaultProduct);

  // Dynamic fetch for external API products by ID slug (e.g. -1, -25)
  useEffect(() => {
    setProduct(defaultProduct);
    const idMatch = slug.match(/-(\d+)$/);
    if (idMatch && !productCatalog[slug] && !MASTER_CATALOG.find((m) => m.slug === slug)) {
      fetch(`https://dummyjson.com/products/${idMatch[1]}`)
        .then((res) => res.json())
        .then((p) => {
          if (p && p.id) {
            const priceRupees = Math.round((p.price || 15) * 85);
            const priceInPaise = priceRupees * 100;
            const compareAtInPaise = p.discountPercentage
              ? Math.round(priceInPaise * (1 + p.discountPercentage / 100))
              : Math.round(priceInPaise * 1.25);

            setProduct({
              id: `dj-${p.id}`,
              title: p.title,
              slug: slug,
              brand: p.brand || 'Nexus Global',
              hsnCode: '85171300',
              taxRatePercent: 18.0,
              categoryName: p.category || 'General',
              categorySlug: 'electronics',
              shortDescription: p.description,
              description: p.description,
              isDealOfTheDay: (p.discountPercentage || 0) > 12,
              dealDiscountPct: p.discountPercentage || 15.0,
              dealEndsAt: '24h : 15m : 30s',
              avgRating: Number((p.rating || 4.5).toFixed(1)),
              reviewCount: (p.reviews?.length || 5) * 20 + 30,
              seller: {
                storeName: p.brand ? `${p.brand} Official Store` : 'Prime Global Seller',
                rating: 4.8,
                totalRatings: 840,
                pickupPincode: '400093',
                isGstVerified: true,
                dispatchTime: 'Dispatches within 4 hours',
              },
              media: p.images?.length > 0 ? p.images : [p.thumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80'],
              variants: [
                {
                  id: `dj-${p.id}-v1`,
                  title: 'Standard Edition',
                  sku: `SKU-${p.id}`,
                  priceInPaise,
                  compareAtInPaise,
                  stock: p.stock || 20,
                  attributes: { Edition: 'Standard' },
                },
              ],
              specs: [
                { label: 'Brand', value: p.brand || 'Nexus Verified' },
                { label: 'Category', value: p.category || 'Lifestyle' },
                { label: 'Warranty', value: p.warrantyInformation || '1 Year Brand Domestic Warranty' },
                { label: 'Shipping', value: p.shippingInformation || 'Free Express Delivery with Prime' },
              ],
              priceHistory30d: [
                { day: 'Day 1', price: Math.round(priceRupees * 1.05) },
                { day: 'Day 10', price: Math.round(priceRupees * 1.02) },
                { day: 'Day 20', price: priceRupees },
                { day: 'Day 30', price: priceRupees },
              ],
              reviews: (p.reviews || []).map((r, idx) => ({
                id: `rev-${idx}`,
                authorName: r.reviewerName || 'Verified Buyer',
                rating: r.rating || 5,
                date: 'Recent Purchase',
                verifiedBuyer: true,
                title: r.comment || 'Great product',
                body: r.comment || 'Extremely happy with the build quality and delivery time.',
                helpfulCount: 12 + idx * 3,
              })),
              questions: [
                {
                  q: 'Is this covered by return policy?',
                  a: p.returnPolicy || '7 Days Replacement Policy across India.',
                },
              ],
            });
          }
        })
        .catch(() => {});
    }
  }, [slug, defaultProduct]);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [viewerMode, setViewerMode] = useState('photos');
  const [isPriceDropModalOpen, setIsPriceDropModalOpen] = useState(false);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('400011');
  const [deliveryResult, setDeliveryResult] = useState('Delivery by Thursday, Oct 15 • Free with Prime');
  const [priceAlertSet, setPriceAlertSet] = useState(false);
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  // Customer Feedback & Review State
  const [reviewsList, setReviewsList] = useState([]);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [newAuthor, setNewAuthor] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [reviewSubmittedToast, setReviewSubmittedToast] = useState(false);
  const [helpfulVotesMap, setHelpfulVotesMap] = useState({});
  const [votedReviews, setVotedReviews] = useState(new Set());

  // Load reviews from localStorage on product change
  useEffect(() => {
    try {
      const storageKey = `nexus_reviews_${product.slug || slug}`;
      const localReviewsRaw = localStorage.getItem(storageKey);
      const localReviews = localReviewsRaw ? JSON.parse(localReviewsRaw) : [];
      const baseReviews = (product.reviews || []).map((r, idx) => ({
        id: r.id || `base-${idx}`,
        author: r.author || r.authorName || 'Verified Buyer',
        rating: r.rating || 5,
        date: r.date || 'Recent Purchase',
        title: r.title || 'Great product',
        comment: r.comment || r.body || 'Very satisfied with the quality.',
        helpfulVotes: r.helpfulVotes || r.helpfulCount || 0,
        isUserFeedback: false,
      }));
      setReviewsList([...localReviews, ...baseReviews]);
    } catch (e) {
      setReviewsList(product.reviews || []);
    }
  }, [product.slug, product.reviews, slug]);

  function handleSubmitReview(e) {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newRev = {
      id: `user-rev-${Date.now()}`,
      author: newAuthor.trim(),
      rating: newRating,
      date: 'Verified Buyer • Just now',
      title: newTitle.trim() || `${newRating}★ Customer Experience`,
      comment: newComment.trim(),
      helpfulVotes: 0,
      isUserFeedback: true,
    };

    const storageKey = `nexus_reviews_${product.slug || slug}`;
    try {
      const localReviewsRaw = localStorage.getItem(storageKey);
      const localReviews = localReviewsRaw ? JSON.parse(localReviewsRaw) : [];
      const updatedLocal = [newRev, ...localReviews];
      localStorage.setItem(storageKey, JSON.stringify(updatedLocal));
    } catch (e) {}

    setReviewsList((prev) => [newRev, ...prev]);
    setNewAuthor('');
    setNewTitle('');
    setNewComment('');
    setNewRating(5);
    setIsWritingReview(false);
    setReviewSubmittedToast(true);
    setTimeout(() => setReviewSubmittedToast(false), 4000);
  }

  function handleHelpfulClick(reviewId) {
    if (votedReviews.has(reviewId)) return;
    setVotedReviews((prev) => new Set([...prev, reviewId]));
    setHelpfulVotesMap((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
  }

  const activeVariant = product.variants[selectedVariantIndex];
  const discountPct = calculateDiscountPercent(activeVariant.compareAtInPaise, activeVariant.priceInPaise);

  function handleCheckPincode(e) {
    e.preventDefault();
    if (pincode.length === 6) {
      setDeliveryResult('Delivery in 2 days (Oct 15) • Free Express Shipping with Prime');
    } else {
      setDeliveryResult('Please enter a valid 6-digit Indian PIN code');
    }
  }

  function handleAddToCart() {
    addToCart({
      variantId: activeVariant.id,
      title: product.title,
      variantTitle: activeVariant.title,
      imageUrl: product.media?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
      priceInPaise: activeVariant.priceInPaise,
      compareAtInPaise: activeVariant.compareAtInPaise,
      quantity: quantity,
      sellerId: product.seller?.storeName || 'Apex Electronics',
      sellerName: product.seller?.storeName || 'Apex Electronics India',
      slug: product.slug,
    });
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 3000);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.media,
    description: product.shortDescription,
    sku: activeVariant.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `https://nexusmarket.in/p/${product.slug}`,
      priceCurrency: 'INR',
      price: (activeVariant.priceInPaise / 100).toFixed(2),
      priceValidUntil: '2026-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: activeVariant.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: product.seller.storeName,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.avgRating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Toast Alert */}
      {addedToCartToast && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-5 h-5" />
          <span>Added {quantity}x to your multi-seller cart!</span>
        </div>
      )}

      {/* Review Submitted Toast */}
      {reviewSubmittedToast && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-sm shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5" />
          <span>Thank you! Your product review has been published.</span>
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
        <Link href="/" className="hover:text-amber-400">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <Link href={`/c/${product.categorySlug}`} className="hover:text-amber-400">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-300 font-medium truncate max-w-xs">{product.brand}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery, 360 Studio & CAD X-Ray (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#12151E] border border-[#1F2433] text-xs font-semibold">
            <button
              onClick={() => setViewerMode('photos')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all ${
                viewerMode === 'photos'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Photos ({product.media.length})
            </button>
            <button
              onClick={() => setViewerMode('360')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                viewerMode === '360'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-cyan-300'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>360° Studio</span>
            </button>
            <button
              onClick={() => setViewerMode('xray')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all flex items-center justify-center gap-1 ${
                viewerMode === 'xray'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>CAD / X-Ray</span>
            </button>
          </div>

          {/* Conditional Visual Area */}
          {viewerMode === 'photos' ? (
            <>
              <div className="relative aspect-square w-full rounded-2xl bg-[#12151E] border border-[#1F2433] overflow-hidden group">
                <Image
                  src={product.media[selectedMediaIndex] || product.media[0]}
                  alt={product.title}
                  fill
                  priority
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                {product.isDealOfTheDay && (
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg">
                    <Zap className="w-3.5 h-3.5 fill-slate-950" />
                    Deal of the Day
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.media.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedMediaIndex(idx)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden bg-slate-900 border-2 flex-shrink-0 transition-all ${
                      selectedMediaIndex === idx ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={imgUrl} alt={`Thumbnail ${idx}`} fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <Interactive360Viewer
                productTitle={product.title}
                productBrand={product.brand}
                colorHex={activeVariant.colorHex}
                initialMode={viewerMode === 'xray' ? 'xray' : 'studio'}
              />
              <p className="text-center text-[11px] text-slate-500 font-medium">
                Hold & drag mouse/touch to spin • Click pulsing hotspots to inspect internal transducer specs
              </p>
            </div>
          )}
        </div>

        {/* Center: Details, Variants, Specs, Story (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Brand & Title */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-bold text-amber-400 uppercase tracking-wider">{product.brand}</span>
              <span className="font-mono text-slate-500">SKU: {activeVariant.sku}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {product.title}
            </h1>
          </div>

          {/* Ratings & Verified Buyer Count */}
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 font-bold">
              <span>{product.avgRating}</span>
              <Star className="w-3.5 h-3.5 fill-emerald-400" />
            </div>
            <span className="text-slate-400">({product.reviewCount} verified customer ratings)</span>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-xl bg-[#12151E] border border-[#1F2433]">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {formatPaiseToINR(activeVariant.priceInPaise)}
              </span>
              {activeVariant.compareAtInPaise && (
                <span className="text-sm text-slate-500 line-through">
                  MSRP {formatPaiseToINR(activeVariant.compareAtInPaise)}
                </span>
              )}
              {discountPct > 0 && (
                <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-xs font-bold">
                  {discountPct}% OFF
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Inclusive of all taxes (GST 18% HSN {product.hsnCode}). Free shipping with Nexus Prime.
            </p>
          </div>

          {/* Variant Selector */}
          <div>
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Select Color & Style: <span className="text-amber-400 normal-case">{activeVariant.title}</span>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              {product.variants.map((v, idx) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantIndex(idx)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border flex items-center gap-2 ${
                    selectedVariantIndex === idx
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {v.colorHex && (
                    <span className="w-3 h-3 rounded-full border border-slate-600" style={{ backgroundColor: v.colorHex }} />
                  )}
                  <span>{v.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stock Warning */}
          <div>
            {activeVariant.stock < 5 ? (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Hurry! Only {activeVariant.stock} units left in stock at this seller.</span>
              </div>
            ) : (
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>In Stock. Ready for immediate dispatch.</span>
              </div>
            )}
          </div>

          {/* Story & Description */}
          <div className="space-y-3 pt-4 border-t border-[#1F2433]">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Product Story & Highlights</h3>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Specifications Table */}
          <div className="pt-4 border-t border-[#1F2433]">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">Technical Specifications</h3>
            <div className="divide-y divide-slate-800 text-xs">
              {product.specs?.map((spec, idx) => (
                <div key={idx} className="py-2 flex justify-between">
                  <span className="text-slate-400">{spec.label}</span>
                  <span className="text-slate-200 font-medium text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Buy Box, Pincode Estimator & Price Tracker (3 Cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Main Action Box */}
          <div className="p-5 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-4 shadow-xl">
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Quantity</span>
              <div className="flex items-center border border-slate-700 rounded-lg overflow-hidden bg-slate-900">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-2.5 py-1 text-slate-300 hover:bg-slate-800 text-xs font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-mono font-bold text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(activeVariant.stock, quantity + 1))}
                  className="px-2.5 py-1 text-slate-300 hover:bg-slate-800 text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleAddToCart}
                className="w-full h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Add to Cart</span>
              </button>
              <Link
                href="/checkout"
                className="w-full h-11 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center"
              >
                Buy Now (1-Click)
              </Link>
            </div>

            {/* Seller Info Badge */}
            <div className="pt-3 border-t border-slate-800/80 text-xs space-y-1.5 text-slate-400">
              <div className="flex items-center justify-between">
                <span>Sold by:</span>
                <span className="text-slate-200 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  {product.seller.storeName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Seller Rating:</span>
                <span className="text-emerald-400 font-semibold">{product.seller.rating} ★ ({product.seller.totalRatings})</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span>Fulfillment:</span>
                <span>NEXUS Express Logistics</span>
              </div>
            </div>
          </div>

          {/* Delivery Estimator Box */}
          <div className="p-4 rounded-xl bg-[#12151E] border border-[#1F2433] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>Delivery Estimate</span>
            </div>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                maxLength={6}
                placeholder="6-digit PIN code"
                className="w-full h-9 rounded-lg bg-slate-900 border border-slate-700 px-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-3 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
              >
                Check
              </button>
            </form>
            {deliveryResult && (
              <p className="text-[11px] text-cyan-400 flex items-center gap-1.5 leading-snug">
                <Truck className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{deliveryResult}</span>
              </p>
            )}
          </div>

          {/* Signature Feature: Price History Sparkline Card with Interactive Scrubber */}
          <div className="p-4 rounded-xl bg-gradient-to-b from-[#12151E] to-slate-950 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                <TrendingDown className="w-4 h-4" />
                Price History Vault
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                All-Time Low ₹27,990
              </span>
            </div>

            {/* Interactive SVG Sparkline */}
            <div className="relative pt-2">
              {hoveredDay && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/50 text-[10px] font-mono text-cyan-300 shadow-md">
                  {hoveredDay.day}: ₹{hoveredDay.price.toLocaleString('en-IN')}
                </div>
              )}

              <div className="h-16 w-full flex items-end gap-2 pt-2">
                {[
                  { day: '30d ago', price: 34990, height: 95, color: 'bg-slate-700' },
                  { day: '20d ago', price: 32990, height: 80, color: 'bg-slate-700' },
                  { day: '14d ago', price: 30990, height: 65, color: 'bg-slate-600' },
                  { day: '7d ago', price: 29990, height: 55, color: 'bg-cyan-600/80' },
                  { day: 'Today', price: 27990, height: 42, color: 'bg-cyan-400' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredDay({ day: item.day, price: item.price })}
                    onMouseLeave={() => setHoveredDay(null)}
                    style={{ height: `${item.height}%` }}
                    className={`flex-1 ${item.color} rounded-t transition-all hover:bg-amber-400 cursor-pointer ${
                      idx === 4 ? 'shadow-lg shadow-cyan-400/40 animate-pulse' : ''
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>30-Day High: ₹34,990</span>
              <span className="text-cyan-400 font-bold">Now: {formatPaiseToINR(activeVariant.priceInPaise)}</span>
            </div>

            <button
              onClick={() => setIsPriceDropModalOpen(true)}
              className="w-full h-9 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all bg-gradient-to-r from-cyan-500/20 to-amber-500/20 hover:from-cyan-500/30 hover:to-amber-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm active:scale-95"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Set Price Drop Vault Alert</span>
            </button>
          </div>
        </div>
      </div>

      {/* Price Drop Vault Sentinel Modal */}
      <PriceDropModal
        isOpen={isPriceDropModalOpen}
        onClose={() => setIsPriceDropModalOpen(false)}
        productTitle={product.title}
        variantTitle={activeVariant.title}
        variantId={activeVariant.id}
        currentPricePaise={activeVariant.priceInPaise}
      />

      {/* Verified Reviews & Customer Feedback Section */}
      <section className="mt-16 pt-12 border-t border-[#1F2433]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Customer Reviews & Feedback</h2>
            <p className="text-xs text-slate-400 mt-1">Verified buyer ratings and authentic customer impressions</p>
          </div>
          <button
            onClick={() => setIsWritingReview((prev) => !prev)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95 self-start sm:self-auto"
          >
            <PenLine className="w-3.5 h-3.5" />
            {isWritingReview ? 'Cancel Feedback' : 'Write a Product Review'}
          </button>
        </div>

        {/* Expandable Feedback Form */}
        {isWritingReview && (
          <form
            onSubmit={handleSubmitReview}
            className="mb-8 p-6 rounded-2xl bg-gradient-to-b from-[#161B26] to-[#0F131D] border border-amber-500/40 shadow-xl space-y-5 animate-in fade-in duration-300"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Share Your Product Experience</h3>
              </div>
              <span className="text-[11px] text-slate-400">Help fellow shoppers make informed choices</span>
            </div>

            {/* Star Rating Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">Overall Rating *</label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating ?? newRating)
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                            : 'text-slate-700'
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-amber-400">
                  {(hoverRating ?? newRating) === 5 && '5 - Excellent, Loved it!'}
                  {(hoverRating ?? newRating) === 4 && '4 - Very Good, Met expectations'}
                  {(hoverRating ?? newRating) === 3 && '3 - Average, It was okay'}
                  {(hoverRating ?? newRating) === 2 && '2 - Below expectations'}
                  {(hoverRating ?? newRating) === 1 && '1 - Terrible, Disappointed'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Review Headline</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Superb build quality & fast delivery!"
                  className="w-full h-10 px-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Your Feedback & Comments *</label>
              <textarea
                required
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="What did you like or dislike? How does it perform day-to-day? Any tips for other buyers?"
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Verified buyer feedback will be published immediately</span>
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Rating Summary */}
          <div className="p-6 rounded-2xl bg-[#12151E] border border-[#1F2433] space-y-4 h-fit">
            <div className="text-center">
              <span className="text-5xl font-extrabold text-white">
                {reviewsList.length > 0
                  ? (reviewsList.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewsList.length).toFixed(1)
                  : product.avgRating}
              </span>
              <div className="flex justify-center gap-1 my-2 text-emerald-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-emerald-400" />
                ))}
              </div>
              <p className="text-xs text-slate-400">
                {(product.reviewCount || 10) + reviewsList.filter((r) => r.isUserFeedback).length} total customer reviews
              </p>
            </div>

            {/* Distribution bars */}
            <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span>5★</span>
                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[84%]" />
                </div>
                <span>84%</span>
              </div>
              <div className="flex items-center gap-2">
                <span>4★</span>
                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[12%]" />
                </div>
                <span>12%</span>
              </div>
              <div className="flex items-center gap-2">
                <span>3★</span>
                <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 w-[3%]" />
                </div>
                <span>3%</span>
              </div>
            </div>

            <button
              onClick={() => setIsWritingReview(true)}
              className="w-full py-2.5 rounded-xl border border-slate-700 hover:border-amber-500/50 text-slate-300 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <PenLine className="w-3.5 h-3.5 text-amber-400" />
              <span>Review This Item</span>
            </button>
          </div>

          {/* Customer Reviews List */}
          <div className="md:col-span-2 space-y-4">
            {reviewsList.length === 0 ? (
              <div className="p-8 rounded-2xl bg-[#12151E] border border-dashed border-slate-800 text-center space-y-3">
                <MessageSquare className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">No reviews yet for this product</p>
                <p className="text-xs text-slate-500">Be the first customer to share your thoughts!</p>
                <button
                  onClick={() => setIsWritingReview(true)}
                  className="px-4 py-2 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold"
                >
                  Write the First Review
                </button>
              </div>
            ) : (
              reviewsList.map((rev, idx) => {
                const totalVotes = (rev.helpfulVotes || 0) + (helpfulVotesMap[rev.id] || 0);
                const hasVoted = votedReviews.has(rev.id);
                return (
                  <div
                    key={rev.id || idx}
                    className={`p-5 rounded-2xl bg-[#12151E] border ${
                      rev.isUserFeedback ? 'border-amber-500/30 bg-amber-500/[0.02]' : 'border-[#1F2433]'
                    } space-y-2 transition-all`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-200">{rev.author}</span>
                        {rev.isUserFeedback && (
                          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            Customer Feedback
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-emerald-400 text-xs">
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-emerald-400" />
                      ))}
                      <span className="text-slate-300 ml-1.5 font-semibold">{rev.title}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>

                    <div className="pt-2 flex items-center gap-3 text-[11px] text-slate-500">
                      <button
                        onClick={() => handleHelpfulClick(rev.id)}
                        className={`flex items-center gap-1 transition-colors ${
                          hasVoted ? 'text-emerald-400 font-semibold' : 'hover:text-slate-300'
                        }`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-emerald-400' : ''}`} />
                        <span>{hasVoted ? 'Helpful!' : 'Helpful'} ({totalVotes})</span>
                      </button>
                      <span className="text-slate-700">•</span>
                      <span className="text-emerald-400/80 flex items-center gap-1 text-[11px]">
                        <Check className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Community Q&A Section */}
      <section className="mt-12 pt-8 border-t border-[#1F2433]">
        <h2 className="text-lg font-bold text-white mb-4">Customer Questions & Answers</h2>
        <div className="space-y-4">
          {product.questions?.map((qa, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#12151E] border border-[#1F2433] space-y-1.5 text-xs">
              <p className="font-semibold text-slate-100 flex items-start gap-2">
                <span className="text-amber-400 font-bold">Q:</span>
                <span>{qa.q}</span>
              </p>
              <p className="text-slate-300 flex items-start gap-2 pl-4">
                <span className="text-cyan-400 font-bold">A:</span>
                <span>{qa.a}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Sticky Mobile Add-to-Cart Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090A0F]/95 backdrop-blur-md border-t border-[#1F2433] p-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-slate-400">Total Price</div>
          <div className="text-lg font-bold text-white">{formatPaiseToINR(activeVariant.priceInPaise)}</div>
        </div>
        <button
          onClick={handleAddToCart}
          className="flex-1 h-11 rounded-xl bg-amber-500 text-slate-950 font-bold text-sm shadow-md"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
