const mongoose = require('mongoose');

const CartItem = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1, min: 1 },
});

module.exports = { CartItem };
