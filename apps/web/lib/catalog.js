import { calculateDiscountPercent } from '@nexus/shared';






















export const MASTER_CATALOG = [
  // --- ELECTRONICS: LAPTOPS & TABLETS ---
  {
    id: 'prod-macbook-air-m3',
    title: 'Apple MacBook Air 15-inch M3 Chip (16GB Unified Memory, 512GB SSD)',
    slug: 'apple-macbook-air-15-m3-16gb-512gb',
    brand: 'Apple',
    sellerName: 'Apex Electronics',
    categorySlug: 'electronics',
    categoryName: 'Electronics & Gadgets',
    primaryImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    priceInPaise: 15490000, // ₹1,54,900
    compareAtInPaise: 17490000,
    avgRating: 4.9,
    reviewCount: 194,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['apple', 'macbook', 'air', 'm3', 'laptop', 'computer', 'notebook', '16gb', '512gb'],
    description: 'Impossibly thin 15.3-inch Liquid Retina display powered by the groundbreaking Apple M3 chip with up to 18 hours of battery life.',
    tags: ['Best Seller', 'Apple Silicon', '18h Battery'],
  },
  {
    id: 'prod-macbook-pro-m3',
    title: 'Apple MacBook Pro 16-inch M3 Max (36GB RAM, 1TB SSD, Space Black)',
    slug: 'apple-macbook-pro-16-m3-max-36gb-1tb',
    brand: 'Apple',
    sellerName: 'Apex Electronics',
    categorySlug: 'electronics',
    categoryName: 'Electronics & Gadgets',
    primaryImage: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80',
    priceInPaise: 34990000, // ₹3,49,900
    compareAtInPaise: 39990000,
    avgRating: 4.9,
    reviewCount: 82,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['apple', 'macbook', 'pro', 'm3 max', 'laptop', 'workstation', 'creator', 'space black'],
    description: 'Extreme performance with 14-core CPU, 30-core GPU, Liquid Retina XDR display, and 120Hz ProMotion.',
    tags: ['Pro Choice', 'M3 Max', '120Hz XDR'],
  },
  {
    id: 'prod-dell-xps-15',
    title: 'Dell XPS 15 9530 (13th Gen Intel i9, 32GB DDR5, 1TB SSD, RTX 4070, 3.5K OLED)',
    slug: 'dell-xps-15-9530-i9-32gb-1tb-rtx4070-oled',
    brand: 'Dell',
    sellerName: 'Apex Electronics',
    categorySlug: 'electronics',
    categoryName: 'Electronics & Gadgets',
    primaryImage: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80',
    priceInPaise: 24999000, // ₹2,49,990
    compareAtInPaise: 28999000,
    avgRating: 4.7,
    reviewCount: 114,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['dell', 'xps', 'laptop', 'intel', 'i9', 'rtx 4070', 'oled', 'creator', 'windows'],
    description: 'Machined aluminum CNC chassis, stunning 3.5K OLED InfinityEdge touch display with GeForce RTX 4070 power.',
    tags: ['OLED', 'RTX 4070', 'Intel i9'],
  },
  {
    id: 'prod-asus-rog-g14',
    title: 'ASUS ROG Zephyrus G14 (AMD Ryzen 9, 32GB RAM, 1TB SSD, RTX 4080, OLED 120Hz)',
    slug: 'asus-rog-zephyrus-g14-ryzen9-rtx4080-oled',
    brand: 'ASUS',
    sellerName: 'Apex Electronics',
    categorySlug: 'gaming',
    categoryName: 'Gaming & Setup',
    primaryImage: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80',
    priceInPaise: 21990000, // ₹2,19,900
    compareAtInPaise: 24990000,
    avgRating: 4.8,
    reviewCount: 96,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['asus', 'rog', 'zephyrus', 'gaming laptop', 'rtx 4080', 'ryzen 9', 'oled', 'gamer'],
    description: 'Ultraportable gaming powerhouse featuring CNC aluminum unibody, ROG Nebula OLED display, and Slash Lighting.',
    tags: ['Gaming Beast', 'Slash Lighting', 'OLED 120Hz'],
  },
  {
    id: 'prod-ipad-pro-m4',
    title: 'Apple iPad Pro 13-inch M4 Ultra Retina XDR Tandem OLED (256GB, Wi-Fi, Space Black)',
    slug: 'apple-ipad-pro-13-m4-tandem-oled-256gb',
    brand: 'Apple',
    sellerName: 'Apex Electronics',
    categorySlug: 'electronics',
    categoryName: 'Electronics & Gadgets',
    primaryImage: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80',
    priceInPaise: 12990000, // ₹1,29,900
    compareAtInPaise: 13990000,
    avgRating: 4.9,
    reviewCount: 140,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['apple', 'ipad', 'pro', 'm4', 'tablet', 'oled', 'pencil', 'tandem oled'],
    description: 'The thinnest Apple product ever made, featuring revolutionary Tandem OLED display and the breakthrough M4 chip.',
    tags: ['Tandem OLED', 'M4 Chip', '5.1mm Thin'],
  },

  // --- SMARTPHONES & MOBILES ---
  {
    id: 'prod-iphone-16-pro',
    title: 'Apple iPhone 16 Pro Max (256GB, Desert Titanium, 5G)',
    slug: 'apple-iphone-16-pro-max-256gb-desert-titanium',
    brand: 'Apple',
    sellerName: 'Apex Electronics',
    categorySlug: 'electronics',
    categoryName: 'Electronics & Gadgets',
    primaryImage: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&q=80',
    priceInPaise: 14490000, // ₹1,44,900
    compareAtInPaise: 15490000,
    avgRating: 4.9,
    reviewCount: 412,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['iphone', 'apple', '16 pro max', 'mobile', 'smartphone', 'phone', '5g', 'camera control', 'desert titanium'],
    description: 'Grade 5 titanium design with Camera Control button, 48MP Fusion camera system, and the lightning-fast A18 Pro chip.',
    tags: ['Flagship Phone', 'A18 Pro', 'Titanium'],
  },
  {
    id: 'prod-galaxy-s24-ultra',
    title: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 512GB Storage, Titanium Gray, AI Features)',
    slug: 'samsung-galaxy-s24-ultra-5g-12gb-512gb',
    brand: 'Samsung',
    sellerName: 'Apex Electronics',
    categorySlug: 'electronics',
    categoryName: 'Electronics & Gadgets',
    primaryImage: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
    priceInPaise: 13999900, // ₹1,39,999
    compareAtInPaise: 15499900,
    avgRating: 4.8,
    reviewCount: 388,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['samsung', 'galaxy', 's24 ultra', 'smartphone', 'mobile', 'phone', 'galaxy ai', 'spen', '5g'],
    description: 'Unleash Galaxy AI with Circle to Search, Live Translate, Note Assist, 200MP Quad Telephoto camera, and embedded S-Pen.',
    tags: ['Galaxy AI', '200MP Zoom', 'S-Pen'],
  },
  {
    id: 'prod-pixel-9-pro',
    title: 'Google Pixel 9 Pro 5G (16GB RAM, 256GB Storage, Obsidian, Gemini AI Built-in)',
    slug: 'google-pixel-9-pro-5g-16gb-256gb-obsidian',
    brand: 'Google',
    sellerName: 'Apex Electronics',
    categorySlug: 'electronics',
    categoryName: 'Electronics & Gadgets',
    primaryImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80',
    priceInPaise: 10999900, // ₹1,09,999
    compareAtInPaise: 11999900,
    avgRating: 4.7,
    reviewCount: 165,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['google', 'pixel', 'pixel 9 pro', 'gemini ai', 'smartphone', 'mobile', 'android', 'camera'],
    description: 'Google Tensor G4 with built-in Gemini Advanced, studio-quality triple rear camera system with 30x Super Res Zoom.',
    tags: ['Gemini AI', 'Pure Android', 'Pro Camera'],
  },
  {
    id: 'prod-oneplus-12',
    title: 'OnePlus 12 5G (16GB RAM, 512GB Storage, Silky Black, Snapdragon 8 Gen 3)',
    slug: 'oneplus-12-5g-16gb-512gb-silky-black',
    brand: 'OnePlus',
    sellerName: 'Apex Electronics',
    categorySlug: 'electronics',
    categoryName: 'Electronics & Gadgets',
    primaryImage: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80',
    priceInPaise: 6999900, // ₹69,999
    compareAtInPaise: 7999900,
    avgRating: 4.7,
    reviewCount: 284,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['oneplus', 'oneplus 12', 'smartphone', 'mobile', '5g', 'hasselblad', 'fast charging'],
    description: '4th Gen Hasselblad camera for mobile, 2K 120Hz ProXDR display with 100W SUPERVOOC hyper-fast wired charging.',
    tags: ['100W Fast Charge', 'Hasselblad', 'Value Flagship'],
  },

  // --- AUDIO & WEARABLES ---
  {
    id: 'prod-sony-xm5',
    title: 'Sony WH-1000XM5 Wireless Active Noise Canceling Headphones',
    slug: 'sony-wh-1000xm5-wireless-anc-headphones',
    brand: 'Sony',
    sellerName: 'Apex Electronics',
    categorySlug: 'audio-wearables',
    categoryName: 'Audio & Wearables',
    primaryImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    priceInPaise: 2799000, // ₹27,990
    compareAtInPaise: 3499000,
    avgRating: 4.8,
    reviewCount: 328,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['sony', 'headphones', 'anc', 'wireless', 'bluetooth', 'audio', 'xm5', 'noise canceling'],
    description: 'Industry-leading noise cancellation with Auto NC Optimizer, 8 microphones, and up to 30-hour battery life.',
    tags: ['Editor Choice', 'ANC Leader', 'Hi-Res Audio'],
  },
  {
    id: 'prod-bose-qc-ultra',
    title: 'Bose QuietComfort Ultra Wireless Noise Cancelling Headphones with Spatial Audio',
    slug: 'bose-quietcomfort-ultra-anc-spatial-audio',
    brand: 'Bose',
    sellerName: 'Apex Electronics',
    categorySlug: 'audio-wearables',
    categoryName: 'Audio & Wearables',
    primaryImage: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
    priceInPaise: 3590000, // ₹35,900
    compareAtInPaise: 3990000,
    avgRating: 4.8,
    reviewCount: 190,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['bose', 'quietcomfort', 'ultra', 'headphones', 'spatial audio', 'anc', 'wireless'],
    description: 'Revolutionary Bose Immersive Audio spatializes what you hear for acoustic realism and world-class quiet mode.',
    tags: ['Spatial Audio', 'Comfort King', 'CustomTune'],
  },
  {
    id: 'prod-airpods-pro-2',
    title: 'Apple AirPods Pro (2nd Generation with MagSafe USB-C Case)',
    slug: 'apple-airpods-pro-2nd-gen-usbc',
    brand: 'Apple',
    sellerName: 'Apex Electronics',
    categorySlug: 'audio-wearables',
    categoryName: 'Audio & Wearables',
    primaryImage: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80',
    priceInPaise: 2190000, // ₹21,900
    compareAtInPaise: 2490000,
    avgRating: 4.9,
    reviewCount: 540,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['apple', 'airpods', 'pro', 'earbuds', 'anc', 'wireless', 'bluetooth', 'tws', 'usb-c'],
    description: 'Up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, and Personalized Spatial Audio with dynamic head tracking.',
    tags: ['Best Seller', 'Adaptive Audio', 'H2 Chip'],
  },
  {
    id: 'prod-sony-wf-1000xm5',
    title: 'Sony WF-1000XM5 Truly Wireless Noise Canceling Earbuds (Hi-Res Audio Wireless)',
    slug: 'sony-wf-1000xm5-truly-wireless-anc-earbuds',
    brand: 'Sony',
    sellerName: 'Apex Electronics',
    categorySlug: 'audio-wearables',
    categoryName: 'Audio & Wearables',
    primaryImage: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    priceInPaise: 2199000, // ₹21,990
    compareAtInPaise: 2699000,
    avgRating: 4.7,
    reviewCount: 215,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['sony', 'earbuds', 'wf-1000xm5', 'anc', 'tws', 'wireless', 'bluetooth', 'audio'],
    description: 'Dynamic Driver X for rich vocals and deep bass, dual feedback microphones, and AI bone-conduction noise reduction for calls.',
    tags: ['Compact TWS', 'LDAC Codec', 'Wireless Charging'],
  },
  {
    id: 'prod-bose-soundlink-flex',
    title: 'Bose SoundLink Flex Portable Waterproof Bluetooth Outdoor Speaker',
    slug: 'bose-soundlink-flex-portable-bluetooth-speaker',
    brand: 'Bose',
    sellerName: 'Apex Electronics',
    categorySlug: 'audio-wearables',
    categoryName: 'Audio & Wearables',
    primaryImage: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
    priceInPaise: 1190000, // ₹11,900
    compareAtInPaise: 1590000,
    avgRating: 4.7,
    reviewCount: 290,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['bose', 'speaker', 'bluetooth', 'soundlink', 'waterproof', 'portable', 'outdoor', 'audio'],
    description: 'Rugged IP67 dustproof and waterproof speaker with PositionIQ technology that detects its orientation and optimizes sound.',
    tags: ['IP67 Waterproof', 'PositionIQ', '12h Battery'],
  },
  {
    id: 'prod-marshall-stanmore',
    title: 'Marshall Stanmore III Bluetooth Home Speaker (Black, Vintage Brass Controls)',
    slug: 'marshall-stanmore-iii-bluetooth-speaker-black',
    brand: 'Marshall',
    sellerName: 'Apex Electronics',
    categorySlug: 'audio-wearables',
    categoryName: 'Audio & Wearables',
    primaryImage: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80',
    priceInPaise: 3499900, // ₹34,999
    compareAtInPaise: 4199900,
    avgRating: 4.8,
    reviewCount: 178,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['marshall', 'stanmore', 'speaker', 'home audio', 'bluetooth', 'vintage', 'rock'],
    description: 'Legendary room-filling Marshall signature sound with outward-angled tweeters and updated waveguides.',
    tags: ['Iconic Design', 'Analogue Knobs', '80W Output'],
  },
  {
    id: 'prod-apple-watch-ultra-2',
    title: 'Apple Watch Ultra 2 (GPS + Cellular, 49mm Titanium, Orange Ocean Band)',
    slug: 'apple-watch-ultra-2-49mm-titanium-ocean-band',
    brand: 'Apple',
    sellerName: 'Apex Electronics',
    categorySlug: 'audio-wearables',
    categoryName: 'Audio & Wearables',
    primaryImage: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80',
    priceInPaise: 8990000, // ₹89,900
    compareAtInPaise: 9990000,
    avgRating: 4.9,
    reviewCount: 164,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['apple watch', 'smartwatch', 'ultra 2', 'titanium', 'fitness', 'gps', 'cellular', 'dive'],
    description: 'Corrosion-resistant titanium case with 3000-nit display, precision dual-frequency GPS, and up to 72 hours in Low Power Mode.',
    tags: ['3000 Nits', 'Titanium Case', '100m Water Resistant'],
  },

  // --- COMPUTER ACCESSORIES & GAMING ---
  {
    id: 'prod-logitech-mx-master-3s',
    title: 'Logitech MX Master 3S Wireless Performance Mouse (8K DPI, Quiet Clicks)',
    slug: 'logitech-mx-master-3s-wireless-mouse',
    brand: 'Logitech',
    sellerName: 'Apex Electronics',
    categorySlug: 'electronics',
    categoryName: 'Electronics & Gadgets',
    primaryImage: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    priceInPaise: 899500, // ₹8,995
    compareAtInPaise: 1099500,
    avgRating: 4.7,
    reviewCount: 512,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['mouse', 'logitech', 'mx master', 'wireless', 'ergonomic', 'bluetooth', 'office', 'productivity'],
    description: 'Iconic ergonomic silhouette with electromagnetic MagSpeed wheel scrolling 1,000 lines per second and 90% quieter clicks.',
    tags: ['Ergonomic Leader', 'MagSpeed Scroll', '70 Days Battery'],
  },
  {
    id: 'prod-keychron-q1-pro',
    title: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard (QMK/VIA, CNC Aluminum)',
    slug: 'keychron-q1-pro-wireless-custom-mechanical-keyboard',
    brand: 'Keychron',
    sellerName: 'Apex Electronics',
    categorySlug: 'gaming',
    categoryName: 'Gaming & Setup',
    primaryImage: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
    priceInPaise: 1849900, // ₹18,499
    compareAtInPaise: 2199900,
    avgRating: 4.9,
    reviewCount: 88,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['keyboard', 'keychron', 'mechanical', 'custom keyboard', 'qmk', 'via', 'aluminum', 'wireless', 'hot swappable'],
    description: 'Full metal 75% layout custom mechanical keyboard with double-gasket acoustic mounting and hot-swappable switches.',
    tags: ['CNC Aluminum', 'Double-Gasket', 'Hot-Swappable'],
  },
  {
    id: 'prod-ps5-slim',
    title: 'Sony PlayStation 5 Slim Console (1TB SSD, Ultra HD Blu-Ray Disc Edition)',
    slug: 'sony-playstation-5-slim-console-1tb-disc',
    brand: 'Sony',
    sellerName: 'Apex Electronics',
    categorySlug: 'gaming',
    categoryName: 'Gaming & Setup',
    primaryImage: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
    priceInPaise: 5499000, // ₹54,990
    compareAtInPaise: 5999000,
    avgRating: 4.9,
    reviewCount: 680,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['sony', 'ps5', 'playstation 5', 'console', 'gaming', 'disc edition', 'controller', '4k 120hz'],
    description: 'Experience lightning-fast loading with an ultra-high speed 1TB SSD, deeper immersion with haptic feedback, and breathtaking next-gen graphics.',
    tags: ['Top Gaming Console', '1TB NVMe', 'Haptic Triggers'],
  },
  {
    id: 'prod-razer-deathadder-v3',
    title: 'Razer DeathAdder V3 Pro Wireless Ergonomic Esports Gaming Mouse (63g Lightweight)',
    slug: 'razer-deathadder-v3-pro-wireless-gaming-mouse',
    brand: 'Razer',
    sellerName: 'Apex Electronics',
    categorySlug: 'gaming',
    categoryName: 'Gaming & Setup',
    primaryImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80',
    priceInPaise: 1249900, // ₹12,499
    compareAtInPaise: 1499900,
    avgRating: 4.8,
    reviewCount: 230,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['razer', 'deathadder', 'gaming mouse', 'esports', 'wireless', 'lightweight', 'focus pro 30k'],
    description: 'Refined in collaboration with top esports pros: ultra-lightweight 63g design with Focus Pro 30K Optical Sensor.',
    tags: ['63g Ultralight', 'Focus Pro 30K', '90h Battery'],
  },

  // --- FASHION & APPAREL ---
  {
    id: 'prod-urban-stitch-tee',
    title: 'Urban Stitch 280 GSM Heavyweight Supima Cotton Oversized Tee (Vintage Onyx)',
    slug: 'urban-stitch-280gsm-heavyweight-supima-oversized-tee',
    brand: 'Urban Stitch',
    sellerName: 'Urban Stitch Apparels',
    categorySlug: 'fashion',
    categoryName: 'Fashion & Apparel',
    primaryImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    priceInPaise: 149900, // ₹1,499
    compareAtInPaise: 249900,
    avgRating: 4.8,
    reviewCount: 420,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['t-shirt', 'tee', 'cotton', 'oversized', 'fashion', 'clothing', 'urban stitch', 'supima', 'streetwear'],
    description: 'Crafted from 100% long-staple Indian Supima cotton. Heavyweight 280 GSM knit with dropped shoulders and ribbed neckband.',
    tags: ['100% Supima', '280 GSM Heavyweight', 'Pre-Shrunk'],
  },
  {
    id: 'prod-urban-stitch-jacket',
    title: 'Urban Stitch Weatherproof Cordura Utility Field Jacket (Olive Slate)',
    slug: 'urban-stitch-weatherproof-cordura-utility-jacket',
    brand: 'Urban Stitch',
    sellerName: 'Urban Stitch Apparels',
    categorySlug: 'fashion',
    categoryName: 'Fashion & Apparel',
    primaryImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
    priceInPaise: 499900, // ₹4,999
    compareAtInPaise: 799900,
    avgRating: 4.7,
    reviewCount: 92,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['jacket', 'outerwear', 'field jacket', 'weatherproof', 'cordura', 'urban stitch', 'clothing', 'winter'],
    description: 'Military-grade 500D Cordura ripstop exterior with DWR water-resistant coating, YKK storm zippers, and 6 utility cargo pockets.',
    tags: ['Cordura Ripstop', 'Water Resistant', 'YKK Zippers'],
  },
  {
    id: 'prod-nike-air-force-1',
    title: 'Nike Air Force 1 07 Triple White Leather Classic Sneakers',
    slug: 'nike-air-force-1-07-triple-white-sneakers',
    brand: 'Nike',
    sellerName: 'Urban Stitch Apparels',
    categorySlug: 'fashion',
    categoryName: 'Fashion & Apparel',
    primaryImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
    priceInPaise: 849500, // ₹8,495
    compareAtInPaise: 999500,
    avgRating: 4.8,
    reviewCount: 780,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['nike', 'sneakers', 'shoes', 'air force 1', 'footwear', 'white sneakers', 'casual'],
    description: 'The radiance lives on with crisp leather overlays, bold accents, and iconic Nike Air cushioning.',
    tags: ['All-Time Classic', 'Air Cushioning', 'Genuine Leather'],
  },
  {
    id: 'prod-adidas-ultraboost',
    title: 'Adidas Ultraboost Light Running Shoes (Continental Rubber Sole, Core Black)',
    slug: 'adidas-ultraboost-light-running-shoes',
    brand: 'Adidas',
    sellerName: 'Urban Stitch Apparels',
    categorySlug: 'fashion',
    categoryName: 'Fashion & Apparel',
    primaryImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80',
    priceInPaise: 1399900, // ₹13,999
    compareAtInPaise: 1899900,
    avgRating: 4.7,
    reviewCount: 310,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['adidas', 'ultraboost', 'running shoes', 'sports shoes', 'sneakers', 'boost', 'marathon'],
    description: '30% lighter Boost midsole material combined with PRIMEKNIT+ textile upper and Continental Better Rubber outsole.',
    tags: ['Ultralight Boost', 'Primeknit+', 'Continental Sole'],
  },
  {
    id: 'prod-levis-501-jeans',
    title: 'Levis 501 Original Straight Fit Heavy Selvedge Denim Jeans (Medium Stonewash)',
    slug: 'levis-501-original-straight-selvedge-denim',
    brand: 'Levis',
    sellerName: 'Urban Stitch Apparels',
    categorySlug: 'fashion',
    categoryName: 'Fashion & Apparel',
    primaryImage: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&q=80',
    priceInPaise: 389900, // ₹3,899
    compareAtInPaise: 549900,
    avgRating: 4.6,
    reviewCount: 440,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['jeans', 'levis', '501', 'denim', 'pants', 'selvedge', 'clothing', 'fashion'],
    description: 'The original blue jeans since 1873. Classic straight leg with the signature button fly, crafted from durable 14oz non-stretch denim.',
    tags: ['Button Fly', '14oz Denim', 'Timeless Fit'],
  },

  // --- HOME & LIVING ---
  {
    id: 'prod-ergonomic-chair',
    title: 'Auraform Ergonomic High-Back Executive Mesh Office Chair with 4D Armrests',
    slug: 'auraform-ergonomic-high-back-mesh-office-chair',
    brand: 'Auraform',
    sellerName: 'Aura Home & Living',
    categorySlug: 'home-living',
    categoryName: 'Home & Living',
    primaryImage: 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?w=800&q=80',
    priceInPaise: 1999900, // ₹19,999
    compareAtInPaise: 2799900,
    avgRating: 4.8,
    reviewCount: 160,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['chair', 'office chair', 'ergonomic', 'desk chair', 'home office', 'mesh chair', 'auraform'],
    description: 'Dynamic self-adjusting lumbar support, breathable German elastomer mesh, aluminum alloy base, and multi-angle recline lock.',
    tags: ['4D Armrests', 'Ergonomic Mesh', 'BIFMA Certified'],
  },
  {
    id: 'prod-dyson-v12',
    title: 'Dyson V12 Detect Slim Total Clean Cordless Vacuum Cleaner (Laser Dust Detection)',
    slug: 'dyson-v12-detect-slim-cordless-vacuum',
    brand: 'Dyson',
    sellerName: 'Apex Electronics',
    categorySlug: 'home-living',
    categoryName: 'Home & Living',
    primaryImage: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80',
    priceInPaise: 5290000, // ₹52,900
    compareAtInPaise: 6590000,
    avgRating: 4.8,
    reviewCount: 220,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['dyson', 'vacuum cleaner', 'cordless', 'v12', 'cleaning', 'home appliance', 'laser'],
    description: 'Precisely-angled laser reveals invisible microscopic dust on hard floors with piezo sensor measuring dust particles in real-time.',
    tags: ['Laser Detect', 'Piezo Sensor', 'Up to 60m Run Time'],
  },
  {
    id: 'prod-philips-airfryer',
    title: 'Philips Digital Air Fryer XXL with Rapid Air Technology (7.2L, 2000W, Touch UI)',
    slug: 'philips-digital-air-fryer-xxl-7-2l',
    brand: 'Philips',
    sellerName: 'Apex Electronics',
    categorySlug: 'home-living',
    categoryName: 'Home & Living',
    primaryImage: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80',
    priceInPaise: 1249900, // ₹12,499
    compareAtInPaise: 1699900,
    avgRating: 4.7,
    reviewCount: 390,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['philips', 'air fryer', 'kitchen', 'appliance', 'cooking', 'healthy', 'oil free'],
    description: 'Cook with up to 90% less fat. Starfish bottom design creates high-speed swirling vortex of heat for crispy golden food.',
    tags: ['7.2L Capacity', '90% Less Fat', 'Keep Warm Mode'],
  },
  {
    id: 'prod-ceramic-dinnerware',
    title: 'Terracotta & Glaze Artisanal Wheel-Thrown Stoneware 16-Piece Dinnerware Set',
    slug: 'terracotta-glaze-artisanal-stoneware-dinner-set',
    brand: 'Auraform',
    sellerName: 'Aura Home & Living',
    categorySlug: 'home-living',
    categoryName: 'Home & Living',
    primaryImage: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
    priceInPaise: 649900, // ₹6,499
    compareAtInPaise: 899900,
    avgRating: 4.9,
    reviewCount: 84,
    isDealOfTheDay: false,
    isInStock: true,
    isPrime: true,
    keywords: ['plates', 'dinnerware', 'dinner set', 'crockery', 'ceramics', 'pottery', 'kitchen', 'home'],
    description: 'Individually hand-glazed by Indian master potters. Lead-free, scratch-resistant stoneware safe for microwave and dishwasher.',
    tags: ['Handcrafted', 'Microwave Safe', 'Lead-Free Glaze'],
  },
  {
    id: 'prod-nespresso-coffee',
    title: 'Nespresso Vertuo Pop Automatic Espresso & Coffee Machine (Pacific Blue)',
    slug: 'nespresso-vertuo-pop-coffee-machine-pacific-blue',
    brand: 'Nespresso',
    sellerName: 'Apex Electronics',
    categorySlug: 'home-living',
    categoryName: 'Home & Living',
    primaryImage: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80',
    priceInPaise: 1499900, // ₹14,999
    compareAtInPaise: 1799900,
    avgRating: 4.6,
    reviewCount: 140,
    isDealOfTheDay: true,
    isInStock: true,
    isPrime: true,
    keywords: ['nespresso', 'coffee machine', 'espresso', 'coffee', 'vertuo', 'kitchen', 'cafe'],
    description: 'Centrifusion extraction technology reads the barcode on each capsule and adjusts parameters for thick, velvety crema.',
    tags: ['Centrifusion Tech', 'Barcode Sensing', 'One-Touch Brew'],
  },
];


























