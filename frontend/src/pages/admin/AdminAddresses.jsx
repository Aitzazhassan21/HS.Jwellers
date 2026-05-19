import { useState, useEffect } from "react";
import { Download, Search, X } from "lucide-react";
import { toast } from "react-toastify";
import { orderAPI } from "../../services/api.js";

const AdminAddresses = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [orders, searchQuery, cityFilter, provinceFilter, startDate, endDate]);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getAll({ limit: 200 });
      const items = response.data?.orders || response.data?.data?.orders || [];
      setOrders(Array.isArray(items) ? items : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let items = [...orders];
    const query = searchQuery.trim().toLowerCase();

    if (query) {
      items = items.filter((order) => {
        const customerName = order.customerInfo?.name || order.customer?.name || "";
        const customerPhone = order.customerInfo?.phone || order.customer?.phone || order.shippingAddress?.phone || "";
        return (
          customerName.toLowerCase().includes(query) ||
          customerPhone.toLowerCase().includes(query)
        );
      });
    }

    if (cityFilter) {
      items = items.filter(
        (order) => order.shippingAddress?.city === cityFilter
      );
    }

    if (provinceFilter) {
      items = items.filter(
        (order) => order.shippingAddress?.province === provinceFilter
      );
    }

    if (startDate) {
      const start = new Date(startDate);
      items = items.filter((order) => {
        const orderDate = new Date(order.orderTime || order.createdAt);
        return orderDate >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      items = items.filter((order) => {
        const orderDate = new Date(order.orderTime || order.createdAt);
        return orderDate <= end;
      });
    }

    setFilteredOrders(items);
  }; 

  const uniqueCities = Array.from(
    new Set(
      orders
        .map((order) => order.shippingAddress?.city)
        .filter(Boolean)
    )
  );

  const uniqueProvinces = Array.from(
    new Set(
      orders
        .map((order) => order.shippingAddress?.province)
        .filter(Boolean)
    )
  );

  const formatOrderDate = (value) =>
    new Date(value).toLocaleString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const exportCSV = () => {
    const headers = [
      "Name",
      "Phone",
      "CNIC",
      "Address",
      "City",
      "Province",
      "Order#",
      "Date",
      "Status",
    ];

    const rows = filteredOrders.map((order) => [
      order.customerInfo?.name || order.customer?.name || "Guest",
      order.customerInfo?.phone || order.customer?.phone || order.shippingAddress?.phone || "",
      order.customerInfo?.cnic || order.customer?.cnic || "N/A",
      order.shippingAddress?.address || "",
      order.shippingAddress?.city || "",
      order.shippingAddress?.province || "",
      order.orderNumber || "",
      new Date(order.orderTime || order.createdAt).toLocaleDateString(),
      order.orderStatus || order.status || "pending",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hs-glamour-addresses.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRowClick = (order) => {
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-playfair text-3xl text-text-dark mb-2">Addresses</h1>
            <p className="text-text-muted text-sm font-inter">
              All delivery addresses collected from orders.
            </p>
          </div>
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-[30px] bg-[#1A1A2E] px-4 py-3 text-[#debc65] font-semibold hover:bg-[#172037] transition-colors"
          >
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_auto] mb-6">
        <div className="rounded-xl border border-[#debc65]/20 bg-white p-4 flex items-center gap-3">
          <Search size={18} className="text-[#1A1A2E]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or phone"
            className="w-full border-0 bg-transparent text-sm text-[#1A1A1A] focus:outline-none"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="rounded-xl border border-[#debc65]/30 bg-white px-4 py-3 text-sm focus:border-[#debc65] focus:ring-[#debc65]/20"
          >
            <option value="">Filter by city</option>
            {uniqueCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <select
            value={provinceFilter}
            onChange={(e) => setProvinceFilter(e.target.value)}
            className="rounded-xl border border-[#debc65]/30 bg-white px-4 py-3 text-sm focus:border-[#debc65] focus:ring-[#debc65]/20"
          >
            <option value="">Filter by province</option>
            {uniqueProvinces.map((province) => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-xl border border-[#debc65]/30 bg-white px-4 py-3 text-sm focus:border-[#debc65] focus:ring-[#debc65]/20"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-xl border border-[#debc65]/30 bg-white px-4 py-3 text-sm focus:border-[#debc65] focus:ring-[#debc65]/20"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#debc65]/20 border-t-[#debc65] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#debc65]/20 bg-white">
          <table className="w-full min-w-[1000px] table-auto">
            <thead className="bg-[#FFFCF5] border-b border-[#debc65]/20">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A1A1A]">#</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A1A1A]">Customer Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A1A1A]">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A1A1A]">CNIC</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A1A1A]">Address</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A1A1A]">City</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A1A1A]">Province</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A1A1A]">Order #</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A1A1A]">Order Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-[#1A1A1A]">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order)}
                  className="cursor-pointer border-b border-[#debc65]/10 hover:bg-[#FFFCF5]/50"
                >
                  <td className="px-4 py-3 text-sm text-text-muted">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-[#1A1A1A]">
                    {order.customerInfo?.name || order.customer?.name || "Guest"}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1A1A1A]">
                    {order.customerInfo?.phone || order.customer?.phone || order.shippingAddress?.phone || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1A1A1A]">
                    {order.customerInfo?.cnic || order.customer?.cnic || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1A1A1A]">
                    {order.shippingAddress?.address || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1A1A1A]">{order.shippingAddress?.city || "-"}</td>
                  <td className="px-4 py-3 text-sm text-[#1A1A1A]">{order.shippingAddress?.province || "-"}</td>
                  <td className="px-4 py-3 text-sm text-[#1A1A1A]">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-sm text-text-muted">
                    {formatOrderDate(order.orderTime || order.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex rounded-full bg-[#debc65]/10 px-2.5 py-1 text-xs font-semibold text-[#debc65]">
                      {order.orderStatus || order.status || "pending"}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-sm text-text-muted">
                    No addresses found with current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {drawerOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            className="fixed inset-0 bg-black/50"
            onClick={closeDrawer}
          />
          <div className="relative ml-auto h-full w-full max-w-[520px] bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#debc65]/20 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="font-playfair text-xl font-bold text-[#1A1A1A]">Address detail</h2>
                <p className="text-sm text-text-muted">Order {selectedOrder.orderNumber}</p>
              </div>
              <button
                type="button"
                onClick={closeDrawer}
                className="p-2 hover:bg-[#FFFCF5] rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="bg-[#F9FAFB] rounded-xl p-4 border-l-4 border-[#debc65]">
                <h3 className="font-semibold text-[#1A1A1A] mb-3">Customer</h3>
                <p className="text-sm text-[#1A1A1A]">{selectedOrder.customerInfo?.name || selectedOrder.customer?.name || "Guest"}</p>
                <p className="text-sm text-text-muted">Phone: {selectedOrder.customerInfo?.phone || selectedOrder.customer?.phone || selectedOrder.shippingAddress?.phone || "-"}</p>
                <p className="text-sm text-text-muted">CNIC: {selectedOrder.customerInfo?.cnic || selectedOrder.customer?.cnic || "N/A"}</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-xl p-4 border-l-4 border-[#debc65]">
                <h3 className="font-semibold text-[#1A1A1A] mb-3">Delivery Address</h3>
                <p className="text-sm text-[#1A1A1A]">{selectedOrder.shippingAddress?.address}</p>
                <p className="text-sm text-[#1A1A1A]">{selectedOrder.shippingAddress?.city}</p>
                <p className="text-sm text-[#1A1A1A]">{selectedOrder.shippingAddress?.province}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-[#debc65]/10">
                <p className="text-sm text-text-muted">Order Date</p>
                <p className="font-medium text-[#1A1A1A]">{formatOrderDate(selectedOrder.orderTime || selectedOrder.createdAt)}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-[#debc65]/10">
                <p className="text-sm text-text-muted">Status</p>
                <p className="font-medium text-[#debc65]">{selectedOrder.orderStatus || selectedOrder.status || "pending"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAddresses;
