import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

const FALLBACK_CATALOG = [
  {
    id: 'prod-sony-wh1000xm5',
    title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    slug: 'sony-wh-1000xm5-wireless-anc-headphones',
    brand: 'Sony',
    categoryName: 'Audio & Wearables',
    categorySlug: 'audio-wearables',
    priceInPaise: 2799000,
    compareAtInPaise: 3499000,
    avgRating: 4.8,
    reviewCount: 328,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    tags: ['headphones', 'anc', 'noise canceling', 'wireless', 'bluetooth', 'audio', 'sound', 'gym', 'travel', 'commute', 'work', 'sony'],
    specs: { battery: '30 Hours', driver: '30mm Carbon Fiber', weight: '250g', connectivity: 'Bluetooth 5.2' },
    pros: ['Flagship industry-leading noise cancellation', '30-hour battery life with fast charging', 'Ultra-comfortable soft-fit leather'],
    tradeoff: 'Premium price tag; earcups fold flat but do not collapse inwards.',
  },
  {
    id: 'prod-macbook-air-m3',
    title: 'Apple MacBook Air 15-inch M3 Chip (16GB RAM, 512GB SSD)',
    slug: 'apple-macbook-air-15-m3-16gb-512gb',
    brand: 'Apple',
    categoryName: 'Electronics & Gadgets',
    categorySlug: 'electronics',
    priceInPaise: 15490000,
    compareAtInPaise: 17490000,
    avgRating: 4.9,
    reviewCount: 194,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    tags: ['laptop', 'apple', 'macbook', 'm3', 'programming', 'student', 'editing', 'lightweight', 'mac'],
    specs: { processor: 'Apple M3 8-core CPU', memory: '16GB Unified', storage: '512GB SSD', display: '15.3-inch Liquid Retina' },
    pros: ['Phenomenal 18-hour battery life', 'Fanless, completely silent operation', 'Vibrant 15.3-inch Liquid Retina display'],
    tradeoff: 'Supports dual external displays only with laptop lid closed.',
  },
  {
    id: 'prod-dell-xps-14',
    title: 'Dell XPS 14 OLED Intel Core Ultra 7 (32GB RAM, 1TB SSD, RTX 4050)',
    slug: 'dell-xps-14-oled-core-ultra-7',
    brand: 'Dell',
    categoryName: 'Electronics & Gadgets',
    categorySlug: 'electronics',
    priceInPaise: 18990000,
    compareAtInPaise: 21990000,
    avgRating: 4.7,
    reviewCount: 88,
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
    tags: ['laptop', 'dell', 'xps', 'windows', 'oled', 'programming', 'engineering', 'gaming', 'intel'],
    specs: { processor: 'Intel Core Ultra 7 155H', graphics: 'NVIDIA RTX 4050 6GB', display: '3.2K OLED 120Hz Touch' },
    pros: ['Stunning 3.2K OLED 120Hz display', 'Dedicated RTX 4050 graphics', 'CNC machined aluminum premium chassis'],
    tradeoff: 'Capacitive touch function row takes getting used to.',
  },
  {
    id: 'prod-bose-quietcomfort-ultra',
    title: 'Bose QuietComfort Ultra Wireless Noise Canceling Headphones',
    slug: 'bose-quietcomfort-ultra-anc',
    brand: 'Bose',
    categoryName: 'Audio & Wearables',
    categorySlug: 'audio-wearables',
    priceInPaise: 2990000,
    compareAtInPaise: 3590000,
    avgRating: 4.7,
    reviewCount: 210,
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
    tags: ['headphones', 'bose', 'anc', 'comfort', 'quietcomfort', 'travel', 'spatial audio'],
    specs: { battery: '24 Hours', features: 'Immersive Spatial Audio', weight: '252g' },
    pros: ['Unrivaled ear cushion comfort for long flights', 'Immersive spatial audio mode', 'Crystal clear microphone array'],
    tradeoff: 'Slightly shorter battery life than Sony XM5.',
  },
];

// POST /ai-finder/recommend
router.post('/ai-finder/recommend', async (req, res, next) => {
  try {
    const { query, maxBudgetPaise, categorySlug, priority = 'balanced' } = req.body;

    if (!query || String(query).trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_QUERY', message: 'Search query must be at least 2 characters long' },
        timestamp: new Date().toISOString(),
      });
    }

    const cleanQuery = String(query).toLowerCase();
    const queryTokens = cleanQuery.split(/[\s,.-]+/).filter((t) => t.length > 1);

    // Fetch products from MongoDB
    let dbProducts = await Product.find({ status: 'PUBLISHED' }).limit(50).lean();

    let candidatePool = dbProducts.length > 0 ? dbProducts : FALLBACK_CATALOG;

    // Filter budget
    if (maxBudgetPaise && maxBudgetPaise > 0) {
      const budgetMatched = candidatePool.filter((p) => p.priceInPaise <= maxBudgetPaise);
      if (budgetMatched.length >= 2) {
        candidatePool = budgetMatched;
      }
    }

    // Score candidates
    const scored = candidatePool.map((p) => {
      let score = 50;
      const searchableText = `${p.title} ${p.brand} ${p.categoryName || ''} ${(p.tags || []).join(' ')} ${(p.keywords || []).join(' ')}`.toLowerCase();

      for (const token of queryTokens) {
        if (searchableText.includes(token)) score += 15;
      }

      if (priority === 'value') {
        if (p.priceInPaise < 5000000) score += 15;
      } else if (priority === 'performance') {
        if (p.priceInPaise > 8000000) score += 15;
      } else if (priority === 'rating') {
        score += Math.round((p.avgRating || 4.5) * 6);
      }

      score = Math.min(99, Math.max(65, score));

      return {
        id: p._id ? p._id.toString() : p.id,
        title: p.title,
        slug: p.slug,
        brand: p.brand,
        categoryName: p.categoryName || 'General',
        priceInPaise: p.priceInPaise,
        compareAtInPaise: p.compareAtInPaise,
        avgRating: p.avgRating || 4.7,
        reviewCount: p.reviewCount || 100,
        imageUrl: p.primaryImage || p.imageUrl,
        matchScore: score,
        pros: p.pros || ['High customer satisfaction', 'Fast and secure shipping', 'Verified authentic seller warranty'],
        tradeoff: p.tradeoff || 'High demand item with limited seasonal stock.',
        whyPickThis: `Top match for "${query}" with excellent ${p.avgRating}★ rating and stellar feedback.`,
      };
    });

    scored.sort((a, b) => b.matchScore - a.matchScore);
    const topResults = scored.slice(0, 4);

    res.json({
      success: true,
      data: {
        recommendations: topResults,
        inferredIntent: {
          budgetFormatted: maxBudgetPaise ? `₹${(maxBudgetPaise / 100).toLocaleString('en-IN')}` : 'Flexible',
          priorityPreference: priority,
          bestCategoryMatch: topResults[0]?.categoryName || 'All Categories',
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
