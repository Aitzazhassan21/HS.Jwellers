import express from "express";
import { register, login, refreshToken, getMe, logout } from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.get("/me", verifyToken, getMe);
router.post("/logout", verifyToken, logout);

export default router;
