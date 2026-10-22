import mongoose from 'mongoose';

const SellerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    storeName: { type: String, required: true, trim: true },
    storeSlug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    businessEmail: { type: String, required: true, lowercase: true, trim: true },
    businessPhone: { type: String, required: true },
    gstin: { type: String, required: true, uppercase: true, trim: true },
    pan: { type: String, required: true, uppercase: true, trim: true },
    bankAccountNo: { type: String, required: true },
    bankIfsc: { type: String, required: true, uppercase: true },
    pickupAddress: { type: String, required: true },
    pickupPincode: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING_VERIFICATION', 'ACTIVE', 'SUSPENDED', 'REJECTED'],
      default: 'ACTIVE',
    },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 120 },
    commissionRate: { type: Number, default: 0.1 }, // 10%
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

export const SellerProfile = mongoose.model('SellerProfile', SellerProfileSchema);
export default SellerProfile;
