const mongoose = require("mongoose");

const GiftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    valueInDiamonds: {
      type: Number,
      required: true,
      default: 1,
    },

    image: {
      type: String, // URL for gift animation / icon
      default: "",
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiverRoom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    message: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gift", GiftSchema);
