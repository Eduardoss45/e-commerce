const express = require('express');
const router = express.Router();
const { checkEmptyBody, checkToken } = require('../middlewares/authMiddleware');
const {
  getMe,
  registerController,
  loginController,
  checkCode,
  resendCodeController,
  refreshToken,
  logoutController,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');
const {
  getFavoriteProducts,
  getCartProducts,
  removeItemFromCart,
  addItemToFavorites,
  removeItemFromFavorites,
  addItemToCart,
  createCheckoutSession,
} = require('../controllers/productController');

router.post('/auth/register', checkEmptyBody, registerController);
router.post('/auth/login', checkEmptyBody, loginController);
router.post('/auth/verify', checkEmptyBody, checkCode);
router.post('/auth/resend-code', checkEmptyBody, resendCodeController);
router.post('/auth/refresh', refreshToken);
router.post('/auth/logout', logoutController);
router.get('/auth/me', checkToken, getMe);
router.post('/auth/password-reset-request', forgotPassword);
router.post('/auth/reset-password/:token', resetPassword);

router.get('/user/:id/cart-products', getCartProducts);
router.get('/user/:id/favorite-products', getFavoriteProducts);
router.post('/user/:id/add-item-cart', checkToken, checkEmptyBody, addItemToCart);
router.post('/user/:id/remove-item-cart', checkToken, checkEmptyBody, removeItemFromCart);
router.post('/user/:id/add-item-favorites', checkToken, checkEmptyBody, addItemToFavorites);
router.post('/user/:id/remove-item-favorites', checkToken, checkEmptyBody, removeItemFromFavorites);

router.post('/create-checkout-session', checkToken, createCheckoutSession);

module.exports = router;
