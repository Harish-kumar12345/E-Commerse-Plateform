import { z } from 'zod';

export const AddToCartSchema = z.object({
  variantId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10).default(1),
  guestId: z.string().optional(),
});
export type AddToCartInput = z.infer<typeof AddToCartSchema>;

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(0).max(10),
});
export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;

export const ApplyCouponSchema = z.object({
  code: z.string().min(2).max(25),
});
export type ApplyCouponInput = z.infer<typeof ApplyCouponSchema>;

export const MergeCartSchema = z.object({
  guestId: z.string().min(1),
});
export type MergeCartInput = z.infer<typeof MergeCartSchema>;
