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

### Option A: Vercel (`apps/web`) + Cloud Run (`apps/api`) [Recommended]

#### 1. Deploy Fastify API on Cloud Run / Render:
```bash
# In apps/api
docker build -t nexus-api:latest .
# Set Environment Variables:
# DATABASE_URL, JWT_ACCESS_SECRET, STOREFRONT_URL, PORT=4000
```

#### 2. Deploy Next.js Web on Vercel:
- **Framework Preset:** Next.js
- **Root Directory:** `apps/web`
- **Build Command:** `cd ../.. && pnpm --filter @nexus/web build`
- **Output Directory:** `.next`
- **Environment Variables:**
  - `NEXT_PUBLIC_API_URL=https://api.nexusmarket.in`

---

### Option B: Docker Compose (Single Host / VPS)
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
