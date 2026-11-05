# NovaStore — E-commerce Web Application

A React storefront with an Express.js API for customer accounts and shopping workflows.

## Overview

NovaStore separates the customer-facing React application from an Express API. The repository contains route groups for authentication, products, categories, orders, cart, wishlist, and administration.

## Technology

- **Frontend:** React, TypeScript, Vite, React Router
- **Backend:** Node.js, Express
- **Authentication:** JWT and bcryptjs
- **Request handling:** Express JSON middleware and cookie-parser
- **Optional integrations/configuration:** Gemini and Cloudinary environment settings

> The repository contains a MongoDB connection setting in `.env.example`; verify the database adapter and live persistence in the current source/deployment before treating database-backed workflows as production-verified.

## Features represented in the source

- Customer registration and login routes
- Product and category API routes
- Cart and wishlist routes
- Order routes
- Customer storefront, product details, checkout, order history, and profile pages
- Separate admin API route group

## Requirements

- Node.js 20 or newer
- npm
- A configured database and any external services required by the backend routes

## Local setup

```bash
git clone https://github.com/asifgul21704-arch/e-comerce-web.git
cd e-comerce-web
npm install
```

Create a local `.env` file from the template.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

Set real values for the services you use. Generate a unique random `JWT_SECRET`; never use the example value or commit real credentials.

Start the development server:

```bash
npm run dev
```

The current server entrypoint listens on port **3000**.

## Validation

```bash
npm run lint
npm run build
npm start
```

Run the health endpoint after startup:

```text
http://localhost:3000/api/health
```

## Environment and security

The template lists `GEMINI_API_KEY`, `APP_URL`, `PORT`, `JWT_SECRET`, `MONGODB_URI`, and Cloudinary settings. Only put secrets in server-side environment variables. Do not prefix private keys with `VITE_`.

Before production deployment, verify database persistence, cookie flags, CORS origins, admin authorization, input validation, rate limiting, and payment/order integrity.

## Project status

The codebase includes frontend and backend route layers. Production readiness and external integrations must be verified against the deployment environment; this README does not claim that a live deployment or payment provider has been tested.
