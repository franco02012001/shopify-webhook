# Shopify PayMongo Integration

NestJS backend + React client for Shopify payment session handling with PayMongo.

## Tech Stack

- Backend: NestJS, Mongoose, MongoDB Atlas
- Frontend: React + Vite (`client/`)
- Integrations: Shopify webhooks + payment session APIs, PayMongo APIs

## Requirements

- Node.js 20+ (recommended LTS)
- npm
- MongoDB Atlas URI
- Shopify app credentials
- PayMongo keys

## Environment Variables

Create `.env` in either:

- `shopify-paymongo/.env`, or
- workspace root `.env` (supported by app config)

Required keys:

```env
PORT=3000
MONGODB_URI=...
MONGODB_DB_NAME=shopify_paymongo

SHOPIFY_API_KEY=...
SHOPIFY_API_SECRET=...
SHOPIFY_SCOPES=read_orders,write_orders,read_customers,write_customers,read_products
SHOPIFY_HOST=...
SHOPIFY_API_VERSION=2024-01
SHOPIFY_WEBHOOK_SECRET=...

PAYMONGO_SECRET_KEY=...
PAYMONGO_PUBLIC_KEY=...
PAYMONGO_WEBHOOK_SECRET=...
PAYMONGO_BASE_URL=https://api.paymongo.com/v1
```

## Local Development

Install dependencies:

```bash
npm install
cd client && npm install
```

Run backend (from project root):

```bash
npm run start:dev
```

Build frontend static files:

```bash
cd client
npm run build
```

The backend serves static files from `client/dist`.

## API Routes

- `POST /payment/attach`
- `GET /payment/callback`
- `POST /payment/session/create`
- `POST /payment/session/resolve`
- `POST /payment/session/reject`
- `POST /payment/session/refund`
- `POST /payment/session/capture`
- `POST /webhooks/paymongo`
- `POST /webhooks/shopify`

## GitHub Deploy / Push

Current repository:

- [franco02012001/shopify-webhook](https://github.com/franco02012001/shopify-webhook.git)

Push latest changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

## Security Notes

- Do not commit `.env` or secret tokens.
- Rotate leaked credentials immediately.
