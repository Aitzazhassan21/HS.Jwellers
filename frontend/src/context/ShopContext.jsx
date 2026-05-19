import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { products as staticProducts } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../utils/apiConfig.js";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [backendOnline, setBackendOnline] = useState(true);
  const [backendChecking, setBackendChecking] = useState(true);
  const navigate = useNavigate();

  const backendUrl = getApiBaseUrl();

  const currency = "Rs";
  const delivery_fee = 150;

  useEffect(() => {
    // INFO: Load cart items from localStorage when the component mounts
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCartItems) {
      setCartItems(storedCartItems);
    }
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setBackendChecking(true);
      try {
        const healthResponse = await axios.get(`${backendUrl}/api/health`);
        const healthy = Boolean(healthResponse.data?.success);
        setBackendOnline(healthy);

        if (!healthy) {
          setProducts(staticProducts);
          return;
        }

        const response = await axios.get(`${backendUrl}/api/products`);
        if (response.data?.success && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          setProducts(staticProducts);
        }
      } catch (error) {
        setBackendOnline(false);
        setProducts(staticProducts);
        toast.error("Backend is offline");
      } finally {
        setBackendChecking(false);
      }
    };

    loadProducts();
  }, [backendUrl]);

  useEffect(() => {
    // INFO: Save cart items to localStorage whenever cartItems changes
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Please Select a Size");
      return;
    } else {
      toast.success("Item Added To The Cart");
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          // INFO: Error Handling
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    if (quantity === 0) {
      const productData = products.find((product) => product._id === itemId);
      toast.success("Item Removed From The Cart");
    }

    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            if (itemInfo) {
              totalAmount += itemInfo.price * cartItems[items][item];
            }
          }
        } catch (error) {}
      }
    }
    return totalAmount;
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    backendUrl,
    backendOnline,
    backendChecking,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
