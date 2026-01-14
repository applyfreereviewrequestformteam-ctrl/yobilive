const express = require("express");
const User = require("../models/User");
const Room = require("../models/Room");
const Gift = require("../models/Gift");

const router = express.Router();

// Get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Ban / Unban user
router.post("/ban/:userId", async (req, res) => {
  try {
    const { ban } = req.body; // true or false
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBanned = ban;
    await user.save();

    res.json({ message: `User ${ban ? "banned" : "unbanned"}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Approve / Reject Host
router.post("/approve-host/:userId", async (req, res) => {
  try {
    const { approve } = req.body; // true or false
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerifiedHost = approve;
    await user.save();

    res.json({ message: `Host ${approve ? "approved" : "rejected"}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Gift price / value update
router.post("/gift/:giftId", async (req, res) => {
  try {
    const { valueInDiamonds } = req.body;
    const gift = await Gift.findById(req.params.giftId);
    if (!gift) return res.status(404).json({ message: "Gift not found" });

    gift.valueInDiamonds = valueInDiamonds || gift.valueInDiamonds;
    await gift.save();

    res.json({ message: "Gift updated", gift });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get earnings / stats (basic)
router.get("/stats", async (req, res) => {
  try {
    const users = await User.find();
    const totalDiamonds = users.reduce((sum, u) => sum + (u.diamonds || 0), 0);
    const totalWallet = users.reduce((sum, u) => sum + (u.walletBalance || 0), 0);

    res.json({
      totalUsers: users.length,
      totalDiamonds,
      totalWallet,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
