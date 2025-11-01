const axios = require('axios');
const { parseStringPromise } = require('xml2js');

const WSDL_URL = process.env.CORREIOS_API_URL;

async function calcularFrete({
  cepOrigem,
  cepDestino,
  peso,
  comprimento,
  altura,
  largura,
  valorDeclarado = 0,
  codigosServicos = ['04014', '04510'], // SEDEX e PAC
}) {
  const nCdServico = codigosServicos.join(',');

  const params = new URLSearchParams({
    nCdEmpresa: process.env.CORREIOS_CODIGO_EMPRESA || '',
    sDsSenha: process.env.CORREIOS_SENHA || '',
    nCdServico,
    sCepOrigem: cepOrigem,
    sCepDestino: cepDestino,
    nVlPeso: peso.toString(),
    nCdFormato: '1', // 1 = caixa/pacote
    nVlComprimento: comprimento.toString(),
    nVlAltura: altura.toString(),
    nVlLargura: largura.toString(),
    nVlDiametro: '0',
    sCdMaoPropria: 'N',
    nVlValorDeclarado: valorDeclarado.toString(),
    sCdAvisoRecebimento: 'N',
    StrRetorno: 'xml',
  });

  const { data } = await axios.post(WSDL_URL, params);
  const parsed = await parseStringPromise(data, { explicitArray: false });

  const servicos = parsed?.Servicos?.cServico;
  const lista = Array.isArray(servicos) ? servicos : [servicos];

  return lista.map(servico => ({
    codigo: servico?.Codigo,
    tipo: servico?.Codigo === '04014' ? 'SEDEX' : servico?.Codigo === '04510' ? 'PAC' : 'Outro',
    valor: servico?.Valor,
    prazoEntrega: servico?.PrazoEntrega,
    erro: servico?.Erro,
    mensagem: servico?.MsgErro,
  }));
}

module.exports = { calcularFrete };
