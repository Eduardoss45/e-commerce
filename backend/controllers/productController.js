const { User } = require('../models/userModel');

async function getProducts(req, res) {
  const { id } = req.body;

  try {
    const user = await User.findOne({ 'cart._id': id });

    if (!user) {
      return res.status(404).json({ msg: 'Usuário ou item não encontrado.' });
    }

    const product = user.cart.id(id);

    if (!product) {
      return res.status(404).json({ msg: 'Produto não encontrado no carrinho.' });
    }

    // Converte o subdocumento em objeto puro e remove o _id
    const plainProduct = product.toObject();
    delete plainProduct._id;

    res.status(200).json({ produto: plainProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Aconteceu um erro no servidor, tente novamente mais tarde!',
    });
  }
}

module.exports = { getProducts };
