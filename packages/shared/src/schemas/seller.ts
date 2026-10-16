import { z } from 'zod';

export const SellerOnboardSchema = z.object({
  storeName: z.string().min(3).max(100),
  businessEmail: z.string().email(),
  businessPhone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid 10-digit Indian phone number'),
  gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  bankAccountNo: z.string().min(9).max(18),
  bankIfsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code'),
  pickupAddress: z.string().min(10).max(255),
  pickupPincode: z.string().regex(/^\d{6}$/, 'Invalid 6-digit PIN code'),
});
export type SellerOnboardInput = z.infer<typeof SellerOnboardSchema>;

export const StockAdjustSchema = z.object({
  variantId: z.string().uuid(),
  quantityDelta: z.number().int(),
  reason: z.string().min(3).max(100),
});
export type StockAdjustInput = z.infer<typeof StockAdjustSchema>;
