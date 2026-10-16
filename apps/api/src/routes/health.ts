import { FastifyInstance } from 'fastify';
import { db } from '@nexus/db';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    let dbStatus = 'ok';
    try {
      await db.$queryRaw`SELECT 1`;
    } catch (e: any) {
      dbStatus = `unreachable: ${e.message}`;
    }

    return {
      success: true,
      data: {
        service: 'NEXUS REST API v1',
        status: 'online',
        database: dbStatus,
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    };
  });
}
