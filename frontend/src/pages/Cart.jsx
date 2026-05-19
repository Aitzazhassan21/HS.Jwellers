import { Link, useNavigate } from "react-router-dom";
import useCart from "../hooks/useCart.js";
import CartItem from "../components/cart/CartItem.jsx";
import CartSummary from "../components/cart/CartSummary.jsx";

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQty, removeItem, subtotal, shipping, total } = useCart();
  const isCartEmpty = items.length === 0;

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-16 pt-[120px] lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-text-dark">Your Cart</h1>
          <p className="mt-1 text-sm text-text-muted">Review your selected items before checkout.</p>
        </div>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("open-cart-drawer"))}
          className="rounded-full border border-border px-4 py-2 text-sm text-text-dark transition-colors hover:border-[#debc65] hover:text-[#debc65]"
        >
          Open Drawer
        </button>
      </div>

      {isCartEmpty ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-border bg-[#FFF8E7] text-center">
          <p className="text-lg font-semibold text-text-dark">Your cart is empty</p>
          <p className="mt-2 text-sm text-text-muted">Add some jewellery pieces to proceed.</p>
          <Link
            to="/collection"
            className="mt-5 rounded-full bg-[#debc65] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            {items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onIncrease={() => updateQty(item.productId, item.quantity + 1)}
                onDecrease={() => updateQty(item.productId, item.quantity - 1)}
                onRemove={() => removeItem(item.productId)}
              />
            ))}
          </div>

          <div className="lg:sticky lg:top-[95px] lg:self-start">
            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              checkoutHref="/checkout"
              onCheckout={() => navigate("/checkout")}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
