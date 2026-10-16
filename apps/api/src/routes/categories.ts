import { FastifyInstance } from 'fastify';
import { db } from '@nexus/db';

export async function categoryRoutes(fastify: FastifyInstance) {
  // GET /categories
  fastify.get('/categories', async (request, reply) => {
    const categories = await db.category.findMany({
      where: { parentId: null },
      orderBy: { orderIndex: 'asc' },
      include: {
        children: {
          orderBy: { orderIndex: 'asc' },
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: { select: { products: true } },
      },
    });

    return {
      success: true,
      data: categories,
      timestamp: new Date().toISOString(),
    };
  });

  // GET /categories/:slug
  fastify.get('/categories/:slug', async (request, reply) => {
    const { slug } = request.params as { slug: string };

    const category = await db.category.findUnique({
      where: { slug },
      include: {
        parent: { select: { id: true, name: true, slug: true } },
        children: {
          orderBy: { orderIndex: 'asc' },
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) {
      return reply.status(404).send({
        success: false,
        error: { code: 'CATEGORY_NOT_FOUND', message: 'Category not found' },
        timestamp: new Date().toISOString(),
      });
    }

    return {
      success: true,
      data: category,
      timestamp: new Date().toISOString(),
    };
  });
}
