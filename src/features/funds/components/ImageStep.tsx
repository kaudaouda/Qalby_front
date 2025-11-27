import { useState, useRef } from 'react';
import type { FundFormData } from '../CreateFund';

interface ImageStepProps {
  formData: FundFormData;
  updateFormData: (field: keyof FundFormData, value: any) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ImageStep = ({ formData, updateFormData, onNext, onBack }: ImageStepProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) return;

    // Validation du type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Format non supporté. Utilisez JPG, PNG ou WebP');
      return;
    }

    // Validation de la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('L\'image ne doit pas dépasser 5 Mo');
      return;
    }

    // Créer la prévisualisation
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    updateFormData('image', file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    updateFormData('image', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNext = () => {
    // L'image est optionnelle, on peut continuer sans
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ajoutez une image
        </h2>
        <p className="text-gray-600">
          Une belle image augmente vos chances de réussite (optionnel)
        </p>
      </div>

      {/* Zone d'upload */}
      <div>
        {!preview ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-500 transition-colors cursor-pointer"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <div className="space-y-4">
              <div className="flex justify-center">
                <svg
                  className="w-16 h-16 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Cliquez pour choisir une image
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ou glissez-déposez une image ici
                </p>
              </div>
              <p className="text-xs text-gray-500">
                JPG, PNG ou WebP (max 5 Mo)
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-4 right-4 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>

      {/* Conseils */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">📸 Conseils pour votre image</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Choisissez une image lumineuse et de bonne qualité</li>
          <li>• Privilégiez les photos authentiques et personnelles</li>
          <li>• Évitez les images trop chargées ou floues</li>
          <li>• Assurez-vous que l'image illustre bien votre projet</li>
        </ul>
      </div>

      {/* Exemples d'images */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          Exemples d'images réussies
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {[
            'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400',
            'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400',
          ].map((src, index) => (
            <div key={index} className="aspect-video rounded-lg overflow-hidden">
              <img
                src={src}
                alt={`Exemple ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
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
          {preview ? 'Continuer' : 'Passer cette étape'}
        </button>
      </div>
    </div>
  );
};

