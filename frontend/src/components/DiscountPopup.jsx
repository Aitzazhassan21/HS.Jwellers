import React, { useState } from 'react';
import { X, Gift, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getApiBaseUrl } from '../utils/apiConfig.js';

const DiscountPopup = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [email, setEmail] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(`${getApiBaseUrl()}/api/coupons/claim`, { email });
      if (response.data.success) {
        setCouponCode(response.data.couponCode);
        setShowSuccess(true);
        toast.success(response.data.message);
      }
    } catch (error) {
      console.error('Error claiming coupon:', error);
      toast.error('Error claiming coupon. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>

        {!showSuccess ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-4 rounded-full">
                <Gift size={32} className="text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 text-center mb-2">
              10% OFF YOUR FIRST ORDER
            </h3>
            <p className="text-slate-500 text-center mb-6">
              Yes Please! Enter your email to unlock your discount
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Unlocking...' : 'Unlock My Discount!'}
              </button>
            </form>

            <p className="text-xs text-slate-400 text-center mt-4">
              By entering your email, you agree to receive promotional emails
            </p>
          </>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-full">
                <CheckCircle size={32} className="text-green-600" />
              </div>
            </div>

            <h3 className="text-2xl font-black text-slate-900 mb-2">
              THANKS FOR SIGNING UP!
            </h3>
            <p className="text-slate-500 mb-6">
              As a thank you — you'll find a 10% discount in your inbox. 💎 Check your email to unlock it!
            </p>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-2xl mb-6">
              <p className="text-white text-sm font-medium mb-2">Your Coupon Code:</p>
              <p className="text-white text-3xl font-black tracking-wider">{couponCode}</p>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscountPopup;
