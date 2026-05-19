import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import formatPKR from "../../utils/formatPKR.js";

const CartSummary = ({ subtotal, shipping, total, checkoutHref = "/checkout", compact = false, onCheckout }) => {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <h3 className="font-playfair text-xl font-bold text-text-dark">Order Summary</h3>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between text-text-muted">
          <span>Subtotal</span>
          <span>{formatPKR(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-text-muted">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : formatPKR(shipping)}</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-border pt-3 text-base font-semibold text-[#debc65]">
          <span>Total</span>
          <span>{formatPKR(total)}</span>
        </div>
      </div>

      {compact ? (
        <button
          type="button"
          onClick={onCheckout}
          className="mt-4 w-full rounded-full bg-[#debc65] px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Proceed to Checkout
        </button>
      ) : (
        <Link
          to={checkoutHref}
          onClick={onCheckout}
          className="mt-4 block w-full rounded-full bg-[#debc65] px-5 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Proceed to Checkout
        </Link>
      )}
    </div>
  );
};

CartSummary.propTypes = {
  subtotal: PropTypes.number.isRequired,
  shipping: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  checkoutHref: PropTypes.string,
  compact: PropTypes.bool,
  onCheckout: PropTypes.func,
};

export default CartSummary;