export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-');
}

export function mapDummyJsonCategory(cat) {
  const c = cat.toLowerCase();
  if (['smartphones', 'tablets', 'laptops', 'mobile-accessories'].includes(c)) {
    return { slug: 'electronics', name: 'Electronics & Gadgets' };
  }
  if (['mens-watches', 'womens-watches'].includes(c)) {
    return { slug: 'audio-wearables', name: 'Audio & Wearables' };
  }
  if (['mens-shirts', 'mens-shoes', 'tops', 'womens-dresses', 'womens-shoes', 'sunglasses', 'womens-bags', 'womens-jewellery', 'beauty', 'fragrances', 'skin-care'].includes(c)) {
    return { slug: 'fashion', name: 'Fashion & Apparel' };
  }
  if (['home-decoration', 'furniture', 'kitchen-accessories', 'groceries'].includes(c)) {
    return { slug: 'home-living', name: 'Home & Living' };
  }
  if (['sports-accessories', 'motorcycle', 'vehicle'].includes(c)) {
    return { slug: 'gaming', name: 'Gaming & Setup' };
  }
  return { slug: 'electronics', name: 'Electronics & Gadgets' };
}

let fullDynamicCatalogCache = null;
let lastCacheTime = 0;

export async function fetchDynamicCatalog(_query = '') {
  const now = Date.now();
  // Fetch and cache all 194 products from DummyJSON combined with MASTER_CATALOG
  if (!fullDynamicCatalogCache || now - lastCacheTime > 1800000) {
    try {
      const res = await fetch('https://dummyjson.com/products?limit=200', {
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const json = await res.json();
        const mappedItems = (json.products || []).map((p) => {
          const cat = mapDummyJsonCategory(p.category || '');
          const priceRupees = Math.round((p.price || 15) * 85);
          const priceInPaise = priceRupees * 100;
          const compareAtInPaise = p.discountPercentage
            ? Math.round(priceInPaise * (1 + p.discountPercentage / 100))
            : Math.round(priceInPaise * 1.25);

          return {
            id: `dj-${p.id}`,
            title: p.title,
            slug: `${slugify(p.title)}-${p.id}`,
            brand: p.brand || 'Nexus Verified',
            sellerName: p.brand ? `${p.brand} Store` : 'Prime Global Seller',
            categorySlug: cat.slug,
            categoryName: cat.name,
            primaryImage: p.thumbnail || p.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
            priceInPaise,
            compareAtInPaise,
            avgRating: Number((p.rating || 4.2).toFixed(1)),
            reviewCount: (p.reviews?.length || 5) * 20 + (p.id * 9),
            isDealOfTheDay: (p.discountPercentage || 0) > 12,
            isInStock: (p.stock || 0) > 0,
            isPrime: (p.rating || 0) >= 3.0,
            keywords: [
              ...(p.tags || []),
              p.category || '',
              p.brand || '',
              ...p.title.toLowerCase().split(/\s+/),
            ],
            description: p.description || p.title,
            tags: p.tags || ['Popular'],
          };
        });

        const existingTitles = new Set(MASTER_CATALOG.map((m) => m.title.toLowerCase()));
        fullDynamicCatalogCache = [
          ...MASTER_CATALOG,
          ...mappedItems.filter((item) => !existingTitles.has(item.title.toLowerCase())),
        ];
        lastCacheTime = now;
      }
    } catch (err) {
      // Graceful fallback to MASTER_CATALOG if offline
    }
  }

  return fullDynamicCatalogCache && fullDynamicCatalogCache.length > 0
    ? fullDynamicCatalogCache
    : MASTER_CATALOG;
}

export async function getCategoryProducts(categorySlug) {
  const allProducts = await fetchDynamicCatalog();
  return allProducts.filter((p) => p.categorySlug === categorySlug);
}

export async function getHomeDeals() {
  const allProducts = await fetchDynamicCatalog();
  const deals = allProducts.filter((p) => p.isDealOfTheDay);
  return deals.slice(0, 8);
}

export async function getHomeBestsellers() {
  const allProducts = await fetchDynamicCatalog();
  return allProducts
    .filter((p) => p.avgRating >= 4.5)
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 8);
}

