export * from '../schemas/auth.js';
export * from '../schemas/product.js';
export * from '../schemas/cart.js';
export * from '../schemas/checkout.js';
export * from '../schemas/seller.js';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
  timestamp: string;
}

export interface ProductSummary {
  id: string;
  title: string;
  slug: string;
  brand: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  seller: {
    id: string;
    storeName: string;
    rating: number;
  };
  primaryImage: string;
  minPriceInPaise: number;
  maxPriceInPaise: number;
  compareAtInPaise?: number | null;
  discountPercent: number;
  avgRating: number;
  reviewCount: number;
  isDealOfTheDay: boolean;
  dealEndsAt?: string | null;
  isInStock: boolean;
}

export interface SplitCartBySeller {
  sellerId: string;
  storeName: string;
  items: Array<{
    cartItemId: string;
    variantId: string;
    productId: string;
    productTitle: string;
    productSlug: string;
    variantTitle: string;
    imageUrl: string;
    unitPriceInPaise: number;
    compareAtInPaise?: number | null;
    quantity: number;
    subtotalInPaise: number;
    inStock: boolean;
  }>;
  sellerSubtotalInPaise: number;
  sellerEstimatedTaxInPaise: number;
  sellerShippingFeeInPaise: number;
}
