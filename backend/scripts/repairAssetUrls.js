#!/usr/bin/env node
/*
 Safe DB script: find product/category image fields that reference localhost or relative /assets paths
 and either show proposed changes (dry run) or apply them when run with `--apply`.

 Usage:
  node scripts/repairAssetUrls.js         # dry run
  node scripts/repairAssetUrls.js --apply # actually update DB

*/
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

const MONGODB_URI = process.env.MONGODB_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.CLIENT_URL || (process.env.FRONTEND_VERCEL_URL ? `https://${process.env.FRONTEND_VERCEL_URL}` : null);

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not set in environment. Aborting.');
  process.exit(1);
}

const apply = process.argv.includes('--apply');

const rewriteUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  // absolute cloudinary or external URLs: leave
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const isAsset = url.includes('/assets/') || url.includes('/uploads/');
    const isLocalHost = url.includes('localhost') || url.includes('127.0.0.1') || url.includes(':5000');
    if (isAsset && isLocalHost && FRONTEND_URL) {
      try {
        const u = new URL(url);
        return `${FRONTEND_URL}${u.pathname}${u.search}`;
      } catch (e) {
        return url;
      }
    }
    return url;
  }

  // relative paths starting with /assets -> prefix FRONTEND_URL if available
  if (url.startsWith('/')) {
    if (FRONTEND_URL) return `${FRONTEND_URL}${url}`;
    return url;
  }

  return url;
};

const connect = async () => {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
};

const processProducts = async () => {
  const products = await Product.find({}).lean();
  let changed = 0;
  for (const p of products) {
    const updates = {};
    if (Array.isArray(p.images) && p.images.length > 0) {
      const newImages = p.images.map((img) => {
        if (!img) return img;
        const orig = img.url || img.image || img.public_id || (typeof img === 'string' ? img : null);
        const resolved = rewriteUrl(orig);
        if (resolved && resolved !== orig) {
          return { ...(typeof img === 'object' ? img : {}), url: resolved };
        }
        // ensure url field exists
        if (typeof img === 'object' && !img.url && (img.public_id || img.image)) {
          const fallback = img.image || img.public_id;
          const resolved2 = rewriteUrl(fallback);
          return { ...img, url: resolved2 };
        }
        return img;
      });
      // detect change
      const diff = JSON.stringify(newImages) !== JSON.stringify(p.images);
      if (diff) updates.images = newImages;
    }

    // single image field
    if (p.image) {
      const orig = p.image.url || p.image.image || (typeof p.image === 'string' ? p.image : null);
      const resolved = rewriteUrl(orig);
      if (resolved && resolved !== orig) updates.image = { ...(typeof p.image === 'object' ? p.image : {}), url: resolved };
    }

    if (Object.keys(updates).length > 0) {
      changed++;
      console.log(`Product ${p._id} will be updated:`, Object.keys(updates));
      if (apply) {
        await Product.updateOne({ _id: p._id }, { $set: updates });
      }
    }
  }
  return changed;
};

const processCategories = async () => {
  const categories = await Category.find({}).lean();
  let changed = 0;
  for (const c of categories) {
    const updates = {};
    if (c.image) {
      const orig = c.image.url || c.image.image || (typeof c.image === 'string' ? c.image : null);
      const resolved = rewriteUrl(orig);
      if (resolved && resolved !== orig) updates.image = { ...(typeof c.image === 'object' ? c.image : {}), url: resolved };
    }
    if (Object.keys(updates).length > 0) {
      changed++;
      console.log(`Category ${c._id} will be updated:`, Object.keys(updates));
      if (apply) {
        await Category.updateOne({ _id: c._id }, { $set: updates });
      }
    }
  }
  return changed;
};

const run = async () => {
  try {
    await connect();
    console.log('Connected to DB');
    console.log('FRONTEND_URL=', FRONTEND_URL || '(not set)');

    const prodChanged = await processProducts();
    const catChanged = await processCategories();

    console.log(`Products needing update: ${prodChanged}`);
    console.log(`Categories needing update: ${catChanged}`);
    if (!apply) console.log('Dry run complete. Rerun with --apply to modify records.');
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
