// * imports
const express = require('express');
const router = express.Router();
const { checkEmptyBody, checkToken } = require('../middlewares/authMiddleware');
const {
  registerController,
  loginController,
  resendCodeController,
  refreshToken,
  logoutController,
} = require('../controllers/authController');
const { userInfo, userAddItemCart } = require('../controllers/userController');

// * autenticação
router.post('/auth/register', checkEmptyBody, registerController);
router.post('/auth/login', checkEmptyBody, loginController);
router.post('/auth/resend-code', checkEmptyBody, resendCodeController);
router.post('/auth/refresh', refreshToken);
router.post('/auth/logout', logoutController);

// * usuário
router.get('/user/:id', checkToken, userInfo);
router.post('/user/:id/add-item-cart', checkToken, checkEmptyBody, userAddItemCart);

// * export
module.exports = router;
