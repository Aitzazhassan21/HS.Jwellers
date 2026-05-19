import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useCart from "../hooks/useCart.js";
import { orderAPI, productAPI } from "../services/api.js";
import { buildGuestOrderPayload } from "../utils/orderHelpers.js";
import AddressModal from "../components/AddressModal.jsx";
import formatPKR from "../utils/formatPKR.js";

const Category = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const { addItem, addToCart } = useCart();

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
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const response = await productAPI.getByCategory(category);
        const productList = response.data?.products || response.data?.data?.products || response.data?.data || [];
        setProducts(Array.isArray(productList) ? productList : []);
      } catch {
        setProducts([]);
        toast.error("Unable to load category products");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [category]);

  const availableMaterials = useMemo(() => {
    const materials = products.map((item) => item.material).filter(Boolean);
    return [...new Set(materials)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedMaterials.length > 0) {
      result = result.filter((item) => selectedMaterials.includes(item.material));
    }

    if (priceRange !== "all") {
      result = result.filter((item) => {
        const price = Number(item.discountPrice || item.price || 0);
        if (priceRange === "under1000") return price < 1000;
        if (priceRange === "1000to3000") return price >= 1000 && price <= 3000;
        return price > 3000;
      });
    }

    if (sortBy === "priceLowHigh") {
      result.sort((a, b) => (a.discountPrice || a.price || 0) - (b.discountPrice || b.price || 0));
    } else if (sortBy === "priceHighLow") {
      result.sort((a, b) => (b.discountPrice || b.price || 0) - (a.discountPrice || a.price || 0));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.ratings?.average || 0) - (a.ratings?.average || 0));
    }

    return result;
  }, [priceRange, products, selectedMaterials, sortBy]);

  const displayCategoryName = decodeURIComponent(category || "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());

  const handleMaterialChange = (material) => {
    setSelectedMaterials((prev) =>
      prev.includes(material) ? prev.filter((item) => item !== material) : [...prev, material]
    );
  };

  const handleAddToCart = (product) => {
    openAddressModal(product);
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-14 pt-[120px] lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-playfair text-3xl font-bold text-text-dark">{displayCategoryName}</h1>
          <p className="mt-1 text-sm text-text-muted">
            Explore handcrafted pieces curated for every occasion.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowFilters((prev) => !prev)}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-text-dark lg:hidden"
        >
          <SlidersHorizontal size={16} />
          Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside className={`${showFilters ? "block" : "hidden"} rounded-2xl border border-border bg-white p-5 lg:block`}>
          <h2 className="text-base font-semibold text-text-dark">Filters</h2>

          <div className="mt-5">
            <h3 className="text-sm font-semibold text-text-dark">Material</h3>
            <div className="mt-2 space-y-2">
              {availableMaterials.length === 0 && <p className="text-xs text-text-muted">No material filters</p>}
              {availableMaterials.map((material) => (
                <label key={material} className="flex cursor-pointer items-center gap-2 text-sm text-text-muted">
                  <input
                    type="checkbox"
                    checked={selectedMaterials.includes(material)}
                    onChange={() => handleMaterialChange(material)}
                    className="accent-primary"
                  />
                  {material}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-text-dark">Price</h3>
            <select
              value={priceRange}
              onChange={(event) => setPriceRange(event.target.value)}
              className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm text-text-dark outline-none focus:border-primary"
            >
              <option value="all">All Prices</option>
              <option value="under1000">Under Rs. 1,000</option>
              <option value="1000to3000">Rs. 1,000 - Rs. 3,000</option>
              <option value="above3000">Above Rs. 3,000</option>
            </select>
          </div>
        </aside>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-border bg-white p-4">
            <p className="text-sm text-text-muted">
              Showing <span className="font-semibold text-text-dark">{filteredProducts.length}</span> products
            </p>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-xl border border-border px-3 py-2 text-sm text-text-dark outline-none focus:border-primary"
            >
              <option value="newest">Newest</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {loading ? (
            <div className="flex h-[300px] items-center justify-center rounded-2xl border border-border bg-[#FFF8E7] text-sm text-text-muted">
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex h-[300px] flex-col items-center justify-center rounded-2xl border border-border bg-[#FFF8E7]">
              <p className="text-sm text-text-muted">No products found with selected filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {filteredProducts.map((product) => {
                const price = product.discountPrice || product.price || 0;
                const originalPrice = product.price || 0;
                const rating = product.ratings?.average || 0;
                const ratingCount = product.ratings?.count || 0;
                const imageCount = product.images?.length || 0;

                return (
                  <div
                    key={product._id}
                    className="group rounded-2xl border border-border bg-white p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_22px_rgba(222,188,101,0.15)]"
                  >
                    <Link to={`/product/${product.slug || product._id}`} className="block overflow-hidden rounded-xl bg-[#FFF8E7]">
                      <div className="h-[220px] w-full overflow-hidden rounded-xl">
                        {product.images?.[0]?.url ? (
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-text-muted">
                            Image Placeholder
                          </div>
                        )}
                      </div>
                    </Link>

                    {imageCount > 1 && (
                      <div className="mt-3 flex items-center gap-2 overflow-x-auto">
                        {product.images.slice(0, 3).map((img) => (
                          <img
                            key={img.public_id || img.url}
                            src={img.url}
                            alt={product.name}
                            className="h-12 w-12 rounded-lg object-cover border border-border"
                          />
                        ))}
                        {imageCount > 3 && (
                          <div className="flex h-12 min-w-[48px] items-center justify-center rounded-lg border border-border bg-[#f7f7f7] text-xs text-text-muted">
                            +{imageCount - 3}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="pt-3">
                      <p className="text-[11px] uppercase tracking-wider text-primary">
                        {product.category?.name || "Jewellery"}
                      </p>
                      <Link
                        to={`/product/${product.slug || product._id}`}
                        className="mt-1 line-clamp-2 min-h-[40px] text-sm font-medium text-text-dark"
                      >
                        {product.name}
                      </Link>

                      <div className="mt-2 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={13}
                            className={star <= Math.round(rating) ? "fill-gold text-gold" : "text-[#D3D3D3]"}
                          />
                        ))}
                        <span className="ml-1 text-xs text-text-muted">({ratingCount})</span>
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm font-semibold text-primary">{formatPKR(price)}</span>
                        {originalPrice > price && (
                          <span className="text-xs text-text-muted line-through">{formatPKR(originalPrice)}</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="mt-3 w-full rounded-full border border-primary py-2 text-xs font-medium text-primary transition-all hover:bg-primary hover:text-white"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
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

export default Category;
