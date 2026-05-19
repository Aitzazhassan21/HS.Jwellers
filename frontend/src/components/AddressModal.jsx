import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

const AddressModal = ({
  open,
  productName,
  quantity,
  loading,
  onClose,
  onSubmit,
}) => {
  const [formValues, setFormValues] = useState({
    fullName: "",
    email: "",
    phone: "",
    cnic: "",
    street: "",
    city: "",
    province: "",
    postalCode: "",
    instructions: "",
  });

  useEffect(() => {
    if (open) {
      setFormValues({
        fullName: "",
        email: "",
        phone: "",
        cnic: "",
        street: "",
        city: "",
        province: "",
        postalCode: "",
        instructions: "",
      });
    }
  }, [open]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const requiredFields = ["fullName", "phone", "cnic", "street", "city", "province", "postalCode"];
    const missingField = requiredFields.find((field) => !formValues[field]?.trim());

    if (missingField) {
      return;
    }

    onSubmit(formValues);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-[32px] border border-[#debc65]/30 bg-[#FFF8E7] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.18)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-text-dark">Delivery Information</h2>
            <p className="mt-1 text-sm text-text-muted">
              Enter delivery details before adding <span className="font-semibold">{productName}</span> to the cart.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-text-dark transition hover:bg-[#1A1A2E]/10"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-5 rounded-3xl bg-[#1A1A2E] p-4 text-sm text-[#DEBC65] shadow-inner">
          <p className="font-medium">Order summary</p>
          <p className="mt-2 text-xs text-[#F5E2A6]">
            {quantity} × {productName}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-text-dark">
              Name
              <input
                name="fullName"
                value={formValues.fullName}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none focus:border-[#debc65]"
                placeholder="Full Name"
                required
              />
            </label>

            <label className="block text-sm text-text-dark">
              Phone
              <input
                name="phone"
                value={formValues.phone}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none focus:border-[#debc65]"
                placeholder="0300 1234567"
                required
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-text-dark">
              CNIC
              <input
                name="cnic"
                value={formValues.cnic}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none focus:border-[#debc65]"
                placeholder="35202-1234567-1"
                required
              />
            </label>

            <label className="block text-sm text-text-dark">
              Email (optional)
              <input
                name="email"
                value={formValues.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none focus:border-[#debc65]"
                placeholder="name@example.com"
              />
            </label>
          </div>

          <label className="block text-sm text-text-dark">
            Street Address
            <input
              name="street"
              value={formValues.street}
              onChange={handleChange}
              className="mt-2 w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none focus:border-[#debc65]"
              placeholder="House number, street, sector"
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block text-sm text-text-dark">
              City
              <input
                name="city"
                value={formValues.city}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none focus:border-[#debc65]"
                placeholder="Karachi"
                required
              />
            </label>

            <label className="block text-sm text-text-dark">
              Province
              <input
                name="province"
                value={formValues.province}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none focus:border-[#debc65]"
                placeholder="Sindh"
                required
              />
            </label>

            <label className="block text-sm text-text-dark">
              Postal Code
              <input
                name="postalCode"
                value={formValues.postalCode}
                onChange={handleChange}
                className="mt-2 w-full rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none focus:border-[#debc65]"
                placeholder="74500"
                required
              />
            </label>
          </div>

          <label className="block text-sm text-text-dark">
            Delivery Notes
            <textarea
              name="instructions"
              value={formValues.instructions}
              onChange={handleChange}
              className="mt-2 h-28 w-full resize-none rounded-3xl border border-border bg-white px-4 py-3 text-sm text-text-dark outline-none focus:border-[#debc65]"
              placeholder="Leave any special delivery note"
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-12 items-center justify-center rounded-full border border-border px-6 text-sm font-semibold text-text-dark transition hover:bg-[#1A1A2E]/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#1A1A2E] px-6 text-sm font-semibold text-[#debc65] transition hover:bg-[#debc65] hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Confirming..." : "Confirm Delivery Info"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddressModal.propTypes = {
  open: PropTypes.bool.isRequired,
  productName: PropTypes.string,
  quantity: PropTypes.number,
  loading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

AddressModal.defaultProps = {
  productName: "product",
  quantity: 1,
  loading: false,
};

export default AddressModal;
