const mongoose = require('mongoose');
const { CartItem } = require('./cartItemModel');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  codeHash: { type: String },
  codeExpiresAt: { type: Date },
  verified: { type: Boolean, default: false },
  codeAttempts: { type: Number, default: 0 },
  refreshTokens: { type: [String], default: [] },
  lastCodeSendAt: { type: Date },
  resendWindowStart: { type: Date },
  resendAttempts: { type: Number, default: 0 },
  resetPasswordToken: { type: String },
  resetPasswordExpires: {
    type: Date,
    default: () => new Date(Date.now() + 15 * 60 * 1000),
  },
  createdAt: { type: Date, default: Date.now },
  cart: [CartItem],
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
