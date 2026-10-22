import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import SellerProfile from '../models/SellerProfile.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'nexus_super_secret_jwt_access_token_key_change_in_production_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'nexus_super_secret_jwt_refresh_token_key_change_in_production_2026';

// POST /register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phoneNumber, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Name, email, and password are required' },
        timestamp: new Date().toISOString(),
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({
      $or: [{ email: cleanEmail }, ...(phoneNumber ? [{ phoneNumber }] : [])],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'An account with this email or phone number already exists.' },
        timestamp: new Date().toISOString(),
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: cleanEmail,
      phoneNumber: phoneNumber || null,
      passwordHash,
      role: 'CUSTOMER',
      isPrimeMember: false,
      coinsBalance: 100,
      referralCode: `NX${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    });

    const accessToken = jwt.sign({ userId: user._id.toString(), role: user.role }, JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id.toString() }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.cookie('nexus_access_token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          isPrimeMember: user.isPrimeMember,
          coinsBalance: user.coinsBalance,
        },
        accessToken,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Email and password are required' },
        timestamp: new Date().toISOString(),
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail }).populate('sellerProfileId');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password.' },
        timestamp: new Date().toISOString(),
      });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect email or password.' },
        timestamp: new Date().toISOString(),
      });
    }

    const accessToken = jwt.sign({ userId: user._id.toString(), role: user.role }, JWT_ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId: user._id.toString() }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    res.cookie('nexus_access_token', accessToken, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    const sellerProfile = user.sellerProfileId
      ? {
          id: user.sellerProfileId._id.toString(),
          storeName: user.sellerProfileId.storeName,
          status: user.sellerProfileId.status,
        }
      : null;

    return res.json({
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          isPrimeMember: user.isPrimeMember,
          coinsBalance: user.coinsBalance,
          sellerProfile,
        },
        accessToken,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// GET /me
router.get('/me', authenticate, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).populate('sellerProfileId');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User profile not found.' },
        timestamp: new Date().toISOString(),
      });
    }

    return res.json({
      success: true,
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isPrimeMember: user.isPrimeMember,
        addresses: user.addresses,
        sellerProfile: user.sellerProfileId,
        coinsBalance: user.coinsBalance,
        createdAt: user.createdAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// POST /logout
router.post('/logout', (req, res) => {
  res.clearCookie('nexus_access_token', { path: '/' });
  res.json({
    success: true,
    data: { message: 'Logged out successfully.' },
    timestamp: new Date().toISOString(),
  });
});

export default router;
