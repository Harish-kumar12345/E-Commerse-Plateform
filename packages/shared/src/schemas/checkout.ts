import { z } from 'zod';

export const PaymentMethodEnum = z.enum([
  'RAZORPAY_UPI',
  'RAZORPAY_CARD',
  'RAZORPAY_NETBANKING',
  'COD',
]);
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;

export const CreateAddressSchema = z.object({
  fullName: z.string().min(2).max(100),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid 10-digit Indian phone number'),
  addressLine1: z.string().min(5).max(255),
  addressLine2: z.string().max(255).optional(),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  postalCode: z.string().regex(/^\d{6}$/, 'Invalid 6-digit Indian PIN code'),
  country: z.string().default('India'),
  isDefault: z.boolean().default(false),
});
export type CreateAddressInput = z.infer<typeof CreateAddressSchema>;

export const CheckoutOrderSchema = z.object({
  addressId: z.string().uuid(),
  paymentMethod: PaymentMethodEnum,
  couponCode: z.string().optional(),
  idempotencyKey: z.string().uuid(),
});
export type CheckoutOrderInput = z.infer<typeof CheckoutOrderSchema>;

export const VerifyCodOtpSchema = z.object({
  orderId: z.string().uuid(),
  otpCode: z.string().length(6, 'OTP must be 6 digits'),
});
export type VerifyCodOtpInput = z.infer<typeof VerifyCodOtpSchema>;

export const RazorpayVerificationSchema = z.object({
  orderId: z.string().uuid(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});
export type RazorpayVerificationInput = z.infer<typeof RazorpayVerificationSchema>;
