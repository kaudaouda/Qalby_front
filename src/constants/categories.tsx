import { 
  FaGraduationCap, 
  FaHeartbeat, 
  FaExclamationTriangle, 
  FaPartyHorn,
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

export const CATEGORIES: Category[] = [
  { 
    value: 'education', 
    label: 'Éducation', 
    icon: FaGraduationCap, 
    description: 'Frais de scolarité, matériel...' 
  },
  { 
    value: 'health', 
    label: 'Santé', 
    icon: FaHeartbeat, 
    description: 'Frais médicaux, soins...' 
  },
  { 
    value: 'emergency', 
    label: 'Urgence', 
    icon: FaExclamationTriangle, 
    description: 'Situation d\'urgence' 
  },
  { 
    value: 'event', 
    label: 'Événement', 
    icon: FaPartyHorn, 
    description: 'Mariage, anniversaire...' 
  },
  { 
    value: 'community', 
    label: 'Communauté', 
    icon: FaHandsHelping, 
    description: 'Projet communautaire' 
  },
  { 
    value: 'sports', 
    label: 'Sports', 
    icon: FaFutbol, 
    description: 'Équipement, compétition...' 
  },
  { 
    value: 'charity', 
    label: 'Charité', 
    icon: FaHeart, 
    description: 'Action caritative' 
  },
  { 
    value: 'business', 
    label: 'Entreprise', 
    icon: FaBriefcase, 
    description: 'Startup, projet pro...' 
  },
  { 
    value: 'personal', 
    label: 'Personnel', 
    icon: FaUser, 
    description: 'Projet personnel' 
  },
  { 
    value: 'other', 
    label: 'Autre', 
    icon: FaStar, 
    description: 'Autre projet' 
  },
];

export const CATEGORIES_MAP: Record<string, string> = {
  education: 'Éducation',
  health: 'Santé',
  emergency: 'Urgence',
  event: 'Événement',
  community: 'Communauté',
  sports: 'Sports',
  charity: 'Charité',
  business: 'Entreprise',
  personal: 'Personnel',
  other: 'Autre',
};

// Catégories avec "Toutes" pour les filtres
export const CATEGORIES_WITH_ALL: Category[] = [
  { 
    value: 'all', 
    label: 'Toutes', 
    icon: FaStar
  },
  ...CATEGORIES
];

export const getCategoryIcon = (categoryValue: string): ComponentType<{ className?: string }> | null => {
  const category = CATEGORIES.find(c => c.value === categoryValue);
  return category ? category.icon : null;
};

export const getCategory = (categoryValue: string): Category | undefined => {
  return [...CATEGORIES_WITH_ALL, ...CATEGORIES].find(c => c.value === categoryValue);
};

