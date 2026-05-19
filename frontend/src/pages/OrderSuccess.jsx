import { Link, useLocation } from "react-router-dom";

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;
  const phone = order?.shippingAddress?.phone || order?.customerInfo?.phone || "your phone number";

  return (
    <div className="max-w-lg mx-auto px-4 pt-28 pb-16 text-center">
      <h1 className="font-playfair text-3xl text-text-dark mb-4">Thank you!</h1>
      <p className="text-text-muted font-poppins mb-4">
        📞 Our team will call you at {phone} to confirm your order before dispatching.
      </p>
      <p className="text-text-muted font-poppins mb-4">🚚 Estimated delivery: 3-5 working days</p>
      <p className="text-text-muted font-poppins mb-8">📦 Free delivery on orders above Rs. 2,000</p>
      <Link
        to="/my-orders"
        className="inline-block px-8 py-3 rounded-full bg-[#debc65] text-white text-sm font-inter font-medium"
      >
        View my orders
      </Link>
    </div>
  );
};

export default OrderSuccess;

