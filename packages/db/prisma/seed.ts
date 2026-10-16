import { PrismaClient, Role, SellerStatus, ProductStatus, ParentOrderStatus, SubOrderStatus, PaymentStatus, PaymentMethod } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NEXUS Database Seed...');

  // Clean existing tables in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.loyaltyTransaction.deleteMany();
  await prisma.loyaltyAccount.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productQuestion.deleteMany();
  await prisma.review.deleteMany();
  await prisma.trackingEvent.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.returnRequest.deleteMany();
  await prisma.payout.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.subOrder.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.priceDropAlert.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.stockMovementLog.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productMedia.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password@123', 10);

  // 1. CREATE ADMIN USER
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@nexusmarket.in',
      name: 'NEXUS Operations Admin',
      phoneNumber: '9876543210',
      passwordHash,
      role: Role.ADMIN,
      isPrimeMember: true,
    },
  });

  // 2. CREATE SELLERS & PROFILES
  const sellerUser1 = await prisma.user.create({
    data: {
      email: 'seller.apex@nexusmarket.in',
      name: 'Vikram Singhania',
      phoneNumber: '9820011223',
      passwordHash,
      role: Role.SELLER,
    },
  });

  const sellerProfile1 = await prisma.sellerProfile.create({
    data: {
      userId: sellerUser1.id,
      storeName: 'Apex Electronics India',
      storeSlug: 'apex-electronics',
      businessEmail: 'contact@apexelectronics.in',
      businessPhone: '9820011223',
      gstin: '27AABCU9603R1ZM',
      pan: 'AABCU9603R',
      bankAccountNo: '918239019283',
      bankIfsc: 'HDFC0001234',
      pickupAddress: 'Plot 42, MIDC Industrial Area, Andheri East, Mumbai',
      pickupPincode: '400093',
      commissionRate: 0.08, // 8% commission
      status: SellerStatus.ACTIVE,
      rating: 4.8,
      totalRatings: 1420,
    },
  });

  const sellerUser2 = await prisma.user.create({
    data: {
      email: 'seller.urban@nexusmarket.in',
      name: 'Aanya Kapoor',
      phoneNumber: '9811122334',
      passwordHash,
      role: Role.SELLER,
    },
  });

  const sellerProfile2 = await prisma.sellerProfile.create({
    data: {
      userId: sellerUser2.id,
      storeName: 'Urban Stitch Apparels',
      storeSlug: 'urban-stitch',
      businessEmail: 'care@urbanstitch.in',
      businessPhone: '9811122334',
      gstin: '07AAECU4501F1ZW',
      pan: 'AAECU4501F',
      bankAccountNo: '5010023458912',
      bankIfsc: 'ICIC0000104',
      pickupAddress: 'Okhla Phase III, Industrial Estate, New Delhi',
      pickupPincode: '110020',
      commissionRate: 0.12, // 12% commission
      status: SellerStatus.ACTIVE,
      rating: 4.6,
      totalRatings: 840,
    },
  });

  const sellerUser3 = await prisma.user.create({
    data: {
      email: 'seller.aura@nexusmarket.in',
      name: 'Devendra Joshi',
      phoneNumber: '9845011998',
      passwordHash,
      role: Role.SELLER,
    },
  });

  const sellerProfile3 = await prisma.sellerProfile.create({
    data: {
      userId: sellerUser3.id,
      storeName: 'Aura Living & Home',
      storeSlug: 'aura-living',
      businessEmail: 'hello@auraliving.co.in',
      businessPhone: '9845011998',
      gstin: '29AABCL3409K1ZX',
      pan: 'AABCL3409K',
      bankAccountNo: '003405001239',
      bankIfsc: 'SBIN0004051',
      pickupAddress: 'Indiranagar 100ft Road, Bengaluru, Karnataka',
      pickupPincode: '560038',
      commissionRate: 0.10, // 10% commission
      status: SellerStatus.ACTIVE,
      rating: 4.9,
      totalRatings: 560,
    },
  });

  // 3. CREATE CUSTOMERS
  const customer1 = await prisma.user.create({
    data: {
      email: 'rahul.sharma@example.com',
      name: 'Rahul Sharma',
      phoneNumber: '9892019283',
      passwordHash,
      role: Role.CUSTOMER,
      isPrimeMember: true,
      primeExpiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  const address1 = await prisma.address.create({
    data: {
      userId: customer1.id,
      fullName: 'Rahul Sharma',
      phoneNumber: '9892019283',
      addressLine1: 'B-402, Lodha Bellissimo, NM Joshi Marg',
      addressLine2: 'Mahalaxmi West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400011',
      country: 'India',
      isDefault: true,
    },
  });

  await prisma.loyaltyAccount.create({
    data: {
      userId: customer1.id,
      coinsBalance: 450, // 450 Nexus Coins (₹450)
      referralCode: 'RAHUL99',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      email: 'priya.verma@example.com',
      name: 'Priya Verma',
      phoneNumber: '9871092834',
      passwordHash,
      role: Role.CUSTOMER,
      isPrimeMember: false,
    },
  });

  const address2 = await prisma.address.create({
    data: {
      userId: customer2.id,
      fullName: 'Priya Verma',
      phoneNumber: '9871092834',
      addressLine1: 'Villa 14, Palm Meadows, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560066',
      country: 'India',
      isDefault: true,
    },
  });

  // 4. CREATE CATEGORIES
  const catElectronics = await prisma.category.create({
    data: {
      name: 'Electronics & Gadgets',
      slug: 'electronics',
      description: 'Laptops, smartphones, audio peripherals and precision tech',
      imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
      orderIndex: 1,
    },
  });

  const catAudio = await prisma.category.create({
    data: {
      name: 'Audio & Wearables',
      slug: 'audio-wearables',
      description: 'Studio headphones, true wireless earbuds and portable acoustics',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      parentId: catElectronics.id,
      orderIndex: 2,
    },
  });

  const catFashion = await prisma.category.create({
    data: {
      name: 'Fashion & Apparel',
      slug: 'fashion',
      description: 'High-density cotton tees, all-weather technical outerwear and basics',
      imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
      orderIndex: 3,
    },
  });

  const catHome = await prisma.category.create({
    data: {
      name: 'Home & Living',
      slug: 'home-living',
      description: 'Architectural ceramics, executive work desks and minimalist furniture',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
      orderIndex: 4,
    },
  });

  const catGaming = await prisma.category.create({
    data: {
      name: 'Gaming & Setup',
      slug: 'gaming',
      description: 'Next-gen consoles, mechanical custom keyboards and desktop gear',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
      orderIndex: 5,
    },
  });

  // 5. SEED PRODUCTS
  const productsData = [
    {
      title: 'Sony WH-1000XM5 Wireless Active Noise Canceling Headphones',
      slug: 'sony-wh-1000xm5-wireless-anc-headphones',
      sellerId: sellerProfile1.id,
      categoryId: catAudio.id,
      brand: 'Sony',
      hsnCode: '85183000',
      taxRatePercent: 18.0,
      shortDescription: 'Industry-leading noise cancellation with Auto NC Optimizer, 30-hour battery life, and crystal-clear hands-free calling.',
      description: `The Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality. With a newly developed driver, DSEE - Extreme and Hi-Res audio support, the WH-1000XM5 provides awe-inspiring audio quality.
      
Features:
- Magnificently engineered Auto NC Optimizer
- Up to 30-hour battery life with fast charging (3 min charge for 3 hours playback)
- Ultra-comfortable, lightweight design with soft fit leather
- Multipoint connection allows you to quickly switch between devices`,
      isFeatured: true,
      isDealOfTheDay: true,
      dealDiscountPct: 20.0,
      dealEndsAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      avgRating: 4.8,
      reviewCount: 328,
      aiSpecsSummary: {
        category: 'Headphones',
        noiseCanceling: 'Active (Flagship Auto NC)',
        batteryLife: '30 hours',
        connectivity: 'Bluetooth 5.2, Multipoint, 3.5mm jack',
        micQuality: '4 beamforming mics with AI noise reduction',
        weight: '250g',
        bestFor: 'Commuting, deep work, audiophiles, travel',
      },
      media: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
      ],
      variants: [
        {
          sku: 'SONY-XM5-BLK',
          title: 'Midnight Black',
          priceInPaise: 2799000, // ₹27,990
          compareAtInPaise: 3499000, // ₹34,990
          costPriceInPaise: 2200000,
          attributes: { Color: 'Midnight Black' },
          stock: 45,
        },
        {
          sku: 'SONY-XM5-SLV',
          title: 'Platinum Silver',
          priceInPaise: 2799000, // ₹27,990
          compareAtInPaise: 3499000, // ₹34,990
          costPriceInPaise: 2200000,
          attributes: { Color: 'Platinum Silver' },
          stock: 18,
        },
      ],
    },
    {
      title: 'Apple MacBook Air 15-inch M3 Chip (16GB Unified Memory, 512GB SSD)',
      slug: 'apple-macbook-air-15-m3-16gb-512gb',
      sellerId: sellerProfile1.id,
      categoryId: catElectronics.id,
      brand: 'Apple',
      hsnCode: '84713010',
      taxRatePercent: 18.0,
      shortDescription: 'Strikingly thin and fast with the power of M3 chip, Liquid Retina display, and up to 18 hours of battery life.',
      description: `The 15-inch MacBook Air is impossibly thin and has a stunning Liquid Retina display. Supercharged by the M3 chip with an 8-core CPU and 10-core GPU, it breezes through work and play.

Key Specifications:
- Apple M3 chip with 8-core CPU and 10-core GPU
- 16GB unified memory for fluid multitasking
- 512GB superfast SSD storage
- 15.3-inch Liquid Retina display with True Tone and 500 nits brightness
- MagSafe 3 charging port, two Thunderbolt ports, headphone jack`,
      isFeatured: true,
      isDealOfTheDay: false,
      avgRating: 4.9,
      reviewCount: 194,
      aiSpecsSummary: {
        category: 'Laptop',
        processor: 'Apple M3 (8-core CPU / 10-core GPU)',
        ram: '16GB Unified Memory',
        storage: '512GB SSD',
        display: '15.3-inch Liquid Retina (2880x1864)',
        batteryLife: 'Up to 18 hours',
        weight: '1.51 kg',
        bestFor: 'Software development, video editing, university, executive productivity',
      },
      media: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
      ],
      variants: [
        {
          sku: 'MBA-15-M3-MIDNIGHT',
          title: 'Midnight (Dark Navy)',
          priceInPaise: 15490000, // ₹1,54,900
          compareAtInPaise: 17490000, // ₹1,74,900
          costPriceInPaise: 13800000,
          attributes: { Color: 'Midnight', Storage: '512GB', RAM: '16GB' },
          stock: 22,
        },
        {
          sku: 'MBA-15-M3-STARLIGHT',
          title: 'Starlight (Champagne Gold)',
          priceInPaise: 15490000, // ₹1,54,900
          compareAtInPaise: 17490000, // ₹1,74,900
          costPriceInPaise: 13800000,
          attributes: { Color: 'Starlight', Storage: '512GB', RAM: '16GB' },
          stock: 14,
        },
      ],
    },
    {
      title: 'Logitech MX Master 3S Wireless Performance Mouse',
      slug: 'logitech-mx-master-3s-wireless-mouse',
      sellerId: sellerProfile1.id,
      categoryId: catElectronics.id,
      brand: 'Logitech',
      hsnCode: '84716060',
      taxRatePercent: 18.0,
      shortDescription: 'Ergonomic wireless mouse with Quiet Clicks, 8K DPI track-on-glass sensor, and MagSpeed electromagnetic scroll wheel.',
      description: `Feel every moment of your workflow with even more precision, tactility, and performance, thanks to Quiet Clicks and an 8,000 DPI track-on-glass sensor. MagSpeed Electromagnetic scrolling is precise enough to stop on a pixel and quick enough to scroll 1,000 lines per second.`,
      isFeatured: false,
      isDealOfTheDay: true,
      dealDiscountPct: 15.0,
      dealEndsAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      avgRating: 4.7,
      reviewCount: 512,
      aiSpecsSummary: {
        category: 'Computer Peripherals',
        sensor: '8000 DPI Darkfield track-on-glass',
        buttons: '7 customizable buttons + gesture button',
        scrollWheel: 'MagSpeed electromagnetic wheel',
        battery: 'Up to 70 days on full charge',
        bestFor: 'Designers, coders, power productivity, multiple displays',
      },
      media: [
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
      ],
      variants: [
        {
          sku: 'LOGI-MX3S-GRAPHITE',
          title: 'Graphite',
          priceInPaise: 899500, // ₹8,995
          compareAtInPaise: 1099500, // ₹10,995
          costPriceInPaise: 680000,
          attributes: { Color: 'Graphite' },
          stock: 60,
        },
        {
          sku: 'LOGI-MX3S-PALEGREY',
          title: 'Pale Grey',
          priceInPaise: 899500, // ₹8,995
          compareAtInPaise: 1099500, // ₹10,995
          costPriceInPaise: 680000,
          attributes: { Color: 'Pale Grey' },
          stock: 35,
        },
      ],
    },
    {
      title: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard (QMK/VIA CNC Aluminum)',
      slug: 'keychron-q1-pro-wireless-custom-mechanical-keyboard',
      sellerId: sellerProfile1.id,
      categoryId: catGaming.id,
      brand: 'Keychron',
      hsnCode: '84716040',
      taxRatePercent: 18.0,
      shortDescription: 'Full CNC machined 75% aluminum layout with double-gasket design, Bluetooth 5.1 & Type-C wired mode, hot-swappable switches.',
      description: `The Keychron Q1 Pro is a groundbreaking all-metal wireless custom mechanical keyboard. Along with many premium designs, including double-gasket design, PBT keycaps, screw-in stabs, and wireless Bluetooth connectivity, it will deliver an unprecedented typing experience.`,
      isFeatured: true,
      isDealOfTheDay: false,
      avgRating: 4.9,
      reviewCount: 88,
      aiSpecsSummary: {
        category: 'Mechanical Keyboard',
        connectivity: 'Bluetooth 5.1 & USB-C Wired',
        layout: '75% exploded layout with aluminum knob',
        switches: 'Keychron K Pro Red (Linear) / Brown (Tactile)',
        chassis: 'Solid 6063 CNC Aluminum body',
        bestFor: 'Desk aesthetic enthusiasts, developers, writers, gamers',
      },
      media: [
        'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
      ],
      variants: [
        {
          sku: 'KC-Q1PRO-RED',
          title: 'Carbon Black / K Pro Red (Linear)',
          priceInPaise: 1849900, // ₹18,499
          compareAtInPaise: 2199900, // ₹21,999
          costPriceInPaise: 1400000,
          attributes: { Switch: 'K Pro Red (Linear)', Color: 'Carbon Black' },
          stock: 15,
        },
        {
          sku: 'KC-Q1PRO-BROWN',
          title: 'Silver Grey / K Pro Brown (Tactile)',
          priceInPaise: 1849900, // ₹18,499
          compareAtInPaise: 2199900, // ₹21,999
          costPriceInPaise: 1400000,
          attributes: { Switch: 'K Pro Brown (Tactile)', Color: 'Silver Grey' },
          stock: 12,
        },
      ],
    },
    {
      title: 'Urban Stitch 280 GSM Heavyweight Supima Cotton Oversized Tee',
      slug: 'urban-stitch-280gsm-heavyweight-supima-oversized-tee',
      sellerId: sellerProfile2.id,
      categoryId: catFashion.id,
      brand: 'Urban Stitch',
      hsnCode: '61091000',
      taxRatePercent: 12.0,
      shortDescription: 'Structured boxy fit tee crafted from 100% American Supima extra-long staple combed cotton. Zero shrinkage guarantee.',
      description: `Engineered for the modern wardrobe, this 280 GSM heavyweight tee offers an architectural drape that retains its silhouette all day. Pre-shrunk, bio-washed, and reinforced with double-needle ribbed collar.`,
      isFeatured: true,
      isDealOfTheDay: false,
      avgRating: 4.8,
      reviewCount: 420,
      aiSpecsSummary: {
        category: 'Men Fashion',
        material: '100% American Supima Cotton (280 GSM)',
        fit: 'Boxy drop-shoulder oversized fit',
        care: 'Machine wash cold, air dry',
        bestFor: 'Streetwear, casual layering, everyday minimal wardrobe',
      },
      media: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
      ],
      variants: [
        {
          sku: 'US-TEE-BLK-M',
          title: 'Washed Charcoal Black / Medium',
          priceInPaise: 149900, // ₹1,499
          compareAtInPaise: 249900, // ₹2,499
          costPriceInPaise: 65000,
          attributes: { Color: 'Washed Charcoal', Size: 'M' },
          stock: 80,
        },
        {
          sku: 'US-TEE-BLK-L',
          title: 'Washed Charcoal Black / Large',
          priceInPaise: 149900, // ₹1,499
          compareAtInPaise: 249900, // ₹2,499
          costPriceInPaise: 65000,
          attributes: { Color: 'Washed Charcoal', Size: 'L' },
          stock: 65,
        },
        {
          sku: 'US-TEE-ECRU-M',
          title: 'Natural Ecru / Medium',
          priceInPaise: 149900, // ₹1,499
          compareAtInPaise: 249900, // ₹2,499
          costPriceInPaise: 65000,
          attributes: { Color: 'Natural Ecru', Size: 'M' },
          stock: 45,
        },
      ],
    },
    {
      title: 'Urban Stitch Weatherproof Cordura Utility Field Jacket',
      slug: 'urban-stitch-weatherproof-cordura-utility-jacket',
      sellerId: sellerProfile2.id,
      categoryId: catFashion.id,
      brand: 'Urban Stitch',
      hsnCode: '62014000',
      taxRatePercent: 12.0,
      shortDescription: 'Technical outerwear built with water-repellent 500D Cordura fabric, YKK Aquaguard zippers, and 6 modular cargo pockets.',
      description: `Designed for urban commutes and unpredictable weather. Features a stowaway hood, magnetic storm flap closures, internal device pocket, and breathable underarm gussets.`,
      isFeatured: false,
      isDealOfTheDay: true,
      dealDiscountPct: 30.0,
      dealEndsAt: new Date(Date.now() + 36 * 60 * 60 * 1000),
      avgRating: 4.7,
      reviewCount: 92,
      aiSpecsSummary: {
        category: 'Outerwear',
        fabric: '500D Cordura Nylon with DWR water-repellent coating',
        hardware: 'YKK Aquaguard zippers + Fidlock magnetic snaps',
        pockets: '6 external pockets + 2 internal zippered compartments',
        bestFor: 'Monsoon, motorcycle commute, outdoor travel',
      },
      media: [
        'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
      ],
      variants: [
        {
          sku: 'US-JKT-OLV-M',
          title: 'Olive Drab / Medium',
          priceInPaise: 499900, // ₹4,999
          compareAtInPaise: 799900, // ₹7,999
          costPriceInPaise: 280000,
          attributes: { Color: 'Olive Drab', Size: 'M' },
          stock: 25,
        },
        {
          sku: 'US-JKT-OLV-L',
          title: 'Olive Drab / Large',
          priceInPaise: 499900, // ₹4,999
          compareAtInPaise: 799900, // ₹7,999
          costPriceInPaise: 280000,
          attributes: { Color: 'Olive Drab', Size: 'L' },
          stock: 14,
        },
      ],
    },
    {
      title: 'Aura Studio Hand-Thrown Matte Ceramic Pour-Over Coffee Set',
      slug: 'aura-studio-matte-ceramic-pour-over-coffee-set',
      sellerId: sellerProfile3.id,
      categoryId: catHome.id,
      brand: 'Aura Living',
      hsnCode: '69120010',
      taxRatePercent: 12.0,
      shortDescription: 'Artisanal stoneware V60 style dripper with 600ml matching carafe, finished in satin volcanic ash glaze.',
      description: `Each set is individually hand-thrown on the potter's wheel using high-fired grogged stoneware. The spiral interior ribs optimize water flow and thermal stability for sweet, balanced extraction. Dishwasher and microwave safe.`,
      isFeatured: true,
      isDealOfTheDay: false,
      avgRating: 4.9,
      reviewCount: 165,
      aiSpecsSummary: {
        category: 'Coffee & Kitchenware',
        material: 'High-fired grogged stoneware',
        capacity: '600ml Carafe + Size 02 Dripper (1-4 cups)',
        glaze: 'Food-safe lead-free volcanic ash matte glaze',
        bestFor: 'Coffee enthusiasts, slow mornings, housewarming gift',
      },
      media: [
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
      ],
      variants: [
        {
          sku: 'AURA-CFE-SLATE',
          title: 'Volcanic Slate Grey',
          priceInPaise: 289900, // ₹2,899
          compareAtInPaise: 389900, // ₹3,899
          costPriceInPaise: 120000,
          attributes: { Color: 'Volcanic Slate Grey' },
          stock: 30,
        },
        {
          sku: 'AURA-CFE-SAND',
          title: 'Desert Sand Dune',
          priceInPaise: 289900, // ₹2,899
          compareAtInPaise: 389900, // ₹3,899
          costPriceInPaise: 120000,
          attributes: { Color: 'Desert Sand Dune' },
          stock: 22,
        },
      ],
    },
    {
      title: 'Aura ErgoPro Minimalist Executive Breathable Mesh Chair',
      slug: 'aura-ergopro-minimalist-executive-mesh-chair',
      sellerId: sellerProfile3.id,
      categoryId: catHome.id,
      brand: 'Aura Living',
      hsnCode: '94013000',
      taxRatePercent: 18.0,
      shortDescription: 'Orthopedic dynamic lumbar support chair with 3D armrests, Italian Donati synchro-tilt mechanism, and breathable German mesh.',
      description: `Conquer 10+ hour workdays in sublime comfort. Built with a solid aluminum base, class-4 gas lift, and adaptive self-adjusting lumbar curve that relieves lower spine tension.`,
      isFeatured: true,
      isDealOfTheDay: false,
      avgRating: 4.8,
      reviewCount: 310,
      aiSpecsSummary: {
        category: 'Ergonomic Furniture',
        mechanism: 'Italian Donati Synchro-tilt with 4 locking angles',
        mesh: 'High-tensile breathable elastomeric mesh',
        weightCapacity: '135 kg (300 lbs)',
        armrests: '3D adjustable (height, depth, pivot)',
        bestFor: 'Work from home, developers, back pain relief, long sessions',
      },
      media: [
        'https://images.unsplash.com/photo-1580481077191-4543789452c9?w=800&q=80',
      ],
      variants: [
        {
          sku: 'AURA-CHAIR-BLK',
          title: 'Graphite Mesh / Polished Aluminum Frame',
          priceInPaise: 1999900, // ₹19,999
          compareAtInPaise: 2799900, // ₹27,999
          costPriceInPaise: 1350000,
          attributes: { Color: 'Graphite Black' },
          stock: 16,
        },
      ],
    },
    {
      title: 'PlayStation 5 Slim Digital Edition Console (1TB Custom SSD)',
      slug: 'playstation-5-slim-digital-edition-1tb',
      sellerId: sellerProfile1.id,
      categoryId: catGaming.id,
      brand: 'Sony',
      hsnCode: '95045000',
      taxRatePercent: 18.0,
      shortDescription: 'Next-gen gaming power in a sleek, compact silhouette with 1TB SSD, Tempest 3D AudioTech, and 4K 120Hz HDR gameplay.',
      description: `Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio, and an all-new generation of incredible PlayStation games.`,
      isFeatured: true,
      isDealOfTheDay: false,
      avgRating: 4.9,
      reviewCount: 480,
      aiSpecsSummary: {
        category: 'Gaming Console',
        storage: '1TB Custom High-Speed NVMe SSD (5.5 GB/s raw)',
        graphics: 'AMD RDNA 2 GPU with Ray Tracing up to 4K 120fps',
        audio: 'Tempest 3D AudioTech engine',
        controller: 'Includes DualSense wireless controller',
        bestFor: 'AAA 4K console gaming, exclusive titles, family entertainment',
      },
      media: [
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
      ],
      variants: [
        {
          sku: 'PS5-SLIM-DIGITAL',
          title: 'White / 1TB SSD Digital Edition',
          priceInPaise: 4499000, // ₹44,990
          compareAtInPaise: 4999000, // ₹49,990
          costPriceInPaise: 3900000,
          attributes: { Edition: 'Digital Edition', Storage: '1TB' },
          stock: 25,
        },
      ],
    },
    {
      title: 'Sony DualSense Wireless Controller Midnight Black',
      slug: 'sony-dualsense-wireless-controller-midnight-black',
      sellerId: sellerProfile1.id,
      categoryId: catGaming.id,
      brand: 'Sony',
      hsnCode: '95045000',
      taxRatePercent: 18.0,
      shortDescription: 'Immersive haptic feedback, dynamic adaptive triggers, and a built-in microphone, all integrated into an iconic comfortable design.',
      description: `Feel physically responsive feedback to your in-game actions with dual actuators which replace traditional rumble motors. In your hands, these dynamic vibrations can simulate the feeling of everything from environments to the recoil of different weapons.`,
      isFeatured: false,
      isDealOfTheDay: true,
      dealDiscountPct: 18.0,
      dealEndsAt: new Date(Date.now() + 18 * 60 * 60 * 1000),
      avgRating: 4.8,
      reviewCount: 220,
      aiSpecsSummary: {
        category: 'Gaming Accessories',
        features: 'Haptic feedback, adaptive triggers, built-in mic & 3.5mm jack',
        connectivity: 'Bluetooth 5.1 & USB-C wired',
        battery: 'Built-in rechargeable Li-ion',
        bestFor: 'PS5, PC Steam gaming, iOS/Android mobile gaming',
      },
      media: [
        'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&q=80',
      ],
      variants: [
        {
          sku: 'DUALSENSE-BLK',
          title: 'Midnight Black',
          priceInPaise: 549000, // ₹5,490
          compareAtInPaise: 639000, // ₹6,390
          costPriceInPaise: 420000,
          attributes: { Color: 'Midnight Black' },
          stock: 40,
        },
      ],
    },
    {
      title: 'Kindle Paperwhite (16 GB) 6.8-inch Glare-Free Display with Adjustable Warm Light',
      slug: 'kindle-paperwhite-16gb-68-glare-free-display',
      sellerId: sellerProfile1.id,
      categoryId: catElectronics.id,
      brand: 'Amazon',
      hsnCode: '84713090',
      taxRatePercent: 18.0,
      shortDescription: 'Waterproof e-reader with 300 ppi glare-free display, 10 weeks of battery life, and 20% faster page turns.',
      description: `Now with a 6.8-inch display and thinner borders, adjustable warm light, up to 10 weeks of battery life, and 20% faster page turns. Flush-front design and 300 ppi glare-free display that reads like real paper even in bright sunlight. IPX8 rated waterproof.`,
      isFeatured: false,
      isDealOfTheDay: false,
      avgRating: 4.8,
      reviewCount: 650,
      aiSpecsSummary: {
        category: 'E-Reader',
        screen: '6.8-inch Paperwhite with built-in light, 300 ppi',
        storage: '16GB (holds thousands of books)',
        battery: 'Up to 10 weeks on a single USB-C charge',
        waterproof: 'IPX8 (survives 2 meters freshwater for 60 min)',
        bestFor: 'Book lovers, bed reading, travel, beach reading',
      },
      media: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
      ],
      variants: [
        {
          sku: 'KINDLE-PW-16GB-BLK',
          title: 'Black / 16GB',
          priceInPaise: 1399900, // ₹13,999
          compareAtInPaise: 1499900, // ₹14,999
          costPriceInPaise: 1100000,
          attributes: { Color: 'Black', Storage: '16GB' },
          stock: 35,
        },
      ],
    },
    {
      title: 'Bose SoundLink Flex Portable Waterproof Bluetooth Outdoor Speaker',
      slug: 'bose-soundlink-flex-portable-bluetooth-speaker',
      sellerId: sellerProfile1.id,
      categoryId: catAudio.id,
      brand: 'Bose',
      hsnCode: '85182100',
      taxRatePercent: 18.0,
      shortDescription: 'Rugged wireless speaker with PositionIQ technology, IP67 waterproof & dustproof rating, up to 12 hours playback.',
      description: `State-of-the-art design packs clear, deep sound into a compact speaker that resists water, dust, and drops. PositionIQ technology automatically detects orientation to optimize audio quality whether standing upright or hanging.`,
      isFeatured: false,
      isDealOfTheDay: true,
      dealDiscountPct: 22.0,
      dealEndsAt: new Date(Date.now() + 30 * 60 * 60 * 1000),
      avgRating: 4.7,
      reviewCount: 290,
      aiSpecsSummary: {
        category: 'Portable Speaker',
        battery: 'Up to 12 hours battery life',
        waterproof: 'IP67 waterproof, dustproof and floats in water',
        positionIQ: 'Auto-adapting sound orientation',
        bestFor: 'Outdoor trips, showers, beach parties, room audio',
      },
      media: [
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
      ],
      variants: [
        {
          sku: 'BOSE-FLEX-BLUE',
          title: 'Stone Blue',
          priceInPaise: 1190000, // ₹11,900
          compareAtInPaise: 1590000, // ₹15,900
          costPriceInPaise: 890000,
          attributes: { Color: 'Stone Blue' },
          stock: 28,
        },
        {
          sku: 'BOSE-FLEX-BLK',
          title: 'Black',
          priceInPaise: 1190000, // ₹11,900
          compareAtInPaise: 1590000, // ₹15,900
          costPriceInPaise: 890000,
          attributes: { Color: 'Black' },
          stock: 19,
        },
      ],
    },
    {
      title: 'Dyson V12 Detect Slim Total Clean Cordless Vacuum Cleaner',
      slug: 'dyson-v12-detect-slim-cordless-vacuum-cleaner',
      sellerId: sellerProfile1.id,
      categoryId: catHome.id,
      brand: 'Dyson',
      hsnCode: '85081100',
      taxRatePercent: 18.0,
      shortDescription: 'Laser reveals invisible dust on hard floors with piezo sensor measuring dust particles and up to 60 minutes run time.',
      description: `Dyson's lightest intelligent cordless vacuum with laser illumination. Engineered for deep cleaning everywhere. Features single-button power control, hair screw tool with anti-tangle conical brush bar, and whole-machine filtration.`,
      isFeatured: true,
      isDealOfTheDay: false,
      avgRating: 4.8,
      reviewCount: 140,
      aiSpecsSummary: {
        category: 'Home Appliances',
        suctionPower: '150 Air Watts (Hyperdymium motor)',
        weight: '2.2 kg (Ultra lightweight)',
        runTime: 'Up to 60 minutes',
        technology: 'Fluffy Optic laser reveals microscopic dust',
        bestFor: 'Pet owners, hardwood & tile floors, dust allergy relief',
      },
      media: [
        'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80',
      ],
      variants: [
        {
          sku: 'DYSON-V12-SLIM',
          title: 'Yellow / Iron',
          priceInPaise: 5290000, // ₹52,900
          compareAtInPaise: 6590000, // ₹65,900
          costPriceInPaise: 4200000,
          attributes: { Color: 'Yellow / Iron' },
          stock: 10,
        },
      ],
    },
    {
      title: 'Aura Artisanal Cast-Iron Enamelled Dutch Oven (4.5 Litre)',
      slug: 'aura-artisanal-cast-iron-enamelled-dutch-oven-4-5l',
      sellerId: sellerProfile3.id,
      categoryId: catHome.id,
      brand: 'Aura Living',
      hsnCode: '73239100',
      taxRatePercent: 12.0,
      shortDescription: 'Heavy cast-iron construction distributes heat evenly, coated in chip-resistant porcelain enamel with brass lid knob.',
      description: `From slow-simmered biryanis and stews to crusty artisanal sourdough bread, this 4.5L Dutch oven delivers legendary heat retention. Compatible with all stovetops including induction and oven-safe up to 260°C.`,
      isFeatured: false,
      isDealOfTheDay: false,
      avgRating: 4.9,
      reviewCount: 95,
      aiSpecsSummary: {
        category: 'Cookware',
        capacity: '4.5 Litres (Serves 4-6)',
        material: 'Cast Iron with 3-layer porcelain enamel',
        compatibility: 'Gas, Induction, Ceramic, Oven safe up to 260°C',
        bestFor: 'Sourdough baking, braising, biryani, slow cooking',
      },
      media: [
        'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80',
      ],
      variants: [
        {
          sku: 'AURA-DO-MATTEGREEN',
          title: 'Forest Moss Green',
          priceInPaise: 649900, // ₹6,499
          compareAtInPaise: 849900, // ₹8,499
          costPriceInPaise: 350000,
          attributes: { Color: 'Forest Moss Green' },
          stock: 15,
        },
      ],
    },
  ];

  for (const p of productsData) {
    const product = await prisma.product.create({
      data: {
        title: p.title,
        slug: p.slug,
        sellerId: p.sellerId,
        categoryId: p.categoryId,
        brand: p.brand,
        hsnCode: p.hsnCode,
        taxRatePercent: p.taxRatePercent,
        shortDescription: p.shortDescription,
        description: p.description,
        isFeatured: p.isFeatured,
        isDealOfTheDay: p.isDealOfTheDay,
        dealDiscountPct: p.dealDiscountPct,
        dealEndsAt: p.dealEndsAt,
        avgRating: p.avgRating,
        reviewCount: p.reviewCount,
        aiSpecsSummary: p.aiSpecsSummary,
        status: ProductStatus.PUBLISHED,
      },
    });

    // Add media
    for (let i = 0; i < p.media.length; i++) {
      await prisma.productMedia.create({
        data: {
          productId: product.id,
          url: p.media[i],
          sortOrder: i,
          mediaType: 'IMAGE',
        },
      });
    }

    // Add variants and inventory
    for (const v of p.variants) {
      const variant = await prisma.productVariant.create({
        data: {
          productId: product.id,
          sku: v.sku,
          title: v.title,
          priceInPaise: v.priceInPaise,
          compareAtInPaise: v.compareAtInPaise,
          costPriceInPaise: v.costPriceInPaise,
          attributes: v.attributes,
        },
      });

      await prisma.inventory.create({
        data: {
          variantId: variant.id,
          quantityOnHand: v.stock,
          quantityReserved: 0,
          lowStockThreshold: 5,
        },
      });

      // Price history points (today, 15 days ago, 30 days ago)
      await prisma.priceHistory.createMany({
        data: [
          {
            productId: product.id,
            variantId: variant.id,
            priceInPaise: v.compareAtInPaise || v.priceInPaise,
            recordedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
          {
            productId: product.id,
            variantId: variant.id,
            priceInPaise: Math.round(v.priceInPaise * 1.05),
            recordedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          },
          {
            productId: product.id,
            variantId: variant.id,
            priceInPaise: v.priceInPaise,
            recordedAt: new Date(),
          },
        ],
      });
    }

    // Seed verified customer reviews for top products
    await prisma.review.create({
      data: {
        productId: product.id,
        userId: customer1.id,
        rating: 5,
        title: 'Outstanding build quality and fast delivery!',
        comment: `Genuinely impressed with this purchase on NEXUS. Dispatched within 4 hours by the seller, packaged securely with tamper-proof seal. The specs match exactly as described in the AI finder.`,
        verified: true,
        helpfulVotes: 24,
      },
    });

    await prisma.productQuestion.create({
      data: {
        productId: product.id,
        question: 'Does this come with official manufacturer warranty in India?',
        askedBy: 'Arjun M.',
        answer: 'Yes! All units sold by verified NEXUS sellers include 1-year official brand warranty and GST tax invoice.',
        answeredBy: 'Verified Seller Support',
      },
    });
  }

  // 6. CREATE COUPONS
  await prisma.coupon.createMany({
    data: [
      {
        code: 'NEXUSFIRST',
        discountPercent: 15.0,
        minOrderPaise: 100000, // ₹1,000 min order
        maxDiscountPaise: 75000, // ₹750 max discount
        usageLimit: 10000,
        validUntil: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'SUPERDEAL',
        fixedAmountPaise: 50000, // Flat ₹500 off
        minOrderPaise: 300000, // ₹3,000 min order
        usageLimit: 5000,
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'PRIMECLUB',
        discountPercent: 10.0,
        minOrderPaise: 50000, // ₹500 min order
        maxDiscountPaise: 200000, // ₹2,000 max discount
        usageLimit: 20000,
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ],
  });

  // 7. CREATE A REAL MULTI-SELLER SAMPLE ORDER
  // Get variants from Seller 1 (Apex) and Seller 2 (Urban Stitch)
  const variantApex = await prisma.productVariant.findFirst({
    where: { product: { sellerId: sellerProfile1.id } },
  });
  const variantUrban = await prisma.productVariant.findFirst({
    where: { product: { sellerId: sellerProfile2.id } },
  });

  if (variantApex && variantUrban) {
    const parentOrder = await prisma.order.create({
      data: {
        orderNumber: 'NX-2026-98124',
        userId: customer1.id,
        addressId: address1.id,
        totalAmountInPaise: variantApex.priceInPaise + variantUrban.priceInPaise,
        taxAmountInPaise: Math.round((variantApex.priceInPaise + variantUrban.priceInPaise) * 0.18),
        shippingFeeInPaise: 0, // Free for Prime
        discountInPaise: 0,
        status: ParentOrderStatus.PAID,
      },
    });

    // SubOrder 1 for Apex Electronics
    const subOrder1 = await prisma.subOrder.create({
      data: {
        subOrderNumber: 'NX-2026-98124-S1',
        parentOrderId: parentOrder.id,
        sellerId: sellerProfile1.id,
        subTotalInPaise: variantApex.priceInPaise,
        taxInPaise: Math.round(variantApex.priceInPaise * 0.18),
        shippingInPaise: 0,
        commissionRate: sellerProfile1.commissionRate,
        commissionInPaise: Math.round(variantApex.priceInPaise * sellerProfile1.commissionRate),
        sellerNetPayableInPaise: variantApex.priceInPaise - Math.round(variantApex.priceInPaise * sellerProfile1.commissionRate),
        status: SubOrderStatus.SHIPPED,
      },
    });

    await prisma.orderItem.create({
      data: {
        subOrderId: subOrder1.id,
        variantId: variantApex.id,
        unitPriceInPaise: variantApex.priceInPaise,
        taxRatePercent: 18.0,
        quantity: 1,
        totalInPaise: variantApex.priceInPaise,
      },
    });

    const shipment1 = await prisma.shipment.create({
      data: {
        subOrderId: subOrder1.id,
        courierName: 'Shiprocket',
        awbCode: 'SR982104928IN',
        currentStatus: 'IN_TRANSIT',
      },
    });

    await prisma.trackingEvent.createMany({
      data: [
        {
          shipmentId: shipment1.id,
          status: 'PICKED_UP',
          location: 'Mumbai Hub',
          description: 'Package picked up from Apex Electronics warehouse',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          shipmentId: shipment1.id,
          status: 'IN_TRANSIT',
          location: 'Thane Sorting Center',
          description: 'Package arrived at regional distribution facility',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
        },
      ],
    });

    // SubOrder 2 for Urban Stitch
    const subOrder2 = await prisma.subOrder.create({
      data: {
        subOrderNumber: 'NX-2026-98124-S2',
        parentOrderId: parentOrder.id,
        sellerId: sellerProfile2.id,
        subTotalInPaise: variantUrban.priceInPaise,
        taxInPaise: Math.round(variantUrban.priceInPaise * 0.12),
        shippingInPaise: 0,
        commissionRate: sellerProfile2.commissionRate,
        commissionInPaise: Math.round(variantUrban.priceInPaise * sellerProfile2.commissionRate),
        sellerNetPayableInPaise: variantUrban.priceInPaise - Math.round(variantUrban.priceInPaise * sellerProfile2.commissionRate),
        status: SubOrderStatus.PACKED,
      },
    });

    await prisma.orderItem.create({
      data: {
        subOrderId: subOrder2.id,
        variantId: variantUrban.id,
        unitPriceInPaise: variantUrban.priceInPaise,
        taxRatePercent: 12.0,
        quantity: 1,
        totalInPaise: variantUrban.priceInPaise,
      },
    });

    // Payment record
    await prisma.payment.create({
      data: {
        orderId: parentOrder.id,
        method: PaymentMethod.RAZORPAY_UPI,
        status: PaymentStatus.CAPTURED,
        amountInPaise: parentOrder.totalAmountInPaise,
        razorpayOrderId: 'order_NxSampleRazorpay981',
        razorpayPaymentId: 'pay_NxSampleRazorpay234',
        razorpaySignature: 'sig_NxSampleSignatureProof567',
      },
    });
  }

  console.log('✅ Seed completed successfully:');
  console.log('   - 1 Admin user (admin@nexusmarket.in)');
  console.log('   - 3 Verified Sellers (Apex Electronics, Urban Stitch, Aura Living)');
  console.log('   - 2 Active Customers with addresses & loyalty points');
  console.log(`   - 5 Main categories with subcategories`);
  console.log(`   - ${productsData.length} Realistic products with variants, stock, media, and price history`);
  console.log('   - 3 Live coupons (NEXUSFIRST, SUPERDEAL, PRIMECLUB)');
  console.log('   - 1 Live multi-seller parent order split into 2 sub-orders with courier tracking');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
