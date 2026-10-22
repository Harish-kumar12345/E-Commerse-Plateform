# NEXUS Bazaar — Production Deployment Guide & Launch Checklist 🚀

This document outlines the deployment procedure, infrastructure topologies, security configurations, and pre-launch verification checklist for **NEXUS Bazaar**.

---

## 1. INFRASTRUCTURE TOPOLOGY

```
                        [ Cloudflare / Route 53 DNS ]
                                      │
                         HTTPS (Port 443) / SSL Edge
                                      │
             ┌────────────────────────┴────────────────────────┐
             ▼                                                 ▼
   [ apps/web — Next.js 15 ]                         [ apps/api — Fastify API ]
   • Vercel / AWS Amplify / ECS                      • Google Cloud Run / AWS ECS / Render
   • Edge Caching & SSR                              • Node.js 20 LTS Runtime
   • Dynamic Sitemap & SEO Prerendering              • Strict CORS & Rate Limiting
             │                                                 │
             └────────────────────────┬────────────────────────┘
                                      │
                       Private VPC / Security Group
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            ▼                         ▼                         ▼
  [ Managed PostgreSQL ]      [ Redis Cluster ]         [ External Gateways ]
  • AWS RDS / Supabase        • Upstash / RedisLabs     • Razorpay Payments
  • Prisma Client Pool        • Session Cache           • Shiprocket Logistics
  • Strict SSL Required       • BullMQ Background Jobs  • Resend / Mailgun Emails
```

---

## 2. PRODUCTION LAUNCH CHECKLIST

### Statutory & Regulatory Compliance (India)
- [x] **GST Compliance**: All prices recorded in integer minor units (paise) with tax-inclusive pricing.
- [x] **HSN Code Mapping**: Verified mandatory HSN codes (e.g. `85183000` for headphones, `84713010` for laptops, `61091000` for apparel).
- [x] **Statutory Merchant KYC**: Strict regex validation for 15-character GSTIN, 10-character PAN, and 11-character IFSC codes prior to merchant activation.
- [x] **E-Commerce Policy Disclosures**: Verified seller details, pickup postal code, and grievance officer disclosure.

### Payment Gateway & Transactions
- [x] **Razorpay Production Mode**: Configured `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
- [x] **Webhook Signature Verification**: Secret HMAC SHA256 verification on all payment capture and refund events.
- [x] **Cash on Delivery (COD) Protection**: 6-digit SMS OTP verification before order finalization to eliminate fake orders.

### Logistics & Fulfillment
- [x] **Shiprocket Live Integration**: Real-time AWB generation and automated tracking timeline webhooks.
- [x] **Multi-Seller Order Splitting**: Parent `Order` atomically split into merchant `SubOrder` records with isolated manifest slips.

### SEO, Performance & Core Web Vitals
- [x] **XML Sitemap & Robots**: Next.js 15 dynamic `sitemap.xml` and `robots.txt` indexing all categories and product slugs.
- [x] **Schema.org Structured Data**: Valid JSON-LD `Product` and `AggregateRating` schemas on all PDP routes.
- [x] **Responsive Next/Image**: Strict `sizes` specifications and above-the-fold image priorities.

### Security Hardening
- [x] **Fastify Helmet**: Secure HTTP response headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`).
- [x] **Rate Limiting**: 100 requests per minute per IP to protect against brute-force attacks.
- [x] **Authentication Cookies**: `httpOnly: true`, `secure: true`, `sameSite: 'lax'`, signed with 64-character secret.

---

## 3. DEPLOYMENT INSTRUCTIONS

### Option A: Render (Monorepo Blueprint or Manual Services)

#### Method 1: 1-Click Render Blueprint (`render.yaml`)
1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** > **Blueprint**.
3. Select your repository. Render reads [render.yaml](file:///d:/Internship/E-commerce/render.yaml) and automatically provisions:
   - **PostgreSQL Database** (`nexus-db`)
   - **Fastify API Web Service** (`nexus-api`)
   - **Next.js Web Storefront** (`nexus-web`)
4. Fill in `STOREFRONT_URL` (e.g. `https://nexus-web.onrender.com`) and `NEXT_PUBLIC_API_URL` (e.g. `https://nexus-api.onrender.com/api/v1`) in the prompt.
5. Click **Apply**.

#### Method 2: Manual Setup on Render
1. **Create Managed PostgreSQL**:
   - Go to **New +** > **PostgreSQL**.
   - Name: `nexus-db`, Database: `nexus_marketplace`.
   - Copy the **Internal Database URL**.
2. **Deploy Fastify API**:
   - Go to **New +** > **Web Service** > Connect Repo.
   - **Environment:** Node
   - **Build Command:** `npm install -g pnpm && pnpm install --frozen-lockfile && pnpm --filter @nexus/db db:generate && pnpm --filter @nexus/db db:push && pnpm turbo run build --filter=@nexus/api...`
   - **Start Command:** `pnpm --filter @nexus/api start`
   - **Health Check Path:** `/api/v1/health`
   - **Env Vars:**
     - `DATABASE_URL`: *(Paste Internal Database URL from step 1)*
     - `NODE_ENV`: `production`
     - `JWT_ACCESS_SECRET`: *(32+ random characters)*
     - `JWT_REFRESH_SECRET`: *(32+ random characters)*
     - `COOKIE_SECRET`: *(32+ random characters)*
     - `STOREFRONT_URL`: `https://nexus-web.onrender.com`
3. **Deploy Next.js Web Storefront**:
   - Go to **New +** > **Web Service** > Connect Repo.
   - **Environment:** Node
   - **Build Command:** `npm install -g pnpm && pnpm install --frozen-lockfile && pnpm turbo run build --filter=@nexus/web...`
   - **Start Command:** `pnpm --filter @nexus/web start`
   - **Env Vars:**
     - `NODE_ENV`: `production`
     - `NEXT_PUBLIC_API_URL`: `https://nexus-api.onrender.com/api/v1`

---

### Option B: Vercel (`apps/web`) + Render (`apps/api` & PostgreSQL)

#### 1. Deploy Fastify API on Render:
- Follow Step 1 & 2 of the manual Render setup above.

#### 2. Deploy Next.js Web on Vercel:
- **Framework Preset:** Next.js
- **Root Directory:** `apps/web`
- **Build Command:** `cd ../.. && pnpm --filter @nexus/web build`
- **Output Directory:** `.next`
- **Environment Variables:**
  - `NEXT_PUBLIC_API_URL=https://nexus-api.onrender.com/api/v1`

---

### Option C: Docker Compose (Single Host / VPS)
```bash
# Launch database, redis, API, and web storefront
docker-compose up -d --build
```

---

## 4. VERIFICATION COMMANDS
```bash
# 1. Typecheck & Build API
pnpm --filter @nexus/api build

# 2. Build Next.js Web Storefront
pnpm --filter @nexus/web build

# 3. Execute Complete Test Suite
pnpm test
```
All checks must return exit code 0.
