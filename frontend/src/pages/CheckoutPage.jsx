import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Info, Truck, Loader2, Check } from "lucide-react";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import { orderAPI } from "../services/api";
import formatPKR from "../utils/formatPKR";
import { getProductImage } from "../utils/imageHelpers";

const STEPS = [
  { id: 1, label: "Delivery Info" },
  { id: 2, label: "Review Order" },
  { id: 3, label: "Payment" },
];

const PROVINCES = [
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "AJK",
  "Gilgit Baltistan",
  "Islamabad",
];

const initialDelivery = {
  fullName: "",
  phone: "",
  email: "",
  street: "",
  city: "",
  province: "",
  postalCode: "",
  deliveryNotes: "",
};

const validatePhonePK = (value) => {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11) return "Phone must be 11 digits";
  if (!digits.startsWith("03")) return "Phone must start with 03";
  return null;
};

const ProgressBar = ({ step }) => (
  <div className="mb-10 px-1">
    <div className="flex items-center justify-between max-w-2xl mx-auto">
      {STEPS.map((s, idx) => {
        const done = step > s.id;
        const active = step === s.id;
        const isLast = idx === STEPS.length - 1;
        return (
          <div key={s.id} className="flex flex-1 items-center min-w-0">
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                  done
                    ? "border-green-500 bg-green-500 text-white"
                    : active
                      ? "border-[#debc65] bg-[#debc65] text-white"
                      : "border-[#E5E5E5] bg-white text-muted"
                }`}
              >
                {done ? <Check className="h-5 w-5" strokeWidth={2.5} /> : s.id}
              </div>
              <span
                className={`mt-2 text-center text-xs font-inter sm:text-sm ${
                  active ? "font-semibold text-text-dark" : "text-muted"
                }`}
              >
                {s.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`mx-1 h-0.5 flex-1 min-w-[12px] -mt-6 self-start sm:mx-2 ${
                  step > s.id ? "bg-green-500" : "bg-[#E5E5E5]"
                }`}
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </div>
  </div>
);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, subtotal, shipping, total, clear } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1);
  const [delivery, setDelivery] = useState(initialDelivery);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!items.length) {
      toast.info("Your cart is empty");
      navigate("/cart", { replace: true });
    }
  }, [items.length, navigate]);

  const shippingFee = useMemo(() => shipping, [shipping]);

  const setField = (key, value) => {
    setDelivery((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateStep1 = () => {
    const next = {};
    if (!delivery.fullName.trim()) next.fullName = "Full name is required";
    const phoneErr = validatePhonePK(delivery.phone);
    if (phoneErr) next.phone = phoneErr;
    if (!delivery.street.trim()) next.street = "Street address is required";
    if (!delivery.city.trim()) next.city = "City is required";
    if (!delivery.province) next.province = "Select a province";
    if (!delivery.postalCode.trim()) next.postalCode = "Postal code is required";
    if (delivery.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(delivery.email.trim())) {
      next.email = "Invalid email";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleNextFromDelivery = () => {
    if (!validateStep1()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (!items.length) return;
    setSubmitting(true);
    const shippingAddress = {
      fullName: delivery.fullName.trim(),
      phone: delivery.phone.replace(/\D/g, ""),
      email: delivery.email.trim() || undefined,
      street: delivery.street.trim(),
      city: delivery.city.trim(),
      province: delivery.province,
      postalCode: delivery.postalCode.trim(),
      deliveryNotes: delivery.deliveryNotes.trim() || undefined,
    };

    const customerId = user?._id || user?.id;
    const payload = {
      items: items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        price: i.price,
      })),
      shippingAddress,
      pricing: {
        subtotal,
        shippingFee,
        discount: 0,
        total,
      },
      paymentMethod,
      paymentStatus: "pending",
      ...(isAuthenticated && customerId
        ? { customer: customerId }
        : {
            guestInfo: {
              name: delivery.fullName.trim(),
              phone: delivery.phone.replace(/\D/g, ""),
              email: delivery.email.trim() || undefined,
            },
          }),
    };

    try {
      const { data } = await orderAPI.create(payload);
      if (!data?.success || !data?.order) {
        throw new Error(data?.message || "Order failed");
      }
      toast.success("Order placed successfully!");
      clear();
      navigate("/order-success", {
        replace: true,
        state: { order: data.order },
      });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Could not place order";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!items.length) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center pt-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#debc65]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8E7]/40 pb-20 pt-28 sm:pt-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <h1 className="mb-2 text-center font-playfair text-3xl text-text-dark sm:text-4xl">
          Checkout
        </h1>
        <p className="mb-8 text-center font-inter text-sm text-muted">
          Complete your order in three quick steps
        </p>

        <ProgressBar step={step} />

        {/* STEP 1 */}
        {step === 1 && (
          <div className="mx-auto max-w-xl rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-playfair text-[28px] leading-tight text-text-dark">
              Delivery Information
            </h2>

            <div className="mt-6 space-y-4 font-inter">
              <div>
                <label className="mb-1 block text-sm font-medium text-text-dark">
                  Full Name <span className="text-[#debc65]">*</span>
                </label>
                <input
                  type="text"
                  value={delivery.fullName}
                  onChange={(e) => setField("fullName", e.target.value)}
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none ring-[#debc65]/30 focus:ring-2"
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text-dark">
                  Phone <span className="text-[#debc65]">*</span>
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="+92 3XX XXXXXXX"
                  value={delivery.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none ring-[#debc65]/30 focus:ring-2"
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text-dark">Email</label>
                <input
                  type="email"
                  value={delivery.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none ring-[#debc65]/30 focus:ring-2"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text-dark">
                  Street Address <span className="text-[#debc65]">*</span>
                </label>
                <textarea
                  rows={2}
                  value={delivery.street}
                  onChange={(e) => setField("street", e.target.value)}
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none ring-[#debc65]/30 focus:ring-2"
                />
                {errors.street && <p className="mt-1 text-xs text-red-500">{errors.street}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-dark">
                    City <span className="text-[#debc65]">*</span>
                  </label>
                  <input
                    type="text"
                    value={delivery.city}
                    onChange={(e) => setField("city", e.target.value)}
                    className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none ring-[#debc65]/30 focus:ring-2"
                  />
                  {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-text-dark">
                    Province <span className="text-[#debc65]">*</span>
                  </label>
                  <select
                    value={delivery.province}
                    onChange={(e) => setField("province", e.target.value)}
                    className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm outline-none ring-[#debc65]/30 focus:ring-2"
                  >
                    <option value="">Select province</option>
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  {errors.province && <p className="mt-1 text-xs text-red-500">{errors.province}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text-dark">
                  Postal Code <span className="text-[#debc65]">*</span>
                </label>
                <input
                  type="text"
                  value={delivery.postalCode}
                  onChange={(e) => setField("postalCode", e.target.value)}
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none ring-[#debc65]/30 focus:ring-2"
                />
                {errors.postalCode && <p className="mt-1 text-xs text-red-500">{errors.postalCode}</p>}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-text-dark">Delivery Notes</label>
                <textarea
                  rows={2}
                  placeholder="Gate number, landmark..."
                  value={delivery.deliveryNotes}
                  onChange={(e) => setField("deliveryNotes", e.target.value)}
                  className="w-full rounded-xl border border-border px-4 py-2.5 text-sm outline-none ring-[#debc65]/30 focus:ring-2"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 rounded-xl border border-[#debc65]/40 bg-[#FFF8E7] p-4 font-inter text-sm text-text-dark">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#debc65]" />
              <p>
                Our team will call you to confirm your order before dispatching. Please keep phone
                available.
              </p>
            </div>

            <button
              type="button"
              onClick={handleNextFromDelivery}
              className="mt-8 w-full rounded-[30px] bg-[#debc65] py-3.5 text-center font-inter text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Next — Review Order →
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 font-playfair text-[28px] text-text-dark">Review Your Order</h2>

            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="lg:w-[60%]">
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
                  <ul className="divide-y divide-border">
                    {items.map((item) => (
                      <li key={item.productId} className="flex gap-4 py-4 first:pt-0">
                        {item.image ? (
                          <img
                            src={getProductImage(item)}
                            alt=""
                            className="h-[70px] w-[70px] shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-[70px] w-[70px] shrink-0 rounded-lg bg-[#FFF8E7]" />
                        )}
                        <div className="min-w-0 flex-1 font-inter">
                          <p className="font-medium text-text-dark">{item.name}</p>
                          <p className="text-sm text-muted">Qty: {item.quantity}</p>
                        </div>
                        <p className="shrink-0 text-right font-semibold text-text-dark">
                          {formatPKR(item.subtotal)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:w-[40%]">
                <div className="rounded-2xl border border-border bg-white p-5 shadow-sm font-inter">
                  <h3 className="font-playfair text-lg font-semibold text-text-dark">Summary</h3>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-muted">
                      <span>Subtotal</span>
                      <span>{formatPKR(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted">
                      <span>Shipping</span>
                      <span>
                        {shippingFee === 0 ? (
                          <span className="font-semibold text-green-600">FREE</span>
                        ) : (
                          formatPKR(shippingFee)
                        )}
                      </span>
                    </div>
                    <div className="my-3 border-t border-border" />
                    <div className="flex justify-between text-lg font-bold text-[#debc65]">
                      <span>Total</span>
                      <span>{formatPKR(total)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-border bg-white p-4 font-inter text-sm text-text-dark shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">Ship to</p>
                      <p className="mt-2 text-muted">
                        {delivery.fullName}
                        <br />
                        {delivery.phone}
                        <br />
                        {delivery.street}, {delivery.city}, {delivery.province} {delivery.postalCode}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="shrink-0 text-[#debc65] underline-offset-2 hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-[30px] border border-border bg-white px-8 py-3 font-inter text-sm font-semibold text-text-dark hover:bg-[#FFF8E7]"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="rounded-[30px] bg-[#debc65] px-8 py-3 font-inter text-sm font-semibold text-white hover:opacity-90"
              >
                Confirm & Pay →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="mx-auto max-w-xl">
            <h2 className="font-playfair text-[28px] text-text-dark">Select Payment Method</h2>
            <p className="mt-1 font-inter text-sm text-muted">Simple & secure — Pakistan only</p>

            <div className="mt-6 space-y-4 font-inter">
              <label className="flex gap-4 rounded-2xl border-2 border-[#debc65] bg-[#FFF8E7] p-5">
                <input type="radio" name="pay" className="sr-only" checked readOnly />
                <Truck className="h-7 w-7 shrink-0 text-[#debc65]" strokeWidth={1.75} />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-bold text-text-dark">Cash on Delivery</p>
                  <p className="mt-1 text-sm text-muted">Pay when your order arrives at your door</p>
                  <p className="text-sm text-muted">Our team will call to confirm before shipping</p>
                  <span className="mt-2 inline-block rounded-[20px] bg-[#debc65]/10 px-3 py-1 text-xs font-semibold text-[#debc65]">
                    FREE • Most Popular
                  </span>
                </div>
              </label>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={handlePlaceOrder}
              className="mt-6 flex h-[52px] w-full items-center justify-center gap-2 rounded-[30px] bg-[#debc65] font-inter text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Placing order…
                </>
              ) : (
                "Place Order →"
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="mt-4 w-full rounded-[30px] border border-border py-3 font-inter text-sm font-medium text-text-dark hover:bg-white"
            >
              ← Back to review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;

