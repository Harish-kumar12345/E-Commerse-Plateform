import { FastifyInstance } from 'fastify';
import { db, ProductStatus, Prisma } from '@nexus/db';
import { ProductFilterSchema, calculateDiscountPercent } from '@nexus/shared';
import { z } from 'zod';

const AutocompleteQuerySchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().int().min(1).max(10).default(6),
});

const PincodeEstimateSchema = z.object({
  pincode: z.string().regex(/^\d{6}$/, 'Must be a 6-digit Indian PIN code'),
  productId: z.string().uuid(),
});

export async function productRoutes(fastify: FastifyInstance) {
  // GET /products with deep faceted filtering
  fastify.get('/products', async (request, reply) => {
    const parseResult = ProductFilterSchema.safeParse(request.query);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_QUERY', message: 'Invalid filter parameters', details: parseResult.error.flatten() },
        timestamp: new Date().toISOString(),
      });
    }

    const { query, categorySlug, brand, minPrice, maxPrice, minRating, isDeal, sort, page, limit } = parseResult.data;

    const where: Prisma.ProductWhereInput = {
      status: ProductStatus.PUBLISHED,
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (categorySlug) {
      where.category = {
        OR: [{ slug: categorySlug }, { parent: { slug: categorySlug } }],
      };
    }

    if (brand) {
      const brandsList = brand.split(',').map((b) => b.trim());
      where.brand = { in: brandsList, mode: 'insensitive' };
    }

    if (minRating) {
      where.avgRating = { gte: minRating };
    }

    if (isDeal) {
      where.isDealOfTheDay = true;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.variants = {
        some: {
          priceInPaise: {
            ...(minPrice !== undefined ? { gte: minPrice } : {}),
            ...(maxPrice !== undefined ? { lte: maxPrice } : {}),
          },
        },
      };
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    if (sort === 'rating_desc') orderBy = { avgRating: 'desc' };
    else if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const skip = (page - 1) * limit;

    const [total, products, allBrands, priceBounds] = await Promise.all([
      db.product.count({ where }),
      db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          seller: { select: { id: true, storeName: true, rating: true } },
          media: { orderBy: { sortOrder: 'asc' }, take: 1 },
          variants: {
            include: { inventory: true },
            orderBy: { priceInPaise: 'asc' },
          },
        },
      }),
      // Facets: brands in current category
      db.product.groupBy({
        by: ['brand'],
        where: categorySlug
          ? {
              status: ProductStatus.PUBLISHED,
              category: { OR: [{ slug: categorySlug }, { parent: { slug: categorySlug } }] },
            }
          : { status: ProductStatus.PUBLISHED },
        _count: { brand: true },
      }),
      // Price range
      db.productVariant.aggregate({
        _min: { priceInPaise: true },
        _max: { priceInPaise: true },
      }),
    ]);

    const formatted = products.map((p: any) => {
      const minVariant = p.variants[0];
      const maxVariant = p.variants[p.variants.length - 1];
      const primaryImage = p.media[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
      const inStock = p.variants.some((v: any) => (v.inventory?.quantityOnHand ?? 0) > 0);

      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        brand: p.brand,
        category: p.category,
        seller: p.seller,
        primaryImage,
        minPriceInPaise: minVariant?.priceInPaise ?? 0,
        maxPriceInPaise: maxVariant?.priceInPaise ?? 0,
        compareAtInPaise: minVariant?.compareAtInPaise ?? null,
        discountPercent: calculateDiscountPercent(minVariant?.compareAtInPaise, minVariant?.priceInPaise),
        avgRating: p.avgRating,
        reviewCount: p.reviewCount,
        isDealOfTheDay: p.isDealOfTheDay,
        dealEndsAt: p.dealEndsAt?.toISOString() ?? null,
        dealDiscountPct: p.dealDiscountPct,
        isInStock: inStock,
      };
    });

    const facets = {
      brands: allBrands.map((b) => ({ name: b.brand, count: b._count.brand })),
      minPriceInPaise: priceBounds._min.priceInPaise ?? 0,
      maxPriceInPaise: priceBounds._max.priceInPaise ?? 10000000,
    };

    return {
      success: true,
      data: formatted,
      facets,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      timestamp: new Date().toISOString(),
    };
  });

  // GET /products/deals/today
  fastify.get('/products/deals/today', async (request, reply) => {
    const deals = await db.product.findMany({
      where: {
        status: ProductStatus.PUBLISHED,
        isDealOfTheDay: true,
      },
      take: 8,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: { select: { id: true, storeName: true, rating: true } },
        media: { orderBy: { sortOrder: 'asc' }, take: 1 },
        variants: {
          include: { inventory: true },
          orderBy: { priceInPaise: 'asc' },
        },
      },
    });

    const formatted = deals.map((p: any) => {
      const minVariant = p.variants[0];
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        brand: p.brand,
        category: p.category,
        seller: p.seller,
        primaryImage: p.media[0]?.url || '',
        priceInPaise: minVariant?.priceInPaise ?? 0,
        compareAtInPaise: minVariant?.compareAtInPaise ?? null,
        discountPercent: calculateDiscountPercent(minVariant?.compareAtInPaise, minVariant?.priceInPaise),
        avgRating: p.avgRating,
        reviewCount: p.reviewCount,
        dealEndsAt: p.dealEndsAt?.toISOString() ?? null,
      };
    });

    return {
      success: true,
      data: formatted,
      timestamp: new Date().toISOString(),
    };
  });

  // GET /search/autocomplete
  fastify.get('/search/autocomplete', async (request, reply) => {
    const parse = AutocompleteQuerySchema.safeParse(request.query);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_QUERY', message: 'Search query string q is required' },
        timestamp: new Date().toISOString(),
      });
    }

    const { q, limit } = parse.data;

    const [products, matchingCategories] = await Promise.all([
      db.product.findMany({
        where: {
          status: ProductStatus.PUBLISHED,
          OR: [
            { title: { contains: q, mode: 'insensitive' } },
            { brand: { contains: q, mode: 'insensitive' } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          brand: true,
          media: { take: 1, select: { url: true } },
          variants: { take: 1, select: { priceInPaise: true } },
        },
      }),
      db.category.findMany({
        where: {
          name: { contains: q, mode: 'insensitive' },
        },
        take: 3,
        select: { id: true, name: true, slug: true },
      }),
    ]);

    return {
      success: true,
      data: {
        query: q,
        suggestions: products.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          brand: p.brand,
          imageUrl: p.media[0]?.url,
          priceInPaise: p.variants[0]?.priceInPaise,
        })),
        categories: matchingCategories,
      },
      timestamp: new Date().toISOString(),
    };
  });

  // POST /products/estimate-delivery
  fastify.post('/products/estimate-delivery', async (request, reply) => {
    const parse = PincodeEstimateSchema.safeParse(request.body);
    if (!parse.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'INVALID_PINCODE', message: 'Valid 6-digit Indian PIN code required' },
        timestamp: new Date().toISOString(),
      });
    }

    const { pincode, productId } = parse.data;

    const product = await db.product.findUnique({
      where: { id: productId },
      include: { seller: true },
    });

    if (!product) {
      return reply.status(404).send({
        success: false,
        error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found' },
        timestamp: new Date().toISOString(),
      });
    }

    // Realistic delivery estimation logic
    // Same first two digits of PIN = intra-state (1-2 days)
    // Different = inter-state (3-4 days)
    const sellerPincodePrefix = product.seller.pickupPincode.substring(0, 2);
    const destPincodePrefix = pincode.substring(0, 2);
    const isSameZone = sellerPincodePrefix === destPincodePrefix;

    const daysToAdd = isSameZone ? 2 : 4;
    const estDate = new Date();
    estDate.setDate(estDate.getDate() + daysToAdd);

    const formattedDate = estDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    });

    return {
      success: true,
      data: {
        pincode,
        estimatedDeliveryDate: formattedDate,
        isExpressAvailable: true,
        isCodAvailable: true,
        shippingFeeInPaise: 0, // Free delivery with Prime
        courierPartner: 'Shiprocket Express Priority',
      },
      timestamp: new Date().toISOString(),
    };
  });

  // GET /products/:slug
  fastify.get('/products/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };

    const product = await db.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: {
          select: {
            id: true,
            storeName: true,
            storeSlug: true,
            rating: true,
            totalRatings: true,
            pickupPincode: true,
          },
        },
        media: { orderBy: { sortOrder: 'asc' } },
        variants: {
          include: { inventory: true },
          orderBy: { priceInPaise: 'asc' },
        },
        reviews: {
          take: 10,
          orderBy: { helpfulVotes: 'desc' },
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
        },
        questions: { take: 10, orderBy: { createdAt: 'desc' } },
        priceHistory: {
          orderBy: { recordedAt: 'asc' },
          take: 30,
        },
      },
    });

    if (!product) {
      return reply.status(404).send({
        success: false,
        error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found.' },
        timestamp: new Date().toISOString(),
      });
    }

    return {
      success: true,
      data: product,
      timestamp: new Date().toISOString(),
    };
  });
}
