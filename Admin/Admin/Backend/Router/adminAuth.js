const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");

// Admin Login Only
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ==== DEV BYPASS LOGIN ====
    if (email === "admin@example.com" && password === "admin123") {
      const token = jwt.sign(
        { id: "devAdminId", email, isAdmin: true },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Login successful (dev bypass)",
        token,
        user: { id: "devAdminId", email, name: "Dev Admin" }
      });
    }
    // ===========================

    // Find user in DB
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Check admin role
    if (!user.isAdmin) return res.status(403).json({ message: "Access denied. Admins only." });

    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
