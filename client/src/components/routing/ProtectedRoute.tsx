import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../../auth/storage';

export const ProtectedRoute = () => {
  if (!getToken()) return <Navigate to="/login" replace />;
  return <Outlet />;
};
