import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// Si no hay sesión, redirige al login
export default function ProtectedRoute({ children }) {
  const { token, notice } = useAuth();
  if (!token) return <Navigate to="/login" replace state={{ message: notice || 'Inicia sesión para continuar' }} />;
  return children;
}
