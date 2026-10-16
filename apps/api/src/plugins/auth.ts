import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { Role } from '@nexus/shared';
import { db } from '@nexus/db';

export interface AuthUserPayload {
  userId: string;
  role: Role;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: AuthUserPayload;
  }
}

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'nexus_super_secret_jwt_access_token_key_change_in_production_2026';

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    let token = '';

    // Check Authorization header: Bearer <token>
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (request.cookies?.nexus_access_token) {
      token = request.cookies.nexus_access_token;
    }

    if (!token) {
      return reply.status(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required. Please login.' },
        timestamp: new Date().toISOString(),
      });
    }

    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as AuthUserPayload;
    request.user = decoded;
  } catch (err) {
    return reply.status(401).send({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Token is expired or invalid.' },
      timestamp: new Date().toISOString(),
    });
  }
}

export function requireRole(allowedRoles: Role[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' },
        timestamp: new Date().toISOString(),
      });
    }

    if (!allowedRoles.includes(request.user.role)) {
      return reply.status(403).send({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Access denied: Insufficient permissions.' },
        timestamp: new Date().toISOString(),
      });
    }
  };
}
