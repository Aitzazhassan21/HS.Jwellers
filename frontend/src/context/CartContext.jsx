import PropTypes from "prop-types";
import { createContext, useState, useEffect, useCallback } from "react";

export const CartContext = createContext();

const CART_KEY = "anonjewels_cart";

const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product._id);
      const unitPrice = product.discountPrice || product.price;

      if (existing) {
        return prev.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + quantity, subtotal: item.price * (item.quantity + quantity) }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          image: product.images?.[0]?.url || "",
          price: unitPrice,
          originalPrice: product.price,
          quantity,
          subtotal: unitPrice * quantity,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const updateQty = useCallback((productId, quantity) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity, subtotal: item.price * quantity }
          : item
      )
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const shipping = subtotal >= 2000 || subtotal === 0 ? 0 : 200;
  const total = subtotal + shipping;

  const getCartCount = useCallback(() => totalItems, [totalItems]);
  const getCartSubtotal = useCallback(() => subtotal, [subtotal]);
  const getShippingFee = useCallback(() => shipping, [shipping]);
  const getCartTotal = useCallback(() => total, [total]);

  const value = {
    items,
    totalItems,
    subtotal,
    shipping,
    total,
    addItem,
    removeItem,
    updateQty,
    clear,
    cartItems: items,
    addToCart: addItem,
    removeFromCart: removeItem,
    updateQuantity: updateQty,
    clearCart: clear,
    getCartCount,
    getCartSubtotal,
    getShippingFee,
    getCartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;
