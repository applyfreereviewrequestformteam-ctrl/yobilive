const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "host", "admin"],
      default: "user",
    },

    profilePic: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    level: {
      type: Number,
      default: 1,
    },

    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    coins: {
      type: Number,
      default: 0,
    },

    diamonds: {
      type: Number,
      default: 0,
    },

    walletBalance: {
      type: Number,
      default: 0,
    },

    isBanned: {
      type: Boolean,
      default: false,
    },

    isVerifiedHost: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
