import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { resetPassword, loading } = useAuth();
  const [email, setEmail] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    if (!email.trim()) {
      return toast.error('Preencha o campo o e-mail prosseguir.');
    }

    try {
      await resetPassword(email);
    } catch (error) {
      toast.error(error.message || 'Erro ao tentar redefinir senha!');
    }
  };

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit}>
        <h2>Redefinir senha</h2>
        <label htmlFor="name">E-mail:</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Aguarde...' : 'Enviar'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
