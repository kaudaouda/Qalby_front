import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Composant pour protéger les routes qui nécessitent une authentification
 * Redirige vers /login si l'utilisateur n'est pas connecté
 */
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  console.log('[PROTECTED-ROUTE]', {
    path: location.pathname,
    isAuthenticated,
    isLoading,
    hasSession: localStorage.getItem('hasSession')
  });

  // Afficher un loader pendant la vérification de l'authentification
  if (isLoading) {
    console.log('[PROTECTED-ROUTE] 🔄 Chargement en cours...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers login si non authentifié ET pas de session
  if (!isAuthenticated && !localStorage.getItem('hasSession')) {
    console.log('[PROTECTED-ROUTE] ❌ Non authentifié, redirection vers /login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Si on a une session mais pas encore authentifié, attendre
  if (!isAuthenticated && localStorage.getItem('hasSession')) {
    console.log('[PROTECTED-ROUTE] ⏳ Session existe, attente de l\'authentification...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Restauration de la session...</p>
        </div>
      </div>
    );
  }

  console.log('[PROTECTED-ROUTE] ✅ Authentifié, affichage du contenu');
  return <>{children}</>;
};

