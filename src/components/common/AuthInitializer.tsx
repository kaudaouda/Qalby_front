import { useEffect } from 'react';
import { useAppDispatch } from '../../hooks';
import { getCurrentUser } from '../../store/slices/authSlice';

/**
 * Composant pour initialiser l'état d'authentification au chargement de l'app
 * Vérifie si l'utilisateur est déjà connecté via les cookies
 */
export const AuthInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Vérifier si un indicateur de session existe
    // (Les cookies HTTP-only ne sont pas accessibles en JS)
    const hasSession = localStorage.getItem('hasSession');
    
    if (hasSession === 'true') {
      // Tenter de récupérer l'utilisateur si une session pourrait exister
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return null; // Ce composant ne rend rien
};

