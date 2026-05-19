import express from "express";
import { getStats } from "../controllers/adminController.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", verifyToken, isAdmin, getStats);

export default router;
