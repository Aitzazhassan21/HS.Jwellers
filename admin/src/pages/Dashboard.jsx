import { useEffect, useState } from 'react';
import { 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package, 
  Mail,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye,
  Calendar
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { backendUrl } from '../config';

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentSubscribers, setRecentSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch Real Orders
      const ordersRes = await axios.get(`${backendUrl}/api/orders`, { headers: { Authorization: `Bearer ${token}` } });
      let orders = [];
      if (ordersRes.data.success) {
        orders = ordersRes.data.orders;
        setRecentOrders(orders.slice().reverse().slice(0, 5));
      }

      // Fetch Real Users
      const usersRes = await axios.get(`${backendUrl}/api/user/admin/list`, { headers: { Authorization: `Bearer ${token}` } });
      let usersCount = 0;
      if (usersRes.data.success) {
        const allUsers = usersRes.data.users;
        usersCount = allUsers.length;
        setRecentUsers(allUsers.slice().reverse().slice(0, 5));
        console.log("Dashboard Debug: Total Users from API:", usersCount);
        console.log("Dashboard Debug: Users Data:", allUsers);
      } else {
        console.log("Dashboard Debug: Users API failed:", usersRes.data.message);
      }

      // Fetch Real Products
      const productsRes = await axios.get(`${backendUrl}/api/products/admin/all`, { headers: { Authorization: `Bearer ${token}` } });
      let productsCount = 0;
      if (productsRes.data.success) {
        productsCount = productsRes.data.products.length;
      }

      // Fetch Newsletter Subscribers
      const newsletterRes = await axios.get(`${backendUrl}/api/newsletter/admin`, { headers: { Authorization: `Bearer ${token}` } });
      let subscribersCount = 0;
      if (newsletterRes.data.success) {
        const allSubscribers = newsletterRes.data.subscribers || [];
        subscribersCount = allSubscribers.length;
        setRecentSubscribers(allSubscribers.slice(0, 5));
      }

      // Calculate Total Revenue
      const revenue = orders.reduce((acc, order) => acc + (order.payment ? order.amount : 0), 0);

      setStats({
        totalRevenue: revenue,
        totalOrders: orders.length,
        totalUsers: usersCount,
        totalProducts: productsCount,
        totalSubscribers: subscribersCount
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const revenueData = [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 5000 },
    { name: 'Thu', revenue: 4500 },
    { name: 'Fri', revenue: 6000 },
    { name: 'Sat', revenue: 7000 },
    { name: 'Sun', revenue: 5500 },
  ];

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span>{trendValue}%</span>
        </div>
      </div>
      <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-black text-slate-900">{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Analytics Dashboard</h1>
          <p className="text-slate-500 font-medium">Monitoring your HS Jewels store's performance in real-time.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link 
            to="/add" 
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Plus size={20} strokeWidth={3} />
            Add New Product
          </Link>
          <Link 
            to="/products" 
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl shadow-sm transition-all active:scale-95"
          >
            <Eye size={20} />
            View All Products
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Revenue"
            value={`Rs ${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend="up"
            trendValue="12.5"
            color="bg-gradient-to-br from-blue-600 to-indigo-600"
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            trend="up"
            trendValue="8.2"
            color="bg-gradient-to-br from-emerald-500 to-teal-600"
          />
         
          <StatCard
            title="Inventory"
            value={stats.totalProducts}
            icon={Package}
            trend="down"
            trendValue="2.1"
            color="bg-gradient-to-br from-[#debc65] to-[#C9A84C]"
          />
          <StatCard
            title="Newsletter Subscribers"
            value={stats.totalSubscribers ?? 0}
            icon={Mail}
            trend="up"
            trendValue="9.4"
            color="bg-gradient-to-br from-sky-500 to-cyan-600"
        />
      </div>

      {/* Revenue Chart Section */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 mb-1">Revenue Performance</h2>
            <p className="text-sm text-slate-500 font-medium">Daily revenue insights for the current week</p>
          </div>
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button className="px-4 py-2 text-sm font-bold bg-white text-blue-600 rounded-lg shadow-sm">Weekly</button>
            <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">Monthly</button>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}}
                tickFormatter={(value) => `Rs ${value}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontWeight: 'bold', color: '#1e293b' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#2563eb" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#colorRev)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-8">
        {/* Recent Orders Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Recent Orders</h2>
            <Link to="/orders" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        {(() => {
                          const address = order.shippingAddress || order.address || {};
                          const fullName =
                            address.fullName ||
                            [address.firstName, address.lastName].filter(Boolean).join(" ") ||
                            order.customerInfo?.name ||
                            order.guestInfo?.name ||
                            "Customer";
                          return (
                            <>
                              <p className="font-bold text-slate-900">{fullName}</p>
                              <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                                <Calendar size={12} />
                                {new Date(order.orderTime || order.createdAt || order.date).toLocaleDateString('en-GB')}
                              </div>
                            </>
                          );
                        })()}
                      </td>
                      <td className="px-8 py-5 font-black text-slate-900">Rs {(order.pricing?.total ?? order.amount ?? 0).toLocaleString()}</td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                          order.status === 'Shipped' ? 'bg-blue-50 text-blue-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-8 py-10 text-center text-slate-500 font-medium">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Subscribers */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900">Recent Subscriber Emails</h2>
            <Link to="/newsletter" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                  <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Subscribed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentSubscribers.length > 0 ? (
                  recentSubscribers.map((subscriber) => (
                    <tr key={subscriber._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5 font-bold text-slate-900">{subscriber.email}</td>
                      <td className="px-8 py-5 text-slate-500 text-sm">
                        {new Date(subscriber.subscribedAt).toLocaleDateString('en-GB')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="px-8 py-10 text-center text-slate-500 font-medium">
                      No newsletter subscribers yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Recent Users Table */}
       
      </div>
    </div>
  );
};

export default Dashboard;
