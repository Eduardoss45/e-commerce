const { User } = require('../models/userModel');
const mongoose = require('mongoose');

async function userData(req, res) {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID inválido!' });
  }

  const user = await User.findById(id, '-password -__v');

  if (!user) {
    return res.status(404).json({ msg: 'Usuário não encontrado' });
  }

  res.status(200).json({ user });
}

async function userAddItemCart(req, res) {
  const id = req.params.id;
  const { productId, quantity } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID inválido!' });
  }
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ msg: 'Usuário não encontrado' });
  }
  if (!productId || !quantity || quantity <= 0) {
    return res.status(422).json({ msg: 'Por favor, envie o ID do produto e a quantidade válida!' });
  }
  const existingItem = user.cart.find(item => item.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    user.cart.push({ productId, quantity });
  }
  await user.save();
  return res.status(200).json({
    msg: 'Produto adicionado ao carrinho com sucesso',
    cart: user.cart,
  });
}

async function userRemoveItemCart(req, res) {
  const id = req.params.id;
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'ID inválido!' });
  }

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ msg: 'Usuário não encontrado' });
  }

  if (!productId) {
    return res.status(422).json({ msg: 'Por favor, envie o ID do produto!' });
  }

  const itemIndex = user.cart.findIndex(item => item.productId === productId);
  if (itemIndex === -1) {
    return res.status(404).json({ msg: 'Produto não encontrado no carrinho!' });
  }

  // Remove o item do array
  user.cart.splice(itemIndex, 1);

  await user.save();

  return res.status(200).json({
    msg: 'Produto removido do carrinho com sucesso',
    cart: user.cart,
  });
}

module.exports = {
  userData,
  userRemoveItemCart,
  userAddItemCart,
};
