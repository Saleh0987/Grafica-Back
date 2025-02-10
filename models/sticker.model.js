const mongoose = require("mongoose");

const stickerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  sale: {
    type: String,
    required: true,
 },
  onSale: {
    type: Boolean,
    required: true,
  },
});

module.exports =  mongoose.model("Sticker", stickerSchema);
