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
import { FiArrowLeft, FiCalendar, FiUsers, FiTrendingUp, FiHeart, FiShare2 } from 'react-icons/fi';

export const CampaignPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error && !currentFund) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
          <p className="text-neutral-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
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
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header avec image */}
      <div className="relative h-64 md:h-96 bg-gradient-to-r from-primary-600 to-primary-800">
        {currentFund.image ? (
          <img
            src={currentFund.image}
            alt={currentFund.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-600 to-primary-800"></div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="absolute top-4 left-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100 transition-all"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Titre et description */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-3">
                    {currentFund.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                    {currentFund.title}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <FiHeart className="w-5 h-5 text-neutral-600" />
                  </button>
                  <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <FiShare2 className="w-5 h-5 text-neutral-600" />
                  </button>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
                  {currentFund.description}
                </p>
              </div>

              {/* Informations du créateur */}
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {currentFund.creator.first_name?.[0] || currentFund.creator.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">
                      {currentFund.creator.first_name} {currentFund.creator.last_name}
                    </p>
                    <p className="text-sm text-neutral-600">
                      Créé le {formatDate(currentFund.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl md:text-3xl font-bold text-primary-600">
                    {formatCurrency(currentFund.current_amount)}
                  </span>
                  <span className="text-neutral-600">
                    sur {formatCurrency(currentFund.goal_amount)}
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-4 mb-4">
                  <div
                    className="bg-primary-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(currentFund.progress_percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-600">
                  <span>{currentFund.progress_percentage.toFixed(1)}% collecté</span>
                  <span className="flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    {currentFund.days_remaining > 0
                      ? `${currentFund.days_remaining} jours restants`
                      : 'Terminé'}
                  </span>
                </div>
              </div>

              {/* Statistiques */}
              {statistics && (
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-neutral-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-900">
                      {statistics.contributors_count}
                    </div>
                    <div className="text-sm text-neutral-600 flex items-center justify-center gap-1 mt-1">
                      <FiUsers className="w-4 h-4" />
                      Contributeurs
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-900">
                      {statistics.total_contributions}
                    </div>
                    <div className="text-sm text-neutral-600 flex items-center justify-center gap-1 mt-1">
                      <FiTrendingUp className="w-4 h-4" />
                      Contributions
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-neutral-900">
                      {formatCurrency(statistics.average_contribution)}
                    </div>
                    <div className="text-sm text-neutral-600">Moyenne</div>
                  </div>
                </div>
              )}
            </div>

            {/* Contributions récentes */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Contributions récentes
              </h2>
              {currentFund.latest_contributions && currentFund.latest_contributions.length > 0 ? (
                <div className="space-y-4">
                  {currentFund.latest_contributions.map((contribution) => (
                    <div
                      key={contribution.id}
                      className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">
                            {contribution.contributor_name?.[0].toUpperCase() || 'A'}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900">
                            {contribution.is_anonymous ? 'Anonyme' : contribution.contributor_name}
                          </p>
                          {contribution.message && (
                            <p className="text-sm text-neutral-600">{contribution.message}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary-600">
                          {formatCurrency(contribution.amount)}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {formatDate(contribution.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-neutral-600 py-8">
                  Aucune contribution pour le moment
                </p>
              )}
            </div>
          </div>

          {/* Colonne latérale - Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 sticky top-8">
              <h2 className="text-2xl font-bold text-neutral-900 mb-6">
                Soutenir ce projet
              </h2>
              <div className="space-y-3">
                {/* Bouton Participer */}
                <button className="w-full py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                  <FiHeart className="w-5 h-5" />
                  Participer
                </button>
                
                {/* Bouton Partager */}
                <button className="w-full py-4 bg-white border-2 border-neutral-200 text-neutral-700 rounded-xl font-semibold hover:border-primary-500 hover:text-primary-600 transition-all duration-300 flex items-center justify-center gap-2">
                  <FiShare2 className="w-5 h-5" />
                  Partager
                </button>
              </div>
              
              {/* Message d'encouragement */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-800 text-center">
                  Chaque contribution compte pour atteindre l'objectif !
                </p>
              </div>

              {/* Contributeurs */}
              {contributors.length > 0 && (
                <div className="mt-8 pt-8 border-t border-neutral-200">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                    Top contributeurs
                  </h3>
                  <div className="space-y-3">
                    {contributors.slice(0, 5).map((contributor, index) => (
                      <div
                        key={contributor.user.id}
                        className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-semibold text-xs">
                              {contributor.user.first_name?.[0] || contributor.user.email[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-neutral-900">
                              {contributor.user.first_name} {contributor.user.last_name}
                            </p>
                            <p className="text-xs text-neutral-600">
                              {contributor.contributions_count} contribution{contributor.contributions_count > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-primary-600">
                          {formatCurrency(contributor.total_contributed)}
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

