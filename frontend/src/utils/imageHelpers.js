// Helper functions to get image URLs from products and categories
// These handle both Cloudinary URLs and local asset paths

const getBaseApiUrl = () => import.meta.env.VITE_API_URL || "http://localhost:5000";

const resolveUrl = (image) => {
  if (!image) return null;
  let url = null;

  if (typeof image === "string") {
    url = image;
  } else if (typeof image === "object") {
    url = image.url || image.image || image.public_id || null;
  }

  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${getBaseApiUrl()}${url}`;
  return url;
};

export const getProductImage = (product) => {
  const image = product?.images?.[0] || product?.image;
  const url = resolveUrl(image);
  return url || `${getBaseApiUrl()}/placeholder.jpg`;
};

export const getCategoryImage = (categoryOrImage) => {
  const image = categoryOrImage?.image ? categoryOrImage.image : categoryOrImage;
  const url = resolveUrl(image);
  return url || `${getBaseApiUrl()}/placeholder.jpg`;
};
