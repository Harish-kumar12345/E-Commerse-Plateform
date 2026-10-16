import { z } from 'zod';

export const RoleEnum = z.enum(['CUSTOMER', 'SELLER', 'ADMIN', 'SUPPORT', 'CONTENT_EDITOR']);
export type Role = z.infer<typeof RoleEnum>;

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid 10-digit Indian phone number').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
});
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().nullable(),
  role: RoleEnum,
  isPrimeMember: z.boolean(),
  twoFactorEnabled: z.boolean(),
  createdAt: z.date().or(z.string()),
});
export type UserProfile = z.infer<typeof UserProfileSchema>;
