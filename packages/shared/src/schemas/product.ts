import { z } from 'zod';

export const ProductSortEnum = z.enum([
  'relevance',
  'price_asc',
  'price_desc',
  'rating_desc',
  'newest',
  'discount_desc',
]);

export const ProductFilterSchema = z.object({
  query: z.string().optional(),
  categorySlug: z.string().optional(),
  brand: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  isDeal: z.coerce.boolean().optional(),
  sort: ProductSortEnum.default('relevance'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
export type ProductFilterInput = z.infer<typeof ProductFilterSchema>;

export const AIFinderQuerySchema = z.object({
  prompt: z.string().min(3, 'Search prompt must be at least 3 characters'),
  category: z.string().optional(),
  maxBudgetInPaise: z.number().int().positive().optional(),
});
export type AIFinderQueryInput = z.infer<typeof AIFinderQuerySchema>;

export const PriceDropAlertSchema = z.object({
  variantId: z.string().uuid(),
  targetPriceInPaise: z.number().int().positive(),
});
export type PriceDropAlertInput = z.infer<typeof PriceDropAlertSchema>;
