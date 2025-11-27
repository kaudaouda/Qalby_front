import { useState } from 'react';
import type { FundFormData } from '../CreateFund';
import { useCategories } from '../../../hooks/useCategories';

interface DetailsStepProps {
  formData: FundFormData;
  updateFormData: (field: keyof FundFormData, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const DetailsStep = ({ formData, updateFormData, onNext, onBack }: DetailsStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { categories, loading: categoriesLoading } = useCategories();

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
        {categoriesLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((category) => {
            const IconComponent = category.icon;
            return (
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
                <IconComponent className="text-2xl mb-1 mx-auto text-primary-600" />
                <div className="text-xs font-medium text-gray-900">{category.label}</div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {category.description}
                </div>
              </button>
            );
          })}
          </div>
        )}
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

