import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { WebhookController } from '../controllers/webhookController';
import { FunnelFoxWebhookEvent, WebhookResponse } from '../types/webhooks';
import { logger } from '../utils/logger';
import * as crypto from 'crypto';

interface WebhookHeaders {
  'x-funnelfox-signature'?: string;
  'user-agent'?: string;
}

export async function webhookRoutes(fastify: FastifyInstance) {
  const webhookController = new WebhookController();

  // Webhook endpoint for FunnelFox events
  fastify.post<{
    Body: FunnelFoxWebhookEvent;
    Headers: WebhookHeaders;
  }>('/webhooks', {
    schema: {
      body: {
        type: 'object',
        required: ['id', 'type', 'created', 'data'],
        properties: {
          id: { type: 'string' },
          type: { type: 'string' },
          created: { type: 'string' },
          data: { type: 'object' }
        }
      }
    }
  }, async (request: FastifyRequest<{ Body: FunnelFoxWebhookEvent; Headers: WebhookHeaders }>, reply: FastifyReply) => {
    try {
      const signature = request.headers['x-funnelfox-signature'];
      const userAgent = request.headers['user-agent'];
      
      logger.info('Webhook received', {
        eventId: request.body.id,
        eventType: request.body.type,
        userAgent,
        hasSignature: !!signature
      });

      // Optional: Verify webhook signature
      if (signature && process.env['WEBHOOK_SECRET']) {
        const isValid = verifyWebhookSignature(
          JSON.stringify(request.body),
          signature,
          process.env['WEBHOOK_SECRET']
        );
        
        if (!isValid) {
          logger.warn('Invalid webhook signature', {
            eventId: request.body.id,
            signature
          });
          return reply.status(401).send({
            success: false,
            message: 'Invalid signature',
            timestamp: new Date().toISOString()
          });
        }
      }

      // Process the webhook
      const result: WebhookResponse = await webhookController.handleWebhook(request.body);
      
      if (result.success) {
        return reply.status(200).send(result);
      } else {
        return reply.status(500).send(result);
      }

    } catch (error) {
      logger.error('Webhook processing error', error);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Webhook test endpoint (for development)
  if (process.env['NODE_ENV'] === 'development') {
    fastify.post('/webhooks/test', async (request: FastifyRequest, reply: FastifyReply) => {
      logger.info('Test webhook received', request.body);
      return reply.status(200).send({
        success: true,
        message: 'Test webhook received',
        timestamp: new Date().toISOString(),
        receivedData: request.body
      });
    });
  }
}

/**
 * Verify webhook signature using HMAC SHA-256
 * This is optional and depends on FunnelFox implementation
 */
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');
    
    // Compare signatures securely
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    logger.error('Error verifying webhook signature', error);
    return false;
  }
}
