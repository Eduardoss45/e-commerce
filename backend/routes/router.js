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
const { userData, userAddItemCart, userRemoveItemCart } = require('../controllers/userController');
const { getProducts } = require('../controllers/productController');

router.post('/auth/register', checkEmptyBody, registerController);
router.post('/auth/login', checkEmptyBody, loginController);
router.post('/auth/verify', checkEmptyBody, checkCode);
router.post('/auth/resend-code', checkEmptyBody, resendCodeController);
router.post('/auth/refresh', refreshToken);
router.post('/auth/logout', logoutController);
router.get('/auth/me', checkToken, getMe);

router.post('/password-reset-request', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/products',  getProducts);
router.get('/user/:id', checkToken, userData);
router.post('/user/:id/add-item-cart', checkToken, checkEmptyBody, userAddItemCart);
router.post('/user/:id/remove-item-cart', checkToken, checkEmptyBody, userRemoveItemCart);

module.exports = router;
