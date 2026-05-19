import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const adminAuth = async (req, res, next) => {
  try {
    let token = req.headers.authorization || req.headers.token;
    if (!token) {
      console.log("[adminAuth] No token provided");
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("[adminAuth] Decoded token:", decodedToken);
    console.log("[adminAuth] Token type:", typeof decodedToken);

    // Check if token is from database admin user (object payload with id)
    if (decodedToken && typeof decodedToken === 'object' && decodedToken.id) {
      const adminUser = await userModel.findById(decodedToken.id);
      if (adminUser && (adminUser.role === 'admin' || adminUser.isAdmin === true)) {
        req.admin = adminUser;
        next();
        return;
      }
    }

    // Check for legacy admin token payload object
    if (decodedToken && typeof decodedToken === 'object' && decodedToken.role === 'admin' && decodedToken.legacy) {
      req.admin = {
        _id: 'legacy-admin',
        email: process.env.ADMIN_EMAIL,
        role: 'admin',
        isLegacy: true,
      };
      next();
      return;
    }

    // Fallback to environment variables (legacy string payload)
    console.log("[adminAuth] Checking legacy fallback");
    console.log("[adminAuth] ADMIN_EMAIL:", process.env.ADMIN_EMAIL ? 'SET' : 'NOT SET');
    console.log("[adminAuth] ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD ? 'SET' : 'NOT SET');
    
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      console.log("[adminAuth] Missing env vars");
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const expectedString = process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD;
    console.log("[adminAuth] Expected string:", expectedString);
    console.log("[adminAuth] Token match?", decodedToken === expectedString);

    if (decodedToken === expectedString) {
      console.log("[adminAuth] Legacy auth successful");
      // Set req.admin for legacy auth (create mock admin object for compatibility)
      req.admin = {
        _id: 'legacy-admin',
        email: process.env.ADMIN_EMAIL,
        role: 'admin',
        isLegacy: true,
      };
      next();
      return;
    }

    console.log("[adminAuth] Legacy auth failed");
    return res.status(401).json({ success: false, message: "Unauthorized" });
  } catch (error) {
    console.error("Error while authenticating admin:", error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export default adminAuth;
