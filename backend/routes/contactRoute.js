import express from "express";
import {
  submitContact,
  getAllContacts,
  updateContactStatus,
} from "../controllers/contactController.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public
router.post("/", submitContact);

// Admin
router.get("/", verifyToken, isAdmin, getAllContacts);
router.put("/:id/status", verifyToken, isAdmin, updateContactStatus);

export default router;
