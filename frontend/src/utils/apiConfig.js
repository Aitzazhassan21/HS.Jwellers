export const getApiBaseUrl = () => {
  return import.meta.env.VITE_API_URL?.trim() || import.meta.env.VITE_BACKEND_URL?.trim() || "http://localhost:5000";
};
