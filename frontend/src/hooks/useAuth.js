import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const { user, setAuth, clearAuth } = useAppStore();
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
      toast.success(res.data.msg);
      navigate('/login');
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
      const { user } = res.data;
      setAuth(user);
      if (!user.verified) {
        navigate('/verify');
      } else {
        navigate('/');
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
    setLoading(true);
    try {
      const res = await api.post('/auth/verify', { code, email });
      const { user } = res.data;
      setAuth(user);
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

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
      clearAuth();
      toast.info('Você saiu da conta.');
      navigate('/login');
    } catch (error) {
      clearAuth();
      const message = error.response?.data?.msg || error.message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSession = async () => {
    try {
      const res = await api.get('/auth/me');
      setAuth(res.data.user);
    } catch {
      clearAuth();
    }
  };

  return { user, loading, register, login, checkCode, resendCode, logout, fetchSession };
}
