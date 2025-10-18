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
const { userInfo, userAddItemCart } = require('../controllers/userController');

router.post('/auth/register', checkEmptyBody, registerController);
router.post('/auth/login', checkEmptyBody, loginController);
router.post('/auth/verify', checkEmptyBody, checkCode);
router.post('/auth/resend-code', checkEmptyBody, resendCodeController);
router.post('/auth/refresh', refreshToken);
router.post('/password-reset-request', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/auth/logout', logoutController);
// ! Trabalhar as rotas abaixo
router.get('/user/:id', checkToken, userInfo);
router.post('/user/:id/add-item-cart', checkToken, checkEmptyBody, userAddItemCart);

module.exports = router;
