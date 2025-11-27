import { useState, useEffect } from 'react';
import { fundService } from '../services/fundService';
import { 
  FaGraduationCap, 
  FaHeartbeat, 
  FaExclamationTriangle, 
  FaGlassCheers,
  FaHandsHelping,
  FaFutbol,
  FaHeart,
  FaBriefcase,
  FaUser,
  FaStar
} from 'react-icons/fa';
import { ComponentType } from 'react';

export interface Category {
  value: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  description?: string;
}

// Mapping des icônes pour chaque catégorie
const ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  education: FaGraduationCap,
  health: FaHeartbeat,
  emergency: FaExclamationTriangle,
  event: FaGlassCheers,
  community: FaHandsHelping,
  sports: FaFutbol,
  charity: FaHeart,
  business: FaBriefcase,
  personal: FaUser,
  other: FaStar,
};

// Descriptions pour chaque catégorie
const DESCRIPTION_MAP: Record<string, string> = {
  education: 'Frais de scolarité, matériel...',
  health: 'Frais médicaux, soins...',
  emergency: 'Situation d\'urgence',
  event: 'Mariage, anniversaire...',
  community: 'Projet communautaire',
  sports: 'Équipement, compétition...',
  charity: 'Action caritative',
  business: 'Startup, projet pro...',
  personal: 'Projet personnel',
  other: 'Autre projet',
};

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fundService.getCategories();
        
        // Enrichir les catégories avec les icônes et descriptions
        const enrichedCategories = data.map(cat => ({
          value: cat.value,
          label: cat.label,
          icon: ICON_MAP[cat.value] || FaStar,
          description: DESCRIPTION_MAP[cat.value],
        }));
        
        setCategories(enrichedCategories);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setError('Impossible de charger les catégories');
        
        // Fallback sur les catégories hardcodées en cas d'erreur
        setCategories([
          { value: 'education', label: 'Éducation', icon: FaGraduationCap, description: 'Frais de scolarité, matériel...' },
          { value: 'health', label: 'Santé', icon: FaHeartbeat, description: 'Frais médicaux, soins...' },
          { value: 'emergency', label: 'Urgence', icon: FaExclamationTriangle, description: 'Situation d\'urgence' },
          { value: 'event', label: 'Événement', icon: FaGlassCheers, description: 'Mariage, anniversaire...' },
          { value: 'community', label: 'Communauté', icon: FaHandsHelping, description: 'Projet communautaire' },
          { value: 'sports', label: 'Sports', icon: FaFutbol, description: 'Équipement, compétition...' },
          { value: 'charity', label: 'Charité', icon: FaHeart, description: 'Action caritative' },
          { value: 'business', label: 'Entreprise', icon: FaBriefcase, description: 'Startup, projet pro...' },
          { value: 'personal', label: 'Personnel', icon: FaUser, description: 'Projet personnel' },
          { value: 'other', label: 'Autre', icon: FaStar, description: 'Autre projet' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return { categories, loading, error };
};

// Hook pour obtenir les catégories avec "Toutes"
export const useCategoriesWithAll = () => {
  const { categories, loading, error } = useCategories();
  
  const categoriesWithAll = [
    { value: 'all', label: 'Toutes', icon: FaStar },
    ...categories
  ];
  
  return { categories: categoriesWithAll, loading, error };
};

