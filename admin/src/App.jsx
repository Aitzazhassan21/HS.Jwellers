import { useEffect, useState } from "react";
import axios from "axios";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import Dashboard from "./pages/Dashboard";
import Add from "./pages/Add";
import List from "./pages/List";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import { backendUrl } from "./config";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("adminToken") ? localStorage.getItem("adminToken") : ""
  );
  const [backendOnline, setBackendOnline] = useState(true);
  const [backendChecking, setBackendChecking] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const checkBackend = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/health`);
      setBackendOnline(Boolean(response.data?.success));
    } catch {
      setBackendOnline(false);
    } finally {
      setBackendChecking(false);
    }
  };

  useEffect(() => {
    checkBackend();
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("adminToken", token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem("adminToken");
      delete axios.defaults.headers.common.Authorization;
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-[#FFFCF5]">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      {backendChecking ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Checking backend...</h1>
            <p className="text-slate-500">Please wait while the admin dashboard connects to the API.</p>
          </div>
        </div>
      ) : !backendOnline ? (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-lg max-w-xl">
            <h1 className="text-3xl font-bold mb-4">Backend Offline</h1>
            <p className="text-slate-600 mb-6">
              The admin dashboard cannot connect to the backend server at <span className="font-mono">{backendUrl}</span>.
            </p>
            <button
              type="button"
              onClick={checkBackend}
              className="rounded-2xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-slate-800 transition"
            >
              Retry
            </button>
          </div>
        </div>
      ) : token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <AdminSidebar setToken={setToken} collapsed={sidebarCollapsed} />
          <div className={sidebarCollapsed ? 'ml-20' : 'ml-64'}>
            <AdminHeader collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
            <main className="p-8 pt-24">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard token={token} />} />
                <Route path="/products" element={<List token={token} />} />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/categories" element={<Categories token={token} />} />
                <Route path="/orders" element={<Orders token={token} />} />
                <Route path="/settings" element={<Settings token={token} />} />
              </Routes>
            </main>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
