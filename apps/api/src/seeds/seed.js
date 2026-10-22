import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import SellerProfile from '../models/SellerProfile.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';

dotenv.config();

const CATEGORIES_DATA = [
  {
    name: 'Electronics & Gadgets',
    slug: 'electronics',
    description: 'Flagship laptops, smartphones, noise-canceling audio and gadgets.',
    imageUrl: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    orderIndex: 1,
  },
  {
    name: 'Audio & Wearables',
    slug: 'audio-wearables',
    description: 'Premium wireless headphones, earbuds and smartwatches.',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    orderIndex: 2,
  },
  {
    name: 'Fashion & Apparel',
    slug: 'fashion',
    description: 'Designer apparel, premium cotton shirts, ethnic wear and footwear.',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
    orderIndex: 3,
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Smart kitchen appliances, cookware and contemporary decor.',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
    orderIndex: 4,
  },
  {
    name: 'Beauty & Grooming',
    slug: 'beauty',
    description: 'Luxury skincare, fragrances and personal care essentials.',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
    orderIndex: 5,
  },
];

const PRODUCTS_DATA = [
  {
    title: 'Apple MacBook Air 15-inch M3 Chip (16GB RAM, 512GB SSD)',
    slug: 'apple-macbook-air-15-m3-16gb-512gb',
    brand: 'Apple',
    categorySlug: 'electronics',
    categoryName: 'Electronics & Gadgets',
    primaryImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    priceInPaise: 15490000,
    compareAtInPaise: 17490000,
    avgRating: 4.9,
    reviewCount: 194,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['apple', 'macbook', 'air', 'm3', 'laptop', 'notebook'],
    description: 'Impossibly thin 15.3-inch Liquid Retina display powered by the Apple M3 chip with up to 18 hours of battery life.',
    tags: ['Best Seller', 'Apple Silicon', '18h Battery'],
    specs: { processor: 'Apple M3 8-core CPU', memory: '16GB Unified', storage: '512GB SSD' },
    pros: ['Phenomenal battery life', 'Completely silent fanless design', 'Stunning Liquid Retina display'],
    tradeoff: 'Supports dual external monitors only with lid closed.',
  },
  {
    title: 'Sony WH-1000XM5 Wireless Active Noise Canceling Headphones',
    slug: 'sony-wh-1000xm5-wireless-anc-headphones',
    brand: 'Sony',
    categorySlug: 'audio-wearables',
    categoryName: 'Audio & Wearables',
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    priceInPaise: 2799000,
    compareAtInPaise: 3499000,
    avgRating: 4.8,
    reviewCount: 328,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['sony', 'headphones', 'anc', 'wireless', 'bluetooth', 'audio'],
    description: 'Industry-leading noise cancelation with two processors and 8 microphones for unparalleled quietness.',
    tags: ['Deal of the Day', 'ANC Leader', '30h Playtime'],
    specs: { battery: '30 Hours', driver: '30mm Carbon Fiber', weight: '250g' },
    pros: ['Flagship noise cancellation', 'Extremely comfortable fit', 'Clear hands-free calling'],
    tradeoff: 'Earcups fold flat but do not collapse inwards.',
  },
  {
    title: 'Dell XPS 14 OLED Intel Core Ultra 7 (32GB RAM, 1TB SSD, RTX 4050)',
    slug: 'dell-xps-14-oled-core-ultra-7',
    brand: 'Dell',
    categorySlug: 'electronics',
    categoryName: 'Electronics & Gadgets',
    primaryImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
    priceInPaise: 18990000,
    compareAtInPaise: 21990000,
    avgRating: 4.7,
    reviewCount: 88,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['dell', 'xps', 'laptop', 'intel', 'oled', 'rtx4050'],
    description: 'Precision-crafted aluminum with 3.2K OLED 120Hz touch display and discrete NVIDIA RTX graphics.',
    tags: ['Creator Edition', 'OLED Touch', 'Intel Ultra'],
    specs: { processor: 'Intel Core Ultra 7 155H', graphics: 'NVIDIA RTX 4050 6GB', display: '3.2K OLED 120Hz' },
    pros: ['Breathtaking OLED display', 'CNC machined aluminum build', 'Great graphics performance'],
    tradeoff: 'Capacitive touch function keys take some adjustment.',
  },
  {
    title: 'Bose QuietComfort Ultra Wireless Noise Canceling Headphones',
    slug: 'bose-quietcomfort-ultra-anc',
    brand: 'Bose',
    categorySlug: 'audio-wearables',
    categoryName: 'Audio & Wearables',
    primaryImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
    priceInPaise: 2990000,
    compareAtInPaise: 3590000,
    avgRating: 4.7,
    reviewCount: 210,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['bose', 'quietcomfort', 'headphones', 'anc', 'spatial audio'],
    description: 'World-class noise cancellation, breakthrough spatialized audio, and ultra-luxurious cushions for all-day comfort.',
    tags: ['Spatial Audio', 'Top Comfort', 'Bose ANC'],
    specs: { battery: '24 Hours', features: 'Immersive Audio', weight: '252g' },
    pros: ['Unmatched comfort for flights', 'Immersive spatial audio mode', 'Lush sound profile'],
    tradeoff: 'Slightly shorter battery life than Sony XM5.',
  },
  {
    title: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB Storage, Titanium Gray)',
    slug: 'samsung-galaxy-s24-ultra-5g-titanium',
    brand: 'Samsung',
    categorySlug: 'electronics',
    categoryName: 'Electronics & Gadgets',
    primaryImage: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
    priceInPaise: 12999900,
    compareAtInPaise: 13499900,
    avgRating: 4.8,
    reviewCount: 412,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['samsung', 'galaxy', 's24', 'ultra', 'smartphone', '5g', 'titanium'],
    description: 'Galaxy AI is here. Epic camera zoom, titanium exterior, flat 6.8-inch Dynamic AMOLED 2X display with integrated S Pen.',
    tags: ['Galaxy AI', '200MP Camera', 'Titanium Shield'],
    specs: { processor: 'Snapdragon 8 Gen 3', camera: '200MP + 50MP Periscope', display: '6.8-inch QHD+ 120Hz' },
    pros: ['Versatile 200MP camera system', 'Built-in S Pen stylus', 'Anti-reflective Gorilla Armor glass'],
    tradeoff: 'Substantial phone weight and squared corners.',
  },
  {
    title: 'Minimalist Oxford Linen Tailored Shirt - Slate Gray',
    slug: 'minimalist-oxford-linen-tailored-shirt',
    brand: 'Urban Stitch',
    categorySlug: 'fashion',
    categoryName: 'Fashion & Apparel',
    primaryImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    priceInPaise: 249900,
    compareAtInPaise: 349900,
    avgRating: 4.6,
    reviewCount: 76,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['shirt', 'linen', 'oxford', 'fashion', 'men', 'cotton'],
    description: '100% organic breathable flax linen tailored for comfort in tropical climates with mother-of-pearl buttons.',
    tags: ['Pure Linen', 'Breathable', 'Handcrafted'],
    specs: { material: '100% Organic Flax Linen', fit: 'Tailored Regular', collar: 'Spread' },
    pros: ['Supreme breathability for summer', 'Natural texture softens with every wash'],
    tradeoff: 'Prone to natural linen wrinkles; requires light steam ironing.',
  },
];

