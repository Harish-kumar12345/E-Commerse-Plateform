import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: '' },
    discountType: { type: String, enum: ['PERCENTAGE', 'FLAT'], default: 'PERCENTAGE' },
    discountValue: { type: Number, required: true }, // e.g. 10 for 10% or 50000 for ₹500
    minOrderValueInPaise: { type: Number, default: 0 },
    maxDiscountInPaise: { type: Number, default: null },
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Coupon = mongoose.model('Coupon', CouponSchema);
export default Coupon;
