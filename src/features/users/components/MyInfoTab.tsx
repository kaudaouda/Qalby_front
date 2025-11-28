import { FiMail, FiPhone, FiGlobe } from 'react-icons/fi';

interface MyInfoTabProps {
  profile: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    username: string;
  };
  formData: {
    first_name: string;
    last_name: string;
    phone: string;
    username: string;
  };
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const MyInfoTab = ({ profile, formData, isEditing, onInputChange }: MyInfoTabProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes informations</h2>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
          {isEditing ? (
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={onInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-qalby-orange-500 focus:border-transparent transition-all"
              placeholder="Votre prénom"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200">
              {profile.first_name || 'Non renseigné'}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
          {isEditing ? (
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={onInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-qalby-orange-500 focus:border-transparent transition-all"
              placeholder="Votre nom"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200">
              {profile.last_name || 'Non renseigné'}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FiMail className="w-4 h-4 text-gray-400" />
            Adresse email
          </label>
          <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200">
            {profile.email}
          </div>
          <p className="text-xs text-gray-500 mt-1.5 ml-1">L'adresse email ne peut pas être modifiée</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FiPhone className="w-4 h-4 text-gray-400" />
            Téléphone
          </label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-qalby-orange-500 focus:border-transparent transition-all"
              placeholder="+225 07 12 34 56 78"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200">
              {profile.phone || 'Non renseigné'}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FiGlobe className="w-4 h-4 text-gray-400" />
            Nom d'utilisateur
          </label>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={onInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-qalby-orange-500 focus:border-transparent transition-all"
              placeholder="username"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900 font-medium border border-gray-200">
              {profile.username || 'Non renseigné'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

