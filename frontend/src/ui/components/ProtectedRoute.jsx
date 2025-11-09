import { Navigate, Outlet } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export function ProtectedRoute({ requireVerification = false }) {
  const { token, verified } = useAppStore();

  if (!token) return <Outlet />;

  if (!verified && requireVerification) {
    return <Navigate to="/verify" replace />;
  }

  return <Outlet />;
}
