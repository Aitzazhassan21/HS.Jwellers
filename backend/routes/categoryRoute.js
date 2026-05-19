import express from "express";
import {
  createCategory,
  getAllCategories,
  getFeaturedCategories,
  updateCategory,
  deleteCategory,
  getCategoryBySlug,
} from "../controllers/categoryController.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public
router.get("/", getAllCategories);
router.get("/featured", getFeaturedCategories);
router.get("/:slug", getCategoryBySlug);

// Admin
router.post("/", verifyToken, isAdmin, createCategory);
router.put("/:id", verifyToken, isAdmin, updateCategory);
router.delete("/:id", verifyToken, isAdmin, deleteCategory);

export default router;
