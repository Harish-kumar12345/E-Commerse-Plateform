import express from 'express';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const router = express.Router();

// GET /categories
router.get('/categories', async (req, res, next) => {
  try {
    const parentCategories = await Category.find({ parentId: null }).sort({ orderIndex: 1 }).lean();

    const result = await Promise.all(
      parentCategories.map(async (cat) => {
        const children = await Category.find({ parentId: cat._id }).sort({ orderIndex: 1 }).lean();
        const childrenWithCount = await Promise.all(
          children.map(async (child) => {
            const count = await Product.countDocuments({ categorySlug: child.slug, status: 'PUBLISHED' });
            return {
              id: child._id.toString(),
              ...child,
              _count: { products: count },
            };
          })
        );

        const totalProductCount = await Product.countDocuments({
          $or: [{ categorySlug: cat.slug }, { categorySlug: { $in: children.map((c) => c.slug) } }],
          status: 'PUBLISHED',
        });

        return {
          id: cat._id.toString(),
          ...cat,
          children: childrenWithCount,
          _count: { products: totalProductCount },
        };
      })
    );

    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// GET /categories/:slug
router.get('/categories/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug }).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        error: { code: 'CATEGORY_NOT_FOUND', message: 'Category not found' },
        timestamp: new Date().toISOString(),
      });
    }

    const children = await Category.find({ parentId: category._id }).sort({ orderIndex: 1 }).lean();
    const childrenWithCount = await Promise.all(
      children.map(async (child) => {
        const count = await Product.countDocuments({ categorySlug: child.slug, status: 'PUBLISHED' });
        return {
          id: child._id.toString(),
          ...child,
          _count: { products: count },
        };
      })
    );

    const productCount = await Product.countDocuments({ categorySlug: slug, status: 'PUBLISHED' });

    let parent = null;
    if (category.parentId) {
      parent = await Category.findById(category.parentId).select('name slug').lean();
      if (parent) parent.id = parent._id.toString();
    }

    res.json({
      success: true,
      data: {
        id: category._id.toString(),
        ...category,
        parent,
        children: childrenWithCount,
        _count: { products: productCount },
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

export default router;
