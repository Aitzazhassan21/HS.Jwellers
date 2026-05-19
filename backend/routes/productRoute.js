import express from "express";
import {
  addProduct,
  updateProduct,
  deleteProduct,
  listProducts,
  adminListProducts,
  getFeatured,
  getNewArrivals,
  getProductBySlug,
  getProductsByCategory,
  addReview,
} from "../controllers/productController.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.get("/", listProducts);
router.get("/featured", getFeatured);
router.get("/new-arrivals", getNewArrivals);
router.get("/category/:slug", getProductsByCategory);

// Admin routes
router.get("/admin/all", verifyToken, isAdmin, adminListProducts);

// Public product detail route must come after /admin/all and /category/:slug to avoid collisions
router.get("/:slug", getProductBySlug);

// Protected routes
router.post("/:id/review", verifyToken, addReview);

// Admin routes
router.post("/", verifyToken, isAdmin, addProduct);
router.put("/:id", verifyToken, isAdmin, updateProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

export default router;
