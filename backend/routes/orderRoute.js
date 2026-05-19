import express from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public — guest checkout allowed
router.post("/", placeOrder);

// Protected customer routes
router.get("/my", verifyToken, getMyOrders);
router.get("/:id", verifyToken, getOrderById);
router.put("/:id/cancel", verifyToken, cancelOrder);

// Admin routes
router.get("/", verifyToken, isAdmin, getAllOrders);
router.put("/:id/status", verifyToken, isAdmin, updateOrderStatus);
router.patch("/:id/status", verifyToken, isAdmin, updateOrderStatus);

export default router;
