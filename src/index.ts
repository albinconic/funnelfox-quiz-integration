import * as dotenv from 'dotenv';
import { buildServer } from './server';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

async function start() {
  try {
    const server = await buildServer();
    
    const port = Number(process.env['PORT']) || 3000;
    const host = process.env['HOST'] || '0.0.0.0';

    await server.listen({ port, host });
    
    logger.info(`FunnelFox Webhook Server started`, {
      port,
      host,
      environment: process.env['NODE_ENV'] || 'development'
    });

    if (process.env['NODE_ENV'] === 'development') {
      logger.info('  POST /webhooks/test - Test webhook endpoint (dev only)');
    }

  } catch (error) {
    logger.error('❌ Failed to start server', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
start();
