import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

function calculateCartTotals(cart) {
  let subtotal = 0;
  let totalItems = 0;
  const itemsBySellerMap = new Map();

  for (const item of cart.items) {
    const itemSubtotal = item.priceInPaise * item.quantity;
    subtotal += itemSubtotal;
    totalItems += item.quantity;

    const sName = item.sellerName || 'Apex Electronics';
    if (!itemsBySellerMap.has(sName)) {
      itemsBySellerMap.set(sName, {
        sellerName: sName,
        items: [],
        subtotalInPaise: 0,
      });
    }
    const group = itemsBySellerMap.get(sName);
    group.items.push(item);
    group.subtotalInPaise += itemSubtotal;
  }

  // 18% GST estimate
  const estimatedTaxInPaise = Math.round(subtotal * 0.18);
  // Free shipping above ₹499
  const shippingFeeInPaise = subtotal >= 49900 || subtotal === 0 ? 0 : 4900;
  const discountInPaise = cart.discountInPaise || 0;
  const totalAmountInPaise = Math.max(0, subtotal + estimatedTaxInPaise + shippingFeeInPaise - discountInPaise);

  return {
    itemsBySeller: Array.from(itemsBySellerMap.values()),
    totalItems,
    subtotalInPaise: subtotal,
    estimatedTaxInPaise,
    shippingFeeInPaise,
    discountInPaise,
    couponCode: cart.couponCode || null,
    totalAmountInPaise,
  };
}

async function findOrCreateCart(userId, guestId) {
  let cart = null;
  if (userId) {
    cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId, items: [] });
    }
  } else if (guestId) {
    cart = await Cart.findOne({ guestId });
    if (!cart) {
      cart = await Cart.create({ guestId, items: [] });
    }
  }
  return cart;
}

// GET /cart
router.get('/cart', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const guestId = req.query.guestId;

    if (!userId && !guestId) {
      return res.json({
        success: true,
        data: {
          itemsBySeller: [],
          totalItems: 0,
          subtotalInPaise: 0,
          estimatedTaxInPaise: 0,
          shippingFeeInPaise: 0,
          discountInPaise: 0,
          totalAmountInPaise: 0,
        },
        timestamp: new Date().toISOString(),
      });
    }

    const cart = await findOrCreateCart(userId, guestId);
    const totals = calculateCartTotals(cart);

    res.json({
      success: true,
      data: totals,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /cart/items
router.post('/cart/items', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { guestId, productId, variantId, quantity = 1 } = req.body;

    if (!userId && !guestId) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_IDENTITY', message: 'User or guest identification required' },
        timestamp: new Date().toISOString(),
      });
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({
        success: false,
        error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found' },
        timestamp: new Date().toISOString(),
      });
    }

    const cart = await findOrCreateCart(userId, guestId);

    const price = product.priceInPaise;
    const existingIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && (variantId ? item.variantId === variantId : true)
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        productId: product._id,
        variantId: variantId || null,
        title: product.title,
        slug: product.slug,
        primaryImage: product.primaryImage,
        priceInPaise: price,
        compareAtInPaise: product.compareAtInPaise,
        quantity: Number(quantity),
        sellerId: product.sellerId || null,
        sellerName: product.sellerName || 'Apex Electronics',
      });
    }

    await cart.save();
    const totals = calculateCartTotals(cart);

    res.json({
      success: true,
      data: totals,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /cart/items/:id
router.patch('/cart/items/:id', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { guestId, quantity } = req.body;
    const itemId = req.params.id;

    const cart = await findOrCreateCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: { code: 'CART_NOT_FOUND', message: 'Cart not found' },
        timestamp: new Date().toISOString(),
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: { code: 'ITEM_NOT_FOUND', message: 'Item not in cart' },
        timestamp: new Date().toISOString(),
      });
    }

    if (Number(quantity) <= 0) {
      cart.items.pull(itemId);
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();
    const totals = calculateCartTotals(cart);

    res.json({
      success: true,
      data: totals,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// DELETE /cart/items/:id
router.delete('/cart/items/:id', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const guestId = req.query.guestId;
    const itemId = req.params.id;

    const cart = await findOrCreateCart(userId, guestId);
    if (cart) {
      cart.items.pull(itemId);
      await cart.save();
    }

    const totals = cart ? calculateCartTotals(cart) : { itemsBySeller: [], totalItems: 0 };

    res.json({
      success: true,
      data: totals,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /cart/coupon
router.post('/cart/coupon', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { guestId, code } = req.body;

    const cleanCode = String(code || '').trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });

    if (!coupon) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_COUPON', message: 'Invalid or expired promotional code' },
        timestamp: new Date().toISOString(),
      });
    }

    const cart = await findOrCreateCart(userId, guestId);
    let subtotal = cart.items.reduce((acc, i) => acc + i.priceInPaise * i.quantity, 0);

    let discount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountInPaise) {
        discount = Math.min(discount, coupon.maxDiscountInPaise);
      }
    } else {
      discount = coupon.discountValue;
    }

    cart.couponCode = cleanCode;
    cart.discountInPaise = discount;
    await cart.save();

    const totals = calculateCartTotals(cart);
    res.json({
      success: true,
      data: totals,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /cart/merge
router.post('/cart/merge', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { guestId } = req.body;

    if (!userId || !guestId) {
      return res.json({ success: true, timestamp: new Date().toISOString() });
    }

    const guestCart = await Cart.findOne({ guestId });
    if (guestCart && guestCart.items.length > 0) {
      const userCart = await findOrCreateCart(userId, null);

      for (const gItem of guestCart.items) {
        const existing = userCart.items.find(
          (i) => i.productId.toString() === gItem.productId.toString()
        );
        if (existing) {
          existing.quantity += gItem.quantity;
        } else {
          userCart.items.push(gItem);
        }
      }

      await userCart.save();
      await Cart.deleteOne({ _id: guestCart._id });
    }

    res.json({ success: true, message: 'Cart merged successfully', timestamp: new Date().toISOString() });
  } catch (err) {
    next(err);
  }
});

export default router;
