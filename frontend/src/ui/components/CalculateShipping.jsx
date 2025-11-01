import { useState } from 'react';
import axios from 'axios';

const CalculateShipping = () => {
  const [fretes, setFretes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function buscarFrete() {
    try {
      setLoading(true);
      setErro('');
      setFretes([]);

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
      console.error(err);
      setErro('Erro ao calcular o frete. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="frete-container">
      <h2>📦 Cálculo de Frete (Correios)</h2>

      <button
        onClick={buscarFrete}
        className={`btn-calc ${loading ? 'loading' : ''}`}
        disabled={loading}
      >
        {loading ? 'Calculando...' : 'Calcular Frete'}
      </button>

      {erro && <p className="erro-msg">{erro}</p>}

      {fretes.length > 0 && (
        <div className="frete-resultados">
          {fretes.map((frete, index) => (
            <div className="frete-card" key={index}>
              <h4>{frete.tipo}</h4>
              <p className="valor">💰 {frete.valor}</p>
              <p>Prazo: {frete.prazoEntrega} dias úteis</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalculateShipping;
