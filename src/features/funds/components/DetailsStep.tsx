import { useState } from 'react';
import type { FundFormData } from '../CreateFund';

interface DetailsStepProps {
  formData: FundFormData;
  updateFormData: (field: keyof FundFormData, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const CATEGORIES = [
  { value: 'education', label: 'Éducation', icon: '🎓', description: 'Frais de scolarité, matériel...' },
  { value: 'health', label: 'Santé', icon: '🏥', description: 'Frais médicaux, soins...' },
  { value: 'emergency', label: 'Urgence', icon: '🚨', description: 'Situation d\'urgence' },
  { value: 'event', label: 'Événement', icon: '🎉', description: 'Mariage, anniversaire...' },
  { value: 'community', label: 'Communauté', icon: '🤝', description: 'Projet communautaire' },
  { value: 'sports', label: 'Sports', icon: '⚽', description: 'Équipement, compétition...' },
  { value: 'charity', label: 'Charité', icon: '❤️', description: 'Action caritative' },
  { value: 'business', label: 'Entreprise', icon: '💼', description: 'Startup, projet pro...' },
  { value: 'personal', label: 'Personnel', icon: '👤', description: 'Projet personnel' },
  { value: 'other', label: 'Autre', icon: '✨', description: 'Autre projet' },
];

export const DetailsStep = ({ formData, updateFormData, onNext, onBack }: DetailsStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire';
    } else if (formData.description.length < 50) {
      newErrors.description = 'La description doit contenir au moins 50 caractères';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'La description ne peut pas dépasser 2000 caractères';
    }

    if (!formData.category) {
      newErrors.category = 'Veuillez sélectionner une catégorie';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Présentez votre projet
        </h2>
        <p className="text-gray-600">
          Expliquez clairement pourquoi vous créez cette cagnotte
        </p>
      </div>

      {/* Catégorie */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Catégorie *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => updateFormData('category', category.value)}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${
                  formData.category === category.value
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }
              `}
            >
              <div className="text-2xl mb-1">{category.icon}</div>
              <div className="text-xs font-medium text-gray-900">{category.label}</div>
              <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                {category.description}
              </div>
            </button>
          ))}
        </div>
        {errors.category && (
          <p className="mt-2 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description détaillée *
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          rows={10}
          placeholder="Racontez votre histoire, expliquez pourquoi vous créez cette cagnotte, comment les fonds seront utilisés...&#10;&#10;Soyez authentique et détaillé pour convaincre les contributeurs de vous soutenir !"
          className={`
            w-full px-4 py-3 rounded-lg border ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none
          `}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
        <div className="mt-1 flex justify-between items-center text-xs">
          <span className={formData.description.length < 50 ? 'text-red-500' : 'text-gray-500'}>
            {formData.description.length}/2000 caractères (minimum 50)
          </span>
        </div>
      </div>

      {/* Conseils */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">💡 Conseils pour une bonne description</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Expliquez clairement le but de votre cagnotte</li>
          <li>• Soyez précis sur l'utilisation des fonds</li>
          <li>• Ajoutez des détails personnels pour créer du lien</li>
          <li>• Expliquez pourquoi ce projet vous tient à cœur</li>
        </ul>
      </div>

      {/* Boutons */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onBack}
          className="px-8 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Retour
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          Continuer
        </button>
      </div>
    </div>
  );
};

