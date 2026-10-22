import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'nexus_super_secret_jwt_access_token_key_change_in_production_2026';

export async function authenticate(req, res, next) {
  try {
    let token = '';

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.nexus_access_token) {
      token = req.cookies.nexus_access_token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required. Please login.' },
        timestamp: new Date().toISOString(),
      });
    }

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    req.user = decoded; // { userId, role }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Token is expired or invalid.' },
      timestamp: new Date().toISOString(),
    });
  }
}

export function optionalAuth(req, res, next) {
  try {
    let token = '';
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (req.cookies && req.cookies.nexus_access_token) {
      token = req.cookies.nexus_access_token;
    }

    if (token) {
      const decoded = jwt.verify(token, JWT_ACCESS_SECRET);
      req.user = decoded;
    }
  } catch (e) {
    // Ignore invalid/expired token for optional routes
  }
  next();
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
        timestamp: new Date().toISOString(),
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Access denied: Insufficient permissions.' },
        timestamp: new Date().toISOString(),
      });
    }

    next();
  };
}
