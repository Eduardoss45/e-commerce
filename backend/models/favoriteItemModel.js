const mongoose = require('mongoose');

const FavoriteItem = new mongoose.Schema({
  productId: { type: String, required: true },
});

module.exports = { FavoriteItem };
