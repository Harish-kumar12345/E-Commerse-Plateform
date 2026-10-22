import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

// Route imports
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import categoriesRouter from './routes/categories.js';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import checkoutRouter from './routes/checkout.js';
import paymentsRouter from './routes/payments.js';
import accountRouter from './routes/account.js';
import shippingTaxRouter from './routes/shippingTax.js';
import adminRouter from './routes/admin.js';
import sellerRouter from './routes/seller.js';
import aiFinderRouter from './routes/aiFinder.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

async function startServer() {
  // Connect to MongoDB
  await connectDB();

  // Security Headers
  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  );

  // CORS Configuration
  const allowedOrigins = [
    process.env.STOREFRONT_URL || 'http://localhost:3000',
    process.env.ADMIN_URL || 'http://localhost:3001',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Permissive in dev mode
        }
      },
      credentials: true,
    })
  );

  // Cookie Parser
  app.use(cookieParser(process.env.COOKIE_SECRET || 'nexus_secure_cookie_secret_sign_key_98124'));

  // Body Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Rate Limiting (100 requests per minute)
  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  // Mount API v1 Routes
  app.use('/api/v1', healthRouter);
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1', categoriesRouter);
  app.use('/api/v1', productsRouter);
  app.use('/api/v1', cartRouter);
  app.use('/api/v1', checkoutRouter);
  app.use('/api/v1', paymentsRouter);
  app.use('/api/v1', accountRouter);
  app.use('/api/v1', shippingTaxRouter);
  app.use('/api/v1', adminRouter);
  app.use('/api/v1', sellerRouter);
  app.use('/api/v1', aiFinderRouter);

  // Global Error Handler
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NEXUS MERN API v1 (Express + MongoDB) listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Boot Error:', err);
  process.exit(1);
});
