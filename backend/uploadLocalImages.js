import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dns from "node:dns";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env load karo SABSE PEHLE
dotenv.config({ path: path.join(__dirname, '.env') });

// DNS workaround for Windows + Node (same as seedData.js)
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

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Apply DNS workaround before connecting
if (MONGODB_URI) {
  applyMongoSrvDnsWorkaround(MONGODB_URI);
}

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY || process.env.CLOUDINARY_API_SECRET,
});

// Category to folder mapping
const categoryFolderMap = {
  necklace: "neck",
  rings: "ring",
  earrings: "earing",
  bracelets: "braclet",
  anklets: "anklet",
  sale: "deal",
};

// Image file patterns per category
const categoryImagePatterns = {
  necklace: { prefix: "neck", count: 11, startIdx: 1 },
  rings: { prefix: "ring", count: 11, startIdx: 1 },
  earrings: { prefix: "earring", count: 9, startIdx: 1 },
  bracelets: { prefix: "beaclet", count: 11, startIdx: 1 },
  anklets: { prefix: "anklet", count: 11, startIdx: 1 },
  sale: { prefix: "dealsale", count: 5, startIdx: 1 },
};

// MongoDB Models
const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  image: {
    url: String,
    public_id: String,
  },
  isActive: Boolean,
  order: Number,
});

const productSchema = new mongoose.Schema({
  name: String,
  slug: String,
  category: mongoose.Schema.Types.ObjectId,
  images: [{
    url: String,
    public_id: String,
  }],
});

const Category = mongoose.model("Category", categorySchema);
const Product = mongoose.model("Product", productSchema);

// Upload a single image to Cloudinary
const uploadImageToCloudinary = async (filePath, folder, filename) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `hs-glamour/${folder}`,
      resource_type: "image",
      use_filename: true,
      unique_filename: false,
    });
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error(`❌ Upload failed for ${filename}:`, error.message);
    return { success: false, error: error.message };
  }
};

// Main function
const uploadLocalImages = async () => {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected");

    const assetsPath = path.join(__dirname, "../frontend/public/assets");
    
    let totalProductsUpdated = 0;
    let totalCategoriesUpdated = 0;

    // Process each category
    for (const [categorySlug, folderName] of Object.entries(categoryFolderMap)) {
      console.log(`\n📁 Processing category: ${categorySlug} (folder: ${folderName})`);
      
      const categoryFolderPath = path.join(assetsPath, folderName);
      
      if (!fs.existsSync(categoryFolderPath)) {
        console.log(`⚠️  Folder not found: ${categoryFolderPath}`);
        continue;
      }

      const files = fs.readdirSync(categoryFolderPath);
      const imageFiles = files.filter(f => f.match(/\.(jpg|jpeg|png|webp)$/i));
      
      console.log(`📷 Found ${imageFiles.length} images in ${folderName}/`);

      // Get category from database
      const category = await Category.findOne({ slug: categorySlug });
      if (!category) {
        console.log(`⚠️  Category not found in DB: ${categorySlug}`);
        continue;
      }

      // Update category image with first image
      if (imageFiles.length > 0) {
        const firstImagePath = path.join(categoryFolderPath, imageFiles[0]);
        console.log(`⬆️  Uploading category image: ${imageFiles[0]}`);
        const uploadResult = await uploadImageToCloudinary(firstImagePath, folderName, imageFiles[0]);
        
        if (uploadResult.success) {
          category.image = {
            url: uploadResult.url,
            public_id: uploadResult.public_id,
          };
          await category.save();
          console.log(`✅ Category image updated: ${category.name}`);
          totalCategoriesUpdated++;
        }
      }

      // Update products in this category
      const products = await Product.find({ category: category._id });
      console.log(`📦 Found ${products.length} products in ${category.name}`);

      const pattern = categoryImagePatterns[categorySlug];
      if (!pattern) continue;

      for (let i = 0; i < Math.min(products.length, pattern.count); i++) {
        const product = products[i];
        const imgIndex = pattern.startIdx + i;
        const imageName = `${pattern.prefix}${imgIndex}.jpg`;
        const imagePath = path.join(categoryFolderPath, imageName);

        if (!fs.existsSync(imagePath)) {
          console.log(`⚠️  Image not found: ${imageName}`);
          continue;
        }

        console.log(`⬆️  Uploading product image: ${imageName}`);
        const uploadResult = await uploadImageToCloudinary(imagePath, folderName, imageName);

        if (uploadResult.success) {
          product.images = [{
            url: uploadResult.url,
            public_id: uploadResult.public_id,
          }];
          await product.save();
          console.log(`📝 Updated product: ${product.name}`);
          totalProductsUpdated++;
        }
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("🎉 All images uploaded to Cloudinary!");
    console.log(`✅ ${totalCategoriesUpdated} categories updated with Cloudinary URLs`);
    console.log(`✅ ${totalProductsUpdated} products updated with Cloudinary URLs`);
    console.log("=".repeat(50));

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
};

uploadLocalImages();
