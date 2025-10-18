import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export function ProtectedRoute({ requireVerification = false }) {
  const { token, verified } = useAuthStore();

  if (!token) return <Outlet />;

  if (!verified && requireVerification) {
    return <Navigate to="/verify" replace />;
  }

  return <Outlet />;
}
