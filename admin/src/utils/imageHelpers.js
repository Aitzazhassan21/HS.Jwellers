// Admin image resolver: ensures image URLs returned by backend load correctly in the admin app.
const getBaseFrontend = () => {
  return (
    import.meta.env.VITE_FRONTEND_URL?.trim() ||
    import.meta.env.VITE_CLIENT_URL?.trim() ||
    (window.location.hostname !== 'localhost' ? 'https://hsjwellers.vercel.app' : null)
  );
};
const getBaseApi = () => {
  return (
    import.meta.env.VITE_BACKEND_URL?.trim() ||
    (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://hsjewelsapi.vercel.app')
  );
};

const isLocalAdmin = () => window.location.hostname === 'localhost';

export const resolveImageUrl = (image) => {
  if (!image) return null;
  let url = null;
  if (typeof image === 'string') url = image;
  else if (typeof image === 'object') url = image.url || image.image || image.public_id || null;
  if (!url) return null;

  const frontend = getBaseFrontend();
  const api = getBaseApi();

  const isAsset = url.includes('/assets/') || url.includes('/uploads/');
  const isHttp = url.startsWith('http://') || url.startsWith('https://');

  if (isHttp) {
    if (isAsset && frontend && !isLocalAdmin()) {
      try {
        const u = new URL(url);
        return `${frontend}${u.pathname}${u.search}`;
      } catch (e) {
        return url;
      }
    }
    return url;
  }

  if (url.startsWith('/')) {
    if (!isLocalAdmin() && frontend) return `${frontend}${url}`;
    if (api) return `${api}${url}`;
    return url;
  }

  return url;
};

export default resolveImageUrl;
