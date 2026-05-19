import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'

const Orders = () => {

  const { currency, backendUrl } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className='px-4 sm:px-[2vw] md:px-[3vw] lg:px-[4vw] pt-16 border-t min-h-[60vh] flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800'></div>
      </div>
    );
  }

  return (
    <div className='px-4 sm:px-[2vw] md:px-[3vw] lg:px-[4vw] pt-16 border-t min-h-[60vh]'>
      <div className='text-2xl mb-8'>
        <Title text1={'YOUR'} text2={'ORDERS'} />
      </div>
      {orders.length === 0 ? (
        <div className='text-center py-20 text-gray-500'>
          <p className='text-lg'>No orders found</p>
          <p className='text-sm mt-2'>Place an order to see it here</p>
        </div>
      ) : (
        <div className='space-y-6'>
          {orders.map((order, index) => (
            <div key={index} className='bg-white rounded-xl border border-gray-200 p-6 shadow-sm'>
              <div className='flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-gray-100 pb-4'>
                <div>
                  <p className='text-sm text-gray-500'>Order #{order._id}</p>
                  <p className='text-xs text-gray-400 mt-1'>
                    {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className='mt-2 md:mt-0 flex items-center gap-2'>
                  <span className={`h-2 w-2 rounded-full ${
                    order.status === 'Delivered' ? 'bg-emerald-500' :
                    order.status === 'Shipped' ? 'bg-blue-500' :
                    'bg-amber-500'
                  }`}></span>
                  <span className='text-sm font-medium text-gray-700'>{order.status || 'Order Placed'}</span>
                </div>
              </div>

              <div className='space-y-4'>
                {order.items.map((item, i) => (
                  <div key={i} className='flex items-start gap-4'>
                    {item.image ? (
                      <img className='w-16 sm:w-20 rounded-lg object-cover' src={item.image} alt={item.name} />
                    ) : (
                      <div className='w-16 sm:w-20 h-16 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs'>No Image</div>
                    )}
                    <div className='flex-1'>
                      <p className='font-medium text-gray-800'>{item.name}</p>
                      <p className='text-sm text-gray-500 mt-1'>Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <div>
                  <p className='text-sm text-gray-500'>Total Amount</p>
                  <p className='text-xl font-bold text-gray-900'>{currency}&nbsp;{order.amount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className='text-right'>
                  <p className='text-xs text-gray-400 mb-1'>Payment: {order.paymentMethod || 'COD'}</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                    order.payment ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    {order.payment ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
