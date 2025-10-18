import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Register = () => {
  const { register, loading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem!');
    }

    try {
      await register(name, email, password, confirmPassword);
    } catch (error) {
      toast.error(error.message || 'Erro ao cadastrar!');
    }
  };

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit}>
        <h2>Registre-se</h2>
        <label htmlFor="name">Nome:</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <label htmlFor="email">E-mail:</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <label htmlFor="password">Senha:</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <label htmlFor="confirm_password">Confirme sua senha:</label>
        <input
          type="password"
          name="confirm_password"
          id="confirm_password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Aguarde...' : 'Enviar'}
        </button>
        <p>ou</p>
        <Link to="/login">Acesse sua conta</Link>
      </form>
    </div>
  );
};

export default Register;
