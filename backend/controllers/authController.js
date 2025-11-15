const { User } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const generateCode = require('../utils/generateCode');
const getTemplate = require('../utils/getTemplate');
const sendMail = require('../utils/sendMail');

async function registerController(req, res) {
  const { name, email, password, confirm_password } = req.body;

  if (!name || !email || !password || !confirm_password) {
    return res.status(422).json({
      msg: 'Certifique-se de que todos os campos estão preenchidos e foram enviados.',
    });
  }

  if (password !== confirm_password) {
    return res.status(422).json({ msg: 'As senhas não conferem.' });
  }

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ msg: 'Por favor, utilize outro e-mail.' });
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);
  const data = generateCode();

  const user = new User({
    name,
    email,
    password: passwordHash,
    codeHash: data.codeHash,
    codeExpiresAt: data.codeExpiresAt,
    verified: false,
  });

  try {
    await user.save();
    const html = getTemplate('verification', { name, code: data.code });
    await sendMail(email, 'Verificação de e-mail', html, { isHtml: true });
    res.status(201).json({ msg: `Código de verificação enviado para ${email}.` });
  } catch (error) {
    res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
  }
}

async function loginController(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(422)
      .json({ msg: 'Certifique-se de que todos os campos estão preenchidos e foram enviados.' });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(422).json({ msg: 'Este usuário não existe.' });
  }

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) {
    return res.status(422).json({ msg: 'Senha inválida.' });
  }

  try {
    const access_secret = process.env.ACCESS_SECRET;
    const refresh_secret = process.env.REFRESH_SECRET;
    const payload = {
      id: user._id,
      email: user.email,
    };
    const accessToken = jwt.sign(payload, access_secret, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, refresh_secret, { expiresIn: '30d' });
    const refreshHash = bcrypt.hashSync(refreshToken, 12);
    user.refreshTokens.push(refreshHash);
    await user.save();

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.MODE === 'production' ? true : true,
      sameSite: process.env.MODE === 'production' ? 'strict' : 'none',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.MODE === 'production' ? true : true,
      sameSite: process.env.MODE === 'production' ? 'strict' : 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    res.status(200).json({
      msg: 'Login realizado com sucesso.',
      user: {
        verified: user.verified,
        email: user.email,
        cart: user.cart,
        _id: user._id,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde.' });
  }
}

async function checkCode(req, res) {
  const { email, code } = req.body;

  if (!email || !code) {
    return res
      .status(422)
      .json({ msg: 'Certifique-se de que todos os campos estão preenchidos e foram enviados.' });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(422).json({ msg: 'Este usuário não existe.' });
  }

  try {
    if (user.verified === false) {
      if (!user.codeHash || user.codeExpiresAt.getTime() < Date.now()) {
        return res.status(422).json({ msg: 'Código expirado, solicite outro.' });
      }

      user.codeAttempts = (user.codeAttempts || 0) + 1;

      if (user.codeAttempts > 5) {
        return res.status(429).json({ msg: 'Muitas tentativas, aguarde e gere outro código.' });
      }

      const ok = await bcrypt.compare(code.trim().toUpperCase(), user.codeHash);

      if (!ok) return res.status(422).json({ msg: 'Código inválido.' });

      user.codeHash = undefined;
      user.codeExpiresAt = undefined;
      user.codeAttempts = 0;
      user.verified = true;
      await user.save();
    }

    res.status(200).json({ msg: 'Usuário autenticado com sucesso.' });
  } catch (error) {
    res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde.' });
  }
}

async function refreshToken(req, res) {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ msg: 'Token de atualização não fornecido.' });
  }

  try {
    const refresh_secret = process.env.REFRESH_SECRET;
    const decoded = jwt.verify(refreshToken, refresh_secret);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ msg: 'Este usuário não existe.' });

    const isValid = user.refreshTokens.some(rt => bcrypt.compareSync(refreshToken, rt));

    if (!isValid) {
      return res.status(403).json({ msg: 'Token de atualização inválido.' });
    }

    user.refreshTokens = user.refreshTokens.filter(rt => !bcrypt.compareSync(refreshToken, rt));

    const payload = { id: user._id, email: user.email };

    const newRefreshToken = jwt.sign(payload, refresh_secret, { expiresIn: '30d' });
    const refreshHash = bcrypt.hashSync(newRefreshToken, 12);
    user.refreshTokens.push(refreshHash);
    await user.save();

    const access_secret = process.env.ACCESS_SECRET;
    const token = jwt.sign({ id: user._id, email: user.email }, access_secret, {
      expiresIn: '15m',
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.MODE === 'production' ? true : true,
      sameSite: process.env.MODE === 'production' ? 'strict' : 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/auth/refresh',
    });

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.MODE === 'production' ? true : true,
      sameSite: process.env.MODE === 'production' ? 'strict' : 'none',
      maxAge: 15 * 60 * 1000,
      path: '/',
    });

    return res.status(200).json({ msg: 'Token atualizado com sucesso.' });
  } catch (error) {
    return res.status(403).json({ msg: 'Token de atualização inválido ou expirado.' });
  }
}

