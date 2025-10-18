import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();

    if (email.length < 0 || password.length < 0) {
      toast.error('Preencha todos os campos.');
    }

    try {
      await login(email, password);
    } catch (error) {
      toast.error(error.message || 'Erro ao fazer login!');
    }
  };

  return (
    <div className="register-form">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
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
        <button type="submit" disabled={loading}>
          {loading ? 'Aguarde...' : 'Entrar'}
        </button>
        <p>ou</p>
        <Link to="/register">Crie sua conta</Link>
      </form>
    </div>
  );
};

export default Login;
