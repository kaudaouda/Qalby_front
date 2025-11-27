import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  getFundDetail,
  getFundStatistics,
  getFundContributions,
  getFundContributors,
  clearFund,
} from '../../store/slices/fundSlice';
import { FiArrowLeft, FiCalendar, FiUsers, FiTrendingUp, FiHeart, FiShare2, FiClock, FiAward } from 'react-icons/fi';
import { useCategories } from '../../hooks/useCategories';

export const CampaignPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categories } = useCategories();

  const {
    currentFund,
    statistics,
    contributors,
    contributions,
    isLoading,
    isLoadingStatistics,
    isLoadingContributions,
    isLoadingContributors,
    error,
  } = useAppSelector((state) => state.fund);

  useEffect(() => {
    if (id) {
      dispatch(getFundDetail(id));
      dispatch(getFundStatistics(id));
      dispatch(getFundContributions({ id, page: 1 }));
      dispatch(getFundContributors(id));
    }

    return () => {
      dispatch(clearFund());
    };
  }, [id, dispatch]);

  if (isLoading && !currentFund) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-qalby-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error && !currentFund) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-qalby-orange-500 text-white rounded-xl hover:bg-qalby-orange-600 transition-colors font-semibold"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  if (!currentFund) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getCategoryIcon = (categoryValue: string) => {
    const category = categories.find(c => c.value === categoryValue);
    return category?.icon;
  };

  const getCategoryLabel = (categoryValue: string) => {
    const category = categories.find(c => c.value === categoryValue);
    return category?.label || categoryValue;
  };

  const CategoryIcon = getCategoryIcon(currentFund.category);
  const progressPercentage = Math.min(currentFund.progress_percentage, 100);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: currentFund.title,
        text: `Soutenez mon projet: ${currentFund.title}`,
        url: window.location.href,
      }).catch(() => {
        // Fallback: copier le lien
        navigator.clipboard.writeText(window.location.href);
        alert('Lien copié dans le presse-papiers !');
      });
    } else {
      // Fallback: copier le lien
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header avec image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        {currentFund.image ? (
          <>
          <img
            src={currentFund.image}
            alt={currentFund.title}
            className="w-full h-full object-cover"
          />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-qalby-orange-500 via-qalby-orange-600 to-qalby-orange-700 flex items-center justify-center">
            {CategoryIcon && <CategoryIcon className="text-9xl text-white/30" />}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        )}
        
        {/* Bouton retour */}
        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-xl hover:bg-white hover:shadow-lg transition-all duration-300 font-medium"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
        </div>

        {/* Badge statut */}
        <div className="absolute top-6 right-6">
          <div className={`px-4 py-2 rounded-full backdrop-blur-sm font-semibold text-sm flex items-center gap-2 ${
            currentFund.days_remaining > 0 
              ? 'bg-green-500/90 text-white' 
              : 'bg-gray-500/90 text-white'
          }`}>
            <FiClock className="w-4 h-4" />
            {currentFund.days_remaining > 0 
              ? `${currentFund.days_remaining} jours restants` 
              : 'Terminée'}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Titre et description */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    {CategoryIcon && <CategoryIcon className="w-5 h-5 text-qalby-orange-600" />}
                    <span className="inline-block px-3 py-1 bg-qalby-orange-100 text-qalby-orange-700 rounded-full text-sm font-semibold">
                      {getCategoryLabel(currentFund.category)}
                  </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
                    {currentFund.title}
                  </h1>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                  {currentFund.description}
                </p>
              </div>

              {/* Informations du créateur */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Organisateur</p>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-qalby-orange-400 to-qalby-orange-600 rounded-full flex items-center justify-center ring-4 ring-qalby-orange-100">
                      <span className="text-white font-bold text-lg">
                      {currentFund.creator.first_name?.[0] || currentFund.creator.email[0].toUpperCase()}
                    </span>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {currentFund.creator.first_name} {currentFund.creator.last_name}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <FiCalendar className="w-3.5 h-3.5" />
                      Créé le {formatDate(currentFund.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="mb-6">
                <div className="flex items-baseline justify-between mb-10">
                  <div>
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Collecté</p>
                    <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-qalby-orange-600 to-qalby-orange-500 bg-clip-text text-transparent">
                      {formatCurrency(currentFund.current_amount)} FCFA
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">Objectif</p>
                    <p className="text-lg font-semibold text-gray-700">
                      {formatCurrency(currentFund.goal_amount)} FCFA
                    </p>
                  </div>
                </div>
                
                {/* Barre de progression améliorée */}
                <div className="relative mt-8">
                  <div className="w-full bg-gray-100 rounded-full h-5 shadow-inner">
                    <div
                      className="bg-gradient-to-r from-qalby-orange-500 to-qalby-orange-600 h-5 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="absolute -top-8 left-0 right-0 flex justify-between items-center">
                    <span className="text-2xl font-bold text-qalby-orange-600">{progressPercentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* Statistiques améliorées */}
              {statistics && (
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl">
                    <FiUsers className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {statistics.contributors_count}
                    </div>
                    <div className="text-xs text-gray-600 font-medium mt-1">
                      Contributeurs
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl">
                    <FiTrendingUp className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-gray-900">
                      {statistics.total_contributions}
                    </div>
                    <div className="text-xs text-gray-600 font-medium mt-1">
                      Dons
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl">
                    <FiAward className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(statistics.average_contribution)}
                    </div>
                    <div className="text-xs text-gray-600 font-medium mt-1">Moyenne</div>
                  </div>
                </div>
              )}
            </div>

            {/* Contributions récentes */}
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                Contributions récentes
              </h2>
                {currentFund.latest_contributions && currentFund.latest_contributions.length > 0 && (
                  <span className="px-3 py-1 bg-qalby-orange-100 text-qalby-orange-700 rounded-full text-sm font-semibold">
                    {currentFund.latest_contributions.length}
                  </span>
                )}
              </div>
              {currentFund.latest_contributions && currentFund.latest_contributions.length > 0 ? (
                <div className="space-y-3">
                  {currentFund.latest_contributions.map((contribution) => (
                    <div
                      key={contribution.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-qalby-orange-400 to-qalby-orange-600 rounded-full flex items-center justify-center ring-4 ring-qalby-orange-50 flex-shrink-0">
                          <span className="text-white font-bold">
                            {contribution.contributor_name?.[0]?.toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900">
                            {contribution.is_anonymous ? 'Anonyme' : contribution.contributor_name}
                          </p>
                          {contribution.message && (
                            <p className="text-sm text-gray-600 truncate">{contribution.message}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-0.5">
                            {formatDate(contribution.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="text-lg font-bold text-qalby-orange-600">
                          {formatCurrency(contribution.amount)}
                        </p>
                        <p className="text-xs text-gray-500">FCFA</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiHeart className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">Aucune contribution pour le moment</p>
                  <p className="text-sm text-gray-400 mt-1">Soyez le premier à soutenir ce projet !</p>
                </div>
              )}
            </div>
          </div>

          {/* Colonne latérale - Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100 sticky top-6 hover:shadow-2xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Soutenir ce projet
              </h2>
              <div className="space-y-3">
                {/* Bouton Participer */}
                <button 
                  onClick={() => navigate(`/payment/${id}`)}
                  className="w-full py-4 bg-gradient-to-r from-qalby-orange-500 to-qalby-orange-600 text-white rounded-2xl font-bold hover:from-qalby-orange-600 hover:to-qalby-orange-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 transform"
                >
                  <FiHeart className="w-5 h-5" />
                  Participer
                </button>
                
                {/* Bouton Partager */}
                <button 
                  onClick={handleShare}
                  className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold hover:border-qalby-orange-500 hover:text-qalby-orange-600 hover:bg-qalby-orange-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <FiShare2 className="w-5 h-5" />
                  Partager
                </button>
              </div>
              
              {/* Message d'encouragement */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                <p className="text-sm text-blue-900 text-center font-medium">
                  💝 Chaque contribution compte pour atteindre l'objectif !
                </p>
              </div>

              {/* Contributeurs */}
              {contributors.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">
                    Top contributeurs
                  </h3>
                    <span className="text-sm font-semibold text-qalby-orange-600">
                      🏆
                    </span>
                  </div>
                  <div className="space-y-3">
                    {contributors.slice(0, 5).map((contributor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 bg-gradient-to-br from-qalby-orange-400 to-qalby-orange-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {contributor.name?.[0] || 'U'}
                            </span>
                            </div>
                            {index === 0 && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
                                👑
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {contributor.name || 'Anonyme'}
                            </p>
                            <p className="text-xs text-gray-500">
                              {contributor.contribution_count || 0} don{(contributor.contribution_count || 0) > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-qalby-orange-600">
                          {formatCurrency(contributor.total_amount || 0)}
                        </span>
                      </div>
                    ))}
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
