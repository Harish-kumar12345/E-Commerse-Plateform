import { FastifyInstance, FastifyRequest } from 'fastify';
import { db } from '@nexus/db';
import {
  AddToCartSchema,
  UpdateCartItemSchema,
  ApplyCouponSchema,
  MergeCartSchema,
  formatPaiseToINR,
} from '@nexus/shared';
import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'nexus_super_secret_jwt_access_token_key_change_in_production_2026';

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
    // Guest user
  }
  return null;
}

export async function cartRoutes(fastify: FastifyInstance) {
  // GET /cart
  fastify.get('/cart', async (request, reply) => {
    const userId = getUserIdFromRequest(request);
    const guestId = (request.query as any)?.guestId;

    if (!userId && !guestId) {
      return {
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
      };
    }

    const cart = await db.cart.findFirst({
      where: userId ? { userId } : { guestId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    seller: { select: { id: true, storeName: true, rating: true } },
                    media: { orderBy: { sortOrder: 'asc' }, take: 1 },
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
      return {
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
      };
    }

    // Partition items by Seller for multi-vendor fulfillment
    const sellerMap = new Map<string, any>();
    let subtotalInPaise = 0;
    let totalItems = 0;

    for (const item of cart.items) {
      const sellerId = item.variant.product.seller.id;
      const sellerName = item.variant.product.seller.storeName;
      const itemSubtotal = item.variant.priceInPaise * item.quantity;
      subtotalInPaise += itemSubtotal;
      totalItems += item.quantity;

      if (!sellerMap.has(sellerId)) {
        sellerMap.set(sellerId, {
          sellerId,
          storeName: sellerName,
          sellerRating: item.variant.product.seller.rating,
          items: [],
          sellerSubtotalInPaise: 0,
          sellerShippingInPaise: 0, // Free delivery with Prime
        });
      }

      const sellerGroup = sellerMap.get(sellerId);
      sellerGroup.sellerSubtotalInPaise += itemSubtotal;
      sellerGroup.items.push({
        id: item.id,
        variantId: item.variantId,
        productId: item.variant.product.id,
        title: item.variant.product.title,
        variantTitle: item.variant.title,
        sku: item.variant.sku,
        imageUrl: item.variant.product.media[0]?.url || '',
        priceInPaise: item.variant.priceInPaise,
        compareAtInPaise: item.variant.compareAtInPaise,
        quantity: item.quantity,
        totalInPaise: itemSubtotal,
        inStock: (item.variant.inventory?.quantityOnHand ?? 0) >= item.quantity,
      });
    }

    const estimatedTaxInPaise = Math.round(subtotalInPaise * 0.18);
    const shippingFeeInPaise = 0; // Free delivery for Prime
    const totalAmountInPaise = subtotalInPaise + estimatedTaxInPaise + shippingFeeInPaise;

    return {
      success: true,
      data: {
        cartId: cart.id,
        itemsBySeller: Array.from(sellerMap.values()),
        totalItems,
        subtotalInPaise,
        estimatedTaxInPaise,
        shippingFeeInPaise,
        discountInPaise: 0,
        totalAmountInPaise,
      },
      timestamp: new Date().toISOString(),
    };
  });

  // POST /cart/items
  fastify.post('/cart/items', async (request, reply) => {
    const parse = AddToCartSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Invalid variant or quantity' },
        timestamp: new Date().toISOString(),
      });
    }

    const { variantId, quantity, guestId } = parse.data;
    const userId = getUserIdFromRequest(request);

    if (!userId && !guestId) {
      return reply.status(400).send({
        success: false,
        error: { code: 'GUEST_ID_REQUIRED', message: 'Guest ID or authenticated session required' },
        timestamp: new Date().toISOString(),
      });
    }

    // Check inventory
    const variant = await db.productVariant.findUnique({
      where: { id: variantId },
      include: { inventory: true },
    });

    if (!variant || (variant.inventory?.quantityOnHand ?? 0) < quantity) {
      return reply.status(400).send({
        success: false,
        error: { code: 'OUT_OF_STOCK', message: 'Requested quantity exceeds available stock' },
        timestamp: new Date().toISOString(),
      });
    }

    // Find or create cart
    let cart = await db.cart.findFirst({
      where: userId ? { userId } : { guestId },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: {
          userId,
          guestId: userId ? null : guestId,
        },
      });
    }

    // Upsert cart item
    const cartItem = await db.cartItem.upsert({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cartId: cart.id,
        variantId,
        quantity,
      },
    });

    return reply.status(201).send({
      success: true,
      data: cartItem,
      timestamp: new Date().toISOString(),
    });
  });

  // PATCH /cart/items/:itemId
  fastify.patch('/cart/items/:itemId', async (request, reply) => {
    const { itemId } = request.params as { itemId: string };
    const parse = UpdateCartItemSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_QUANTITY', message: 'Quantity must be between 0 and 10' },
        timestamp: new Date().toISOString(),
      });
    }

    const { quantity } = parse.data;

    if (quantity === 0) {
      await db.cartItem.delete({ where: { id: itemId } });
      return {
        success: true,
        data: { message: 'Item removed from cart' },
        timestamp: new Date().toISOString(),
      };
    }

    const updated = await db.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return {
      success: true,
      data: updated,
      timestamp: new Date().toISOString(),
    };
  });

  // DELETE /cart/items/:itemId
  fastify.delete('/cart/items/:itemId', async (request, reply) => {
    const { itemId } = request.params as { itemId: string };
    await db.cartItem.delete({ where: { id: itemId } });

    return {
      success: true,
      data: { message: 'Item deleted successfully' },
      timestamp: new Date().toISOString(),
    };
  });

  // POST /cart/apply-coupon
  fastify.post('/cart/apply-coupon', async (request, reply) => {
    const parse = ApplyCouponSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_COUPON', message: 'Coupon code required' },
        timestamp: new Date().toISOString(),
      });
    }

    const { code } = parse.data;

    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon || !coupon.isActive || coupon.validUntil < new Date()) {
      return reply.status(404).send({
        success: false,
        error: { code: 'COUPON_INVALID', message: 'Invalid or expired coupon code' },
        timestamp: new Date().toISOString(),
      });
    }

    return {
      success: true,
      data: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        fixedAmountPaise: coupon.fixedAmountPaise,
        minOrderPaise: coupon.minOrderPaise,
        maxDiscountPaise: coupon.maxDiscountPaise,
      },
      timestamp: new Date().toISOString(),
    };
  });
}
