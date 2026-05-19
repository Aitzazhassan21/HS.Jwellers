// Admin image resolver: ensures image URLs returned by backend load correctly in the admin app.
const getBaseFrontend = () => import.meta.env.VITE_FRONTEND_URL?.trim() || import.meta.env.VITE_CLIENT_URL?.trim() || null;
const getBaseApi = () => import.meta.env.VITE_BACKEND_URL?.trim() || null;

export const resolveImageUrl = (image) => {
  if (!image) return null;
  let url = null;
  if (typeof image === 'string') url = image;
  else if (typeof image === 'object') url = image.url || image.image || image.public_id || null;
  if (!url) return null;
  // absolute
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // rewrite localhost backend asset references to frontend origin when available
    const isAsset = url.includes('/assets/') || url.includes('/uploads/');
    const isLocalHost = url.includes('localhost') || url.includes('127.0.0.1') || url.includes(':5000');
    const frontend = getBaseFrontend();
    if (isAsset && isLocalHost && frontend) {
      try {
        const u = new URL(url);
        return `${frontend}${u.pathname}${u.search}`;
      } catch (e) {
        return url;
      }
    }
    return url;
  }

  // relative path like /assets/... -> prefer frontend origin if set, otherwise backend
  if (url.startsWith('/')) {
    const frontend = getBaseFrontend();
    if (frontend) return `${frontend}${url}`;
    const api = getBaseApi();
    if (api) return `${api}${url}`;
    return url;
  }

  return url;
};

export default resolveImageUrl;
