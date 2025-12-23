// Router/stats.js
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Order = require("../Models/Order");
const User = require("../Models/User");

// Average Daily Sales
router.get("/average-sales", async (req, res) => {
  try {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const orders = await Order.find({ status: "Delivered", createdAt: { $gte: last30Days } });
    const totalIncome = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const avgDailySales = totalIncome / 30;
    res.json({ totalIncome, avgDailySales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Monthly Sales
router.get("/sales-overview", async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: { $month: "$createdAt" }, totalSales: { $sum: "$totalAmount" }, ordersCount: { $sum: 1 } } },
      { $sort: { "_id": 1 } },
    ]);
    res.json(sales.map(s => ({ month: s._id, totalSales: s.totalSales, orders: s.ordersCount })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("firstName lastName email phone");
    const data = await Promise.all(
      users.map(async user => {
        const orderCount = await Order.countDocuments({ user: user._id });
        const totalSpentAgg = await Order.aggregate([{ $match: { user: new mongoose.Types.ObjectId(user._id) } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]);
        return {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone || "N/A",
          orderCount,
          totalSpent: totalSpentAgg[0]?.total || 0,
        };
      })
    );
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Popular products
router.get("/popular-products", async (req, res) => {
  try {
    const popular = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { "items.product": { $ne: null } } },
      { $group: { _id: "$items.product", totalSold: { $sum: "$items.quantity" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      { $project: { _id: 0, productId: "$product._id", name: "$product.name", totalSold: 1, price: "$product.price", image: "$product.image" } },
    ]);
    res.json(popular);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
