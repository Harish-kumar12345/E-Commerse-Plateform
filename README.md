# NEXUS Bazaar — Precision Multi-Vendor Marketplace ⚡

> **Next-Generation E-Commerce Marketplace for the India Market (INR ₹)**  
> Built with Next.js 15 App Router, Fastify REST API v1, Prisma ORM, PostgreSQL, TailwindCSS, and Framer Motion.

---

## 🌟 Signature Features & Differentiators

Unlike legacy marketplaces cluttered with low-relevance banners and hidden seller markups, **NEXUS** is engineered for high-velocity precision commerce:

1. **🧠 AI Natural Language Product Finder (`/ai-finder`)**  
   Conversational search powered by semantic intent extraction, natural language Indian budget parsing (e.g. *"under 30k"*, *"below 70,000"*, *"less than 1.5L"*), decision priority weighting, and transparent explainability verdicts (*Why this fits your query*, *Spec highlights*, *Trade-offs*).

2. **🔄 360° Interactive Studio & Acoustic CAD / X-Ray (`/p/[slug]`)**  
   HTML5 Canvas-based 3D product studio featuring 360-degree drag-to-rotate gestures, real-time Azimuth angle HUD (`AZIMUTH: 184°`), auto-spin inertia, interactive pulsing spec hotspots (*30mm Carbon Drivers*, *AI Microphones*, *Protein Leather*), and CAD Wireframe / X-Ray acoustic modes.

3. **📉 Price History Sparklines & Price-Drop Vault Sentinels**  
   Every variant logs historical price changes. Shoppers can hover over interactive 30-day sparklines to inspect all-time low records and activate 1-click Price-Drop Sentinels with 5%, 10%, or custom rupee thresholds delivered via WhatsApp, SMS, or Email.

4. **🛒 Multi-Seller Split Cart & Single-Page Checkout (`/checkout`)**  
   Unified cart allowing shoppers to purchase across independent merchants in one transaction. Automatically partitioned into parent `Order` and isolated `SubOrder` records with separate shipping labels, GST tax breakdowns, and commission deductions (8% - 12%).

5. **🏪 Verified Seller Center (`/seller`) & Platform Admin (`/admin`)**  
   Complete multi-vendor governance: statutory Indian merchant KYC onboarding (GSTIN, PAN, IFSC validation), live AWB courier generation with Shiprocket, stock movement audits, and platform GMV analytics.

---

## 🏗️ Monorepo Architecture

