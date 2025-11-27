import { useState } from 'react';
import type { FundFormData } from '../CreateFund';

interface BasicInfoStepProps {
  formData: FundFormData;
  updateFormData: (field: keyof FundFormData, value: any) => void;
  onNext: () => void;
}

export const BasicInfoStep = ({ formData, updateFormData, onNext }: BasicInfoStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Le titre doit contenir au moins 5 caractères';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Le titre ne peut pas dépasser 100 caractères';
    }

    if (!formData.goal_amount) {
      newErrors.goal_amount = 'L\'objectif est obligatoire';
    } else if (parseFloat(formData.goal_amount) <= 0) {
      newErrors.goal_amount = 'L\'objectif doit être supérieur à 0';
    } else if (parseFloat(formData.goal_amount) > 1000000) {
      newErrors.goal_amount = 'L\'objectif ne peut pas dépasser 1 000 000€';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'La date de fin est obligatoire';
    } else {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (endDate <= startDate) {
        newErrors.end_date = 'La date de fin doit être après la date de début';
      } else if (endDate <= today) {
        newErrors.end_date = 'La date de fin doit être dans le futur';
      }

      // Vérifier que la durée n'est pas trop longue (ex: max 1 an)
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 365) {
        newErrors.end_date = 'La durée ne peut pas dépasser 1 an';
      }
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
          Commençons par les bases
        </h2>
        <p className="text-gray-600">
          Donnez un titre accrocheur et fixez votre objectif
        </p>
      </div>

      {/* Titre */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Titre de votre cagnotte *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => updateFormData('title', e.target.value)}
          placeholder="Ex: Cadeau pour l'anniversaire de Marie"
          className={`
            w-full px-4 py-3 rounded-lg border ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-primary-500
          `}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {formData.title.length}/100 caractères
        </p>
      </div>

      {/* Objectif financier */}
      <div>
        <label htmlFor="goal_amount" className="block text-sm font-medium text-gray-700 mb-2">
          Objectif financier *
        </label>
        <div className="relative">
          <input
            type="number"
            id="goal_amount"
            value={formData.goal_amount}
            onChange={(e) => updateFormData('goal_amount', e.target.value)}
            placeholder="1000"
            min="1"
            step="1"
            className={`
              w-full px-4 py-3 pl-12 rounded-lg border ${
                errors.goal_amount ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-primary-500
            `}
          />
          <span className="absolute left-4 top-3 text-gray-500 text-lg">€</span>
        </div>
        {errors.goal_amount && (
          <p className="mt-1 text-sm text-red-600">{errors.goal_amount}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          Montant que vous souhaitez collecter
        </p>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date de début */}
        <div>
          <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
            Date de début
          </label>
          <input
            type="date"
            id="start_date"
            value={formData.start_date}
            onChange={(e) => updateFormData('start_date', e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Date de fin */}
        <div>
          <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
            Date de fin *
          </label>
          <input
            type="date"
            id="end_date"
            value={formData.end_date}
            onChange={(e) => updateFormData('end_date', e.target.value)}
            min={formData.start_date}
            className={`
              w-full px-4 py-3 rounded-lg border ${
                errors.end_date ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-primary-500
            `}
          />
          {errors.end_date && (
            <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
          )}
        </div>
      </div>

      {/* Visibilité */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Visibilité
        </label>
        <div className="space-y-3">
          <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={formData.visibility === 'public'}
              onChange={(e) => updateFormData('visibility', e.target.value as 'public' | 'private')}
              className="mt-1 mr-3"
            />
            <div>
              <p className="font-medium text-gray-900">Publique</p>
              <p className="text-sm text-gray-500">
                Visible par tous, peut apparaître dans les recherches
              </p>
            </div>
          </label>

          <label className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={formData.visibility === 'private'}
              onChange={(e) => updateFormData('visibility', e.target.value as 'public' | 'private')}
              className="mt-1 mr-3"
            />
            <div>
              <p className="font-medium text-gray-900">Privée</p>
              <p className="text-sm text-gray-500">
                Accessible uniquement via le lien que vous partagez
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Bouton Suivant */}
      <div className="flex justify-end pt-6 border-t">
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

