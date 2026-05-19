export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_URL?.trim() || import.meta.env.VITE_BACKEND_URL?.trim() || "https://hsjewelsapi.vercel.app";
};
