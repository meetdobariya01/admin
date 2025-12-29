

const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Order = require("../Models/Order");
const User = require("../Models/User");

require("events").EventEmitter.defaultMaxListeners = 25;

// ✅ Setup email transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Get all orders (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "name price image")
      .populate("items.box", "name size price")
      .lean();

    res.json({ orders }); // ✅ SEND FULL ORDER (includes address)
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: error.message });
  }
});


// ✅ Get single order
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "firstName lastName email")
      .populate("items.product", "name price image")
      .populate("items.box", "name size price");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Update order delivery status + send email
router.put("/:id/status", async (req, res) => {
  const { status, message } = req.body;
  const allowedStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Ensure trackingHistory exists
    if (!Array.isArray(order.trackingHistory)) order.trackingHistory = [];

    // Update status & tracking
    order.status = status;
    order.trackingHistory.push({
      status,
      message: message || `Order marked as ${status}`,
      date: new Date(),
    });

    await order.save();

    // Determine email recipient
    const recipientEmail = order.user?.email || order.address?.email;
    const fullName =
      (order.user
        ? `${order.user.firstName || ""} ${order.user.lastName || ""}`
        : order.address
        ? `${order.address.firstName || ""} ${order.address.lastName || ""}`
        : "Customer"
      ).trim();

    // Send email if email exists & SMTP credentials set
    if (recipientEmail && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: `Your order status: ${status}`,
        html: `
          <h3>Hello ${fullName},</h3>
          <p>Your order status has been updated to: <b>${status}</b>.</p>
          <p>${message || "We'll keep you updated as it progresses."}</p>
          <hr/>
          <p>Thank you for shopping with us!</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${recipientEmail}`);
      } catch (err) {
        console.error("⚠️ Email sending failed:", err.response || err.message || err);
      }
    }

    res.json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Dashboard summary
router.get("/stats/summary", async (req, res) => {
  try {
    const delivered = await Order.find({ status: "Delivered" });
    const totalIncome = delivered.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalProfit = totalIncome * 0.2;
    res.json({ totalOrders: delivered.length, totalIncome, totalProfit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
