import mongoose from "mongoose";
import Category from "./models/categoryModel.js";
import Product from "./models/productModel.js";
import dotenv from "dotenv";
import dns from "node:dns";

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env load karo SABSE PEHLE
dotenv.config({ path: path.join(__dirname, '.env') });

// DNS workaround for Windows + Node (same as config/mongodb.js)
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
    console.log(
      "[MongoDB] Windows SRV workaround: using 8.8.8.8, 8.8.4.4"
    );
  }
};

// Resolve MongoDB URI (same logic as config/mongodb.js)
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

// MongoDB connection
const connectDB = async () => {
  try {
    const uri = resolveMongoUri();
    
    if (!uri) {
      throw new Error('Missing MongoDB configuration: set MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DB — or MONGODB_URI');
    }
    
    applyMongoSrvDnsWorkaround(uri);
    
    console.log("[MongoDB] Connecting to:", uri.replace(/:([^@]+)@/, ':***@'));
    await mongoose.connect(uri);
    console.log("✅ MongoDB connected (Atlas)");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

// Category data
const categoriesData = [
  {
    name: "Necklace & Chain",
    slug: "necklace",
    image: { url: "/assets/neck/neck1.jpg", public_id: "" },
    isActive: true,
    order: 1,
  },
  {
    name: "Rings",
    slug: "rings",
    image: { url: "/assets/ring/ring1.jpg", public_id: "" },
    isActive: true,
    order: 2,
  },
  {
    name: "Earrings",
    slug: "earrings",
    image: { url: "/assets/earing/earring1.jpg", public_id: "" },
    isActive: true,
    order: 3,
  },
  {
    name: "Bracelets & Watches",
    slug: "bracelets",
    image: { url: "/assets/braclet/beaclet1.jpg", public_id: "" },
    isActive: true,
    order: 4,
  },
  {
    name: "Anklets",
    slug: "anklets",
    image: { url: "/assets/anklet/anklet1.jpg", public_id: "" },
    isActive: true,
    order: 5,
  },
  {
    name: "Sale & Deals",
    slug: "sale",
    image: { url: "/assets/deal/dealsale1.jpg", public_id: "" },
    isActive: true,
    order: 6,
  },
];

// Product names per category
const productNames = {
  necklace: [
    "Pearl Choker",
    "Gold Chain Set",
    "Layered Necklace",
    "Diamond Pendant",
    "Rose Gold Chain",
    "Statement Necklace",
    "Delicate Chain",
    "Vintage Piece",
    "Boho Necklace",
    "Tennis Necklace",
    "Beaded Collar",
  ],
  rings: [
    "Stackable Ring",
    "Statement Band",
    "Midi Ring Set",
    "Floral Ring",
    "Twisted Band",
    "Stone Ring",
    "Minimal Ring",
    "Cocktail Ring",
    "Adjustable Ring",
    "Knuckle Ring",
    "Infinity Ring",
  ],
  earrings: [
    "Hoop Earrings",
    "Drop Earrings",
    "Stud Set",
    "Chandbali",
    "Ear Cuffs",
    "Jhumka Classic",
    "Pearl Drops",
    "Tassel Earrings",
    "Geometric Hoops",
  ],
  bracelets: [
    "Charm Bracelet",
    "Gold Bangle",
    "Tennis Bracelet",
    "Cuff Bracelet",
    "Chain Link",
    "Beaded Bracelet",
    "Analog Watch",
    "Digital Watch",
    "Rose Gold Watch",
    "Vintage Watch",
    "Sports Watch",
  ],
  anklets: [
    "Beaded Anklet",
    "Chain Anklet",
    "Charm Anklet",
    "Layered Anklet",
    "Pearl Anklet",
    "Gold Anklet",
    "Silver Anklet",
    "Boho Anklet",
    "Minimal Anklet",
    "Statement Anklet",
    "Adjustable Anklet",
  ],
  sale: [
    "Bundle Deal Set 1",
    "Bundle Deal Set 2",
    "Bundle Deal Set 3",
    "Flash Sale Set",
    "Clearance Special",
  ],
};

// Image paths per category - using watch folder images
const imagePaths = {
  necklace: { folder: "neck", prefix: "neck", count: 11, startIdx: 1 },
  rings: { folder: "ring", prefix: "ring", count: 10, startIdx: 1 },
  earrings: { folder: "earing", prefix: "earring", count: 9, startIdx: 1 },
  bracelets: { folder: "braclet", prefix: "beaclet", count: 11, startIdx: 1 },
  anklets: { folder: "anklet", prefix: "anklet", count: 11, startIdx: 1 },
  sale: { folder: "deal", prefix: "dealsale", count: 5, startIdx: 1 },
};

// Helper arrays
const prices = [499, 599, 699, 799, 899, 999, 1099, 1199, 1299, 1399, 1499];
const discountPrices = [399, 479, 549, 639, 719, 799, 879, 959, 1039, 1119, 1199];
const stockValues = [15, 20, 25, 30, 35];
const materials = ["Gold Plated", "Silver Plated", "Kundan", "Oxidised"];

// Generate products for a category
const generateProducts = (categorySlug, categoryId) => {
  const config = imagePaths[categorySlug];
  const names = productNames[categorySlug];
  const products = [];

  for (let i = 0; i < config.count; i++) {
    const priceIndex = i % prices.length;
    const stockIndex = i % stockValues.length;
    const materialIndex = i % materials.length;
    const imgIndex = config.startIdx + i;

    const isFeatured = i < 4 || categorySlug === "sale";
    const isNewArrival = i < 4 || (categorySlug === "sale" && i < 2);

    products.push({
      name: names[i] || `${categorySlug} Item ${i + 1}`,
      slug: `${categorySlug}-${i + 1}`,
      description: `Beautiful ${names[i] || categorySlug} piece crafted with care. Perfect for any occasion.`,
      category: categoryId,
      price: prices[priceIndex],
      discountPrice: discountPrices[priceIndex],
      images: [
        {
          url: `/assets/${config.folder}/${config.prefix}${imgIndex}.jpg`,
          public_id: `${config.prefix}${imgIndex}`,
        },
      ],
      material: materials[materialIndex],
      colors: [],
      stock: stockValues[stockIndex],
      sold: 0,
      ratings: { average: 0, count: 0 },
      reviews: [],
      isFeatured,
      isNewArrival,
      isActive: true,
      tags: [categorySlug, materials[materialIndex].toLowerCase()],
    });
  }

  return products;
};

// Seed database
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing database...");
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log("✅ DB cleared");

    // Seed categories
    console.log("📦 Seeding categories...");
    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`✅ Categories seeded: ${createdCategories.length}`);

    // Seed products
    console.log("📦 Seeding products...");
    const allProducts = [];

    for (const category of createdCategories) {
      const products = generateProducts(category.slug, category._id);
      allProducts.push(...products);
    }

    await Product.insertMany(allProducts);
    console.log(`✅ Products seeded: ${allProducts.length}`);

    console.log("🎉 Done!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
