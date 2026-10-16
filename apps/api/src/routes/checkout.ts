import { FastifyInstance, FastifyRequest } from 'fastify';
import { db, ParentOrderStatus, SubOrderStatus, PaymentMethod, PaymentStatus } from '@nexus/db';
import { CheckoutOrderSchema, VerifyCodOtpSchema } from '@nexus/shared';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'nexus_super_secret_jwt_access_token_key_change_in_production_2026';
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_NexusSampleKeyId123';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_NexusSecretKey456';

function getUserIdFromRequest(request: FastifyRequest): string | null {
  try {
    let token = '';
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (request.cookies?.nexus_access_token) {
      token = request.cookies.nexus_access_token;
    }
    if (token) {
      const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as { userId: string };
      return decoded.userId;
    }
  } catch (e) {
    // Guest
  }
  return null;
}

export async function checkoutRoutes(fastify: FastifyInstance) {
  // POST /checkout/create-order (Atomic multi-seller order transactional split)
  fastify.post('/checkout/create-order', async (request, reply) => {
    const parse = CheckoutOrderSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_CHECKOUT_DATA', message: 'Address, payment method and idempotency key are required' },
        timestamp: new Date().toISOString(),
      });
    }

    const { addressId, paymentMethod, couponCode, idempotencyKey } = parse.data;
    const userId = getUserIdFromRequest(request);

    if (!userId) {
      return reply.status(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Please login or register to complete your order.' },
        timestamp: new Date().toISOString(),
      });
    }

    // Fetch user cart
    const cart = await db.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    seller: true,
                  },
                },
                inventory: true,
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return reply.status(400).send({
        success: false,
        error: { code: 'EMPTY_CART', message: 'Your cart is empty.' },
        timestamp: new Date().toISOString(),
      });
    }

    // Verify stock availability
    for (const item of cart.items) {
      const available = item.variant.inventory?.quantityOnHand ?? 0;
      if (available < item.quantity) {
        return reply.status(400).send({
          success: false,
          error: {
            code: 'INSUFFICIENT_STOCK',
            message: `Variant ${item.variant.title} has only ${available} items in stock.`,
          },
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Partition items by Seller
    const sellerGroups = new Map<string, any>();
    let orderSubtotalPaise = 0;

    for (const item of cart.items) {
      const seller = item.variant.product.seller;
      const itemTotal = item.variant.priceInPaise * item.quantity;
      orderSubtotalPaise += itemTotal;

      if (!sellerGroups.has(seller.id)) {
        sellerGroups.set(seller.id, {
          seller,
          items: [],
          subtotalPaise: 0,
        });
      }

      const group = sellerGroups.get(seller.id);
      group.subtotalPaise += itemTotal;
      group.items.push(item);
    }

    const totalTaxPaise = Math.round(orderSubtotalPaise * 0.18);
    const shippingFeePaise = 0; // Free for Prime
    const totalOrderAmountPaise = orderSubtotalPaise + totalTaxPaise + shippingFeePaise;

    // Generate Order Number
    const orderNumber = `NX-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    // Execute atomic multi-seller order transaction
    const order = await db.$transaction(async (tx) => {
      // 1. Create parent Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          addressId,
          totalAmountInPaise: totalOrderAmountPaise,
          taxAmountInPaise: totalTaxPaise,
          shippingFeeInPaise: shippingFeePaise,
          couponCode: couponCode || null,
          status: paymentMethod === 'COD' ? ParentOrderStatus.PROCESSING : ParentOrderStatus.PENDING_PAYMENT,
        },
      });

      // 2. Create sub-orders per seller
      let subIndex = 1;
      for (const [sellerId, group] of sellerGroups.entries()) {
        const subOrderNumber = `${orderNumber}-S${subIndex++}`;
        const commissionRate = group.seller.commissionRate;
        const commissionInPaise = Math.round(group.subtotalPaise * commissionRate);
        const sellerNetPayableInPaise = group.subtotalPaise - commissionInPaise;
        const subTaxPaise = Math.round(group.subtotalPaise * 0.18);

        const subOrder = await tx.subOrder.create({
          data: {
            subOrderNumber,
            parentOrderId: newOrder.id,
            sellerId,
            subTotalInPaise: group.subtotalPaise,
            taxInPaise: subTaxPaise,
            shippingInPaise: 0,
            commissionRate,
            commissionInPaise,
            sellerNetPayableInPaise,
            status: paymentMethod === 'COD' ? SubOrderStatus.CONFIRMED : SubOrderStatus.PLACED,
          },
        });

        // Create Order Items & Reserve Inventory
        for (const item of group.items) {
          await tx.orderItem.create({
            data: {
              subOrderId: subOrder.id,
              variantId: item.variantId,
              unitPriceInPaise: item.variant.priceInPaise,
              taxRatePercent: item.variant.product.taxRatePercent,
              quantity: item.quantity,
              totalInPaise: item.variant.priceInPaise * item.quantity,
            },
          });

          // Reserve inventory
          await tx.inventory.update({
            where: { variantId: item.variantId },
            data: {
              quantityReserved: { increment: item.quantity },
            },
          });
        }
      }

      // 3. Create Payment record
      const isCod = paymentMethod === 'COD';
      const codOtp = isCod ? Math.floor(100000 + Math.random() * 900000).toString() : null;

      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          method: paymentMethod as PaymentMethod,
          status: isCod ? PaymentStatus.PENDING : PaymentStatus.PENDING,
          amountInPaise: totalOrderAmountPaise,
          razorpayOrderId: !isCod ? `order_rzp_${newOrder.id.replace(/-/g, '').substring(0, 14)}` : null,
          codOtpCode: codOtp,
          codOtpVerified: false,
        },
      });

      // 4. Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    const isCod = paymentMethod === 'COD';

    return reply.status(201).send({
      success: true,
      data: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        totalAmountInPaise: order.totalAmountInPaise,
        paymentMethod,
        isCod,
        requiresCodOtp: isCod,
        razorpayConfig: !isCod
          ? {
              keyId: RAZORPAY_KEY_ID,
              orderId: `order_rzp_${order.id.replace(/-/g, '').substring(0, 14)}`,
              amountInPaise: order.totalAmountInPaise,
              currency: 'INR',
              name: 'NEXUS Bazaar Technologies',
            }
          : null,
      },
      timestamp: new Date().toISOString(),
    });
  });

  // POST /checkout/verify-cod-otp (Simulate SMS OTP verification for COD orders)
  fastify.post('/checkout/verify-cod-otp', async (request, reply) => {
    const parse = VerifyCodOtpSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_OTP', message: 'Valid 6-digit OTP code required' },
        timestamp: new Date().toISOString(),
      });
    }

    const { orderId, otpCode } = parse.data;

    const payment = await db.payment.findUnique({
      where: { orderId },
      include: { order: true },
    });

    if (!payment) {
      return reply.status(404).send({
        success: false,
        error: { code: 'PAYMENT_NOT_FOUND', message: 'Order payment record not found' },
        timestamp: new Date().toISOString(),
      });
    }

    // Verify OTP (accept simulated correct OTP or matching code)
    if (payment.codOtpCode && payment.codOtpCode !== otpCode && otpCode !== '123456') {
      return reply.status(400).send({
        success: false,
        error: { code: 'INCORRECT_OTP', message: 'Incorrect OTP entered. Please try again.' },
        timestamp: new Date().toISOString(),
      });
    }

    await db.$transaction([
      db.payment.update({
        where: { orderId },
        data: { codOtpVerified: true },
      }),
      db.order.update({
        where: { id: orderId },
        data: { status: ParentOrderStatus.PAID },
      }),
      db.subOrder.updateMany({
        where: { parentOrderId: orderId },
        data: { status: SubOrderStatus.CONFIRMED },
      }),
    ]);

    return {
      success: true,
      data: {
        orderId,
        orderNumber: payment.order.orderNumber,
        status: 'CONFIRMED',
        message: 'COD order verified successfully.',
      },
      timestamp: new Date().toISOString(),
    };
  });
}
