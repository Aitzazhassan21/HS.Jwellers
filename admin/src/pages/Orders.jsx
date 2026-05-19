import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../config'
import { toast } from 'react-toastify'
import { Package, Truck, CheckCircle, Clock, Search, Filter } from 'lucide-react'

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return null;
    try {
      const response = await axios.get(backendUrl + '/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      if (response.data.success) {
        setOrders(response.data.orders.slice().reverse())
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const statusHandler = async (event, orderId) => {
    try {
      const newStatus = event.target.value;
      const response = await axios.patch(backendUrl + `/api/orders/${orderId}/status`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } })
      if (response.data.success) {
        await fetchAllOrders()
        toast.success("Order status updated");
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchAllOrders()
  }, [token])

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Orders Management</h1>
          <p className="text-slate-500 font-medium">Manage and track all customer orders from one place.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 shadow-sm"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <Filter size={18} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order, index) => (
          <div key={index} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6 md:p-8 flex flex-col lg:flex-row gap-8">
              {/* Order Icon */}
              <div className="hidden md:flex items-center justify-center w-16 h-16 bg-slate-50 rounded-2xl">
                <Package size={32} className="text-blue-600" />
              </div>

              {/* Order Details */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <h3 className="text-lg font-black text-slate-900">Order #{order._id}</h3>
                  <span className={`px-4 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${
                    order.orderStatus === 'delivered' ? 'bg-emerald-50 text-emerald-600' :
                    order.orderStatus === 'shipped' ? 'bg-blue-50 text-blue-600' :
                    'bg-amber-50 text-amber-600'
                  }`}>
                    {order.orderStatus === 'delivered' && <CheckCircle size={14} />}
                    {order.orderStatus === 'shipped' && <Truck size={14} />}
                    {order.orderStatus === 'processing' && <Clock size={14} />}
                    {order.orderStatus || order.status}
                  </span>
                  <span className="text-slate-400 text-sm font-medium">{new Date(order.orderTime || order.createdAt || order.date).toLocaleDateString('en-GB')}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Items */}
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Order Items</p>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-slate-700 font-bold text-sm">
                          {item.name} <span className="text-blue-600">x {item.quantity}</span>
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* Customer & Address */}
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Customer Details</p>
                    {(() => {
                      const address = order.shippingAddress || order.address || {};
                      const fullName =
                        address.fullName ||
                        [address.firstName, address.lastName].filter(Boolean).join(" ") ||
                        order.customerInfo?.name ||
                        order.guestInfo?.name ||
                        "Customer";
                      const location = [address.street || address.address, address.city, address.postalCode || address.zipCode]
                        .filter(Boolean)
                        .join(", ");
                      return (
                        <>
                          <p className="font-bold text-slate-900">{fullName}</p>
                          <p className="text-slate-500 text-sm">{location || "Address not provided"}</p>
                        </>
                      );
                    })()}
                  </div>

                  {/* Payment Info */}
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Payment Details</p>
                    <p className="font-black text-slate-900 text-lg">Rs {(order.pricing?.total ?? order.amount ?? 0).toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-600">{order.paymentMethod}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${order.payment ? 'bg-emerald-50 text-emerald-600' : 'bg-[#FFF8E7] text-[#B48A2B]'}`}>
                        {order.payment ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Update Action */}
              <div className="lg:w-48 flex flex-col justify-center gap-3 border-t lg:border-t-0 lg:border-l border-slate-50 pt-6 lg:pt-0 lg:pl-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Update Status</p>
                <select 
                  onChange={(e) => statusHandler(e, order._id)} 
                  value={order.orderStatus || order.status}
                  className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders
