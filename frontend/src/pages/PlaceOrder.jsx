import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, products, cartItems, getCartAmount, delivery_fee, setCartItems } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChangeHandler = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    // Build items array from cart
    const items = [];
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        if (cartItems[productId][size] > 0) {
          const product = products.find(p => p._id === productId);
          if (product) {
            items.push({
              name: product.name,
              quantity: cartItems[productId][size],
              size,
              price: product.price,
              image: product.image[0]
            });
          }
        }
      }
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const amount = getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee;

    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${backendUrl}/api/order/place`,
        {
          items,
          amount,
          address: formData,
          paymentMethod: method === 'cod' ? 'COD' : method
        },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success('Order placed successfully!');
        setCartItems({});
        localStorage.removeItem('cartItems');
        navigate('/orders');
      } else {
        toast.error(response.data.message || 'Failed to place order');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className='px-4 sm:px-[2vw] md:px-[3vw] lg:px-[4vw] flex flex-col justify-between gap-4 pt-5 sm:flex-row sm:pt-14 min-h-[80vh] border-t'>
      {/* Left Side Content */}
      <div className='flex flex-col w-full gap-4 sm:max-w-[480px]'>
        <div className='my-3 text-xl sm:text-2xl'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>
        <div className='flex gap-3'>
          <input
            required
            name='firstName'
            value={formData.firstName}
            onChange={onChangeHandler}
            className='w-full px-4 py-2 border border-gray-300 rounded'
            type="text"
            placeholder='First Name'
          />
          <input
            required
            name='lastName'
            value={formData.lastName}
            onChange={onChangeHandler}
            className='w-full px-4 py-2 border border-gray-300 rounded'
            type="text"
            placeholder='Last Name'
          />
        </div>
        <input
          required
          name='email'
          value={formData.email}
          onChange={onChangeHandler}
          className='w-full px-4 py-2 border border-gray-300 rounded'
          type="email"
          placeholder='Email Address'
        />
        <input
          required
          name='street'
          value={formData.street}
          onChange={onChangeHandler}
          className='w-full px-4 py-2 border border-gray-300 rounded'
          type="text"
          placeholder='Street'
        />
        <div className='flex gap-3'>
          <input
            required
            name='city'
            value={formData.city}
            onChange={onChangeHandler}
            className='w-full px-4 py-2 border border-gray-300 rounded'
            type="text"
            placeholder='City'
          />
          <input
            required
            name='state'
            value={formData.state}
            onChange={onChangeHandler}
            className='w-full px-4 py-2 border border-gray-300 rounded'
            type="text"
            placeholder='State'
          />
        </div>
        <div className='flex gap-3'>
          <input
            required
            name='zipCode'
            value={formData.zipCode}
            onChange={onChangeHandler}
            className='w-full px-4 py-2 border border-gray-300 rounded'
            type="text"
            placeholder='Zip Code'
          />
          <input
            required
            name='country'
            value={formData.country}
            onChange={onChangeHandler}
            className='w-full px-4 py-2 border border-gray-300 rounded'
            type="text"
            placeholder='Country'
          />
        </div>
        <input
          required
          name='phone'
          value={formData.phone}
          onChange={onChangeHandler}
          className='w-full px-4 py-2 border border-gray-300 rounded'
          type="text"
          placeholder='Mobile'
        />
      </div>
      {/* Right Side Content */}
      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        {/* Payment Methods Selection */}
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHODS'} />
          <div className='flex flex-col gap-3 lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-green-600' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="Stripe" />
            </div>
            <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? 'bg-green-600' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="RazorPay" />
            </div>
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 p-2 px-3 border cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-green-600' : ''}`}></p>
              <p className='mx-4 text-sm font-medium text-gray-500'>CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full mt-8 text-end'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='px-16 py-3 text-sm text-white bg-black active:bg-gray-800 disabled:opacity-60'
            >
              {isSubmitting ? 'PLACING ORDER...' : 'PLACE ORDER'}
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
