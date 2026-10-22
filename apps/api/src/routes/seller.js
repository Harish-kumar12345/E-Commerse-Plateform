import express from 'express';
import SellerProfile from '../models/SellerProfile.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Helper to get active seller context
async function resolveSeller(req) {
  if (req.user?.userId) {
    const user = await User.findById(req.user.userId);
    if (user?.sellerProfileId) {
      return await SellerProfile.findById(user.sellerProfileId);
    }
  }
  return await SellerProfile.findOne({ status: 'ACTIVE' });
}

// POST /seller/register
router.post('/seller/register', optionalAuth, async (req, res, next) => {
  try {
    const { storeName, businessEmail, businessPhone, gstin, pan, bankAccountNo, bankIfsc, pickupAddress, pickupPincode } = req.body;

    if (!storeName || !businessEmail || !gstin || !pan) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Store name, business email, GSTIN, and PAN are required' },
        timestamp: new Date().toISOString(),
      });
    }

    const storeSlug = storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existing = await SellerProfile.findOne({
      $or: [{ gstin }, { storeSlug }, { businessEmail }],
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: { code: 'SELLER_EXISTS', message: 'A seller with this GSTIN, store name or email already exists.' },
        timestamp: new Date().toISOString(),
      });
    }

    const userId = req.user?.userId || (await User.findOne({ role: 'SELLER' }))?._id || (await User.findOne())?._id;

    const seller = await SellerProfile.create({
      userId,
      storeName,
      storeSlug,
      businessEmail,
      businessPhone: businessPhone || '9820011223',
      gstin,
      pan,
      bankAccountNo: bankAccountNo || '918273645019',
      bankIfsc: bankIfsc || 'HDFC0001234',
      pickupAddress: pickupAddress || '101, Industrial Area, Andheri East, Mumbai',
      pickupPincode: pickupPincode || '400069',
      status: 'ACTIVE',
      rating: 4.8,
      commissionRate: 0.1,
    });

    if (userId) {
      await User.findByIdAndUpdate(userId, { role: 'SELLER', sellerProfileId: seller._id });
    }

    res.status(201).json({
      success: true,
      data: { id: seller._id.toString(), ...seller.toObject() },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// GET /seller/dashboard
router.get('/seller/dashboard', optionalAuth, async (req, res, next) => {
  try {
    const seller = await resolveSeller(req);
    const sellerName = seller?.storeName || 'Apex Electronics';

    const [totalProducts, lowStockProducts] = await Promise.all([
      Product.countDocuments({ sellerName }),
      Product.countDocuments({ sellerName, isInStock: false }),
    ]);

    res.json({
      success: true,
      data: {
        seller: seller ? { id: seller._id.toString(), ...seller.toObject() } : { storeName: sellerName, rating: 4.8 },
        metrics: {
          totalProducts,
          lowStockProducts,
          todayOrders: 14,
          todayRevenueInPaise: 14200000,
          pendingShipments: 6,
          rating: seller?.rating || 4.8,
          totalReviews: seller?.reviewCount || 120,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// GET /seller/products
router.get('/seller/products', optionalAuth, async (req, res, next) => {
  try {
    const seller = await resolveSeller(req);
    const sellerName = seller?.storeName || 'Apex Electronics';

    const products = await Product.find({ sellerName }).sort({ createdAt: -1 }).lean();

    res.json({
      success: true,
      data: products.map((p) => ({ id: p._id.toString(), ...p })),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /seller/products
router.post('/seller/products', optionalAuth, async (req, res, next) => {
  try {
    const seller = await resolveSeller(req);
    const sellerName = seller?.storeName || 'Apex Electronics';
    const { title, description, brand, categorySlug, categoryName, priceInPaise, compareAtInPaise, primaryImage, variants = [] } = req.body;

    if (!title || !priceInPaise || !primaryImage) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Title, price, and image are required' },
        timestamp: new Date().toISOString(),
      });
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}-${Date.now().toString().slice(-4)}`;

    const product = await Product.create({
      title,
      slug,
      description: description || title,
      brand: brand || 'NEXUS Essentials',
      categorySlug: categorySlug || 'electronics',
      categoryName: categoryName || 'Electronics & Gadgets',
      sellerId: seller?._id || null,
      sellerName,
      priceInPaise: Number(priceInPaise),
      compareAtInPaise: compareAtInPaise ? Number(compareAtInPaise) : null,
      primaryImage,
      images: [primaryImage],
      avgRating: 4.8,
      reviewCount: 1,
      isInStock: true,
      isPrime: true,
      variants: variants.length > 0 ? variants : [{ sku: `SKU-${Date.now().toString().slice(-6)}`, title: 'Standard', priceInPaise: Number(priceInPaise), stock: 50 }],
    });

    res.status(201).json({
      success: true,
      data: { id: product._id.toString(), ...product.toObject() },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /seller/products/:id/inventory
router.patch('/seller/products/:id/inventory', async (req, res, next) => {
  try {
    const { quantityOnHand } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found' },
        timestamp: new Date().toISOString(),
      });
    }

    const qty = Number(quantityOnHand) || 0;
    product.isInStock = qty > 0;
    if (product.variants?.length > 0) {
      product.variants[0].stock = qty;
    }
    await product.save();

    res.json({
      success: true,
      data: { id: product._id.toString(), ...product.toObject() },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// GET /seller/orders
router.get('/seller/orders', optionalAuth, async (req, res, next) => {
  try {
    const seller = await resolveSeller(req);
    const sellerName = seller?.storeName || 'Apex Electronics';

    const orders = await Order.find({ 'subOrders.sellerName': sellerName }).sort({ createdAt: -1 }).lean();

    res.json({
      success: true,
      data: orders.map((o) => ({ id: o._id.toString(), ...o })),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
