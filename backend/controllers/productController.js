const { User } = require('../models/userModel');
const mongoose = require('mongoose');
const axios = require('axios');

async function getCartProducts(req, res) {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });

    const cartItems = user.cart || [];
    if (cartItems.length === 0) return res.json({ products: [] });

    const productIds = cartItems.map(item => item.productId);

    const requests = productIds.map(id =>
      axios.get(`https://dummyjson.com/products/${id}`).then(r => r.data)
    );

    const productsData = await Promise.all(requests);

    const products = cartItems.map((item, i) => ({
      _id: item._id,
      productId: item.productId,
      quantity: item.quantity,
      details: productsData[i],
    }));

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao buscar produtos do carrinho' });
  }
}

async function getFavoriteProducts(req, res) {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });

    const favorites = user.favorites || [];
    if (favorites.length === 0) return res.json({ favorites: [] });

    const requests = favorites.map(fav =>
      axios.get(`https://dummyjson.com/products/${fav.productId}`).then(r => r.data)
    );

    const favoritesData = await Promise.all(requests);

    const response = favorites.map((fav, i) => ({
      _id: fav._id,
      productId: fav.productId,
      details: favoritesData[i],
    }));

    res.json({ favorites: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Erro ao buscar favoritos' });
  }
}

async function addItemToCart(req, res) {
  const userId = req.params.id;
  const { productId, quantity } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(400).json({ msg: 'ID inválido!' });

  if (!productId || typeof quantity !== 'number' || quantity === 0)
    return res.status(422).json({ msg: 'Quantidade inválida!' });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });

  const itemIndex = user.cart.findIndex(item => String(item.productId) === String(productId));

  if (itemIndex >= 0) {
    const newQuantity = user.cart[itemIndex].quantity + quantity;

    if (newQuantity <= 0) {
      user.cart.splice(itemIndex, 1);
    } else {
      user.cart[itemIndex].quantity = newQuantity;
    }
  } else if (quantity > 0) {
    user.cart.push({ productId, quantity });
  } else {
    return res
      .status(400)
      .json({ msg: 'Não é possível subtrair um item que não está no carrinho' });
  }

  user.markModified('cart');
  await user.save();

  return res.status(200).json({
    msg: 'Carrinho atualizado com sucesso',
    cart: user.cart,
  });
}

async function removeItemFromCart(req, res) {
  const userId = req.params.id;
  const { cartItemId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(400).json({ msg: 'ID inválido!' });
  if (!mongoose.Types.ObjectId.isValid(cartItemId))
    return res.status(422).json({ msg: 'ID do item inválido!' });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });

  const itemIndex = user.cart.findIndex(item => item._id.toString() === cartItemId);
  if (itemIndex === -1) return res.status(404).json({ msg: 'Produto não encontrado no carrinho!' });

  user.cart.splice(itemIndex, 1);

  await user.save();

  return res.status(200).json({
    msg: 'Produto removido do carrinho com sucesso',
    cart: user.cart,
  });
}

async function addItemToFavorites(req, res) {
  const userId = req.params.id;
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(400).json({ msg: 'ID de usuário inválido!' });
  if (!productId) return res.status(422).json({ msg: 'Dados do produto inválidos!' });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });

  const alreadyExists = user.favorites.some(item => String(item.productId) === String(productId));

  if (!alreadyExists) {
    user.favorites.push({ productId });
    await user.save();
  }

  return res.status(200).json({
    msg: alreadyExists
      ? 'Produto já está nos favoritos.'
      : 'Produto adicionado aos favoritos com sucesso.',
    favorites: user.favorites,
  });
}

async function removeItemFromFavorites(req, res) {
  const userId = req.params.id;
  const { favoriteItemId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(userId))
    return res.status(400).json({ msg: 'ID de usuário inválido!' });
  if (!mongoose.Types.ObjectId.isValid(favoriteItemId))
    return res.status(422).json({ msg: 'ID do item inválido!' });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ msg: 'Usuário não encontrado' });

  const itemIndex = user.favorites.findIndex(item => String(item._id) === String(favoriteItemId));

  if (itemIndex === -1)
    return res.status(404).json({ msg: 'Produto não encontrado nos favoritos!' });

  user.favorites.splice(itemIndex, 1);
  await user.save();

  return res.status(200).json({
    msg: 'Produto removido dos favoritos com sucesso',
    favorites: user.favorites,
  });
}

module.exports = {
  getCartProducts,
  getFavoriteProducts,
  addItemToCart,
  removeItemFromCart,
  addItemToFavorites,
  removeItemFromFavorites,
};
