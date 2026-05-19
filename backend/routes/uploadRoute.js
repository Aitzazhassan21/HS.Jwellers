import express from "express";
import { uploadImage, deleteImage } from "../controllers/uploadController.js";
import adminAuth from "../middleware/adminAuth.js";
import upload from "../middleware/multer.js";

const router = express.Router();

router.post("/image", adminAuth, upload.single("image"), uploadImage);
router.delete("/image", adminAuth, deleteImage); // verified - accepts public_id in body

export default router;
