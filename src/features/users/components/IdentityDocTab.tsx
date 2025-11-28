import { FiAlertCircle, FiShield, FiUpload, FiX, FiCheckCircle, FiFileText, FiCreditCard, FiBook, FiTruck, FiMapPin } from 'react-icons/fi';

interface IdentityDocTabProps {
  selectedDocumentType: string | null;
  documentFiles: {
    front: File | null;
    back: File | null;
  };
  documentPreviews: {
    front: string | null;
    back: string | null;
  };
  isSaving: boolean;
  onSelectDocumentType: (type: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => void;
  onRemoveFile: (side: 'front' | 'back') => void;
  onSubmit: () => void;
}

export const IdentityDocTab = ({
  selectedDocumentType,
  documentFiles,
  documentPreviews,
  isSaving,
  onSelectDocumentType,
  onFileChange,
  onRemoveFile,
  onSubmit,
}: IdentityDocTabProps) => {
  const documentTypes = [
    { id: 'id_card', label: "Carte d'identité", icon: FiCreditCard, color: 'text-blue-600' },
    { id: 'passport', label: 'Passeport', icon: FiBook, color: 'text-purple-600' },
    { id: 'driving_license', label: 'Permis de conduire', icon: FiTruck, color: 'text-green-600' },
    { id: 'residence_permit', label: 'Titre de séjour', icon: FiMapPin, color: 'text-orange-600' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Ajouter ma pièce d'identité</h2>
      <p className="text-sm text-gray-600 mb-6">Pensez à vérifier la date de validité de votre document !</p>

      {/* Bannière d'information */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">Pourquoi vérifier mon identité ?</h3>
          <p className="text-sm text-blue-800">
            La vérification d'identité renforce la confiance et la sécurité sur la plateforme. Vos documents sont
            sécurisés et conformes au RGPD.
          </p>
        </div>
      </div>

      {/* Sélection du type de document */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Type de document</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {documentTypes.map((doc) => {
            const Icon = doc.icon;
            return (
              <button
                key={doc.id}
                type="button"
                onClick={() => onSelectDocumentType(doc.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                  selectedDocumentType === doc.id
                    ? 'border-qalby-orange-500 bg-qalby-orange-50'
                    : 'border-gray-200 hover:border-qalby-orange-200 bg-white'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedDocumentType === doc.id ? 'bg-qalby-orange-100' : 'bg-gray-100'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${selectedDocumentType === doc.id ? 'text-qalby-orange-600' : doc.color}`}
                  />
                </div>
                <span className="font-semibold text-gray-900 flex-1">{doc.label}</span>
                {selectedDocumentType === doc.id && <FiCheckCircle className="w-5 h-5 text-qalby-orange-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload des documents */}
      {selectedDocumentType && (
        <div className="space-y-6 animate-fadeIn">
          {/* Recto */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Recto du document *</label>
            {!documentPreviews.front ? (
              <label
                htmlFor="document-front"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-qalby-orange-500 hover:bg-qalby-orange-50 transition-all bg-gray-50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-700">
                    <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (max. 5MB)</p>
                </div>
                <input
                  id="document-front"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(e, 'front')}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={documentPreviews.front}
                  alt="Recto du document"
                  className="w-full h-48 object-contain rounded-xl border-2 border-gray-200 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => onRemoveFile('front')}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Verso */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Verso du document (optionnel)</label>
            {!documentPreviews.back ? (
              <label
                htmlFor="document-back"
                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-qalby-orange-500 hover:bg-qalby-orange-50 transition-all bg-gray-50"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="w-10 h-10 text-gray-400 mb-3" />
                  <p className="mb-2 text-sm text-gray-700">
                    <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (max. 5MB)</p>
                </div>
                <input
                  id="document-back"
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(e, 'back')}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={documentPreviews.back}
                  alt="Verso du document"
                  className="w-full h-48 object-contain rounded-xl border-2 border-gray-200 bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => onRemoveFile('back')}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Bouton de soumission */}
          <div className="pt-4">
            <button
              type="button"
              onClick={onSubmit}
              disabled={isSaving || !documentFiles.front}
              className="w-full py-3 bg-qalby-orange-500 text-white rounded-lg font-semibold hover:bg-qalby-orange-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <FiFileText className="w-5 h-5" />
                  Envoyer pour vérification
                </>
              )}
            </button>
          </div>

          {/* Info RGPD */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <FiShield className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Vos données sont protégées</p>
                <p className="text-xs text-gray-600">
                  Vos documents sont chiffrés, stockés de manière sécurisée et utilisés uniquement pour la
                  vérification d'identité. Conformité RGPD garantie.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

