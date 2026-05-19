import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import { normalizeImages } from "../utils/imageUtils.js";

// Helper: generate unique slug
const createSlug = (name) => {
  let slug = slugify(name, { lower: true, strict: true });
  return `${slug}-${Date.now()}`;
};

// POST /api/products (admin)
export const addProduct = async (req, res) => {
  try {
    const {
      name, description, category, subcategory, price,
      discountPrice, material, colors, stock, isFeatured,
      isNewArrival, tags, images,
    } = req.body;

    if (!name || !description || !category || !price || !stock) {
      return res.status(400).json({ success: false, message: "Name, description, category, price and stock are required" });
    }

    const slug = createSlug(name);

    const product = await Product.create({
      name, slug, description, category, subcategory,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      material: material || "Gold Plated",
      colors: colors || [],
      stock: Number(stock),
      isFeatured: isFeatured || false,
      isNewArrival: isNewArrival || false,
      tags: tags || [],
      images: images || [],
    });

    res.status(201).json({ success: true, message: "Product added", product });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/products/:id (admin)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.name) updates.slug = createSlug(updates.name);

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product updated", product });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/products/:id (admin)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products — filter, sort, paginate
export const adminListProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category", "name slug")
      .sort("-createdAt");

    const normalized = products.map((p) => normalizeImages(p.toObject()));
    res.status(200).json({ success: true, products: normalized });
  } catch (error) {
    console.error("Admin list products error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const listProducts = async (req, res) => {
  try {
    const {
      page = 1, limit = 12, sort = "-createdAt",
      category, subcategory, minPrice, maxPrice,
      material, isFeatured, isNewArrival, search,
    } = req.query;

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (material) filter.material = material;
    if (isFeatured === "true") filter.isFeatured = true;
    if (isNewArrival === "true") filter.isNewArrival = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));
    const total = await Product.countDocuments(filter);

    // Normalize image URLs (Cloudinary or backend assets)
    const normalized = products.map(p => normalizeImages(p.toObject()));

    res.status(200).json({
      success: true,
      products: normalized,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("List products error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/featured
export const getFeatured = async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true, isActive: true })
      .populate("category", "name slug")
      .limit(8);

    res.status(200).json({ success: true, products: products.map(p => normalizeImages(p.toObject())) });
  } catch (error) {
    console.error("Featured products error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/new-arrivals
export const getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ isNewArrival: true, isActive: true })
      .populate("category", "name slug")
      .sort("-createdAt")
      .limit(8);

    res.status(200).json({ success: true, products: products.map(p => normalizeImages(p.toObject())) });
  } catch (error) {
    console.error("New arrivals error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/products/:slug
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug, isActive: true })
      .populate("category", "name slug")
      .populate("reviews.user", "name");
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product: normalizeImages(product.toObject()) });
  } catch (error) {
    console.error("Get product by slug error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const CATEGORY_SLUG_ALIASES = {
  "necklace-and-chain": "necklace",
};

const resolveCategorySlug = (slug) => CATEGORY_SLUG_ALIASES[slug] || slug;

// GET /api/products/category/:slug
export const getProductsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const resolvedSlug = resolveCategorySlug(slug);
    const category = await Category.findOne({ slug: resolvedSlug, isActive: true });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    const products = await Product.find({ category: category._id, isActive: true })
      .populate("category", "name slug");

    res.status(200).json({ success: true, products: products.map(p => normalizeImages(p.toObject())) });
  } catch (error) {
    console.error("Get products by category error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/products/:id/review
export const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Rating and comment required" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: "You already reviewed this product" });
    }

    product.reviews.push({
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    // Recalculate average
    const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.ratings.average = Number((total / product.reviews.length).toFixed(1));
    product.ratings.count = product.reviews.length;

    await product.save();
    res.status(201).json({ success: true, message: "Review added", product });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
