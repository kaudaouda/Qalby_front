import { FiShield, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

interface SecurityTabProps {
  passwordData: {
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  };
  showPasswords: {
    old: boolean;
    new: boolean;
    confirm: boolean;
  };
  isSaving: boolean;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onTogglePassword: (field: 'old' | 'new' | 'confirm') => void;
}

export const SecurityTab = ({
  passwordData,
  showPasswords,
  isSaving,
  onPasswordChange,
  onSubmit,
  onTogglePassword,
}: SecurityTabProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sécurité</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
        <FiShield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">Sécurité de votre compte</h3>
          <p className="text-sm text-blue-800">
            Utilisez un mot de passe fort contenant au moins 8 caractères, incluant des lettres majuscules,
            minuscules et des chiffres.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Ancien mot de passe */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Ancien mot de passe</label>
          <div className="relative">
            <input
              type={showPasswords.old ? 'text' : 'password'}
              name="old_password"
              value={passwordData.old_password}
              onChange={onPasswordChange}
              required
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-qalby-orange-500 focus:border-transparent transition-all"
              placeholder="Votre mot de passe actuel"
            />
            <button
              type="button"
              onClick={() => onTogglePassword('old')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.old ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Nouveau mot de passe */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nouveau mot de passe</label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              name="new_password"
              value={passwordData.new_password}
              onChange={onPasswordChange}
              required
              minLength={8}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-qalby-orange-500 focus:border-transparent transition-all"
              placeholder="Au moins 8 caractères"
            />
            <button
              type="button"
              onClick={() => onTogglePassword('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>
          {passwordData.new_password && passwordData.new_password.length < 8 && (
            <p className="text-xs text-red-600 mt-1.5 ml-1">
              Le mot de passe doit contenir au moins 8 caractères
            </p>
          )}
        </div>

        {/* Confirmation nouveau mot de passe */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirmer le nouveau mot de passe
          </label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              name="new_password_confirm"
              value={passwordData.new_password_confirm}
              onChange={onPasswordChange}
              required
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-qalby-orange-500 focus:border-transparent transition-all"
              placeholder="Confirmez votre nouveau mot de passe"
            />
            <button
              type="button"
              onClick={() => onTogglePassword('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
            </button>
          </div>
          {passwordData.new_password &&
            passwordData.new_password_confirm &&
            passwordData.new_password !== passwordData.new_password_confirm && (
              <p className="text-xs text-red-600 mt-1.5 ml-1">Les mots de passe ne correspondent pas</p>
            )}
        </div>

        {/* Bouton de soumission */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={
              isSaving ||
              !passwordData.old_password ||
              !passwordData.new_password ||
              !passwordData.new_password_confirm ||
              passwordData.new_password.length < 8 ||
              passwordData.new_password !== passwordData.new_password_confirm
            }
            className="w-full py-3 bg-qalby-orange-500 text-white rounded-lg font-semibold hover:bg-qalby-orange-600 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Modification en cours...
              </>
            ) : (
              <>
                <FiLock className="w-5 h-5" />
                Changer le mot de passe
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

