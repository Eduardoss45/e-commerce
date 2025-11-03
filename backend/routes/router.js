const express = require('express');
const router = express.Router();
const { checkEmptyBody, checkToken } = require('../middlewares/authMiddleware');
const {
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

router.post('/auth/register', checkEmptyBody, registerController);
router.post('/auth/login', checkEmptyBody, loginController);
router.post('/auth/verify', checkEmptyBody, checkCode);
router.post('/auth/resend-code', checkEmptyBody, resendCodeController);
router.post('/auth/refresh', refreshToken);
router.post('/auth/logout', logoutController);

router.post('/password-reset-request', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/user/:id', checkToken, userData);
router.post('/user/:id/add-item-cart', checkToken, checkEmptyBody, userAddItemCart);
router.post('/user/:id/add-item-cart', checkToken, checkEmptyBody, userRemoveItemCart);

module.exports = router;
