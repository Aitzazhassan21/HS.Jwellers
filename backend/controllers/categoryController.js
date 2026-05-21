import slugify from "slugify";
import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";
import { normalizeImages } from "../utils/imageUtils.js";

// POST /api/categories — admin
export const createCategory = async (req, res) => {
  try {
    const { name, image, subcategories, featured, order } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: "Category name is required" });
    }

    const slug = slugify(name, { lower: true, strict: true });
    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      slug,
      image: image || { url: "", public_id: "" },
      subcategories: subcategories || [],
      featured: featured || false,
      order: order || 0,
    });

    res.status(201).json({ success: true, message: "Category created", category: normalizeImages(category.toObject()) });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort("order name")
      .select("-__v");

    res.status(200).json({ success: true, categories: categories.map(c => normalizeImages(c.toObject())) });
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/categories/featured
export const getFeaturedCategories = async (req, res) => {
  try {
    const categories = await Category.find({ featured: true, isActive: true })
      .sort("order")
      .limit(8);

    res.status(200).json({ success: true, categories: categories.map(c => normalizeImages(c.toObject())) });
  } catch (error) {
    console.error("Featured categories error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/categories/:id — admin
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.name) updates.slug = slugify(updates.name, { lower: true, strict: true });

    const category = await Category.findByIdAndUpdate(id, updates, { new: true });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, message: "Category updated", category: normalizeImages(category.toObject()) });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/categories/:id — admin
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    await Category.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const CATEGORY_SLUG_ALIASES = {
  // map legacy/short slugs to current DB slug
  "necklace": "necklace-and-chain",
};

const resolveCategorySlug = (slug) => CATEGORY_SLUG_ALIASES[slug] || slug;

// GET /api/categories/:slug — public
export const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const resolvedSlug = resolveCategorySlug(slug);
    const category = await Category.findOne({ slug: resolvedSlug, isActive: true });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    const products = await Product.find({ category: category._id, isActive: true })
      .populate("category", "name slug")
      .sort("-createdAt");

    res.status(200).json({ success: true, category: normalizeImages(category.toObject()), products: products.map(p => normalizeImages(p.toObject())) });
  } catch (error) {
    console.error("Get category by slug error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
