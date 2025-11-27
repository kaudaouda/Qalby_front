import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import { authService } from '../../services/authService';
import { toast } from 'react-toastify';
import {
  ProfileHeader,
  ProfileSidebar,
  MyFundsTab,
  MyInfoTab,
  SecurityTab,
  IdentityDocTab,
  CommunicationTab,
} from './components';

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
      toast.error(
        error.response?.data?.error || error.response?.data?.old_password?.[0] || 'Impossible de changer le mot de passe'
      );
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

  const handleRemoveDocument = (side: 'front' | 'back') => {
    setDocumentFiles({ ...documentFiles, [side]: null });
    setDocumentPreviews({ ...documentPreviews, [side]: null });
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
      console.error("Erreur lors de l'upload du document:", error);
      toast.error(error.response?.data?.message || "Impossible d'envoyer le document");
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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsEditing(false);
  };

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

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
      {/* Header */}
      <ProfileHeader
        profile={profile}
        avatarPreview={avatarPreview}
        isEditing={isEditing}
        isSaving={isSaving}
        activeTab={activeTab}
        onEditToggle={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        onAvatarChange={handleAvatarChange}
      />

      {/* Navigation + Contenu */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation gauche */}
          <div className="lg:col-span-1">
            <ProfileSidebar activeTab={activeTab} onTabChange={handleTabChange} />
          </div>

          {/* Contenu à droite */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              {/* Mes cagnottes */}
              {activeTab === 'funds' && stats && <MyFundsTab stats={stats} />}

              {/* Mes informations */}
              {activeTab === 'info' && (
                <MyInfoTab
                  profile={profile}
                  formData={formData}
                  isEditing={isEditing}
                  onInputChange={handleInputChange}
                />
              )}

              {/* Sécurité */}
              {activeTab === 'security' && (
                <SecurityTab
                  passwordData={passwordData}
                  showPasswords={showPasswords}
                  isSaving={isSaving}
                  onPasswordChange={handlePasswordChange}
                  onSubmit={handleChangePassword}
                  onTogglePassword={togglePasswordVisibility}
                />
              )}

              {/* Document d'identité */}
              {activeTab === 'identity' && (
                <IdentityDocTab
                  selectedDocumentType={selectedDocumentType}
                  documentFiles={documentFiles}
                  documentPreviews={documentPreviews}
                  isSaving={isSaving}
                  onSelectDocumentType={setSelectedDocumentType}
                  onFileChange={handleDocumentFileChange}
                  onRemoveFile={handleRemoveDocument}
                  onSubmit={handleSubmitDocument}
                />
              )}

              {/* Préférences de communication */}
              {activeTab === 'communication' && <CommunicationTab />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
