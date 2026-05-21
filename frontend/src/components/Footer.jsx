import { Link } from "react-router-dom";
import { Facebook, Instagram, Phone, Mail, MapPin } from "lucide-react";
import logo from "../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-auto border-t-4 border-[#debc65]">
      {/* Main Footer */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-16 pb-10">
        {/* Mobile Layout */}
        <div className="sm:hidden">
          {/* Brand Section - Centered */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
              <img src={logo} alt="HS Logo" className="h-16 w-auto mx-auto" />
            </Link>
            <p className="text-gray-400 text-[14px] leading-relaxed mb-6">
              Elegance in Every Detail. Handcrafted artificial jewellery for every occasion.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#debc65] flex items-center justify-center text-black hover:bg-white hover:text-[#debc65] transition-all hover:scale-110 shadow-md"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#debc65] flex items-center justify-center text-black hover:bg-white hover:text-[#debc65] transition-all hover:scale-110 shadow-md"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#debc65] flex items-center justify-center text-black hover:bg-white hover:text-[#debc65] transition-all hover:scale-110 shadow-md"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Row 1: Quick Links | Categories */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Quick Links */}
            <div>
              <h4 className="text-[16px] font-inter font-semibold mb-4 text-white">
                Quick Links
              </h4>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "Home", to: "/" },
                  { label: "About Us", to: "/about" },
                  { label: "Contact", to: "/contact" },
                  { label: "Blog", to: "/blog" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-gray-400 text-[14px] hover:text-[#debc65] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-[16px] font-inter font-semibold mb-4 text-white">
                Categories
              </h4>
              <ul className="flex flex-col gap-2">
                {[
                  { label: "Necklace & Chain", to: "/category/necklace-and-chain" },
                  { label: "Rings", to: "/category/rings" },
                  { label: "Earrings", to: "/category/earrings" },
                  { label: "Bracelets", to: "/category/bracelets" },
                  { label: "Anklets", to: "/category/anklets" },
                  { label: "Sale & Deals", to: "/category/sale" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-gray-400 text-[14px] hover:text-[#debc65] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Row 2: Contact Us | We Accept */}
          <div className="grid grid-cols-1 gap-6 mb-8">
            {/* Contact Us */}
            <div>
              <h4 className="text-[16px] font-inter font-semibold mb-4 text-white">
                Contact Us
              </h4>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-3">
                  <Phone size={16} className="text-[#debc65] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400 text-[14px]">+92 3262840005</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail size={16} className="text-[#debc65] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400 text-[14px]">support@anonjewels.pk</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#debc65] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400 text-[14px]">Lahore, Pakistan</span>
                </li>
              </ul>
            </div>

            {/* We Accept */}
            <div>
              <h4 className="text-[16px] font-inter font-semibold mb-4 text-white">
                Delivery & Payment
              </h4>
              <div className="grid gap-4">
                <div className="flex items-center gap-3 bg-white/5 border border-[#debc65]/20 rounded-xl px-4 py-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#debc65"
                    strokeWidth="2"
                  >
                    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                    <rect x="9" y="11" width="14" height="10" rx="2" />
                    <circle cx="12" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                  </svg>
                  <div>
                    <p className="text-white text-sm font-medium">Cash on Delivery</p>
                    <p className="text-[#debc65]/70 text-xs">Pay when you receive</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/5 border border-[#debc65]/20 rounded-xl px-4 py-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#debc65"
                    strokeWidth="2"
                  >
                    <path d="M3 8l7-5 7 5v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
                    <path d="M16 8l-4 3-4-3" />
                  </svg>
                  <div>
                    <p className="text-white text-sm font-medium">Fast Delivery</p>
                    <p className="text-[#debc65]/70 text-xs">Nationwide shipping available</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 — Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <img src={logo} alt="HS Logo" className="h-18 w-auto" />
            </Link>
            <p className="text-gray-400 text-[14px] leading-relaxed mb-6">
              Elegance in Every Detail. Handcrafted artificial jewellery for every occasion.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#debc65] flex items-center justify-center text-black hover:bg-white hover:text-[#debc65] transition-all hover:scale-110 shadow-md"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#debc65] flex items-center justify-center text-black hover:bg-white hover:text-[#debc65] transition-all hover:scale-110 shadow-md"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#debc65] flex items-center justify-center text-black hover:bg-white hover:text-[#debc65] transition-all hover:scale-110 shadow-md"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 — Quick Links */}
          <div>
            <h4 className="text-[16px] font-inter font-semibold mb-5 text-white">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Home", to: "/" },
                { label: "About Us", to: "/about" },
                { label: "Contact", to: "/contact" },
                { label: "Blog", to: "/blog" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-400 text-[14px] hover:text-[#debc65] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Categories */}
          <div>
            <h4 className="text-[16px] font-inter font-semibold mb-5 text-white">
              Categories
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Necklace & Chain", to: "/category/necklace-and-chain" },
                { label: "Rings", to: "/category/rings" },
                { label: "Earrings", to: "/category/earrings" },
                { label: "Bracelets", to: "/category/bracelets" },
                { label: "Anklets", to: "/category/anklets" },
                { label: "Sale & Deals", to: "/category/sale" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-400 text-[14px] hover:text-[#debc65] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h4 className="text-[16px] font-inter font-semibold mb-5 text-white">
              Contact Us
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-[#debc65] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-[14px]">+92 3262840005</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-[#debc65] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-[14px]">support@anonjewels.pk</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-[#debc65] mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-[14px]">Lahore, Pakistan</span>
              </li>
            </ul>

            {/* Payment icons */}
            <div className="mt-6">
              <div className="grid gap-3">
                <div className="flex items-center gap-2 bg-white/5 border border-[#debc65]/20 rounded-xl px-4 py-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#debc65"
                    strokeWidth="2"
                  >
                    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3" />
                    <rect x="9" y="11" width="14" height="10" rx="2" />
                    <circle cx="12" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                  </svg>
                  <div>
                    <p className="text-white text-sm font-medium">Cash on Delivery</p>
                    <p className="text-[#debc65]/70 text-xs">Pay when you receive</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-[#debc65]/20 rounded-xl px-4 py-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#debc65"
                    strokeWidth="2"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <div>
                    <p className="text-white text-sm font-medium">Fast Delivery</p>
                    <p className="text-[#debc65]/70 text-xs">Delivered across Pakistan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#debc65] bg-black/50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-400 text-[13px]">
            &copy; 2026 HS Jewels. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="text-gray-400 text-[13px] hover:text-[#debc65] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 text-[13px] hover:text-[#debc65] transition-colors">
              Terms of Service
            </Link>
            <Link to="/shipping" className="text-gray-400 text-[13px] hover:text-[#debc65] transition-colors">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
