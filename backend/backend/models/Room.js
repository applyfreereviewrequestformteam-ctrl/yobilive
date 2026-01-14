const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },

    password: {
      type: String, // Only for private rooms
    },

    micSeats: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        isMuted: { type: Boolean, default: false },
      },
    ],

    theme: {
      type: String,
      default: "default",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", RoomSchema);
