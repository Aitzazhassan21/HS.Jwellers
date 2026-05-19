import { v2 as cloudinary } from "cloudinary";

const CLOUDINARY_TRANSFORM = { secure: true, transformation: [{ quality: 'auto', fetch_format: 'auto' }] };

export const resolveImageUrl = (img) => {
  if (!img) return null;

  const isObject = typeof img === 'object' && img !== null;
  const explicitUrl = isObject ? img.url : img;
  const publicId = isObject ? img.public_id : null;
  const url = typeof explicitUrl === 'string' ? explicitUrl : publicId;

  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  if (typeof explicitUrl === 'string') {
    if (explicitUrl.startsWith('/')) {
      // Prefer explicit BACKEND_URL (full origin), then VERCEL_URL, then HOST+PORT
      const backendUrl = process.env.BACKEND_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);
      if (backendUrl) return `${backendUrl}${explicitUrl}`;

      const port = process.env.PORT || 5000;
      const host = process.env.HOST || 'http://localhost';
      return `${host}:${port}${explicitUrl}`;
    }

    if (explicitUrl.includes('.') || explicitUrl.startsWith('data:')) {
      return explicitUrl;
    }
  }

  if (publicId) {
    try {
      return cloudinary.url(publicId, CLOUDINARY_TRANSFORM);
    } catch (e) {
      // ignore and fallthrough
    }
  }

  return url;
};

export const normalizeImages = (obj) => {
  if (!obj) return obj;
  const copy = JSON.parse(JSON.stringify(obj));
  if (Array.isArray(copy)) {
    return copy.map(item => normalizeImages(item));
  }

  if (copy.images && Array.isArray(copy.images)) {
    copy.images = copy.images
      .filter(Boolean)
      .map((img) => ({ ...(img || {}), url: resolveImageUrl(img) }));
  }
  if (copy.image && typeof copy.image === 'object') {
    copy.image = { ...(copy.image || {}), url: resolveImageUrl(copy.image) };
  }
  return copy;
};
