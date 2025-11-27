import { FiCamera, FiCalendar, FiEdit2, FiSave, FiX } from 'react-icons/fi';

interface ProfileHeaderProps {
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    profile_picture: string | null;
    verified: boolean;
    date_joined: string;
  };
  avatarPreview: string | null;
  isEditing: boolean;
  isSaving: boolean;
  activeTab: string;
  onEditToggle: () => void;
  onSave: () => void;
  onCancel: () => void;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader = ({
  profile,
  avatarPreview,
  isEditing,
  isSaving,
  activeTab,
  onEditToggle,
  onSave,
  onCancel,
  onAvatarChange,
}: ProfileHeaderProps) => {
  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
    }
    if (profile?.first_name) {
      return profile.first_name.substring(0, 2).toUpperCase();
    }
    if (profile?.email) {
      return profile.email.substring(0, 2).toUpperCase();
    }
    return 'US';
  };

  const getFullName = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return profile?.email || 'Utilisateur';
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-xl bg-gradient-to-br from-qalby-orange-400 to-qalby-orange-600">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt={getFullName()}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-white drop-shadow-lg">
                    {getInitials()}
                  </span>
                </div>
              )}
            </div>
            {activeTab === 'info' && isEditing && (
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="text-center">
                  <FiCamera className="w-8 h-8 text-white mx-auto mb-1" />
                  <span className="text-xs text-white font-medium">Modifier</span>
                </div>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={onAvatarChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Infos principales */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{getFullName()}</h1>
            <p className="text-gray-600 mb-3">{profile.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <FiCalendar className="w-4 h-4" />
                Membre depuis{' '}
                {new Date(profile.date_joined).toLocaleDateString('fr-FR', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              {profile.verified && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Vérifié
                </span>
              )}
            </div>
          </div>

          {/* Boutons d'action (seulement si onglet info) */}
          {activeTab === 'info' && (
            <div className="sm:ml-auto">
              {!isEditing ? (
                <button
                  onClick={onEditToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-qalby-orange-50 text-qalby-orange-600 rounded-lg hover:bg-qalby-orange-100 transition-colors font-semibold text-sm"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Modifier
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onCancel}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm disabled:opacity-50"
                  >
                    <FiX className="w-4 h-4" />
                    Annuler
                  </button>
                  <button
                    onClick={onSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 bg-qalby-orange-500 text-white rounded-lg hover:bg-qalby-orange-600 transition-all font-semibold text-sm disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        Enregistrer
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

