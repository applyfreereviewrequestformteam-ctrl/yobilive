const express = require("express");
const User = require("../models/User");
const Gift = require("../models/Gift");
const router = express.Router();

// Add Diamonds from Gift (simulate gift conversion)
router.post("/add-diamonds/:userId", async (req, res) => {
  try {
    const { diamonds } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.diamonds += diamonds || 0;
    await user.save();

    res.json({ diamonds: user.diamonds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Convert Diamonds to Wallet
router.post("/convert/:userId", async (req, res) => {
  try {
    const { amount } = req.body; // amount in diamonds
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.diamonds < amount) {
      return res.status(400).json({ message: "Insufficient diamonds" });
    }

    const conversionRate = 1; // 1 diamond = 1 currency unit, adjust as needed
    const walletAmount = amount * conversionRate;

    user.diamonds -= amount;
    user.walletBalance += walletAmount;

    await user.save();
    res.json({ walletBalance: user.walletBalance, diamonds: user.diamonds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Request Withdrawal (Admin approval logic can be added later)
router.post("/withdraw/:userId", async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.walletBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // For now, just deduct and simulate admin approval
    user.walletBalance -= amount;
    await user.save();

    res.json({ message: "Withdrawal request submitted", walletBalance: user.walletBalance });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
