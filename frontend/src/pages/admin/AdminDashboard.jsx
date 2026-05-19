import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DollarSign, ShoppingCart, Package, Users, Mail, Trash2 } from "lucide-react";
import { adminAPI } from "../../services/api.js";
import { toast } from "react-toastify";

const statusColors = {
  pending: "#FBBF24",
  confirmed: "#38BDF8",
  shipped: "#A855F7",
  delivered: "#22C55E",
  cancelled: "#F87171",
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newsletterEmails, setNewsletterEmails] = useState([]);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  useEffect(() => {
    loadStats();
    loadNewsletterEmails();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data?.stats || response.data?.data?.stats || null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  const loadNewsletterEmails = async () => {
    setNewsletterLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://hsjewelsapi.vercel.app'}/api/newsletter/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setNewsletterEmails(data.subscribers || []);
      }
    } catch (error) {
      console.error('Failed to load newsletter emails:', error);
    } finally {
      setNewsletterLoading(false);
    }
  };

  const deleteNewsletterEmail = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://hsjewelsapi.vercel.app'}/api/newsletter/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Subscriber removed successfully');
        loadNewsletterEmails();
      } else {
        toast.error(data.message || 'Failed to remove subscriber');
      }
    } catch (error) {
      console.error('Failed to delete newsletter email:', error);
      toast.error('Failed to remove subscriber');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#debc65]/20 border-t-[#debc65] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 text-text-muted">
        Unable to load dashboard data.
      </div>
    );
  }

  const revenueData = stats.revenueByMonth || [];
  const ordersByStatus = stats.ordersByStatus || [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-playfair text-3xl text-text-dark mb-2">Dashboard</h1>
        <p className="text-text-muted text-sm font-inter">Business analytics for orders, revenue, and inventory.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-8">
        <div className="rounded-3xl border border-[#debc65]/20 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-2xl bg-[#FFF7EB] p-3 text-[#DEBC65]">
              <DollarSign size={22} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#DEBC65]">Total Revenue</span>
          </div>
          <div>
            <p className="text-3xl font-semibold text-[#1A1A2E]">Rs {stats.totalRevenue?.toLocaleString() || 0}</p>
            <p className="text-sm text-text-muted mt-2">Revenue from paid and active orders</p>
          </div>
        </div>

        <div className="rounded-3xl border border-[#debc65]/20 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-2xl bg-[#EFF6FF] p-3 text-[#2563EB]">
              <ShoppingCart size={22} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#2563EB]">Total Orders</span>
          </div>
          <div>
            <p className="text-3xl font-semibold text-[#1A1A2E]">{stats.totalOrders || 0}</p>
            <p className="text-sm text-text-muted mt-2">All orders in the system</p>
          </div>
        </div>

        <div className="rounded-3xl border border-[#debc65]/20 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-2xl bg-[#E2E8F0] p-3 text-[#1A1A2E]">
              <Package size={22} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#1A1A2E]">Total Products</span>
          </div>
          <div>
            <p className="text-3xl font-semibold text-[#1A1A2E]">{stats.totalProducts || 0}</p>
            <p className="text-sm text-text-muted mt-2">Active products available for sale</p>
          </div>
        </div>

        <div className="rounded-3xl border border-[#debc65]/20 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-2xl bg-[#ECFDF5] p-3 text-[#16A34A]">
              <Users size={22} />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#16A34A]">Total Customers</span>
          </div>
          <div>
            <p className="text-3xl font-semibold text-[#1A1A2E]">{stats.totalCustomers || 0}</p>
            <p className="text-sm text-text-muted mt-2">Registered customers</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr] mb-8">
        <div className="rounded-3xl border border-[#debc65]/20 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[#1A1A2E]">Revenue last 6 months</h2>
              <p className="text-sm text-text-muted">Monthly sales totals from recent orders.</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip formatter={(value) => [`Rs ${value.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="#debc65" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-[#debc65]/20 bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#1A1A2E]">Orders by status</h2>
            <p className="text-sm text-text-muted">Distribution of current order statuses.</p>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={52}
                  outerRadius={90}
                  paddingAngle={4}
                >
                  {ordersByStatus.map((entry) => (
                    <Cell key={entry.status} fill={statusColors[entry.status] || "#CBD5E1"} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-[#debc65]/20 bg-white p-6 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[#EFF6FF] p-3 text-[#2563EB]">
              <Mail size={22} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1A1A2E]">Newsletter Subscribers</h2>
              <p className="text-sm text-text-muted">Email addresses subscribed to exclusive offers</p>
            </div>
          </div>
          <span className="text-sm font-semibold text-[#debc65]">{newsletterEmails.length} Subscribers</span>
        </div>

        {newsletterLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#debc65]/20 border-t-[#debc65] rounded-full animate-spin"></div>
          </div>
        ) : newsletterEmails.length === 0 ? (
          <div className="text-center py-12 text-text-muted">
            <p>No subscribers yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A1A2E]">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#1A1A2E]">Subscribed At</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-[#1A1A2E]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsletterEmails.map((subscriber) => (
                  <tr key={subscriber._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-[#1A1A2E]">{subscriber.email}</td>
                    <td className="py-3 px-4 text-sm text-text-muted">
                      {new Date(subscriber.subscribedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteNewsletterEmail(subscriber._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Remove subscriber"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
