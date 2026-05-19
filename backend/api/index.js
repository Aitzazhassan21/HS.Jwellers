import app from '../server.js';
import connectDB from '../config/mongodb.js';
import connectCloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';

let isInitialized = false;
let initError = null;

async function initialize() {
  if (isInitialized) return;
  if (initError) throw initError;

  try {
    console.log("[Serverless] Initializing connections...");
    await connectDB();
    await connectCloudinary();
    isInitialized = true;
    console.log("[Serverless] Initialization complete. Mongoose readyState:", mongoose.connection.readyState);
  } catch (error) {
    initError = error;
    console.error("[Serverless] Initialization failed:", error.message);
    throw error;
  }
}

function isDbReady() {
  return mongoose.connection.readyState === 1; // 1 = connected
}

async function waitForDbReady(maxWaitMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    if (isDbReady()) return true;
    await new Promise(r => setTimeout(r, 500));
  }
  return false;
}

// Wrapper to ensure initialization before handling requests
export default async function handler(req, res) {
  try {
    await initialize();

    // Wait up to 30s for DB to be fully ready (handles cold start race condition)
    const dbReady = await waitForDbReady(30000);
    if (!dbReady) {
      console.error("[Serverless] DB not ready after wait. readyState:", mongoose.connection.readyState);
      return res.status(503).json({
        success: false,
        message: "Database connection is not ready. Please retry in a few seconds."
      });
    }

    // Forward to express app
    return app(req, res);
  } catch (error) {
    console.error("[Serverless] Request failed:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server initialization failed: " + error.message,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
