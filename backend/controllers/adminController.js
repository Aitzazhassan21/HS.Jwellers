import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

// GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    // Total orders
    const totalOrders = await Order.countDocuments();

    // Total revenue (only paid/completed orders)
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $nin: ["cancelled", "returned"] } } },
      { $group: { _id: null, totalRevenue: { $sum: "$pricing.total" } } },
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Total products
    const totalProducts = await Product.countDocuments({ isActive: true });

    // Total customers
    const totalCustomers = await User.countDocuments({ role: "customer" });

    // Recent 10 orders
    const recentOrders = await Order.find()
      .sort("-createdAt")
      .limit(10)
      .populate("customer", "name email")
      .select("orderNumber orderStatus paymentStatus pricing.total createdAt");

    // Orders by status
    const ordersByStatusAgg = await Order.aggregate([
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
    ]);

    const ordersByStatus = ordersByStatusAgg.map((item) => ({
      status: item._id,
      count: item.count,
    }));

    // Revenue by month (last 6 months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const revenueByMonthAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          orderStatus: { $nin: ["cancelled", "returned"] },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$pricing.total" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const revenueMap = new Map(
      revenueByMonthAgg.map((item) => [
        `${item._id.year}-${item._id.month}`,
        item.revenue,
      ])
    );

    const revenueByMonth = [];
    const today = new Date();
    for (let i = 0; i < 6; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      revenueByMonth.push({
        month: monthNames[date.getMonth()],
        revenue: revenueMap.get(key) || 0,
      });
    }

    // Top 5 products by sold count
    const topProducts = await Product.find({ isActive: true })
      .sort("-soldCount -sold")
      .limit(5)
      .select("name soldCount stock images");

    // Low stock products
    const lowStockProducts = await Product.find({ stock: { $lt: 5 }, isActive: true })
      .select("name stock images")
      .limit(10);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalCustomers,
        recentOrders,
        ordersByStatus: ordersByStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
        revenueByMonth: revenueByMonth.map((m) => ({
          month: `${m._id.year}-${String(m._id.month).padStart(2, "0")}`,
          revenue: m.revenue,
        })),
        topProducts,
        lowStockProducts,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
