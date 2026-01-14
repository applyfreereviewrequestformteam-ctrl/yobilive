const express = require("express");
const Room = require("../models/Room");
const User = require("../models/User");

const router = express.Router();

// Create Room
router.post("/create", async (req, res) => {
  try {
    const { name, hostId, type, password, theme } = req.body;

    const host = await User.findById(hostId);
    if (!host) return res.status(404).json({ message: "Host not found" });

    const newRoom = new Room({
      name,
      host: host._id,
      type: type || "public",
      password: password || "",
      theme: theme || "default",
    });

    await newRoom.save();
    res.status(201).json({ room: newRoom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Join Room
router.post("/join/:roomId/:userId", async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    const user = await User.findById(req.params.userId);
    if (!room || !user) return res.status(404).json({ message: "Not found" });

    if (room.type === "private" && req.body.password !== room.password) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    if (!room.participants.includes(user._id)) {
      room.participants.push(user._id);
      await room.save();
    }

    res.json({ room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Leave Room
router.post("/leave/:roomId/:userId", async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    const user = await User.findById(req.params.userId);
    if (!room || !user) return res.status(404).json({ message: "Not found" });

    room.participants = room.participants.filter(
      (p) => p.toString() !== user._id.toString()
    );
    await room.save();

    res.json({ message: "Left room" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Change Room Theme
router.post("/theme/:roomId", async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    room.theme = req.body.theme || room.theme;
    await room.save();

    res.json({ room });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