export function searchCatalog(
  options = {},
  sourceCatalog
) {
  const {
    q = '',
    category,
    brand,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    dealsOnly,
    minDiscount,
    primeOnly,
    sort = 'relevance',
  } = options;

  const catalogPool = sourceCatalog && sourceCatalog.length > 0 ? sourceCatalog : MASTER_CATALOG;
  const rawQuery = q.toLowerCase().trim();
  const queryTokens = rawQuery ? rawQuery.split(/\s+/).filter(Boolean) : [];

  const selectedBrands = brand
    ? brand.split(',').map((b) => b.trim().toLowerCase()).filter(Boolean)
    : [];

  // 1. Text & Category Base Filter
  const baseFiltered = catalogPool.filter((item) => {
    // Category check
    if (category && category !== 'all') {
      if (item.categorySlug !== category) return false;
    }

    // Query tokens match
    if (queryTokens.length > 0) {
      const titleLower = item.title.toLowerCase();
      const brandLower = item.brand.toLowerCase();
      const catLower = item.categoryName.toLowerCase();
      const descLower = item.description.toLowerCase();
      const keywords = item.keywords.map((k) => k.toLowerCase());
      const tags = (item.tags || []).map((t) => t.toLowerCase());

      const searchableBlob = `${titleLower} ${brandLower} ${catLower} ${descLower} ${keywords.join(' ')} ${tags.join(' ')}`;

      // Every token must match somewhere in searchable content
      const matchesAllTokens = queryTokens.every((token) => searchableBlob.includes(token));
      if (!matchesAllTokens) return false;
    }

    return true;
  });

  // 2. Compute dynamic facets from base query match
  const brandCountMap = new Map();
  const catCountMap = new Map();
  let lowestPriceInRupees = Infinity;
  let highestPriceInRupees = 0;

  for (const item of baseFiltered) {
    // Brands
    brandCountMap.set(item.brand, (brandCountMap.get(item.brand) || 0) + 1);

    // Categories
    const existingCat = catCountMap.get(item.categorySlug);
    if (existingCat) {
      existingCat.count += 1;
    } else {
      catCountMap.set(item.categorySlug, { name: item.categoryName, count: 1 });
    }

    // Price
    const priceRupees = Math.round(item.priceInPaise / 100);
    if (priceRupees < lowestPriceInRupees) lowestPriceInRupees = priceRupees;
    if (priceRupees > highestPriceInRupees) highestPriceInRupees = priceRupees;
  }

  const facets = {
    brands: Array.from(brandCountMap.entries()).map(([name, count]) => ({ name, count })),
    categories: Array.from(catCountMap.entries()).map(([slug, val]) => ({
      slug,
      name: val.name,
      count: val.count,
    })),
    priceBounds: {
      min: lowestPriceInRupees === Infinity ? 0 : lowestPriceInRupees,
      max: highestPriceInRupees === 0 ? 350000 : highestPriceInRupees,
    },
    totalMatching: baseFiltered.length,
  };

  // 3. Apply secondary strict filters
  let items = baseFiltered.filter((item) => {
    const itemPriceRupees = Math.round(item.priceInPaise / 100);

    // Brand filter
    if (selectedBrands.length > 0) {
      if (!selectedBrands.includes(item.brand.toLowerCase())) return false;
    }

    // Price bounds
    if (minPrice !== undefined && itemPriceRupees < minPrice) return false;
    if (maxPrice !== undefined && itemPriceRupees > maxPrice) return false;

    // Minimum rating
    if (minRating !== undefined && item.avgRating < minRating) return false;

    // In Stock
    if (inStockOnly && !item.isInStock) return false;

    // Deals of the day
    if (dealsOnly && !item.isDealOfTheDay) return false;

    // Prime
    if (primeOnly && !item.isPrime) return false;

    // Minimum discount
    if (minDiscount !== undefined) {
      const discount = calculateDiscountPercent(item.compareAtInPaise, item.priceInPaise);
      if (discount < minDiscount) return false;
    }

    return true;
  });

  // 4. Sorting
  items.sort((a, b) => {
    if (sort === 'price_asc') {
      return a.priceInPaise - b.priceInPaise;
    }
    if (sort === 'price_desc') {
      return b.priceInPaise - a.priceInPaise;
    }
    if (sort === 'rating') {
      if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
      return b.reviewCount - a.reviewCount;
    }
    if (sort === 'discount') {
      const discA = calculateDiscountPercent(a.compareAtInPaise, a.priceInPaise);
      const discB = calculateDiscountPercent(b.compareAtInPaise, b.priceInPaise);
      return discB - discA;
    }
    if (sort === 'newest') {
      return b.id.localeCompare(a.id);
    }

    // Default 'relevance': Boost exact title match, deal of day, and reviews
    let scoreA = 0;
    let scoreB = 0;
    if (rawQuery) {
      if (a.title.toLowerCase().includes(rawQuery)) scoreA += 50;
      if (b.title.toLowerCase().includes(rawQuery)) scoreB += 50;
      if (a.brand.toLowerCase() === rawQuery) scoreA += 30;
      if (b.brand.toLowerCase() === rawQuery) scoreB += 30;
    }
    if (a.isDealOfTheDay) scoreA += 10;
    if (b.isDealOfTheDay) scoreB += 10;
    scoreA += a.avgRating * 2;
    scoreB += b.avgRating * 2;

    return scoreB - scoreA;
  });

  return {
    items,
    total: items.length,
    facets,
  };
}
