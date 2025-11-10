const mongoose = require('mongoose');

const CartItem = new mongoose.Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
});

module.exports = { CartItem };
