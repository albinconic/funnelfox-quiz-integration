import { FunnelFoxWebhookEvent, QuizWebhookEvent, PaymentWebhookEvent, LeadWebhookEvent, WebhookResponse } from '../types/webhooks';
import { logger } from '../utils/logger';

export class WebhookController {
  /**
   * Main webhook handler that routes events to specific handlers
   */
  async handleWebhook(event: FunnelFoxWebhookEvent): Promise<WebhookResponse> {
    try {
      logger.info(`Received webhook event: ${event.type}`, { id: event.id });

      switch (event.type) {
        case 'quiz.completed':
        case 'quiz.started':
        case 'quiz.abandoned':
          return await this.handleQuizEvent(event as QuizWebhookEvent);

        case 'payment.succeeded':
        case 'payment.failed':
        case 'payment.pending':
          return await this.handlePaymentEvent(event as PaymentWebhookEvent);

        case 'lead.created':
        case 'lead.updated':
          return await this.handleLeadEvent(event as LeadWebhookEvent);

        default:
          const unknownEvent = event as any;
          logger.warn(`Unknown webhook event type: ${unknownEvent.type}`, event);
          return {
            success: true,
            message: `Event type ${unknownEvent.type} received but not processed`,
            timestamp: new Date().toISOString()
          };
      }
    } catch (error) {
      logger.error('Error processing webhook', { error, event });
      return {
        success: false,
        message: 'Internal server error',
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Handle quiz-related webhook events
   */
  private async handleQuizEvent(event: QuizWebhookEvent): Promise<WebhookResponse> {
    logger.info(`Processing quiz event: ${event.type}`, {
      quizId: event.data.quiz_id,
      userEmail: event.data.email,
      totalScore: event.data.total_score
    });

    switch (event.type) {
			case 'onboarding.started':
				logger.info('Onboarding started', {
						quizId: event.data.quiz_id,
						userEmail: event.data.email
				});
				break;

			case 'onboarding.completed':

        logger.info('Onboarding completed', {
          quizId: event.data.quiz_id,
          score: event.data.total_score,
          answers: event.data.answers?.length
        });
        break;

      case 'purchase.completed':
        logger.info('Purchase completed', {
          quizId: event.data.quiz_id,
          userEmail: event.data.email
        });
        break;
    }

    return {
      success: true,
      message: `Quiz event ${event.type} processed successfully`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Handle payment-related webhook events
   */
  private async handlePaymentEvent(event: PaymentWebhookEvent): Promise<WebhookResponse> {
    logger.info(`Processing payment event: ${event.type}`, {
      paymentId: event.data.payment_id,
      amount: event.data.amount,
      currency: event.data.currency,
      customerEmail: event.data.customer_email
    });

    switch (event.type) {
      case 'payment.succeeded':
        logger.info('Payment succeeded', {
          paymentId: event.data.payment_id,
          amount: event.data.amount,
          product: event.data.product_name
        });
        break;

      case 'payment.failed':
        logger.warn('Payment failed', {
          paymentId: event.data.payment_id,
          customerEmail: event.data.customer_email
        });
        break;

      case 'payment.pending':
        logger.info('Payment pending', {
          paymentId: event.data.payment_id,
          customerEmail: event.data.customer_email
        });
        break;
    }

    return {
      success: true,
      message: `Payment event ${event.type} processed successfully`,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Handle lead-related webhook events
   */
  private async handleLeadEvent(event: LeadWebhookEvent): Promise<WebhookResponse> {
    logger.info(`Processing lead event: ${event.type}`, {
      leadId: event.data.lead_id,
      email: event.data.email,
      source: event.data.source
    });

    switch (event.type) {
      case 'lead.created':
        logger.info('New lead created', {
          leadId: event.data.lead_id,
          email: event.data.email,
          name: `${event.data.first_name || ''} ${event.data.last_name || ''}`.trim()
        });
        break;

      case 'lead.updated':
        logger.info('Lead updated', {
          leadId: event.data.lead_id,
          email: event.data.email
        });
        break;
    }

    return {
      success: true,
      message: `Lead event ${event.type} processed successfully`,
      timestamp: new Date().toISOString()
    };
  }
}
