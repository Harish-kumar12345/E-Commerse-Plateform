import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import dotenv from 'dotenv';
import { healthRoutes } from './routes/health.js';
import { authRoutes } from './routes/auth.js';
import { categoryRoutes } from './routes/categories.js';
import { productRoutes } from './routes/products.js';
import { cartRoutes } from './routes/cart.js';
import { checkoutRoutes } from './routes/checkout.js';
import { paymentRoutes } from './routes/payments.js';
import { accountRoutes } from './routes/account.js';
import { shippingTaxRoutes } from './routes/shipping-tax.js';
import { adminRoutes } from './routes/admin.js';
import { sellerRoutes } from './routes/seller.js';
import { aiFinderRoutes } from './routes/ai-finder.js';

dotenv.config();

const server = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'info' : 'warn',
  },
});

async function main() {
  // Security headers
  await server.register(helmet, {
    crossOriginResourcePolicy: false,
  });

  // CORS
  await server.register(cors, {
    origin: [
      process.env.STOREFRONT_URL || 'http://localhost:3000',
      process.env.ADMIN_URL || 'http://localhost:3001',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  });

  // Cookies
  await server.register(cookie, {
    secret: process.env.COOKIE_SECRET || 'nexus_secure_cookie_secret_sign_key_98124',
  });

  // Rate Limiting
  await server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Global Error Handler
  server.setErrorHandler((error: any, request, reply) => {
    server.log.error(error);
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
      success: false,
      error: {
        code: error.code || 'INTERNAL_SERVER_ERROR',
        message: error.message || 'An unexpected error occurred.',
      },
      timestamp: new Date().toISOString(),
    });
  });

  // Register routes with version prefix
  await server.register(healthRoutes, { prefix: '/api/v1' });
  await server.register(authRoutes, { prefix: '/api/v1/auth' });
  await server.register(categoryRoutes, { prefix: '/api/v1' });
  await server.register(productRoutes, { prefix: '/api/v1' });
  await server.register(cartRoutes, { prefix: '/api/v1' });
  await server.register(checkoutRoutes, { prefix: '/api/v1' });
  await server.register(paymentRoutes, { prefix: '/api/v1' });
  await server.register(accountRoutes, { prefix: '/api/v1' });
  await server.register(shippingTaxRoutes, { prefix: '/api/v1' });
  await server.register(adminRoutes, { prefix: '/api/v1' });
  await server.register(sellerRoutes, { prefix: '/api/v1' });
  await server.register(aiFinderRoutes, { prefix: '/api/v1' });

  const port = Number(process.env.PORT) || 4000;
  const host = '0.0.0.0';

  try {
    await server.listen({ port, host });
    console.log(`🚀 NEXUS API v1 server listening on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

main();
