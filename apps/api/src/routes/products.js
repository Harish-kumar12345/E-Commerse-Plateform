import express from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

const router = express.Router();

// GET /products/autocomplete
router.get('/products/autocomplete', async (req, res, next) => {
  try {
    const q = req.query.q ? String(req.query.q).trim() : '';
    const limit = Math.min(Number(req.query.limit) || 6, 10);

    if (!q) {
      return res.json({ success: true, data: [], timestamp: new Date().toISOString() });
    }

    const regex = new RegExp(q, 'i');
    const suggestions = await Product.find({
      status: 'PUBLISHED',
      $or: [{ title: regex }, { brand: regex }, { keywords: regex }],
    })
      .select('title slug brand primaryImage priceInPaise categoryName')
      .limit(limit)
      .lean();

    res.json({
      success: true,
      data: suggestions.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        slug: p.slug,
        brand: p.brand,
        primaryImage: p.primaryImage,
        priceInPaise: p.priceInPaise,
        categoryName: p.categoryName,
      })),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// GET /products
router.get('/products', async (req, res, next) => {
  try {
    const {
      query,
      categorySlug,
      brand,
      minPrice,
      maxPrice,
      minRating,
      isDeal,
      sort,
      page = 1,
      limit = 24,
    } = req.query;

    const filter = { status: 'PUBLISHED' };

    if (query) {
      const regex = new RegExp(String(query).trim(), 'i');
      filter.$or = [{ title: regex }, { description: regex }, { brand: regex }, { keywords: regex }];
    }

    if (categorySlug) {
      // Check if this category has subcategories
      const cat = await Category.findOne({ slug: categorySlug }).lean();
      if (cat) {
        const subCats = await Category.find({ parentId: cat._id }).select('slug').lean();
        const slugs = [categorySlug, ...subCats.map((s) => s.slug)];
        filter.categorySlug = { $in: slugs };
      } else {
        filter.categorySlug = categorySlug;
      }
    }

    if (brand) {
      const brandsList = String(brand)
        .split(',')
        .map((b) => new RegExp(`^${b.trim()}$`, 'i'));
      filter.brand = { $in: brandsList };
    }

    if (minRating) {
      filter.avgRating = { $gte: Number(minRating) };
    }

    if (isDeal === 'true' || isDeal === true) {
      filter.isDealOfTheDay = true;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.priceInPaise = {};
      if (minPrice !== undefined) filter.priceInPaise.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.priceInPaise.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'rating_desc') sortOption = { avgRating: -1 };
    else if (sort === 'price_asc') sortOption = { priceInPaise: 1 };
    else if (sort === 'price_desc') sortOption = { priceInPaise: -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [total, products, allBrands] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean(),
      Product.distinct('brand', { status: 'PUBLISHED', ...(categorySlug ? { categorySlug: filter.categorySlug } : {}) }),
    ]);

    const formattedProducts = products.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      brand: p.brand,
      primaryImage: p.primaryImage,
      priceInPaise: p.priceInPaise,
      compareAtInPaise: p.compareAtInPaise,
      avgRating: p.avgRating,
      reviewCount: p.reviewCount,
      isDealOfTheDay: p.isDealOfTheDay,
      isInStock: p.isInStock,
      isPrime: p.isPrime,
      sellerName: p.sellerName,
      categorySlug: p.categorySlug,
      categoryName: p.categoryName,
      variants: p.variants || [],
      tags: p.tags || [],
    }));

    res.json({
      success: true,
      data: {
        products: formattedProducts,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
          hasNext: skip + products.length < total,
        },
        facets: {
          brands: allBrands.filter(Boolean),
          priceBounds: { min: 49900, max: 25000000 },
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// GET /products/:slug
router.get('/products/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug }).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found.' },
        timestamp: new Date().toISOString(),
      });
    }

    // Similar products in same category
    const relatedProducts = await Product.find({
      categorySlug: product.categorySlug,
      _id: { $ne: product._id },
      status: 'PUBLISHED',
    })
      .limit(6)
      .select('title slug brand primaryImage priceInPaise compareAtInPaise avgRating reviewCount isPrime')
      .lean();

    res.json({
      success: true,
      data: {
        id: product._id.toString(),
        ...product,
        relatedProducts: relatedProducts.map((p) => ({ id: p._id.toString(), ...p })),
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /products/estimate-pincode
router.post('/products/estimate-pincode', (req, res) => {
  const { pincode, productId } = req.body;
  if (!pincode || !/^\d{6}$/.test(pincode)) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_PINCODE', message: 'Must be a valid 6-digit Indian PIN code' },
      timestamp: new Date().toISOString(),
    });
  }

  const isExpressAvailable = ['400', '110', '560', '500', '600', '700'].some((prefix) => pincode.startsWith(prefix));
  const today = new Date();
  const deliveryDate = new Date(today);
  deliveryDate.setDate(today.getDate() + (isExpressAvailable ? 1 : 3));

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  res.json({
    success: true,
    data: {
      pincode,
      isDeliverable: true,
      estimatedDeliveryDate: deliveryDate.toISOString(),
      deliveryMessage: `FREE delivery by ${days[deliveryDate.getDay()]}, ${deliveryDate.getDate()} ${months[deliveryDate.getMonth()]}`,
      isExpressAvailable,
      cashOnDeliveryAvailable: true,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
