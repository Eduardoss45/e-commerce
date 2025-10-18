import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { toast } from 'react-toastify';

const CheckCode = () => {
  const { checkCode, resendCode, loading, user } = useAuth(); // adicionamos resendCode
  const [code, setCode] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    if (!code.trim()) {
      return toast.error('Preencha o campo com o código de verificação para prosseguir.');
    }

    try {
      await checkCode(code, user?.email);
    } catch (error) {
      toast.error(error.message || 'Erro ao verificar código!');
    }
  };

  const handleResend = async () => {
    if (!user?.email) {
      return toast.error('Nenhum e-mail encontrado para reenviar o código.');
    }

    try {
      await resendCode(user.email);
    } catch (error) {
      toast.error(error.message || 'Erro ao reenviar código!');
    }
  };

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit}>
        <h2>Verificação</h2>
        <label htmlFor="name">Código:</label>
        <input
          type="text"
          name="code"
          id="code"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Aguarde...' : 'Enviar'}
        </button>
        <p>
          Não recebeu o código?{' '}
          <span onClick={!loading ? handleResend : undefined}>Reenviar código</span>
        </p>
      </form>
    </div>
  );
};

export default CheckCode;
