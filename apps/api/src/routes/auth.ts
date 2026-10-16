import { FastifyInstance } from 'fastify';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, Role } from '@nexus/db';
import { RegisterSchema, LoginSchema } from '@nexus/shared';
import { authenticate } from '../plugins/auth.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'nexus_super_secret_jwt_access_token_key_change_in_production_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'nexus_super_secret_jwt_refresh_token_key_change_in_production_2026';

export async function authRoutes(fastify: FastifyInstance) {
  // POST /register
  fastify.post('/register', async (request, reply) => {
    const parseResult = RegisterSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid registration fields',
          details: parseResult.error.flatten(),
        },
        timestamp: new Date().toISOString(),
      });
    }

    const { name, email, phoneNumber, password } = parseResult.data;

    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ email }, ...(phoneNumber ? [{ phoneNumber }] : [])],
      },
    });

    if (existingUser) {
      return reply.status(409).send({
        success: false,
        error: { code: 'USER_EXISTS', message: 'An account with this email or phone number already exists.' },
        timestamp: new Date().toISOString(),
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.user.create({
      data: {
        name,
        email,
        phoneNumber,
        passwordHash,
        role: Role.CUSTOMER,
      },
    });

    // Create loyalty account with 100 welcome coins
    await db.loyaltyAccount.create({
      data: {
        userId: user.id,
        coinsBalance: 100,
        referralCode: `NX${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      },
    });

    const accessToken = jwt.sign({ userId: user.id, role: user.role }, JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    reply.setCookie('nexus_access_token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 mins
    });

    return reply.status(201).send({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isPrimeMember: user.isPrimeMember,
        },
        accessToken,
      },
      timestamp: new Date().toISOString(),
    });
  });

  // POST /login
  fastify.post('/login', async (request, reply) => {
    const parseResult = LoginSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email or password format',
          details: parseResult.error.flatten(),
        },
        timestamp: new Date().toISOString(),
      });
    }

    const { email, password } = parseResult.data;

    const user = await db.user.findUnique({
      where: { email },
      include: { sellerProfile: true },
    });

    if (!user) {
      return reply.status(401).send({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password.' },
        timestamp: new Date().toISOString(),
      });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return reply.status(401).send({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password.' },
        timestamp: new Date().toISOString(),
      });
    }

    const accessToken = jwt.sign({ userId: user.id, role: user.role }, JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    reply.setCookie('nexus_access_token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60,
    });

    return {
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isPrimeMember: user.isPrimeMember,
          sellerProfile: user.sellerProfile
            ? {
                id: user.sellerProfile.id,
                storeName: user.sellerProfile.storeName,
                status: user.sellerProfile.status,
              }
            : null,
        },
        accessToken,
      },
      timestamp: new Date().toISOString(),
    };
  });

  // GET /me
  fastify.get('/me', { preHandler: [authenticate] }, async (request, reply) => {
    const user = await db.user.findUnique({
      where: { id: request.user!.userId },
      include: {
        sellerProfile: true,
        addresses: { orderBy: { isDefault: 'desc' } },
        loyaltyAccount: true,
      },
    });

    if (!user) {
      return reply.status(404).send({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User profile not found.' },
        timestamp: new Date().toISOString(),
      });
    }

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isPrimeMember: user.isPrimeMember,
        addresses: user.addresses,
        sellerProfile: user.sellerProfile,
        coinsBalance: user.loyaltyAccount?.coinsBalance ?? 0,
        createdAt: user.createdAt,
      },
      timestamp: new Date().toISOString(),
    };
  });

  // POST /logout
  fastify.post('/logout', async (request, reply) => {
    reply.clearCookie('nexus_access_token', { path: '/' });
    return {
      success: true,
      data: { message: 'Logged out successfully.' },
      timestamp: new Date().toISOString(),
    };
  });
}
