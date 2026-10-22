import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    variantId: { type: String, default: null },
    title: { type: String, required: true },
    slug: { type: String, default: '' },
    primaryImage: { type: String, default: '' },
    priceInPaise: { type: Number, required: true },
    quantity: { type: Number, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'SellerProfile' },
    sellerName: { type: String, default: 'Apex Electronics' },
  },
  { _id: true }
);

const SubOrderSchema = new mongoose.Schema(
  {
    subOrderNumber: { type: String, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'SellerProfile' },
    sellerName: { type: String, default: 'Apex Electronics' },
    subTotalInPaise: { type: Number, required: true },
    taxInPaise: { type: Number, default: 0 },
    shippingFeeInPaise: { type: Number, default: 0 },
    commissionInPaise: { type: Number, default: 0 },
    sellerNetPayableInPaise: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'],
      default: 'CONFIRMED',
    },
    trackingNumber: { type: String, default: '' },
    courierPartner: { type: String, default: 'Delhivery' },
    items: [OrderItemSchema],
  },
  { _id: true, timestamps: true }
);

const OrderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    shippingAddress: {
      name: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      landmark: String,
      city: String,
      state: String,
      pincode: String,
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'CREDIT_CARD', 'DEBIT_CARD', 'NET_BANKING', 'COD', 'WALLET'],
      default: 'UPI',
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED'],
      default: 'CAPTURED',
    },
    status: {
      type: String,
      enum: ['PENDING_PAYMENT', 'PAID', 'PROCESSING', 'PARTIALLY_SHIPPED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PAID',
    },
    totalAmountInPaise: { type: Number, required: true },
    subtotalInPaise: { type: Number, required: true },
    taxInPaise: { type: Number, default: 0 },
    shippingFeeInPaise: { type: Number, default: 0 },
    discountInPaise: { type: Number, default: 0 },
    couponCode: { type: String, default: null },
    razorpayOrderId: { type: String, default: null },
    razorpayPaymentId: { type: String, default: null },
    razorpaySignature: { type: String, default: null },
    idempotencyKey: { type: String, default: null },
    subOrders: [SubOrderSchema],
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

export const Order = mongoose.model('Order', OrderSchema);
export default Order;
