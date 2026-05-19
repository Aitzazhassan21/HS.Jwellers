import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Heart, ChevronRight, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import useCart from "../hooks/useCart.js";
import { orderAPI, productAPI } from "../services/api.js";
import { buildGuestOrderPayload } from "../utils/orderHelpers.js";
import AddressModal from "../components/AddressModal.jsx";
import formatPKR from "../utils/formatPKR.js";
import { getProductImage } from "../utils/imageHelpers.js";

const categoryDisplayNames = {
  necklace: 'Necklace & Chain',
  rings: 'Rings',
  earrings: 'Earrings',
  bracelets: 'Bracelets & Watches',
  anklets: 'Anklets',
  sale: 'Sale & Deals',
};

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product);
  };

  const price = product?.discountPrice || product?.price || 0;
  const originalPrice = product?.price || 0;
  const imageUrl = getProductImage(product);

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden border border-[#debc65]/20 cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(222,188,101,0.2)]"
      onClick={handleProductClick}
    >
      <div className="relative overflow-hidden">
        <div className="aspect-[4/5] overflow-hidden bg-[#FFFCF5]">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        </div>

        {product?.isNewArrival && (
          <span className="absolute left-3 top-3 bg-[#1A1A2E] text-[#debc65] text-[10px] font-inter font-semibold px-2 py-1 rounded-full uppercase tracking-wide">
            New
          </span>
        )}

        <button
          type="button"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#debc65] opacity-0 transition-all duration-300 group-hover:opacity-100 hover:scale-110"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart size={18} strokeWidth={1.5} />
        </button>
      </div>

      <div className="p-3">
        <h3 className="font-playfair text-[14px] font-medium text-[#1A1A1A] line-clamp-2 min-h-[40px] leading-5">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          <span className="text-[16px] font-bold text-[#debc65]">{formatPKR(price)}</span>
          {originalPrice > price && (
            <span className="text-[13px] text-gray-400 line-through">{formatPKR(originalPrice)}</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-3 w-full h-[40px] bg-[#1A1A2E] text-[#debc65] text-[13px] font-inter font-medium rounded-full opacity-0 translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#debc65] hover:text-black"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const CategoryPage = () => {
  const { categorySlug } = useParams();
  const navigate = useNavigate();
  const { addItem, addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  const addToCartAction = addItem || addToCart;
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedProductForAddress, setSelectedProductForAddress] = useState(null);
  const [addressSubmitting, setAddressSubmitting] = useState(false);

  const openAddressModal = (product) => {
    setSelectedProductForAddress(product);
    setShowAddressModal(true);
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setSelectedProductForAddress(null);
  };

  const handleConfirmAddress = async (values) => {
    if (!selectedProductForAddress) return;
    setAddressSubmitting(true);

    try {
      await orderAPI.create(buildGuestOrderPayload({
        product: selectedProductForAddress,
        quantity: 1,
        fieldValues: values,
      }));

      if (addToCartAction) {
        addToCartAction(selectedProductForAddress, 1);
      }

      toast.success("Delivery info saved and item added to cart");
      closeAddressModal();
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || "Unable to place order";
      toast.error(message);
    } finally {
      setAddressSubmitting(false);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const response = await productAPI.getByCategory(categorySlug);
        const items = response.data?.products || response.data?.data?.products || [];
        setProducts(Array.isArray(items) ? items : []);
        setTotal(Array.isArray(items) ? items.length : 0);
        setPages(1);
      } catch {
        setProducts([]);
        setTotal(0);
        setPages(1);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categorySlug]);

  const handleAddToCart = (product) => {
    if (!product || !addToCartAction) return;
    addToCartAction(product, 1);
    window.dispatchEvent(new Event("open-cart-drawer"));
    toast.success("Product added to cart");
  };

  const displayName = categoryDisplayNames[categorySlug] || decodeURIComponent(categorySlug || "").replace(/-/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
  
  if (loading) {
    return (
      <div className="pt-[90px] min-h-screen bg-[#FFFCF5]">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="h-[200px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-[#debc65]/20 border-t-[#debc65] rounded-full animate-spin"></div>
              <p className="text-gray-500 font-inter text-sm">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (products.length === 0) {
    return (
      <div className="pt-[90px] min-h-screen bg-[#FFFCF5]">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 rounded-full border-4 border-[#debc65]/30 flex items-center justify-center mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-[#debc65]/50 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-[#debc65]/20"></div>
              </div>
            </div>
            <h2 className="font-playfair text-[24px] font-bold text-[#1A1A1A] mb-2">No products found</h2>
            <p className="text-gray-500 font-inter text-sm mb-6">Check back soon for new arrivals</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-[#debc65] text-black font-inter font-medium rounded-full hover:bg-[#C9A84C] transition-colors"
            >
              Browse All
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-[90px] min-h-screen bg-[#FFFCF5]">
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-playfair text-[40px] font-bold text-[#1A1A1A] mb-4">
            {displayName}
          </h1>
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[3px] w-[60px] bg-[#debc65]"></div>
            <span className="text-gray-500 font-inter text-sm">({products.length} products)</span>
            <div className="h-[3px] w-[60px] bg-[#debc65]"></div>
          </div>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
              index={index}
            />
          ))}
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A2E] text-[#debc65] border border-[#debc65]/30 hover:bg-[#debc65] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} />
            </button>
            <span className="text-sm font-inter text-gray-600">
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A2E] text-[#debc65] border border-[#debc65]/30 hover:bg-[#debc65] hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
      <AddressModal
        open={showAddressModal}
        productName={selectedProductForAddress?.name || "product"}
        quantity={1}
        loading={addressSubmitting}
        onClose={closeAddressModal}
        onSubmit={handleConfirmAddress}
      />
    </div>
  );
};

export default CategoryPage;
