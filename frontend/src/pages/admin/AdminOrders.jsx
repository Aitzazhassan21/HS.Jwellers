import { useState, useEffect } from "react";
import { MessageCircle, Edit, X } from "lucide-react";
import { toast } from "react-toastify";
import { orderAPI } from "../../services/api.js";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState("pending");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderAPI.getAll({ limit: 50 });
      const items = response.data?.orders || response.data?.data?.orders || [];
      setOrders(Array.isArray(items) ? items : []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setStatusUpdate(order.orderStatus || "pending");
    setDrawerOpen(true);
  };

  useEffect(() => {
    if (selectedOrder) {
      setStatusUpdate(selectedOrder.orderStatus || "pending");
    }
  }, [selectedOrder]);

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, { status });
      toast.success("Order status updated");
      loadOrders();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handlePaymentUpdate = async (orderId, paymentStatus) => {
    try {
      await orderAPI.markPaid(orderId);
      toast.success("Payment status updated");
      loadOrders();
    } catch {
      toast.error("Failed to update payment status");
    }
  };

  const getWhatsAppLink = (order) => {
    const phone = order.customerInfo?.phone || order.customer?.phone || order.shippingAddress?.phone;
    if (!phone) return null;
    const message = encodeURIComponent(`Regarding order ${order.orderNumber}`);
    return `https://wa.me/92${phone.replace(/^0/, "")}?text=${message}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      processing: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      paid: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getOrderCustomerName = (order) => order.customerInfo?.name || order.customer?.name || "Guest";
  const getOrderPhone = (order) => order.customerInfo?.phone || order.customer?.phone || order.shippingAddress?.phone || "-";
  const getOrderCNIC = (order) => order.customerInfo?.cnic || order.customer?.cnic || "N/A";
  const formatOrderTime = (date) =>
    new Date(date).toLocaleString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-playfair text-3xl text-text-dark mb-2">Orders</h1>
        <p className="text-text-muted text-sm font-inter">Review and update customer orders.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#debc65]/20 border-t-[#debc65] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#debc65]/20 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#FFFCF5] border-b border-[#debc65]/20">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Order #</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Customer</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Phone</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">CNIC</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Items</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Total</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Payment</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Order Time</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-[#debc65]/10 hover:bg-[#FFFCF5]/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1A1A1A]">{order.orderNumber}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-[#1A1A1A]">{getOrderCustomerName(order)}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1A1A1A]">{getOrderPhone(order)}</td>
                  <td className="px-4 py-3 text-sm text-[#1A1A1A]">{getOrderCNIC(order)}</td>
                  <td className="px-4 py-3 text-sm text-[#1A1A1A]">{order.items?.length || 0}</td>
                  <td className="px-4 py-3 text-sm font-medium text-[#debc65]">Rs {order.pricing?.total || order.total || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted">
                    {formatOrderTime(order.orderTime || order.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="p-2 text-[#1A1A2E] hover:bg-[#debc65]/10 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      {getWhatsAppLink(order) && (
                        <a
                          href={getWhatsAppLink(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <MessageCircle size={16} />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Detail Drawer */}
      {drawerOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex">
          <button
            type="button"
            className="fixed inset-0 bg-black/50"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative ml-auto h-full w-full max-w-[520px] bg-white shadow-xl overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#debc65]/20 px-6 py-4 flex items-center justify-between">
              <h2 className="font-playfair text-xl font-bold text-[#1A1A1A]">
                Order {selectedOrder.orderNumber}
              </h2>
              <button onClick={() => setDrawerOpen(false)} className="p-2 hover:bg-[#FFFCF5] rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-[#FFFCF5] rounded-xl p-4">
                <h3 className="font-semibold text-[#1A1A1A] mb-3">Customer Info</h3>
                <p className="font-medium text-[#1A1A1A]">{getOrderCustomerName(selectedOrder)}</p>
                <p className="text-sm text-text-muted">Phone: {getOrderPhone(selectedOrder)}</p>
                <p className="text-sm text-text-muted">CNIC: {getOrderCNIC(selectedOrder)}</p>
                <p className="text-sm text-text-muted">Order placed: {formatOrderTime(selectedOrder.orderTime || selectedOrder.createdAt)}</p>
              </div>

              <div className="bg-[#F9FAFB] rounded-xl p-4 border-l-4 border-[#debc65]">
                <h3 className="font-semibold text-[#1A1A1A] mb-3">Delivery Address</h3>
                <p className="text-sm text-[#1A1A1A]">{selectedOrder.shippingAddress?.address}</p>
                <p className="text-sm text-[#1A1A1A]">{selectedOrder.shippingAddress?.city}</p>
                <p className="text-sm text-[#1A1A1A]">{selectedOrder.shippingAddress?.province}</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1A1A1A] mb-3">Items Ordered</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={item.product?._id || item.name || index} className="flex items-center gap-3 border-b border-[#debc65]/10 pb-3">
                      <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                        <img
                          src={item.image || item.product?.images?.[0]?.url}
                          alt={item.name || item.product?.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#1A1A1A]">{item.product?.name || item.name}</p>
                        <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-[#debc65]">Rs {item.price * item.quantity}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#debc65]/10 pt-4">
                  <p className="font-semibold text-[#1A1A1A]">Total</p>
                  <p className="font-semibold text-[#debc65]">Rs {selectedOrder.pricing?.total || selectedOrder.total || 0}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="statusUpdate" className="block text-sm font-medium text-[#1A1A1A] mb-2">Update Status</label>
                  <select
                    id="statusUpdate"
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value)}
                    className="w-full rounded-xl border border-[#debc65]/30 px-4 py-3 text-sm focus:border-[#debc65] focus:ring-[#debc65]/20"
                  >
                    {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => handleStatusUpdate(selectedOrder._id, statusUpdate)}
                  className="w-full rounded-[30px] bg-[#1A1A2E] text-[#debc65] px-4 py-3 font-semibold hover:bg-[#172037] transition-colors"
                >
                  Update
                </button>
                {selectedOrder.paymentStatus !== "paid" && (
                  <button
                    onClick={() => handlePaymentUpdate(selectedOrder._id)}
                    className="w-full rounded-[30px] bg-[#1A1A2E] text-[#debc65] px-4 py-3 font-semibold hover:bg-[#172037] transition-colors"
                  >
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
