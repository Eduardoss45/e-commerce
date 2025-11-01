const { calcularFrete } = require('../services/correios.service.js');

const calcCorreios = async (req, res) => {
  try {
    const { cepOrigem, cepDestino, peso, comprimento, altura, largura } = req.query;

    const resultado = await calcularFrete({
      cepOrigem,
      cepDestino,
      peso,
      comprimento,
      altura,
      largura,
    });

    res.json(resultado);
  } catch (error) {
    console.error('Erro ao calcular frete:', error);
    res.status(500).json({ error: 'Erro ao calcular frete' });
  }
};

module.exports = { calcCorreios };
