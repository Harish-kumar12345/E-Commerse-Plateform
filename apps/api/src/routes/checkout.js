import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// POST /checkout/create-order
router.post('/checkout/create-order', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { addressId, paymentMethod = 'UPI', couponCode, idempotencyKey } = req.body;

    const [user, cart] = await Promise.all([
      User.findById(userId),
      Cart.findOne({ userId }),
    ]);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found.' },
        timestamp: new Date().toISOString(),
      });
    }

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'EMPTY_CART', message: 'Cannot checkout with an empty cart.' },
        timestamp: new Date().toISOString(),
      });
    }

    // Select address
    let shippingAddress = null;
    if (addressId && user.addresses?.length > 0) {
      shippingAddress = user.addresses.id(addressId) || user.addresses[0];
    } else if (user.addresses?.length > 0) {
      shippingAddress = user.addresses[0];
    } else {
      shippingAddress = {
        name: user.name,
        phone: user.phoneNumber || '9876543210',
        addressLine1: 'B-402, Lotus Grandeur, Veera Desai Road',
        addressLine2: 'Andheri West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400053',
      };
    }

    // Group items by seller for multi-seller marketplace split
    const sellerItemsMap = new Map();
    let subtotalInPaise = 0;

    for (const item of cart.items) {
      const sName = item.sellerName || 'Apex Electronics';
      if (!sellerItemsMap.has(sName)) {
        sellerItemsMap.set(sName, []);
      }
      sellerItemsMap.get(sName).push(item);
      subtotalInPaise += item.priceInPaise * item.quantity;
    }

    const taxInPaise = Math.round(subtotalInPaise * 0.18);
    const shippingFeeInPaise = subtotalInPaise >= 49900 ? 0 : 4900;
    const discountInPaise = cart.discountInPaise || 0;
    const totalAmountInPaise = Math.max(0, subtotalInPaise + taxInPaise + shippingFeeInPaise - discountInPaise);

    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const subOrders = Array.from(sellerItemsMap.entries()).map(([sellerName, items], index) => {
      const sellerSubtotal = items.reduce((acc, i) => acc + i.priceInPaise * i.quantity, 0);
      const commissionInPaise = Math.round(sellerSubtotal * 0.1);
      const sellerNetPayableInPaise = sellerSubtotal - commissionInPaise;

      return {
        subOrderNumber: `${orderNumber}-S${index + 1}`,
        sellerName,
        subTotalInPaise: sellerSubtotal,
        commissionInPaise,
        sellerNetPayableInPaise,
        status: paymentMethod === 'COD' ? 'PROCESSING' : 'CONFIRMED',
        trackingNumber: `TRK-DLH-${Math.floor(100000000 + Math.random() * 900000000)}`,
        courierPartner: 'Delhivery',
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          title: i.title,
          slug: i.slug,
          primaryImage: i.primaryImage,
          priceInPaise: i.priceInPaise,
          quantity: i.quantity,
          sellerName,
        })),
      };
    });

    const isCod = paymentMethod === 'COD';
    const newOrder = await Order.create({
      orderNumber,
      userId: user._id,
      customerName: user.name,
      customerEmail: user.email,
      customerPhone: user.phoneNumber || '9876543210',
      shippingAddress,
      paymentMethod,
      paymentStatus: isCod ? 'PENDING' : 'CAPTURED',
      status: isCod ? 'PROCESSING' : 'PAID',
      totalAmountInPaise,
      subtotalInPaise,
      taxInPaise,
      shippingFeeInPaise,
      discountInPaise,
      couponCode: cart.couponCode || null,
      idempotencyKey,
      subOrders,
    });

    // Clear cart after checkout
    cart.items = [];
    cart.couponCode = null;
    cart.discountInPaise = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      data: {
        order: {
          id: newOrder._id.toString(),
          orderNumber: newOrder.orderNumber,
          status: newOrder.status,
          paymentStatus: newOrder.paymentStatus,
          totalAmountInPaise: newOrder.totalAmountInPaise,
          subOrders: newOrder.subOrders,
        },
        razorpayOrder:
          paymentMethod === 'COD'
            ? null
            : {
                id: `order_rzp_${newOrder.orderNumber.toLowerCase()}`,
                amount: totalAmountInPaise,
                currency: 'INR',
              },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /checkout/cod/verify-otp
router.post('/checkout/cod/verify-otp', authenticate, (req, res) => {
  const { otp } = req.body;
  if (!otp || String(otp).trim() !== '1234') {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_OTP', message: 'Invalid OTP. Please enter 1234 for demo verification.' },
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    success: true,
    data: { verified: true, message: 'Cash on delivery verified successfully' },
    timestamp: new Date().toISOString(),
  });
});

export default router;
