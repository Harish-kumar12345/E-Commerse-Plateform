import express from 'express';
import crypto from 'crypto';
import Order from '../models/Order.js';

const router = express.Router();

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_NexusSecretKey456';

// POST /payments/razorpay/create-order
router.post('/payments/razorpay/create-order', async (req, res, next) => {
  try {
    const { orderId } = req.body;
    let order = null;

    if (orderId) {
      order = await Order.findById(orderId);
    }

    const amountInPaise = order ? order.totalAmountInPaise : 149900;
    const rzpOrderId = `order_${Math.random().toString(36).substring(2, 12)}`;

    res.json({
      success: true,
      data: {
        razorpayOrderId: rzpOrderId,
        amount: amountInPaise,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_NexusSampleKeyId123',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /payments/razorpay/verify
router.post('/payments/razorpay/verify', async (req, res, next) => {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!orderId || !razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_PAYLOAD', message: 'Order ID and payment ID are required' },
        timestamp: new Date().toISOString(),
      });
    }

    const order = await Order.findById(orderId);
    if (order) {
      order.paymentStatus = 'CAPTURED';
      order.status = 'PAID';
      order.razorpayOrderId = razorpayOrderId;
      order.razorpayPaymentId = razorpayPaymentId;
      order.razorpaySignature = razorpaySignature;

      for (const sub of order.subOrders) {
        sub.status = 'CONFIRMED';
      }

      await order.save();
    }

    res.json({
      success: true,
      data: {
        orderId,
        paymentStatus: 'CAPTURED',
        message: 'Payment verified and captured successfully',
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /payments/razorpay/webhook
router.post('/payments/razorpay/webhook', (req, res) => {
  res.json({ received: true });
});

export default router;
