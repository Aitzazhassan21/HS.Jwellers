import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";
import useAuth from "../hooks/useAuth";
import useCart from "../hooks/useCart";
import logo from "../assets/logo.png";

const NAV_LINKS = [
  { label: "Necklace & Chain", to: "/category/necklace-and-chain" },
  { label: "Rings", to: "/category/rings" },
  { label: "Earrings", to: "/category/earrings" },
  { label: "Bracelets", to: "/category/bracelets" },
  { label: "Anklets", to: "/category/anklets" },
  { label: "Sale & Deals", to: "/category/sale" },
  { label: "Antique Timeline", to: "/antique-timeline" },
];

const NavBar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartCount } = useCart();

  const cartCount = getCartCount();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b-4 border-[#debc65] shadow-sm h-[70px]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img src={logo} alt="HS Logo" className="h-24 w-30" />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `nav-link text-[14px] font-inter font-medium text-gray-100 transition-colors ${
                    isActive ? "text-[#debc65]" : ""
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-4">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="hidden sm:block text-white hover:text-[#debc65] transition-colors"
          >
            <Heart size={22} strokeWidth={1.5} />
          </Link>

          {/* Cart */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("open-cart-drawer"))}
            className="relative text-white hover:text-[#debc65] transition-colors"
          >
            <ShoppingCart size={22} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#debc65] text-black text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* User / Account */}
          <div className="relative group hidden sm:block">
            {isAuthenticated ? (
              <button className="text-white hover:text-[#debc65] transition-colors">
                <User size={22} strokeWidth={1.5} />
              </button>
            ) : (
              <Link
                to="/login"
                className="text-white hover:text-[#debc65] transition-colors"
              >
                <User size={22} strokeWidth={1.5} />
              </Link>
            )}

            {/* Dropdown for logged-in users */}
            {isAuthenticated && (
              <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                <div className="bg-white border border-border rounded-lg shadow-lg py-2 w-[160px]">
                  <p className="px-4 py-2 text-sm text-text-dark font-medium border-b border-border">
                    {user?.name || "Account"}
                  </p>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-text-muted hover:text-primary hover:bg-[#FFF8E7] transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/my-orders"
                    className="block px-4 py-2 text-sm text-text-muted hover:text-primary hover:bg-[#FFF8E7] transition-colors"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-text-muted hover:text-primary hover:bg-[#FFF8E7] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-white hover:text-[#debc65] transition-colors"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Search bar overlay */}
      {searchOpen && (
        <div className="absolute top-[70px] left-0 right-0 bg-white border-b border-border shadow-lg px-4 py-4 animate-fade-in">
          <div className="max-w-[600px] mx-auto flex items-center gap-3">
            <Search size={18} className="text-text-muted" />
            <input
              type="text"
              placeholder="Search necklaces, earrings, rings..."
              className="flex-1 outline-none text-sm text-text-dark placeholder:text-text-muted bg-transparent"
              autoFocus
            />
            <button onClick={() => setSearchOpen(false)} className="text-text-muted hover:text-text-dark transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-opacity ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <div
          className={`absolute top-0 right-0 bottom-0 w-[280px] bg-white shadow-xl transform transition-transform ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-5 h-[70px] border-b border-border">
            <span className="font-playfair text-[20px] text-text-dark font-semibold">
              Menu
            </span>
            <button onClick={() => setMobileOpen(false)} className="text-text-dark hover:text-[#debc65]">
              <X size={22} />
            </button>
          </div>

          <div className="flex flex-col py-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-5 py-3 text-[15px] font-poppins font-medium border-b border-border transition-colors ${
                    isActive
                      ? "text-[#debc65] bg-[#FFF8E7]"
                      : "text-text-dark hover:text-[#debc65] hover:bg-[#FFF8E7]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="mt-6 px-5 flex flex-col gap-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center py-3 rounded-full border border-[#debc65] text-[#debc65] text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center py-3 rounded-full bg-[#debc65] text-[#1A1A2E] text-sm font-medium"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center py-3 rounded-full border border-[#debc65] text-[#debc65] text-sm font-medium"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="block w-full text-center py-3 rounded-full bg-[#debc65] text-[#1A1A2E] text-sm font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
