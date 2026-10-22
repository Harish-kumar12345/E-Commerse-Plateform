import mongoose from 'mongoose';

const VariantSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true },
    title: { type: String, required: true },
    priceInPaise: { type: Number, required: true },
    compareAtInPaise: { type: Number, default: null },
    stock: { type: Number, default: 100 },
    lowStockThreshold: { type: Number, default: 5 },
    attributes: { type: Map, of: String, default: {} },
    barcode: { type: String, default: '' },
  },
  { _id: true }
);

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    brand: { type: String, required: true, trim: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    categorySlug: { type: String, required: true, index: true },
    categoryName: { type: String, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'SellerProfile', default: null },
    sellerName: { type: String, default: 'Apex Electronics' },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'PUBLISHED',
      index: true,
    },
    primaryImage: { type: String, required: true },
    images: [{ type: String }],
    priceInPaise: { type: Number, required: true, index: true },
    compareAtInPaise: { type: Number, default: null },
    avgRating: { type: Number, default: 4.5, index: true },
    reviewCount: { type: Number, default: 0 },
    isDealOfTheDay: { type: Boolean, default: false, index: true },
    isInStock: { type: Boolean, default: true },
    isPrime: { type: Boolean, default: true },
    keywords: [{ type: String }],
    tags: [{ type: String }],
    specs: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
    pros: [{ type: String }],
    tradeoff: { type: String, default: '' },
    variants: [VariantSchema],
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

ProductSchema.index({ title: 'text', description: 'text', brand: 'text', keywords: 'text' });

export const Product = mongoose.model('Product', ProductSchema);
export default Product;
