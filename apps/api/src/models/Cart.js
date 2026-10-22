import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: String, default: null },
    title: { type: String, required: true },
    slug: { type: String, default: '' },
    primaryImage: { type: String, default: '' },
    priceInPaise: { type: Number, required: true },
    compareAtInPaise: { type: Number, default: null },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'SellerProfile', default: null },
    sellerName: { type: String, default: 'Apex Electronics' },
  },
  { _id: true }
);

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    guestId: { type: String, default: null, index: true },
    couponCode: { type: String, default: null },
    discountInPaise: { type: Number, default: 0 },
    items: [CartItemSchema],
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

export const Cart = mongoose.model('Cart', CartSchema);
export default Cart;
