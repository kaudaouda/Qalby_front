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
    // Toujours tenter de récupérer l'utilisateur au chargement
    // Les cookies HTTP-only seront automatiquement envoyés par le navigateur
    // Si les cookies n'existent pas ou sont invalides, l'API retournera 401
    // et le state sera mis à jour en conséquence
    dispatch(getCurrentUser());
  }, [dispatch]);

  return null; // Ce composant ne rend rien
};

