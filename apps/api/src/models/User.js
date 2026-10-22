import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String, default: '' },
    landmark: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    type: { type: String, enum: ['HOME', 'WORK', 'OTHER'], default: 'HOME' },
  },
  { _id: true, timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, default: null, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['CUSTOMER', 'SELLER', 'ADMIN', 'SUPPORT', 'CONTENT_EDITOR'],
      default: 'CUSTOMER',
    },
    isPrimeMember: { type: Boolean, default: false },
    coinsBalance: { type: Number, default: 100 },
    referralCode: { type: String, default: null },
    addresses: [AddressSchema],
    sellerProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'SellerProfile', default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

export const User = mongoose.model('User', UserSchema);
export default User;
