import { FastifyInstance } from 'fastify';
import { db } from '@nexus/db';
import { calculateGSTFromGross } from '@nexus/shared';
import { z } from 'zod';

const ShippingRateInputSchema = z.object({
  sourcePincode: z.string().regex(/^\d{6}$/),
  destPincode: z.string().regex(/^\d{6}$/),
  weightGrams: z.number().int().min(1).default(500),
  isPrimeMember: z.boolean().default(false),
  cartAmountInPaise: z.number().int().min(0),
});

const TaxCalculationInputSchema = z.object({
  grossAmountInPaise: z.number().int().positive(),
  taxRatePercent: z.number().min(0).max(28).default(18.0),
  sellerState: z.string().default('Maharashtra'),
  customerState: z.string().default('Maharashtra'),
  hsnCode: z.string().optional(),
});

export async function shippingTaxRoutes(fastify: FastifyInstance) {
  // POST /shipping/calculate-rate
  fastify.post('/shipping/calculate-rate', async (request, reply) => {
    const parse = ShippingRateInputSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Valid source & destination PIN codes required' },
        timestamp: new Date().toISOString(),
      });
    }

    const { sourcePincode, destPincode, weightGrams, isPrimeMember, cartAmountInPaise } = parse.data;

    const sourceZone = sourcePincode.substring(0, 2);
    const destZone = destPincode.substring(0, 2);
    const isSameZone = sourceZone === destZone;

    // Delivery SLA
    const estimatedDays = isSameZone ? (isPrimeMember ? 1 : 2) : isPrimeMember ? 2 : 4;

    // Pricing Rule
    let shippingFeeInPaise = 0;
    if (isPrimeMember || cartAmountInPaise >= 49900) {
      shippingFeeInPaise = 0; // Free delivery for Prime or cart >= ₹499
    } else {
      shippingFeeInPaise = isSameZone ? 4900 : 7900; // ₹49 local, ₹79 national
    }

    const estDate = new Date();
    estDate.setDate(estDate.getDate() + estimatedDays);

    return {
      success: true,
      data: {
        sourcePincode,
        destPincode,
        isSameZone,
        estimatedDays,
        estimatedDeliveryDate: estDate.toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        shippingFeeInPaise,
        courierPartner: isPrimeMember ? 'Shiprocket Priority Air' : 'Delhivery Surface',
        freeShippingReason: isPrimeMember
          ? 'Free with Nexus Prime'
          : cartAmountInPaise >= 49900
          ? 'Free for orders over ₹499'
          : null,
      },
      timestamp: new Date().toISOString(),
    };
  });

  // POST /tax/calculate-breakdown
  fastify.post('/tax/calculate-breakdown', async (request, reply) => {
    const parse = TaxCalculationInputSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Valid amount and tax rate required' },
        timestamp: new Date().toISOString(),
      });
    }

    const { grossAmountInPaise, taxRatePercent, sellerState, customerState, hsnCode } = parse.data;
    const isInterState = sellerState.toLowerCase() !== customerState.toLowerCase();

    const breakdown = calculateGSTFromGross(grossAmountInPaise, taxRatePercent, isInterState);

    return {
      success: true,
      data: {
        ...breakdown,
        isInterState,
        taxType: isInterState ? 'IGST' : 'CGST + SGST',
        hsnCode: hsnCode || '85183000',
        sellerState,
        customerState,
      },
      timestamp: new Date().toISOString(),
    };
  });

  // GET /promotions/coupons
  fastify.get('/promotions/coupons', async (request, reply) => {
    const coupons = await db.coupon.findMany({
      where: {
        isActive: true,
        validUntil: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      data: coupons.map((c) => ({
        id: c.id,
        code: c.code,
        discountPercent: c.discountPercent,
        fixedAmountPaise: c.fixedAmountPaise,
        minOrderPaise: c.minOrderPaise,
        maxDiscountPaise: c.maxDiscountPaise,
        validUntil: c.validUntil,
      })),
      timestamp: new Date().toISOString(),
    };
  });
}
