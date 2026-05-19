export const getShippingFee = (subtotal) => (subtotal >= 2000 || subtotal === 0 ? 0 : 200);

export const buildGuestOrderPayload = ({ product, quantity, fieldValues }) => {
  const price = product.discountPrice || product.price || 0;
  const subtotal = price * quantity;
  return {
    items: [
      {
        productId: product._id,
        quantity,
        price,
      },
    ],
    guestInfo: {
      name: fieldValues.fullName.trim(),
      phone: fieldValues.phone.trim(),
      email: fieldValues.email?.trim() || "",
    },
    shippingAddress: {
      fullName: fieldValues.fullName.trim(),
      phone: fieldValues.phone.trim(),
      street: fieldValues.street.trim(),
      city: fieldValues.city.trim(),
      province: fieldValues.province.trim(),
      postalCode: fieldValues.postalCode.trim(),
      instructions: fieldValues.instructions?.trim() || "",
    },
    paymentMethod: "cod",
    pricing: {
      subtotal,
      shippingFee: getShippingFee(subtotal),
      discount: 0,
      total: subtotal + getShippingFee(subtotal),
    },
  };
};