async function seed() {
  console.log('🌱 Starting MongoDB Database Seeding for NEXUS MERN Stack...');
  const conn = await connectDB();

  if (!conn) {
    console.error('Cannot connect to MongoDB. Please ensure MongoDB is running.');
    process.exit(1);
  }

  // 1. Clear existing collections
  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    User.deleteMany({}),
    SellerProfile.deleteMany({}),
    Coupon.deleteMany({}),
  ]);
  console.log('🧹 Cleaned existing MongoDB collections.');

  // 2. Seed Categories
  const createdCategories = await Category.insertMany(CATEGORIES_DATA);
  console.log(`✅ Seeded ${createdCategories.length} Categories.`);

  // 3. Seed Users
  const passwordHash = await bcrypt.hash('Password@123', 10);

  const customerUser = await User.create({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phoneNumber: '+91 9892019283',
    passwordHash,
    role: 'CUSTOMER',
    isPrimeMember: true,
    coinsBalance: 450,
    addresses: [
      {
        name: 'Rahul Sharma',
        phone: '+91 9892019283',
        addressLine1: 'B-402, Lotus Grandeur, Veera Desai Road',
        addressLine2: 'Andheri West',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400053',
        isDefault: true,
        type: 'HOME',
      },
    ],
  });

  const sellerUser = await User.create({
    name: 'Vikram Singhania (Apex)',
    email: 'seller.apex@nexusmarket.in',
    phoneNumber: '+91 9820011223',
    passwordHash,
    role: 'SELLER',
    isPrimeMember: false,
    coinsBalance: 250,
  });

  const adminUser = await User.create({
    name: 'NEXUS Operations Admin',
    email: 'admin@nexusmarket.in',
    phoneNumber: '+91 9876543210',
    passwordHash,
    role: 'ADMIN',
    isPrimeMember: true,
    coinsBalance: 1000,
  });

  // 4. Seed Seller Profile
  const sellerProfile = await SellerProfile.create({
    userId: sellerUser._id,
    storeName: 'Apex Electronics India',
    storeSlug: 'apex-electronics',
    businessEmail: 'seller.apex@nexusmarket.in',
    businessPhone: '+91 9820011223',
    gstin: '27AABCU9603R1ZM',
    pan: 'AABCU9603R',
    bankAccountNo: '918273645019',
    bankIfsc: 'HDFC0001234',
    pickupAddress: 'Plot 42, Seepz Industrial Zone, Andheri East, Mumbai',
    pickupPincode: '400096',
    status: 'ACTIVE',
    rating: 4.8,
    reviewCount: 240,
    commissionRate: 0.1,
  });

  sellerUser.sellerProfileId = sellerProfile._id;
  await sellerUser.save();
  console.log('✅ Seeded Demo Users (Customer, Seller, Admin) & Seller Profile.');

  // 5. Seed Products
  const categoryMap = new Map(createdCategories.map((c) => [c.slug, c]));

  const productsToInsert = PRODUCTS_DATA.map((p) => {
    const cat = categoryMap.get(p.categorySlug);
    return {
      ...p,
      categoryId: cat ? cat._id : null,
      sellerId: sellerProfile._id,
      sellerName: sellerProfile.storeName,
      images: [p.primaryImage],
      variants: [
        {
          sku: `SKU-${p.slug.substring(0, 10).toUpperCase()}-01`,
          title: 'Standard Retail Package',
          priceInPaise: p.priceInPaise,
          compareAtInPaise: p.compareAtInPaise,
          stock: 45,
          lowStockThreshold: 5,
        },
      ],
    };
  });

  await Product.insertMany(productsToInsert);
  console.log(`✅ Seeded ${productsToInsert.length} Marketplace Products.`);

  // 6. Seed Coupons
  await Coupon.insertMany([
    {
      code: 'WELCOME10',
      description: '10% discount on your first order up to ₹500',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      minOrderValueInPaise: 99900,
      maxDiscountInPaise: 50000,
      isActive: true,
    },
    {
      code: 'NEXUS500',
      description: 'Flat ₹500 off on premium orders above ₹4,999',
      discountType: 'FLAT',
      discountValue: 50000,
      minOrderValueInPaise: 499900,
      isActive: true,
    },
    {
      code: 'SUPERDEAL',
      description: '15% instant savings on electronics',
      discountType: 'PERCENTAGE',
      discountValue: 15,
      minOrderValueInPaise: 199900,
      maxDiscountInPaise: 150000,
      isActive: true,
    },
  ]);
  console.log('✅ Seeded Promotional Coupons.');

  console.log('\n🎉 MongoDB database successfully seeded!');
  console.log('Demo Credentials:');
  console.log('  Customer: rahul.sharma@example.com / Password@123');
  console.log('  Seller:   seller.apex@nexusmarket.in / Password@123');
  console.log('  Admin:    admin@nexusmarket.in / Password@123\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
