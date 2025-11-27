import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks';

interface GuestRouteProps {
  children: React.ReactNode;
}

/**
 * Composant pour protéger les routes accessibles uniquement aux utilisateurs non connectés
 * Redirige vers la page d'accueil si l'utilisateur est déjà connecté
 */
export const GuestRoute = ({ children }: GuestRouteProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Si l'utilisateur est connecté, rediriger vers la page d'accueil
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

