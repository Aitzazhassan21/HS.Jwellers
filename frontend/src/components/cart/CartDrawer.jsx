import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import useCart from "../../hooks/useCart.js";
import CartItem from "./CartItem.jsx";
import CartSummary from "./CartSummary.jsx";

const OPEN_EVENT = "open-cart-drawer";
const CLOSE_EVENT = "close-cart-drawer";

const CartDrawer = () => {
  const [open, setOpen] = useState(false);
  const { items, updateQty, removeItem, subtotal, shipping, total } = useCart();

  const hasItems = items.length > 0;
  const itemList = useMemo(() => items, [items]);

  useEffect(() => {
    const openDrawer = () => setOpen(true);
    const closeDrawer = () => setOpen(false);

    window.addEventListener(OPEN_EVENT, openDrawer);
    window.addEventListener(CLOSE_EVENT, closeDrawer);

    return () => {
      window.removeEventListener(OPEN_EVENT, openDrawer);
      window.removeEventListener(CLOSE_EVENT, closeDrawer);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-[80] bg-black/40 transition-opacity ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed right-0 top-0 z-[90] h-full w-full max-w-[420px] border-l border-border bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-[70px] items-center justify-between border-b border-border px-5">
          <h2 className="font-playfair text-xl font-bold text-text-dark">Your Cart</h2>
          <button type="button" onClick={close} className="text-text-muted transition-colors hover:text-[#debc65]">
            <X size={20} />
          </button>
        </div>

        <div className="flex h-[calc(100%-70px)] flex-col">
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {hasItems ? (
              itemList.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onIncrease={() => updateQty(item.productId, item.quantity + 1)}
                  onDecrease={() => updateQty(item.productId, item.quantity - 1)}
                  onRemove={() => removeItem(item.productId)}
                />
              ))
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl border border-border bg-[#FFF8E7] p-6 text-center">
                <p className="text-sm font-medium text-text-dark">Your cart is empty</p>
                <p className="mt-1 text-xs text-text-muted">Add products to continue checkout</p>
                <Link
                  to="/collection"
                  onClick={close}
                  className="mt-4 rounded-full bg-[#debc65] px-5 py-2 text-xs font-semibold text-white"
                >
                  Start Shopping
                </Link>
              </div>
            )}
          </div>

          <div className="border-t border-border p-4">
            <CartSummary subtotal={subtotal} shipping={shipping} total={total} onCheckout={close} />
            <Link
              to="/cart"
              onClick={close}
              className="mt-3 block text-center text-sm font-medium text-[#debc65] hover:underline"
            >
              View Full Cart
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
};

export default CartDrawer;
