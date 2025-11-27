import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { FiUser, FiMail, FiPhone, FiGlobe, FiEdit2, FiSave, FiX, FiCamera, FiHeart, FiTrendingUp, FiAward, FiCalendar } from 'react-icons/fi';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
  profile_picture: string | null;
  verified: boolean;
  is_active: boolean;
  date_joined: string;
}

interface UserStats {
  funds_created: number;
  total_funds_amount: number;
  contributions_made: number;
  total_contributed: number;
}

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    username: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/profile' } });
      return;
    }

    fetchProfile();
    fetchStats();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await authService.getCurrentUser();
      setProfile(data);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        phone: data.phone || '',
        username: data.username || '',
      });
      setAvatarPreview(data.profile_picture);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      toast.error('Impossible de charger le profil');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { userService } = await import('../../services/userService');
      const data = await userService.getUserStatistics();
      setStats(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      // Fallback to empty stats
      setStats({
        funds_created: 0,
        total_funds_amount: 0,
        contributions_made: 0,
        total_contributed: 0,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { userService } = await import('../../services/userService');
      
      // Préparer les données à envoyer
      const updateData: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        username: formData.username,
      };

      // Si un fichier avatar a été sélectionné, l'ajouter
      const avatarInput = document.getElementById('avatar-upload') as HTMLInputElement;
      if (avatarInput?.files?.[0]) {
        updateData.profile_picture = avatarInput.files[0];
      }

      await userService.updateProfile(updateData);
      
      toast.success('Profil mis à jour avec succès');
      setIsEditing(false);
      await fetchProfile();
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      toast.error(error.response?.data?.message || 'Impossible de mettre à jour le profil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        username: profile.username || '',
      });
      setAvatarPreview(profile.profile_picture);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(value)
      .replace('XOF', 'F CFA');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="w-16 h-16 border-4 border-qalby-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Impossible de charger le profil</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-qalby-orange-500 text-white rounded-lg hover:bg-qalby-orange-600 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header avec bannière */}
        <div className="relative h-64 bg-gradient-to-r from-qalby-orange-500 via-orange-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IndoaXRlIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-30"></div>
          
          {/* Avatar et infos de base */}
          <div className="absolute -bottom-20 left-8 flex items-end gap-6">
            <div className="relative group">
              <div className="w-40 h-40 rounded-3xl overflow-hidden ring-8 ring-white shadow-2xl bg-white">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={`${profile.first_name} ${profile.last_name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-qalby-orange-400 to-qalby-orange-600 flex items-center justify-center">
                    <span className="text-6xl font-bold text-white">
                      {profile.first_name?.[0]?.toUpperCase() || profile.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              {isEditing && (
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-3xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <FiCamera className="w-12 h-12 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="mt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Informations personnelles */}
          <div className="lg:col-span-2 space-y-8">
            {/* Carte d'informations */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Informations personnelles</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-qalby-orange-50 text-qalby-orange-600 rounded-xl hover:bg-qalby-orange-100 transition-colors font-semibold"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Modifier
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold disabled:opacity-50"
                    >
                      <FiX className="w-4 h-4" />
                      Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-qalby-orange-500 to-qalby-orange-600 text-white rounded-xl hover:from-qalby-orange-600 hover:to-qalby-orange-700 transition-colors font-semibold disabled:opacity-50"
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

              <div className="space-y-6">
                {/* Prénom */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-qalby-orange-500" />
                    Prénom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-qalby-orange-500 transition-colors"
                      placeholder="Votre prénom"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                      {profile.first_name || 'Non renseigné'}
                    </p>
                  )}
                </div>

                {/* Nom */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiUser className="w-4 h-4 text-qalby-orange-500" />
                    Nom
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-qalby-orange-500 transition-colors"
                      placeholder="Votre nom"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                      {profile.last_name || 'Non renseigné'}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiMail className="w-4 h-4 text-qalby-orange-500" />
                    Email
                  </label>
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                    {profile.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 ml-1">L'email ne peut pas être modifié</p>
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiPhone className="w-4 h-4 text-qalby-orange-500" />
                    Téléphone
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-qalby-orange-500 transition-colors"
                      placeholder="+225 07 12 34 56 78"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                      {profile.phone || 'Non renseigné'}
                    </p>
                  )}
                </div>

                {/* Nom d'utilisateur */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiGlobe className="w-4 h-4 text-qalby-orange-500" />
                    Nom d'utilisateur
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-qalby-orange-500 transition-colors"
                      placeholder="username"
                    />
                  ) : (
                    <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                      {profile.username || 'Non renseigné'}
                    </p>
                  )}
                </div>

                {/* Date d'inscription */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FiCalendar className="w-4 h-4 text-qalby-orange-500" />
                    Membre depuis
                  </label>
                  <p className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900 font-medium">
                    {formatDate(profile.date_joined)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite - Statistiques */}
          <div className="lg:col-span-1 space-y-8">
            {/* Statistiques */}
            {stats && (
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Mes statistiques</h2>
                <div className="space-y-4">
                  {/* Cagnottes créées */}
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <FiHeart className="w-6 h-6 text-blue-600" />
                      <span className="text-3xl font-bold text-blue-900">{stats.funds_created}</span>
                    </div>
                    <p className="text-sm font-semibold text-blue-800">Cagnottes créées</p>
                    <p className="text-xs text-blue-600 mt-1">
                      Total: {formatCurrency(stats.total_funds_amount)}
                    </p>
                  </div>

                  {/* Contributions */}
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <FiTrendingUp className="w-6 h-6 text-green-600" />
                      <span className="text-3xl font-bold text-green-900">{stats.contributions_made}</span>
                    </div>
                    <p className="text-sm font-semibold text-green-800">Contributions</p>
                    <p className="text-xs text-green-600 mt-1">
                      Total: {formatCurrency(stats.total_contributed)}
                    </p>
                  </div>

                  {/* Badge */}
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <FiAward className="w-6 h-6 text-purple-600" />
                      <span className="text-2xl font-bold text-purple-900">
                        {stats.funds_created > 5 ? '🏆' : stats.contributions_made > 10 ? '⭐' : '🌱'}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-purple-800">
                      {stats.funds_created > 5
                        ? 'Créateur Gold'
                        : stats.contributions_made > 10
                        ? 'Contributeur Star'
                        : 'Nouveau membre'}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      Continuez à contribuer !
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions rapides */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Actions rapides</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/create-fund')}
                  className="w-full py-3 bg-gradient-to-r from-qalby-orange-500 to-qalby-orange-600 text-white rounded-xl font-semibold hover:from-qalby-orange-600 hover:to-qalby-orange-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Créer une cagnotte
                </button>
                <button
                  onClick={() => navigate('/campaigns')}
                  className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-qalby-orange-500 hover:text-qalby-orange-600 transition-all"
                >
                  Explorer les cagnottes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

