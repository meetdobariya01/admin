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
      { $group: { 
          _id: { $month: "$createdAt" },  
          totalSales: { $sum: "$totalAmount" }, 
          ordersCount: { $sum: 1 } 
      } },
      { $sort: { "_id": 1 } },
    ]);
    
    // Fix: Ensure totalSales is rounded to avoid the long decimals seen in your UI
    res.json(sales.map(s => ({ 
      month: s._id, 
      totalSales: Math.round(s.totalSales * 100) / 100, // Rounds to 2 decimal places
      orders: s.ordersCount 
    })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().lean();
    const orders = await Order.find().lean();

    const userStatsMap = new Map();

    // 1. Initialize Map with registered users
    users.forEach(user => {
      userStatsMap.set(user._id.toString(), {
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Registered User",
        email: user.email,
        phone: user.phone || "N/A",
        orderCount: 0,
        totalSpent: 0,
        isGuest: false
      });
    });

    // 2. Process all orders
    orders.forEach(o => {
      // Use o.user because that is what your data shows
      const userIdStr = o.user ? o.user.toString() : null;

      if (userIdStr && userStatsMap.has(userIdStr)) {
        // Update Registered User stats
        const stats = userStatsMap.get(userIdStr);
        stats.orderCount += 1;
        stats.totalSpent += (o.totalAmount || 0);
      } else {
        // Handle as Guest User (grouped by email)
        const guestEmail = o.address?.email || "Guest";
        if (userStatsMap.has(guestEmail)) {
          const stats = userStatsMap.get(guestEmail);
          stats.orderCount += 1;
          stats.totalSpent += (o.totalAmount || 0);
        } else {
          userStatsMap.set(guestEmail, {
            name: `${o.address?.firstName || ""} ${o.address?.lastName || ""}`.trim() || "Guest",
            email: guestEmail,
            phone: o.address?.phone || "N/A",
            orderCount: 1,
            totalSpent: o.totalAmount || 0,
            isGuest: true
          });
        }
      }
    });

    // Convert Map values to array for the frontend
    res.json(Array.from(userStatsMap.values()));
  } catch (err) {
    console.error("Error fetching user stats:", err);
    res.status(500).json({ error: "Internal Server Error" });
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
