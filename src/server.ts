import Fastify from 'fastify';
import { webhookRoutes } from './routes/webhooks';
import { logger } from './utils/logger';

export async function buildServer() {
  const fastify = Fastify({
    logger: false, // We'll use our custom logger
  });

  // Register CORS plugin
  await fastify.register(require('@fastify/cors'), {
    origin: true, // Allow all origins for webhooks
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-funnelfox-signature']
  });

  // Register webhook routes
  await fastify.register(webhookRoutes, {
    prefix: '/api/funnelfox/v1',
  });

  // Global error handler
  fastify.setErrorHandler((error, request, reply) => {
    logger.error('Fastify error', {
      error: error.message,
      stack: error.stack,
      url: request.url,
      method: request.method
    });

    reply.status(500).send({
      success: false,
      message: 'Internal server error',
      timestamp: new Date().toISOString()
    });
  });

  // Global not found handler
  fastify.setNotFoundHandler((request, reply) => {
    logger.warn('Route not found', {
      url: request.url,
      method: request.method
    });

    reply.status(404).send({
      success: false,
      message: 'Route not found',
      timestamp: new Date().toISOString()
    });
  });

  return fastify;
}
