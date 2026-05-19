import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import { errorHandler } from "./middleware/error.middleware.js";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import orderRouter from "./routes/orderRoute.js";
import uploadRouter from "./routes/uploadRoute.js";
import contactRouter from "./routes/contactRoute.js";
import adminContactsRouter from "./routes/adminContactsRoute.js";
import adminStatsRouter from "./routes/adminStatsRoute.js";
import newsletterRouter from "./routes/newsletterRoute.js";

const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize connections
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
  ],
  credentials: true,
}));

// Serve static files from frontend public assets
app.use("/assets", express.static(path.join(__dirname, "../frontend/public/assets")));

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/contact", contactRouter);
app.use("/api/admin/contacts", adminContactsRouter);
app.use("/api/admin", adminStatsRouter);
app.use("/api/newsletter", newsletterRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    timestamp: new Date().toISOString(),
    env: {
      mongodb_configured: Boolean(
        (process.env.MONGODB_USER &&
          process.env.MONGODB_PASSWORD &&
          process.env.MONGODB_HOST &&
          process.env.MONGODB_DB) ||
          process.env.MONGODB_URI
      ),
      jwt_secret_set: !!process.env.JWT_SECRET,
      node_env: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
    },
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("ANON Jewels API is running...");
});

// Error handler
app.use(errorHandler);

// Start server
if (!process.env.VERCEL) {
  app.listen(port, () =>
    console.log(`Server running at http://localhost:${port}`)
  );
}

export default app;