```
d:/Internship/E-commerce/
├── apps/
│   ├── web/                         # Storefront + Customer Portal + Seller Center (Next.js 15)
│   │   ├── app/
│   │   │   ├── (storefront)/        # Browsing: Home, /c/[categorySlug], /p/[slug], /deals, /search
│   │   │   ├── ai-finder/           # Conversational AI Discovery Engine
│   │   │   ├── cart/ & checkout/    # Multi-Seller Split Cart & Single-Page Checkout
│   │   │   ├── account/             # Orders, Wishlist, RMA Returns, Nexus Coins Loyalty
│   │   │   ├── seller/              # Merchant KYC Onboarding & Operations Center
│   │   │   ├── admin/               # Platform GMV Analytics & Merchant Verification
│   │   │   ├── sitemap.ts           # Dynamic XML sitemap indexing all routes
│   │   │   └── robots.ts            # Crawler access control & rules
│   │   └── components/              # 360 Studio, Price Drop Modal, Navbar, Footer
│   │
│   └── api/                         # Fastify High-Performance REST API v1
│       └── src/
│           ├── routes/              # Modular versioned routes (/api/v1/*)
│           │   ├── ai-finder.ts     # Neural intent parser & catalog ranking
│           │   ├── products.ts      # Faceted catalog with Meilisearch sync
│           │   ├── cart.ts          # Multi-vendor guest & authenticated cart
│           │   ├── checkout.ts      # Transactional order creation & COD OTP
│           │   ├── payments.ts      # Razorpay payment gateway integration
│           │   ├── account.ts       # Price alerts, returns & verified reviews
│           │   ├── admin.ts         # Platform metrics, seller approvals
│           │   └── seller.ts        # Merchant orders, inventory, settlements
│           └── index.ts             # Fastify entrypoint with Helmet, CORS & Rate Limits
│
├── packages/
│   ├── db/                          # Prisma ORM & Database Layer
│   │   ├── prisma/schema.prisma     # 25+ models with integer minor units (paise)
│   │   └── prisma/seed.ts           # Comprehensive seed data with 8+ products, reviews, orders
│   │
│   ├── shared/                      # Shared Types, Zod Schemas & Utilities
│   │   └── src/utils/
│   │       ├── currency.ts          # Minor unit money formatting (paise -> ₹)
│   │       ├── tax.ts               # Indian GST calculations (CGST/SGST/IGST)
│   │       ├── ai-intent.ts         # Natural language budget extraction
│   │       ├── cart-split.ts        # Order partitioning & commission logic
│   │       └── validation.ts        # GSTIN, PAN, IFSC, and Pincode validators
│   │
│   └── ui/                          # Shared Design System
│
├── docker-compose.yml               # Local PostgreSQL, Redis, Mailpit
├── turbo.json                       # Turborepo caching & build pipeline
└── package.json                     # Monorepo scripts
```

---

## 🚀 Quickstart Guide

### Prerequisites
- **Node.js** >= 20.x
- **pnpm** >= 9.x
- **Docker** (optional, for local Postgres)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` in the root:
```bash
cp .env.example .env
```

### 3. Database Migration & Seeding
```bash
# Push schema to database
pnpm --filter @nexus/db db:push

# Seed initial multi-vendor catalog, sellers, and test accounts
pnpm --filter @nexus/db db:seed
```

### 4. Run Development Servers
```bash
# Starts both Next.js Storefront (port 3000) and Fastify API (port 4000)
pnpm dev
```
- **Storefront & AI Finder:** [http://localhost:3000](http://localhost:3000)
- **Fastify API Server:** [http://localhost:4000](http://localhost:4000)
- **API Health Check:** [http://localhost:4000/api/v1/health](http://localhost:4000/api/v1/health)

---

## 🧪 Testing & Validation Suite

Run tests across all workspaces:
```bash
pnpm test
```
The test suite executes with **100% pass rate** across:
- `currency.test.ts`: Minor unit formatting, paise to INR conversion, discount calculation.
- `tax.test.ts`: Indian GST intra-state (CGST + SGST) vs inter-state (IGST) math.
- `ai-intent.test.ts`: Natural language budget token extraction (*"under 30k"*, *"max 1.5L"*).
- `cart-split.test.ts`: Multi-vendor order splitting and commission deductions.
- `validation.test.ts`: 15-character GSTIN, 10-char PAN, 11-char IFSC, and 6-digit PIN validation.

---

## 🚢 Production Deployment

### Production Build
```bash
# Builds all workspace packages
pnpm build
```

### Key Production Environment Variables
| Variable | Purpose | Example |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL connection pool | `postgresql://user:pass@host:5432/nexus` |
| `JWT_ACCESS_SECRET` | Auth token encryption key | `secure_random_hex_64_characters` |
| `STOREFRONT_URL` | CORS allowlist for web | `https://nexusmarket.in` |
| `RAZORPAY_KEY_ID` | Razorpay gateway public key | `rzp_live_xxxxxxxxxxxx` |
| `RAZORPAY_KEY_SECRET`| Razorpay gateway secret | `live_secret_xxxxxxxx` |
| `SHIPROCKET_API_KEY` | Courier logistics API | `shiprocket_token_here` |

---

## 📄 License
Private & Proprietary — Developed for NEXUS Marketplace.
