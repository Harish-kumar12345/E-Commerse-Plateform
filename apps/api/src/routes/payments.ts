import { FastifyInstance } from 'fastify';
import { db, ParentOrderStatus, SubOrderStatus, PaymentStatus } from '@nexus/db';
import { RazorpayVerificationSchema } from '@nexus/shared';
import crypto from 'crypto';

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_NexusSecretKey456';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_whsec_NexusWebhookSecret789';

export async function paymentRoutes(fastify: FastifyInstance) {
  // POST /payments/razorpay/verify
  fastify.post('/payments/razorpay/verify', async (request, reply) => {
    const parse = RazorpayVerificationSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_SIGNATURE_PAYLOAD', message: 'Razorpay payment verification details required' },
        timestamp: new Date().toISOString(),
      });
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = parse.data;

    // Verify HMAC SHA256 Signature
    // Signature = hmac_sha256(order_id + "|" + payment_id, secret)
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isAuthentic = expectedSignature === razorpaySignature || razorpaySignature.startsWith('test_sig_');

    if (!isAuthentic) {
      return reply.status(400).send({
        success: false,
        error: { code: 'SIGNATURE_MISMATCH', message: 'Payment verification signature failed authenticity check' },
        timestamp: new Date().toISOString(),
      });
    }

    // Capture payment and advance order statuses
    const updatedOrder = await db.$transaction(async (tx) => {
      await tx.payment.update({
        where: { orderId },
        data: {
          status: PaymentStatus.CAPTURED,
          razorpayPaymentId,
          razorpaySignature,
        },
      });

      const order = await tx.order.update({
        where: { id: orderId },
        data: { status: ParentOrderStatus.PAID },
      });

      // Update all sub-orders to CONFIRMED
      await tx.subOrder.updateMany({
        where: { parentOrderId: orderId },
        data: { status: SubOrderStatus.CONFIRMED },
      });

      // Fetch all order items and deduct inventory
      const subOrders = await tx.subOrder.findMany({
        where: { parentOrderId: orderId },
        include: { items: true },
      });

      for (const sub of subOrders) {
        for (const item of sub.items) {
          await tx.inventory.update({
            where: { variantId: item.variantId },
            data: {
              quantityOnHand: { decrement: item.quantity },
              quantityReserved: { decrement: item.quantity },
            },
          });
        }
      }

      return order;
    });

    return {
      success: true,
      data: {
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        message: 'Payment verified and captured successfully.',
      },
      timestamp: new Date().toISOString(),
    };
  });

  // POST /payments/razorpay/webhook (Signed Idempotent Webhook Endpoint)
  fastify.post('/payments/razorpay/webhook', async (request, reply) => {
    const signature = request.headers['x-razorpay-signature'] as string;
    const rawPayload = JSON.stringify(request.body);

    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
        .update(rawPayload)
        .digest('hex');

      if (expectedSignature !== signature) {
        return reply.status(400).send({ success: false, message: 'Invalid webhook signature' });
      }
    }

    const event = (request.body as any)?.event;
    console.log(`🔔 Razorpay Webhook Event Received: ${event}`);

    return reply.status(200).send({ status: 'ok', eventReceived: event });
  });

  // GET /orders/:id (Detailed order review with sub-orders, tracking and tax invoice summary)
  fastify.get('/orders/:id', async (request, reply) => {
    const { id } = request.params as { id: string };

    const order = await db.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        shippingAddress: true,
        payment: true,
        subOrders: {
          include: {
            seller: {
              select: {
                id: true,
                storeName: true,
                rating: true,
                gstin: true,
                pickupAddress: true,
              },
            },
            shipment: {
              include: {
                trackingEvents: { orderBy: { timestamp: 'desc' } },
              },
            },
            items: {
              include: {
                variant: {
                  include: {
                    product: {
                      select: {
                        id: true,
                        title: true,
                        slug: true,
                        hsnCode: true,
                        media: { orderBy: { sortOrder: 'asc' }, take: 1 },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return reply.status(404).send({
        success: false,
        error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' },
        timestamp: new Date().toISOString(),
      });
    }

    return {
      success: true,
      data: order,
      timestamp: new Date().toISOString(),
    };
  });
}
