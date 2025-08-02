# FunnelFox Webhook Integration

A TypeScript-based Fastify backend server designed to handle FunnelFox webhooks for quiz completions, payments, and lead management.

## 🚀 Features

- **Fastify Framework**: High-performance web framework for Node.js
- **TypeScript**: Full type safety and modern JavaScript features
- **Webhook Handling**: Processes FunnelFox events (quiz, payment, lead)
- **Request Validation**: Optional webhook signature verification
- **Structured Logging**: Timestamped logs with different levels
- **Error Handling**: Comprehensive error handling and logging


## 🛠️ Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Copy `.env` and configure your settings:
   ```bash
   PORT=3000
   NODE_ENV=development
   WEBHOOK_SECRET=FUNNELFOX_SECRET
   ```

3. **Development**
   ```bash
   npm run dev
   ```

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## 📡 API Endpoints

### Webhook Endpoints
- `POST /webhooks` - Main FunnelFox webhook handler
- `POST /webhooks/test` - Test endpoint (development only)

### Monitoring

## 🎯 Supported Webhook Events

### Quiz Events
- `quiz.completed` - User completes a quiz
- `quiz.started` - User starts a quiz
- `quiz.abandoned` - User abandons a quiz

### Payment Events
- `payment.succeeded` - Payment processed successfully
- `payment.failed` - Payment processing failed
- `payment.pending` - Payment is pending

### Lead Events
- `lead.created` - New lead created
- `lead.updated` - Existing lead updated

## 📊 Logging

All webhook events are logged with timestamps and relevant metadata:
- Incoming webhook events
- Processing results
- Errors and warnings
- Server startup and shutdown

## 🚦 Development

The project includes:
- Hot reloading with `ts-node-dev`
- TypeScript strict mode
- Comprehensive error handling
- Request/response logging
