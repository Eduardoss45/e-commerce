const mongoose = require('mongoose');
const { CartItem } = require('./cartItemModel');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  codeHash: { type: String },
  codeExpiresAt: { type: Date },
  lastCodeSendAt: { type: Date },
  codeAttempts: { type: Number, default: 0 },
  resendAttempts: { type: Number, default: 0 },
  resendWindowStart: { type: Date },
  refreshTokens: { type: [String], default: [] },
  cart: [CartItem],
  verified: { type: Boolean, default: false },
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
