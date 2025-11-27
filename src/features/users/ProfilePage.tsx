import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { FiUser, FiMail, FiPhone, FiGlobe, FiEdit2, FiSave, FiX, FiCamera, FiHeart, FiLock, FiFileText, FiBell, FiCalendar, FiEye, FiEyeOff, FiShield, FiUpload, FiCheckCircle, FiAlertCircle, FiCreditCard, FiBook, FiTruck, FiMapPin } from 'react-icons/fi';
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

type TabType = 'funds' | 'info' | 'security' | 'identity' | 'communication';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<TabType>('funds');
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

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    new_password_confirm: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [selectedDocumentType, setSelectedDocumentType] = useState<string | null>(null);
  const [documentFiles, setDocumentFiles] = useState<{
    front: File | null;
    back: File | null;
  }>({
    front: null,
    back: null,
  });
  const [documentPreviews, setDocumentPreviews] = useState<{
    front: string | null;
    back: string | null;
  }>({
    front: null,
    back: null,
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.new_password_confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.new_password.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    try {
      setIsSaving(true);
      const { userService } = await import('../../services/userService');
      
      await userService.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
        new_password_confirm: passwordData.new_password_confirm,
      });

      toast.success('Mot de passe modifié avec succès');
      setPasswordData({
        old_password: '',
        new_password: '',
        new_password_confirm: '',
      });
    } catch (error: any) {
      console.error('Erreur lors du changement de mot de passe:', error);
      toast.error(error.response?.data?.error || error.response?.data?.old_password?.[0] || 'Impossible de changer le mot de passe');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDocumentFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Le fichier est trop volumineux (max 5MB)');
        return;
      }

      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        toast.error('Seules les images sont acceptées');
        return;
      }

      setDocumentFiles({ ...documentFiles, [side]: file });

      // Créer un aperçu
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocumentPreviews({ ...documentPreviews, [side]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitDocument = async () => {
    if (!selectedDocumentType) {
      toast.error('Veuillez sélectionner un type de document');
      return;
    }

    if (!documentFiles.front) {
      toast.error('Veuillez ajouter au moins le recto du document');
      return;
    }

    try {
      setIsSaving(true);
      const { userService } = await import('../../services/userService');
      
      await userService.uploadIdentityDocument({
        document_type: selectedDocumentType,
        front_image: documentFiles.front,
        back_image: documentFiles.back,
      });

      toast.success('Document envoyé pour vérification');
      // Réinitialiser le formulaire
      setSelectedDocumentType(null);
      setDocumentFiles({ front: null, back: null });
      setDocumentPreviews({ front: null, back: null });
    } catch (error: any) {
      console.error('Erreur lors de l\'upload du document:', error);
      toast.error(error.response?.data?.message || 'Impossible d\'envoyer le document');
    } finally {
      setIsSaving(false);
    }
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
      
      const updateData: any = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        username: formData.username,
      };

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

  const tabs = [
    { id: 'funds' as TabType, label: 'Mes cagnottes', icon: FiHeart },
    { id: 'info' as TabType, label: 'Mes informations', icon: FiUser },
    { id: 'security' as TabType, label: 'Sécurité', icon: FiLock },
    { id: 'identity' as TabType, label: "Document d'identité", icon: FiFileText },
    { id: 'communication' as TabType, label: 'Préférences de communication', icon: FiBell },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-qalby-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header simplifié */}
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
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Infos principales */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {getFullName()}
              </h1>
              <p className="text-gray-600 mb-3">{profile.email}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                  <FiCalendar className="w-4 h-4" />
                  Membre depuis {new Date(profile.date_joined).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </span>
                {profile.verified && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Vérifié
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation + Contenu */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation gauche */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsEditing(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeTab === tab.id
                          ? 'bg-qalby-orange-50 text-qalby-orange-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-qalby-orange-600' : 'text-gray-400'}`} />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Contenu à droite */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {/* Mes cagnottes */}
              {activeTab === 'funds' && stats && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes cagnottes</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl border border-blue-100">
                      <div className="flex items-center justify-between mb-3">
                        <FiHeart className="w-6 h-6 text-blue-600" />
                        <span className="text-3xl font-bold text-blue-900">{stats.funds_created}</span>
                      </div>
                      <p className="text-sm font-semibold text-blue-900 mb-1">Cagnottes créées</p>
                      <p className="text-xs text-blue-700">
                        {formatCurrency(stats.total_funds_amount)} collectés
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-green-50 to-green-100/30 rounded-xl border border-green-100">
                      <div className="flex items-center justify-between mb-3">
                        <FiHeart className="w-6 h-6 text-green-600" />
                        <span className="text-3xl font-bold text-green-900">{stats.contributions_made}</span>
                      </div>
                      <p className="text-sm font-semibold text-green-900 mb-1">Participations</p>
                      <p className="text-xs text-green-700">
                        {formatCurrency(stats.total_contributed)} donnés
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/create-fund')}
                      className="w-full py-3 bg-qalby-orange-500 text-white rounded-xl font-semibold hover:bg-qalby-orange-600 transition-all shadow-sm hover:shadow-md"
                    >
                      Créer une nouvelle cagnotte
                    </button>
                    <button
                      onClick={() => navigate('/campaigns')}
                      className="w-full py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-qalby-orange-500 hover:text-qalby-orange-600 transition-all"
                    >
                      Découvrir des cagnottes
                    </button>
                  </div>
                </div>
              )}

              {/* Mes informations */}
              {activeTab === 'info' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Mes informations</h2>
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-qalby-orange-50 text-qalby-orange-600 rounded-lg hover:bg-qalby-orange-100 transition-colors font-semibold text-sm"
                      >
                        <FiEdit2 className="w-4 h-4" />
                        Modifier
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCancel}
                          disabled={isSaving}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold text-sm disabled:opacity-50"
                        >
                          <FiX className="w-4 h-4" />
                          Annuler
                        </button>
                        <button
                          onClick={handleSave}
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

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
                          onChange={handleInputChange}
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
              )}

              {/* Sécurité */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Sécurité</h2>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <FiShield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">Sécurité de votre compte</h3>
                      <p className="text-sm text-blue-800">
                        Utilisez un mot de passe fort contenant au moins 8 caractères, incluant des lettres majuscules, minuscules et des chiffres.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-5">
                    {/* Ancien mot de passe */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ancien mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.old ? 'text' : 'password'}
                          name="old_password"
                          value={passwordData.old_password}
                          onChange={handlePasswordChange}
                          required
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-qalby-orange-500 focus:border-transparent transition-all"
                          placeholder="Votre mot de passe actuel"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.old ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    {/* Nouveau mot de passe */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nouveau mot de passe
                      </label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          name="new_password"
                          value={passwordData.new_password}
                          onChange={handlePasswordChange}
                          required
                          minLength={8}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-qalby-orange-500 focus:border-transparent transition-all"
                          placeholder="Au moins 8 caractères"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordData.new_password && passwordData.new_password.length < 8 && (
                        <p className="text-xs text-red-600 mt-1.5 ml-1">Le mot de passe doit contenir au moins 8 caractères</p>
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
                          onChange={handlePasswordChange}
                          required
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-qalby-orange-500 focus:border-transparent transition-all"
                          placeholder="Confirmez votre nouveau mot de passe"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordData.new_password && passwordData.new_password_confirm && 
                       passwordData.new_password !== passwordData.new_password_confirm && (
                        <p className="text-xs text-red-600 mt-1.5 ml-1">Les mots de passe ne correspondent pas</p>
                      )}
                    </div>

                    {/* Bouton de soumission */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSaving || !passwordData.old_password || !passwordData.new_password || 
                                  !passwordData.new_password_confirm || passwordData.new_password.length < 8 ||
                                  passwordData.new_password !== passwordData.new_password_confirm}
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
              )}

              {/* Document d'identité */}
              {activeTab === 'identity' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Ajouter ma pièce d'identité</h2>
                  <p className="text-sm text-gray-600 mb-6">
                    Pensez à vérifier la date de validité de votre document !
                  </p>

                  {/* Bannière d'information */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
                    <FiAlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-blue-900 mb-1">Pourquoi vérifier mon identité ?</h3>
                      <p className="text-sm text-blue-800">
                        La vérification d'identité renforce la confiance et la sécurité sur la plateforme. 
                        Vos documents sont sécurisés et conformes au RGPD.
                      </p>
                    </div>
                  </div>

                  {/* Sélection du type de document */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Type de document
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { id: 'id_card', label: 'Carte d\'identité', icon: FiCreditCard, color: 'text-blue-600' },
                        { id: 'passport', label: 'Passeport', icon: FiBook, color: 'text-purple-600' },
                        { id: 'driving_license', label: 'Permis de conduire', icon: FiTruck, color: 'text-green-600' },
                        { id: 'residence_permit', label: 'Titre de séjour', icon: FiMapPin, color: 'text-orange-600' },
                      ].map((doc) => {
                        const Icon = doc.icon;
                        return (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => setSelectedDocumentType(doc.id)}
                            className={`p-4 rounded-xl border-2 transition-all text-left flex items-center gap-3 ${
                              selectedDocumentType === doc.id
                                ? 'border-qalby-orange-500 bg-qalby-orange-50'
                                : 'border-gray-200 hover:border-qalby-orange-200 bg-white'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              selectedDocumentType === doc.id ? 'bg-qalby-orange-100' : 'bg-gray-100'
                            }`}>
                              <Icon className={`w-5 h-5 ${selectedDocumentType === doc.id ? 'text-qalby-orange-600' : doc.color}`} />
                            </div>
                            <span className="font-semibold text-gray-900 flex-1">{doc.label}</span>
                            {selectedDocumentType === doc.id && (
                              <FiCheckCircle className="w-5 h-5 text-qalby-orange-600" />
                            )}
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
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Recto du document *
                        </label>
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
                              onChange={(e) => handleDocumentFileChange(e, 'front')}
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
                              onClick={() => {
                                setDocumentFiles({ ...documentFiles, front: null });
                                setDocumentPreviews({ ...documentPreviews, front: null });
                              }}
                              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                              <FiX className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Verso */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Verso du document (optionnel)
                        </label>
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
                              onChange={(e) => handleDocumentFileChange(e, 'back')}
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
                              onClick={() => {
                                setDocumentFiles({ ...documentFiles, back: null });
                                setDocumentPreviews({ ...documentPreviews, back: null });
                              }}
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
                          onClick={handleSubmitDocument}
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
                              Vos documents sont chiffrés, stockés de manière sécurisée et utilisés uniquement 
                              pour la vérification d'identité. Conformité RGPD garantie.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Préférences de communication */}
              {activeTab === 'communication' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Préférences de communication</h2>
                  <div className="text-center py-12">
                    <FiBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Section en cours de développement</p>
                    <p className="text-sm text-gray-400 mt-2">Gestion des notifications et emails</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
