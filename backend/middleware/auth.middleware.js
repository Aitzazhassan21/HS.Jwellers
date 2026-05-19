import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Verify JWT access token from Authorization: Bearer <token> header
const getTokenFromHeaders = (req) => {
  const authHeader = req.headers.authorization || req.headers.token;
  if (!authHeader) return null;
  return authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
};

export const verifyToken = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req);
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded && typeof decoded === "object" && decoded.role === "admin" && decoded.legacy) {
      req.user = {
        role: "admin",
        isActive: true,
        email: process.env.ADMIN_EMAIL || "admin@localhost",
        legacy: true,
      };
      return next();
    }

    const user = await User.findById(decoded.id).select("-password -refreshTokens");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: "Account deactivated" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
  if (
    req.user?.role !== "admin" &&
    req.user?.isAdmin !== true &&
    !req.user?.legacy
  ) {
    return res.status(403).json({ success: false, message: "Admin access required" });
  }
  next();
};
