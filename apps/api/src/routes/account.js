import express from 'express';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /account/orders
router.get('/account/orders', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const filter = userId ? { userId } : {};

    const orders = await Order.find(filter).sort({ createdAt: -1 }).limit(20).lean();

    res.json({
      success: true,
      data: orders.map((o) => ({ id: o._id.toString(), ...o })),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// GET /account/orders/:id
router.get('/account/orders/:id', optionalAuth, async (req, res, next) => {
  try {
    const orderId = req.params.id;
    let order = null;

    if (orderId.startsWith('ORD-')) {
      order = await Order.findOne({ orderNumber: orderId }).lean();
    } else {
      order = await Order.findById(orderId).lean();
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' },
        timestamp: new Date().toISOString(),
      });
    }

    res.json({
      success: true,
      data: { id: order._id.toString(), ...order },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /account/orders/:id/cancel
router.post('/account/orders/:id/cancel', optionalAuth, async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' },
        timestamp: new Date().toISOString(),
      });
    }

    order.status = 'CANCELLED';
    for (const sub of order.subOrders) {
      sub.status = 'CANCELLED';
    }
    await order.save();

    res.json({
      success: true,
      data: { message: 'Order cancelled successfully', status: 'CANCELLED' },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /account/returns
router.post('/account/returns', optionalAuth, async (req, res) => {
  const { subOrderId, reasonCode, comments } = req.body;
  res.status(201).json({
    success: true,
    data: {
      returnId: `RET-${Date.now().toString().slice(-6)}`,
      status: 'APPROVED_FOR_PICKUP',
      pickupDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      message: 'Return request approved. Courier will pick up item in 48 hours.',
    },
    timestamp: new Date().toISOString(),
  });
});

// POST /account/reviews
router.post('/account/reviews', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const { productId, rating, title, comment, photoUrls = [] } = req.body;

    const user = userId ? await User.findById(userId) : null;
    const userName = user ? user.name : 'Verified Customer';

    const review = await Review.create({
      productId,
      userId: userId || null,
      userName,
      rating: Number(rating),
      title,
      comment,
      photoUrls,
      isVerifiedPurchase: true,
    });

    // Update product rating
    const allReviews = await Review.find({ productId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Product.findByIdAndUpdate(productId, {
      avgRating: Number(avgRating.toFixed(1)),
      reviewCount: allReviews.length,
    });

    res.status(201).json({
      success: true,
      data: review,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// GET /account/addresses
router.get('/account/addresses', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    const user = userId ? await User.findById(userId) : null;

    res.json({
      success: true,
      data: user?.addresses || [
        {
          id: 'addr-default-1',
          name: 'Rahul Sharma',
          phone: '+91 9892019283',
          addressLine1: 'B-402, Lotus Grandeur, Veera Desai Road',
          addressLine2: 'Andheri West',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400053',
          isDefault: true,
          type: 'HOME',
        },
      ],
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /account/addresses
router.post('/account/addresses', optionalAuth, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.addresses.push(req.body);
        await user.save();
        return res.status(201).json({
          success: true,
          data: user.addresses,
          timestamp: new Date().toISOString(),
        });
      }
    }

    res.status(201).json({
      success: true,
      data: req.body,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
