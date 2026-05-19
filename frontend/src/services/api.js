import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://hsjewelsapi.vercel.app";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let pendingRequests = [];

const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

const setTokens = ({ accessToken, refreshToken }) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem("user");
};

const resolvePendingRequests = (token) => {
  pendingRequests.forEach((callback) => callback(token));
  pendingRequests = [];
};

const rejectPendingRequests = () => {
  pendingRequests = [];
};

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || originalRequest._retry || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        pendingRequests.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/refresh-token`, { refreshToken });
      const nextAccessToken = response.data?.accessToken;
      const nextRefreshToken = response.data?.refreshToken;

      if (!nextAccessToken) {
        throw new Error("Token refresh failed");
      }

      setTokens({ accessToken: nextAccessToken, refreshToken: nextRefreshToken });
      resolvePendingRequests(nextAccessToken);
      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      rejectPendingRequests();
      clearTokens();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export const authAPI = {
  register: (data) => api.post("/api/auth/register", data),
  login: (data) => api.post("/api/auth/login", data),
  refreshToken: (refreshToken) => api.post("/api/auth/refresh-token", { refreshToken }),
  getMe: () => api.get("/api/auth/me"),
  logout: (refreshToken) => api.post("/api/auth/logout", { refreshToken }),
};

export const productAPI = {
  getAll: (params) => api.get("/api/products", { params }),
  getFeatured: () => api.get("/api/products/featured"),
  getNewArrivals: () => api.get("/api/products/new-arrivals"),
  getBySlug: (slug) => api.get(`/api/products/${slug}`),
  getByCategory: (slug) => api.get(`/api/products/category/${slug}`),
  addReview: (id, data) => api.post(`/api/products/${id}/review`, data),
  // Admin
  getAllAdmin: (params) => api.get("/api/products/admin/all", { params }),
  create: (data) => api.post("/api/products", data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`),
};

export const categoryAPI = {
  getAll: (params) => api.get("/api/categories", { params }),
  getFeatured: () => api.get("/api/categories/featured"),
  getBySlug: (slug) => api.get(`/api/categories/${slug}`),
  // Admin
  create: (data) => api.post("/api/categories", data),
  update: (id, data) => api.put(`/api/categories/${id}`, data),
  delete: (id) => api.delete(`/api/categories/${id}`),
};

export const orderAPI = {
  create: (data) => api.post("/api/orders", data),
  place: (data) => api.post("/api/orders", data),
  getMyOrders: () => api.get("/api/orders/my-orders"),
  getById: (id) => api.get(`/api/orders/${id}`),
  cancel: (id) => api.patch(`/api/orders/${id}/cancel`),
  // Admin
  getAll: (params) => api.get("/api/orders", { params }),
  updateStatus: (id, data) => api.patch(`/api/orders/${id}/status`, data),
  markPaid: (id) => api.patch(`/api/orders/${id}/payment-status`, { paymentStatus: "paid" }),
};

export const contactAPI = {
  create: (data) => api.post("/api/contact", data),
  submit: (data) => api.post("/api/contact", data),
  // Admin
  getAll: (params) => api.get("/api/admin/contacts", { params }),
  getById: (id) => api.get(`/api/contact/${id}`),
  updateStatus: (id, data) => api.patch(`/api/contact/${id}/status`, data),
};

export const uploadAPI = {
  uploadImage: (formData) =>
    api.post("/api/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteImage: (public_id) => api.delete("/api/upload/image", { data: { public_id } }),
};

export const adminAPI = {
  getStats: () => api.get("/api/admin/stats"),
  getDashboard: () => api.get("/api/admin/dashboard"),
  getRevenueTrend: () => api.get("/api/admin/revenue-trend"),
  getOrderStatusBreakdown: () => api.get("/api/admin/order-status-breakdown"),
};

export const tokenStorage = {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
};

export default api;
