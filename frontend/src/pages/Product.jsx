import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useCart from "../hooks/useCart.js";
import { orderAPI, productAPI } from "../services/api.js";
import { buildGuestOrderPayload } from "../utils/orderHelpers.js";
import AddressModal from "../components/AddressModal.jsx";
import formatPKR from "../utils/formatPKR.js";
import { getProductImage, getImageUrl } from "../utils/imageHelpers.js";

const Product = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: 'Ayesha Khan',
      rating: 5,
      comment: 'Beautiful quality! Very happy with purchase.',
      date: '2 days ago',
      verified: true,
    },
    {
      id: 2,
      name: 'Sara Ahmed',
      rating: 4,
      comment: 'Lovely design, fast delivery. Recommended!',
      date: '1 week ago',
      verified: true,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedProductForAddress, setSelectedProductForAddress] = useState(null);
  const [addressSubmitting, setAddressSubmitting] = useState(false);
  const { addItem, addToCart } = useCart();

  const addToCartAction = addItem || addToCart;

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setSelectedProductForAddress(null);
  };

  const handleConfirmAddress = async (values) => {
    if (!selectedProductForAddress) return;
    setAddressSubmitting(true);
    try {
      await orderAPI.create(buildGuestOrderPayload({
        product: selectedProductForAddress.product,
        quantity: selectedProductForAddress.quantity,
        fieldValues: values,
      }));

      if (addToCartAction) {
        addToCartAction(selectedProductForAddress.product, selectedProductForAddress.quantity);
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
    const fetchProduct = async () => {
      setLoading(true);
      try {
        let productData = null;

        try {
          const bySlug = await productAPI.getBySlug(productId);
          productData = bySlug.data?.product || bySlug.data?.data?.product || bySlug.data?.data || null;
        } catch {
          const listRes = await productAPI.getAll({ limit: 100 });
          const list = listRes.data?.products || listRes.data?.data?.products || listRes.data?.data || [];
          productData = list.find((item) => item._id === productId || item.slug === productId) || null;
        }

        if (!productData) {
          setProduct(null);
          return;
        }

        setProduct(productData);
        setActiveImage(getProductImage(productData));
      } catch {
        setProduct(null);
        toast.error("Unable to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const rating = useMemo(
    () => Number(product?.ratings?.average || product?.averageRating || 0),
    [product]
  );
  const ratingCount = useMemo(
    () => Number(product?.ratings?.count || product?.reviewCount || product?.reviews?.length || 0),
    [product]
  );

  const currentPrice = product?.discountPrice || product?.price || 0;
  const originalPrice = product?.price || 0;
  const hasDiscount = originalPrice > currentPrice;

  const handleAddToCart = () => {
    if (!product || !addToCartAction) return;
    addToCartAction(product, quantity);
    window.dispatchEvent(new Event("open-cart-drawer"));
    toast.success("Product added to cart");
  };

  const handleSubmitReview = (event) => {
    event.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      toast.error("Please enter your name and comment");
      return;
    }

    setSubmittingReview(true);
    const newReview = {
      id: Date.now(),
      name: reviewForm.name.trim(),
      rating: Number(reviewForm.rating),
      comment: reviewForm.comment.trim(),
      date: "Just now",
      verified: false,
    };
    setReviews((prev) => [newReview, ...prev]);
    setSubmitted(true);
    setShowForm(false);

    setTimeout(() => {
      setReviewForm({ name: '', rating: 5, comment: '' });
      setSubmittingReview(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-[1400px] flex-col items-center justify-center px-4 pt-[110px] text-sm text-text-muted lg:px-8">
        <img src="/logo.png" alt="Loading" className="w-24 h-24 mb-4 opacity-50" />
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-[1400px] items-center justify-center px-4 pt-[110px] text-sm text-text-muted lg:px-8">
        Product not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 pb-16 pt-[120px] lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="grid grid-cols-[72px_1fr] gap-4">
          <div className="flex max-h-[520px] flex-col gap-3 overflow-y-auto">
            {(product.images || []).map((image) => (
              <button
                type="button"
                  key={image.public_id || image.url}
                  onClick={() => setActiveImage(getImageUrl(image))}
                className={`overflow-hidden rounded-xl border ${
                    activeImage === getImageUrl(image) ? "border-[#debc65]" : "border-border"
                }`}
              >
                <div className="h-[72px] w-[72px] bg-[#FFF8E7]">
                    {getImageUrl(image) ? (
                      <img src={getImageUrl(image)} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-text-muted">Img</div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-[#FFF8E7]">
            <div className="flex h-[420px] w-full items-center justify-center lg:h-[520px]">
              {activeImage ? (
                <img src={activeImage} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm text-text-muted">Image Placeholder</span>
              )}
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[2px] text-[#debc65]">{product.category?.name || "Jewellery"}</p>
          <h1 className="mt-2 font-playfair text-3xl font-bold text-text-dark">{product.name}</h1>

          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={star <= Math.round(rating) ? "fill-gold text-gold" : "text-[#D3D3D3]"}
              />
            ))}
            <span className="ml-2 text-sm text-text-muted">({ratingCount} reviews)</span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex flex-col">
              {product.tags?.[0] && (
                <span className="italic text-sm text-text-muted">{product.tags[0]}</span>
              )}
              <span className="text-3xl font-semibold text-[#debc65]">{formatPKR(currentPrice)}</span>
            </div>
            {hasDiscount && <span className="text-lg text-text-muted line-through">{formatPKR(originalPrice)}</span>}
          </div>

          <p className="mt-5 text-sm leading-7 text-text-muted">
            {product.description ||
              "Premium artificial jewellery designed for elegance, comfort, and long-lasting shine for every occasion."}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {Array.isArray(product.colors) &&
              product.colors.map((color) => (
                <span key={color} className="rounded-full border border-border px-3 py-1 text-xs text-text-muted">
                  {color}
                </span>
              ))}
            {product.material && (
              <span className="rounded-full bg-[#1A1A2E] px-3 py-1 text-xs font-medium text-[#debc65]">
                {product.material}
              </span>
            )}
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-[#debc65]/20 bg-[#1A1A2E]">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="px-3 py-2 text-[#debc65] transition-colors duration-300 hover:text-black"
              >
                <Minus size={16} />
              </button>
              <span className="min-w-[38px] text-center text-sm font-medium text-[#debc65]">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-3 py-2 text-[#debc65] transition-colors duration-300 hover:text-black"
              >
                <Plus size={16} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              className="inline-flex items-center gap-2 rounded-full bg-[#1A1A2E] px-8 py-3 text-sm font-semibold text-[#debc65] transition-all duration-300 hover:bg-[#debc65] hover:text-black"
            >
              <ShoppingBag size={16} />
              Add to Cart
            </button>
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-[#FFF8E7] p-4 text-xs leading-6 text-text-muted">
            <p>Guaranteed quality with careful finishing.</p>
            <p>Cash on Delivery and Bank Transfer available.</p>
            <p>Easy returns for unused items within policy terms.</p>
          </div>
        </div>
      </div>

      <section className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-white p-5">
          <h2 className="font-playfair text-2xl font-bold text-text-dark">Product Details</h2>
          <div className="mt-4 space-y-3 text-sm text-text-muted">
            <p>
              <span className="font-semibold text-text-dark">Stock:</span>{" "}
              {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
            </p>
            <p>
              <span className="font-semibold text-text-dark">Sold:</span> {product.sold || 0}
            </p>
            <p>
              <span className="font-semibold text-text-dark">Tags:</span>{" "}
              {product.tags?.length ? product.tags.join(", ") : "N/A"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-white p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-playfair text-2xl font-bold text-[#1A1A2E]">Customer Reviews</h2>
              <p className="mt-1 text-sm text-gray-500">
                Reviews feed will appear within 2 hours after verification.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-full bg-[#1A1A2E] px-5 py-2 text-sm font-semibold text-[#debc65] transition-all duration-300 hover:bg-[#debc65] hover:text-black"
            >
              Write a Review
            </button>
          </div>

          {submitted && (
            <div className="mt-5 rounded-xl border border-[#86EFAC] bg-[#F0FDF4] p-4 text-sm text-[#166534]">
              <div className="flex items-start gap-3">
                <span className="mt-1 text-xl">✔</span>
                <div>
                  <p className="font-semibold">Thank you for your review!</p>
                  <p className="mt-1 text-sm text-[#4F7440]">
                    Your review will be visible within 2 hours after verification by our team.
                  </p>
                </div>
              </div>
            </div>
          )}

          {showForm && (
            <form className="mt-5 space-y-4" onSubmit={handleSubmitReview}>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1A1A2E]">Your Name</label>
                <input
                  type="text"
                  value={reviewForm.name}
                  onChange={(event) =>
                    setReviewForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="w-full rounded-xl border border-[#debc65]/30 px-4 py-2.5 text-sm outline-none focus:border-[#debc65] focus:ring-[#debc65]/20 focus:ring-2"
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1A1A2E]">Rating</label>
                <div className="flex gap-2 text-[#D3D3D3]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                      className={`rounded-full p-2 text-lg transition-colors duration-200 ${
                        reviewForm.rating >= star ? "text-[#debc65]" : "text-[#D3D3D3]"
                      }`}
                    >
                      <Star size={18} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1A1A2E]">Comment</label>
                <textarea
                  rows={4}
                  value={reviewForm.comment}
                  onChange={(event) =>
                    setReviewForm((prev) => ({ ...prev, comment: event.target.value }))
                  }
                  placeholder="Write your review..."
                  className="w-full rounded-xl border border-[#debc65]/30 px-4 py-2.5 text-sm text-[#1A1A2E] outline-none focus:border-[#debc65] focus:ring-[#debc65]/20 focus:ring-2"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="rounded-full bg-[#1A1A2E] px-6 py-3 text-sm font-semibold text-[#debc65] transition-all duration-300 hover:bg-[#debc65] hover:text-black disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-full border border-[#debc65] px-6 py-3 text-sm font-semibold text-[#1A1A2E] transition-all duration-300 hover:bg-[#debc65] hover:text-black"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[#debc65]/10 bg-white p-5">
        <h2 className="font-playfair text-2xl font-bold text-[#1A1A2E]">Customer Reviews</h2>
        <div className="mt-4 space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-[#debc65]/10 bg-[#FFFFFF] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#1A1A2E]">{review.name}</p>
                  <span className="mt-2 inline-flex rounded-full bg-[#debc65]/10 px-2.5 py-1 text-xs font-semibold text-[#debc65]">
                    Verified Buyer
                  </span>
                </div>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
              <div className="mt-3 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={
                      star <= review.rating
                        ? "fill-[#debc65] text-[#debc65]"
                        : "text-[#D3D3D3]"
                    }
                  />
                ))}
              </div>
              <p className="mt-3 text-sm text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </section>
      <AddressModal
        open={showAddressModal}
        productName={product?.name || "product"}
        quantity={quantity}
        loading={addressSubmitting}
        onClose={closeAddressModal}
        onSubmit={handleConfirmAddress}
      />
    </div>
  );
};

export default Product;
