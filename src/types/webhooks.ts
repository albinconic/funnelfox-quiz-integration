/**
 * FunnelFox Webhook Event Types
 * Based on FunnelFox webhook documentation
 */

export interface BaseWebhookEvent {
  id: string;
  type: string;
  created: string;
  data: Record<string, any>;
  profile: Record<string, any>;
}

export interface QuizWebhookEvent extends BaseWebhookEvent {
  id: string;
	project_id: string;
  type: string;
  data: {
    id: string;
    user_id?: string;
    email?: string;
		replies?: Array<{
			screen: Record<string, any>;
			question: string;
			answer: string | string[];
			score?: number;
		}>;
  };
}

export interface PaymentWebhookEvent extends BaseWebhookEvent {
  type: 'payment.succeeded' | 'payment.failed' | 'payment.pending';
  data: {
    payment_id: string;
    amount: number;
    currency: string;
    customer_email: string;
    customer_id?: string;
    product_id?: string;
    product_name?: string;
    status: 'succeeded' | 'failed' | 'pending';
    payment_method?: string;
    metadata?: Record<string, any>;
  };
}

export interface LeadWebhookEvent extends BaseWebhookEvent {
  type: 'lead.created' | 'lead.updated';
  data: {
    lead_id: string;
    email: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
    source?: string;
    tags?: string[];
    custom_fields?: Record<string, any>;
    created_at: string;
    updated_at?: string;
  };
}

export type FunnelFoxWebhookEvent = QuizWebhookEvent | PaymentWebhookEvent | LeadWebhookEvent;

export interface WebhookRequest {
  body: FunnelFoxWebhookEvent;
  headers: {
    'x-funnelfox-signature'?: string;
    'user-agent'?: string;
    'content-type'?: string;
  };
}

export interface WebhookResponse {
  success: boolean;
  message: string;
  timestamp: string;
}
