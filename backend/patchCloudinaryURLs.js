import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dns from "node:dns";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, ".env") });

// Import models
import Product from "./models/productModel.js";
import Category from "./models/categoryModel.js";

// MongoDB connection helper (same as seedData.js)
const applyMongoSrvDnsWorkaround = (uri) => {
  if (!uri.startsWith("mongodb+srv:")) return;
  if (process.env.MONGODB_SKIP_DNS_OVERRIDE === "1") return;

  const fromEnv = process.env.MONGODB_DNS_SERVERS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (fromEnv?.length) {
    dns.setServers(fromEnv);
    console.log("[MongoDB] DNS servers (SRV):", fromEnv.join(", "));
    return;
  }

  if (process.platform === "win32") {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
    console.log("[MongoDB] Windows SRV workaround: using 8.8.8.8, 8.8.4.4");
  }
};

const resolveMongoUri = () => {
  const user = process.env.MONGODB_USER?.trim();
  const password = process.env.MONGODB_PASSWORD?.trim();
  const host = process.env.MONGODB_HOST?.trim();
  const db = process.env.MONGODB_DB?.trim();

  if (user && password && host && db) {
    const u = encodeURIComponent(user);
    const p = encodeURIComponent(password);
    return `mongodb+srv://${u}:${p}@${host}/${db}?retryWrites=true&w=majority`;
  }

  const legacy = process.env.MONGODB_URI?.trim();
  if (legacy) {
    return legacy;
  }

  return null;
};

const connectDB = async () => {
  try {
    const uri = resolveMongoUri();

    if (!uri) {
      throw new Error(
        "Missing MongoDB configuration: set MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DB — or MONGODB_URI"
      );
    }

    applyMongoSrvDnsWorkaround(uri);

    console.log("[MongoDB] Connecting to:", uri.replace(/:([^@]+)@/, ":***@"));
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected\n");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Build Cloudinary URL from public_id
const buildCloudinaryUrl = (public_id, cloudName) => {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${public_id}`;
};

// Patch products
const patchProducts = async () => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error("CLOUDINARY_CLOUD_NAME not set in .env");
    }

    const products = await Product.find({});
    console.log(`🔍 Checking ${products.length} products...\n`);

    let fixed = 0;
    let skipped = 0;

    for (const product of products) {
      if (product.images && product.images.length > 0) {
        const img = product.images[0];
        if (img.url && img.url.includes("cloudinary")) {
          console.log(`⏭️  Skip: ${product.name} (already Cloudinary)`);
          skipped++;
        } else if (img.public_id) {
          const newUrl = buildCloudinaryUrl(img.public_id, cloudName);
          img.url = newUrl;
          await product.save();
          console.log(`✅ Fixed: ${product.name}`);
          fixed++;
        }
      }
    }

    console.log("\n═══════════════════════════════════");
    console.log(`✅ Fixed: ${fixed} products`);
    console.log(`⏭️  Skipped: ${skipped} products`);

    return fixed;
  } catch (error) {
    console.error("❌ Error patching products:", error.message);
    throw error;
  }
};

// Patch categories
const patchCategories = async () => {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error("CLOUDINARY_CLOUD_NAME not set in .env");
    }

    const categories = await Category.find({});
    console.log(`\n🔍 Checking ${categories.length} categories...\n`);

    let fixed = 0;
    let skipped = 0;

    for (const category of categories) {
      if (category.image && category.image.public_id) {
        if (category.image.url && category.image.url.includes("cloudinary")) {
          console.log(`⏭️  Skip: ${category.name} (already Cloudinary)`);
          skipped++;
        } else {
          const newUrl = buildCloudinaryUrl(category.image.public_id, cloudName);
          category.image.url = newUrl;
          await category.save();
          console.log(`✅ Fixed: ${category.name}`);
          fixed++;
        }
      }
    }

    console.log("\n═══════════════════════════════════");
    console.log(`✅ Fixed: ${fixed} categories`);
    console.log(`⏭️  Skipped: ${skipped} categories`);

    return fixed;
  } catch (error) {
    console.error("❌ Error patching categories:", error.message);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await patchProducts();
    await patchCategories();
    console.log("\n✅ All patches completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Patch failed:", error.message);
    process.exit(1);
  }
};

main();