async function resendCodeController(req, res) {
  const { email } = req.body;

  if (!email) {
    return res
      .status(422)
      .json({ msg: 'Certifique-se de que todos os campos estão preenchidos e foram enviados.' });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ msg: 'Este usuário não existe.' });
  }

  if (user.verified) {
    return res.status(422).json({ msg: 'Este usuário já está verificado.' });
  }

  const now = Date.now();
  const lastSent = user.lastCodeSendAt ? new Date(user.lastCodeSendAt).getTime() : 0;

  if (now - lastSent < 15 * 60 * 1000) {
    return res
      .status(429)
      .json({ msg: 'Você já solicitou um código recentemente, aguarde 15 minutos.' });
  }

  if (!user.resendWindowStart || now - user.resendWindowStart.getTime() > 60 * 60 * 1000) {
    user.resendWindowStart = new Date(now);
    user.resendAttempts = 0;
  }

  if (user.resendAttempts >= 3) {
    return res.status(429).json({ msg: 'Você atingiu o limite de 3 reenvios a cada 1 hora.' });
  }
  try {
    const data = generateCode();
    user.codeHash = data.codeHash;
    user.codeExpiresAt = data.codeExpiresAt;
    user.codeAttempts = data.codeAttempts;
    user.lastCodeSendAt = new Date();
    user.resendAttempts++;
    await user.save();

    const html = getTemplate('new_verification', { name: user.name, code: data.code });
    await sendMail(email, 'Verificação de e-mail', html, { isHtml: true });

    res.status(200).json({ msg: `Novo código de verificação enviado para ${email}.` });
  } catch (error) {
    res.status(500).json({ msg: 'Aconteceu um erro no servidor, tente novamente mais tarde.' });
  }
}

async function logoutController(req, res) {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken)
    return res
      .status(204)
      .json({ msg: 'Certifique-se de que todos os campos estão preenchidos e foram enviados.' });

  const user = await User.findOne({ refreshTokens: { $exists: true } });
  if (!user) return res.status(204).json({ msg: 'Este usuário não existe.' });

  user.refreshTokens = user.refreshTokens.filter(rt => !bcrypt.compareSync(refreshToken, rt));
  await user.save();

  res.clearCookie('accessToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.MODE === 'production',
    path: '/',
  });
  res.clearCookie('refreshToken', {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.MODE === 'production',
    path: '/auth/refresh',
  });
  res.sendStatus(204);
}

async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ msg: 'Certifique-se de que todos os campos estão preenchidos e foram enviados.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: 'Este usuário não existe.' });
    }

    const token = crypto
      .createHash('sha256')
      .update(`${user._id}${Date.now()}${crypto.randomBytes(20).toString('hex')}`)
      .digest('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();
    const resetLink = `${process.env.CLIENT_URL}${process.env.RESET_PASS}${token}`;
    const html = getTemplate('change_password', { name: user.name, link: resetLink });
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Reset Link]: ${resetLink}`);
    }

    await sendMail(email, 'Redefinição de senha - Link de acesso', html, { isHtml: true });

    return res.status(200).json({ msg: 'Redefinição de senha solicitada com sucesso.' });
  } catch (error) {
    return res.status(500).json({ msg: 'Erro interno do servidor.' });
  }
}

async function resetPassword(req, res) {
  const { token } = req.params;
  const { new_password, confirm_new_password } = req.body;

  if (!token || !new_password || !confirm_new_password) {
    return res
      .status(400)
      .json({ msg: 'Certifique-se de que todos os campos estão preenchidos e foram enviados.' });
  }

  if (new_password !== confirm_new_password) {
    return res.status(400).json({ msg: 'As senhas não coincidem.' });
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new Error('Token inválido ou expirado');
  }

  const hashedPassword = await bcrypt.hash(new_password, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  const html = getTemplate('password_changed', { name: user.name });

  await sendMail(user.email, 'Senha redefinida com sucesso', html, { isHtml: true });

  return res.status(200).json({ msg: 'Senha redefinida com sucesso.' });
}

async function getMe(req, res) {
  const id = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ msg: 'ID inválido!' });

  try {
    const user = await User.findById(id, '-password -__v')
      .populate('cart.productId')
      .populate('favorites.productId');
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });
    res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro interno do servidor' });
  }
}

module.exports = {
  registerController,
  loginController,
  checkCode,
  refreshToken,
  resendCodeController,
  logoutController,
  forgotPassword,
  resetPassword,
  getMe,
};
