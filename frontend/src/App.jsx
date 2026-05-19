import { Route, Routes, useLocation } from "react-router-dom";
import { useContext } from "react";
import Home from "./pages/Home";
import useScrollToTop from "./hooks/useScrollToTop";
import Collection from "./pages/Collection";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CategoryPage from "./pages/CategoryPage";
import AntiqueTimeline from "./pages/AntiqueTimeline";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccess from "./pages/OrderSuccess";
import ProfilePage from "./pages/ProfilePage";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminAddresses from "./pages/admin/AdminAddresses";
import NavBar from "./components/NavBar";
import CartDrawer from "./components/cart/CartDrawer";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import AnnouncementBar from "./components/AnnouncementBar";
import WhatsAppButton from "./components/WhatsAppButton";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import { ShopContext } from "./context/ShopContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { pathname } = useLocation();
  const { backendOnline, backendChecking, backendUrl } = useContext(ShopContext);
  const hidePublicNav = pathname.startsWith("/admin");

  useScrollToTop();

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      {!hidePublicNav && !backendChecking && !backendOnline && (
        <div className="bg-primary text-white text-center py-3 px-4 font-semibold">
          Backend is offline. Please start the backend server at <span className="font-mono">{backendUrl}</span> and refresh the page.
        </div>
      )}
      {!hidePublicNav && <AnnouncementBar />}
      {!hidePublicNav && <NavBar />}
      <CartDrawer />
      <SearchBar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/category/:categorySlug" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/antique-timeline" element={<AntiqueTimeline />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccess />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-orders" element={<MyOrders />} />
          </Route>

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="addresses" element={<AdminAddresses />} />
              <Route path="contacts" element={<AdminContacts />} />
            </Route>
          </Route>
        </Routes>
      </div>
      {!hidePublicNav && <Footer />}
      <WhatsAppButton />
    </div>
  );
};

export default App;
