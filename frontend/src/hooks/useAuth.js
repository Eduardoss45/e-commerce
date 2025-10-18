import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const { user, token, setAuth, clearAuth } = useAuthStore();
  const navigate = useNavigate();

  const register = async (name, email, password, confirm_password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name,
        email,
        password,
        confirm_password,
      });
      navigate('/login');
      toast.success(res.data.msg);
    } catch (error) {
      const message = error.response?.data?.msg || error.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data;
      setAuth(user, token);
      if (!user.verified) {
        navigate('/verify');
      } else {
        navigate('/dashboard');
      }
      toast.success(res.data.msg);
    } catch (error) {
      const message = error.response?.data?.msg || error.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const checkCode = async (code, email) => {
    console.log(email, code);
    setLoading(true);
    try {
      const res = await api.post('/auth/verify', { code, email });
      const { user } = res.data;
      setAuth(user, token);
      navigate('/');
      toast.success(res.data.msg);
    } catch (error) {
      const message = error.response?.data?.msg || error.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async email => {
    setLoading(true);
    try {
      const res = await api.post('/auth/resend-code', { email });
      toast.success(res.data.msg);
    } catch (error) {
      const message = error.response?.data?.msg || error.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    toast.info('Você saiu da conta.');
  };

  return { user, token, loading, register, login, checkCode, resendCode, logout };
}
