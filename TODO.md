# 📦 Guia: Integração dos Correios com Express + React

Este guia mostra passo a passo como integrar o cálculo de frete dos **Correios** em um e-commerce feito com **React (frontend)** e **Express (backend)**, usando a API oficial via SOAP e convertendo o resultado em JSON.

## ⚙️ Passo 1 — Instalar dependências

**Backend**:

```bash
npm install axios xml2js
```

## 🧩 Passo 2 — Criar o arquivo `.env`

Ajuste o arquivo `.env` dentro da pasta `backend/` para incluir os seguinte conteúdos:

```env
CORREIOS_URL=https://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPrecoPrazo
CORREIOS_CODIGO_EMPRESA=
CORREIOS_SENHA=
```

## 🧠 Passo 3 — Criar o serviço dos Correios

📄 **`backend/services/correios.service.js`**

```js
import axios from 'axios';
import { parseStringPromise } from 'xml2js';

const WSDL_URL = process.env.CORREIOS_URL;

export async function calcularFrete({
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
```

## 🌐 Passo 4 — Criar a rota

📄 **`backend/routes/router.js`**

Adicione ao router

```js
router.get('/frete', calcCorreios);
```

📄 **`backend/controllers/productsController.js`**

Adicione isto

```js
import { calcularFrete } from '../services/correios.service.js';

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
```

## 💻 Passo 5 — Frontend React

📄 **`frontend/App.jsx`**

```jsx
import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [fretes, setFretes] = useState([]);
  const [loading, setLoading] = useState(false);

  async function buscarFrete() {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:3000/frete', {
        params: {
          cepOrigem: '01001-000',
          cepDestino: '20040-020',
          peso: 1,
          comprimento: 20,
          altura: 10,
          largura: 15,
        },
      });
      setFretes(data);
    } catch (err) {
      alert('Erro ao calcular frete');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Calcular Frete (Correios)</h2>
      <button onClick={buscarFrete} disabled={loading}>
        {loading ? 'Calculando...' : 'Calcular'}
      </button>

      {fretes.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3>Resultados:</h3>
          {fretes.map(frete => (
            <div key={frete.codigo} style={{ marginBottom: 10 }}>
              <strong>{frete.tipo}</strong> — {frete.valor}
              <br />
              Prazo: {frete.prazoEntrega} dias úteis
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```
