const mongoose = require('mongoose');

const CartItem = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1, min: 1 },
  },
  { _id: false }
);

module.exports = { CartItem };
