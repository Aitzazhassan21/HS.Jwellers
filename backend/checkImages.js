import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import dns from 'node:dns'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env') })

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

// Import your Category and Product models
import Category from './models/categoryModel.js'
import Product from './models/productModel.js'

const check = async () => {
  await mongoose.connect(MONGODB_URI)
  console.log('✅ Connected\n')

  console.log('═══ CATEGORIES ═══')
  const cats = await Category.find({})
  cats.forEach(c => {
    console.log(`${c.name}: ${c.image?.url || 'NO IMAGE'}`)
  })

  console.log('\n═══ PRODUCTS (first 3 per category) ═══')
  for (const cat of cats) {
    const products = await Product.find(
      { category: cat._id }
    ).limit(3)
    console.log(`\n[${cat.name}]`)
    products.forEach(p => {
      console.log(`  ${p.name}: ${p.images?.[0]?.url || 'NO IMAGE'}`)
    })
  }

  await mongoose.disconnect()
}
check()
