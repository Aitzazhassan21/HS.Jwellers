export const backendUrl = import.meta.env.VITE_BACKEND_URL?.trim() || "https://hsjewelsapi.vercel.app";

export const currency = (price) => {
  return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(price);
};
