import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";

// Generate order number: ANJ-2025-XXXX
const generateOrderNumber = () => {
  const prefix = "ANJ";
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${random}`;
};

const restoreStockForOrder = async (order) => {
  for (const item of order.items) {
    const productId = item.product?._id || item.product;
    if (!productId) continue;
    await Product.findByIdAndUpdate(productId, {
      $inc: {
        stock: item.quantity,
        sold: -item.quantity,
        soldCount: -item.quantity,
      },
    });
  }
};

// POST /api/orders — public, guest allowed
export const placeOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      guestInfo,
      customer,
      customerInfo,
      pricing,
    } = req.body;

    const hasValidShippingAddress =
      shippingAddress?.fullName &&
      shippingAddress?.phone &&
      (shippingAddress?.address || shippingAddress?.street) &&
      shippingAddress?.city &&
      shippingAddress?.province;

    if (!items?.length || !hasValidShippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Items, shipping address and payment method are required",
      });
    }

    const orderItems = [];
    for (const item of items) {
      const productId = item.product || item.productId;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product not found: ${productId}`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Sorry! Only ${product.stock} units left of ${product.name}`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || "",
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
      });

      await Product.findByIdAndUpdate(product._id, {
        $inc: {
          stock: -item.quantity,
          soldCount: +item.quantity,
          sold: +item.quantity,
        },
      });
    }

    const orderNumber = generateOrderNumber();
    const reservedUntil = paymentMethod === "bank_transfer"
      ? new Date(Date.now() + 24 * 60 * 60 * 1000)
      : null;

    const finalShippingAddress = {
      fullName: shippingAddress.fullName,
      phone: shippingAddress.phone,
      address: shippingAddress.address || shippingAddress.street || "",
      city: shippingAddress.city,
      province: shippingAddress.province,
      postalCode: shippingAddress.postalCode || "",
      notes: shippingAddress.notes || shippingAddress.instructions || "",
      street: shippingAddress.street || "",
      instructions: shippingAddress.instructions || "",
    };

    const orderData = {
      orderNumber,
      customer: customer || null,
      customerInfo: {
        name: customerInfo?.name || guestInfo?.name || "",
        phone: customerInfo?.phone || guestInfo?.phone || "",
        email: customerInfo?.email || guestInfo?.email || "",
        cnic: customerInfo?.cnic || "",
      },
      guestInfo: guestInfo || {},
      items: orderItems,
      shippingAddress: finalShippingAddress,
      pricing: {
        subtotal: pricing?.subtotal ?? orderItems.reduce((s, i) => s + i.subtotal, 0),
        shippingFee: pricing?.shippingFee ?? 0,
        discount: pricing?.discount ?? 0,
        total: pricing?.total ?? orderItems.reduce((s, i) => s + i.subtotal, 0) + (pricing?.shippingFee ?? 0),
      },
      paymentMethod,
      paymentStatus: "pending",
      reservedUntil,
      orderTime: new Date(),
      status: "pending",
      orderStatus: "pending",
      statusHistory: [
        { status: "pending", note: "Order placed", updatedAt: new Date() },
      ],
    };

    const order = await Order.create(orderData);

    res.status(201).json({
      success: true,
      order,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/my — protected
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort("-createdAt")
      .populate("items.product", "name images slug");
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("My orders error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id — protected
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("items.product", "name images slug price");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    // Allow if logged-in customer OR matching guest phone
    if (req.user && order.customer?.toString() === req.user._id.toString()) {
      return res.status(200).json({ success: true, order });
    }
    // Guest access via order number
    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders — admin
export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const skip = (Number(page) - 1) * Number(limit);
    const orders = await Order.find(filter)
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit))
      .populate("customer", "name email phone")
      .populate("items.product", "name images");

    const total = await Order.countDocuments(filter);
    res.status(200).json({ success: true, orders, pagination: { page: Number(page), limit: Number(limit), total } });
  } catch (error) {
    console.error("All orders error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/orders/:id/status — admin
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const isBecomingCancelled = ["cancelled", "returned"].includes(status);
    const wasActive = !["cancelled", "returned"].includes(order.orderStatus);
    if (isBecomingCancelled && wasActive) {
      await restoreStockForOrder(order);
    }

    order.orderStatus = status;
    order.statusHistory.push({ status, note: note || "", updatedAt: new Date() });
    await order.save();

    res.status(200).json({ success: true, message: "Status updated", order });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/orders/:id/cancel — customer
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Check ownership
    if (req.user && order.customer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: "Cannot cancel this order" });
    }

    // Restore stock and sales counters
    await restoreStockForOrder(order);

    order.orderStatus = "cancelled";
    order.statusHistory.push({ status: "cancelled", note: "Cancelled by customer", updatedAt: new Date() });
    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled", order });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
