import type { FundFormData } from '../CreateFund';

interface ReviewStepProps {
  formData: FundFormData;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  error: string | null;
}

const CATEGORIES_MAP: Record<string, string> = {
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

export const ReviewStep = ({ formData, onSubmit, onBack, isSubmitting, error }: ReviewStepProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getDuration = () => {
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Vérifiez et publiez
        </h2>
        <p className="text-gray-600">
          Relisez les informations avant de créer votre cagnotte
        </p>
      </div>

      {/* Aperçu de la cagnotte */}
      <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
        {/* Image */}
        {formData.image && (
          <div className="aspect-video bg-gray-100">
            <img
              src={URL.createObjectURL(formData.image)}
              alt={formData.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Titre et catégorie */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                {CATEGORIES_MAP[formData.category]}
              </span>
              <span className={`
                px-3 py-1 text-sm font-medium rounded-full
                ${formData.visibility === 'public' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
              `}>
                {formData.visibility === 'public' ? '🌍 Publique' : '🔒 Privée'}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {formData.title}
            </h3>
          </div>

          {/* Objectif */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Objectif</p>
              <p className="text-3xl font-bold text-primary-600">
                {parseFloat(formData.goal_amount).toLocaleString('fr-FR')} €
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Durée</p>
              <p className="text-2xl font-bold text-gray-900">
                {getDuration()} jours
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Début</p>
              <p className="font-medium text-gray-900">
                {formatDate(formData.start_date)}
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Fin</p>
              <p className="font-medium text-gray-900">
                {formatDate(formData.end_date)}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700 whitespace-pre-line line-clamp-6">
              {formData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5 mr-3"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Erreur lors de la création
              </h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Informations importantes */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">ℹ️ Avant de publier</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Vous pourrez modifier certaines informations après publication</li>
          <li>• Vos contributeurs pourront voir toutes ces informations</li>
          <li>• Vous recevrez des notifications pour chaque contribution</li>
          <li>• Les fonds seront disponibles une fois l'objectif atteint</li>
        </ul>
      </div>

      {/* Boutons */}
      <div className="flex justify-between pt-6 border-t">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="px-8 py-3 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          Retour
        </button>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-8 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Création en cours...
            </>
          ) : (
            <>
              🚀 Publier ma cagnotte
            </>
          )}
        </button>
      </div>
    </div>
  );
};

