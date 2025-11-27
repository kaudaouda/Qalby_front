import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiUsers, FiClock } from 'react-icons/fi';
import { fundService } from '../../../services/fundService';
import { useCategories } from '../../../hooks/useCategories';
import type { Fund } from '../../../types';

export const PopularCampaigns = () => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { categories } = useCategories();

  useEffect(() => {
    const loadFunds = async () => {
      try {
        setLoading(true);
        const data = await fundService.getFunds({ status: 'open' });
        // Prendre les 6 premières cagnottes publiques
        const fundsList = Array.isArray(data) ? data : data.results || [];
        setFunds(fundsList.slice(0, 6));
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des cagnottes:', err);
        setError('Impossible de charger les cagnottes');
      } finally {
        setLoading(false);
      }
    };

    loadFunds();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  const getCategoryIcon = (categoryValue: string) => {
    const category = categories.find(c => c.value === categoryValue);
    return category?.icon;
  };

  const getCategoryLabel = (categoryValue: string) => {
    const category = categories.find(c => c.value === categoryValue);
    return category?.label || categoryValue;
  };

  const calculateProgress = (current: number, goal: number) => {
    if (goal === 0) return 0;
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  if (loading) {
    return (
      <section id="campaigns" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Cagnottes populaires
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les projets soutenus par notre communauté
            </p>
          </div>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qalby-orange-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="campaigns" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Cagnottes populaires
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les projets soutenus par notre communauté
            </p>
          </div>
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (funds.length === 0) {
    return (
      <section id="campaigns" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Cagnottes populaires
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les projets soutenus par notre communauté
            </p>
          </div>
          <div className="text-center py-20">
            <p className="text-gray-600 mb-6">Aucune cagnotte disponible pour le moment</p>
            <Link
              to="/create-fund"
              className="inline-flex items-center justify-center bg-qalby-orange-500 text-white px-8 py-4 rounded-xl hover:bg-qalby-orange-600 transition-all duration-300 font-semibold text-lg"
            >
              Créer la première cagnotte
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="campaigns" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Cagnottes populaires
          </h2>
          <p className="text-xl text-gray-600">
            Découvrez les projets soutenus par notre communauté
          </p>
        </div>

        {/* Campaigns Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {funds.map((fund) => {
            const progress = calculateProgress(fund.current_amount, fund.goal_amount);
            const daysLeft = calculateDaysRemaining(fund.end_date);
            const CategoryIcon = getCategoryIcon(fund.category);

            return (
              <Link
                key={fund.id}
                to={`/campaign/${fund.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-qalby-orange-100 to-qalby-orange-200">
                  {fund.image ? (
                    <img
                      src={fund.image}
                      alt={fund.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {CategoryIcon && (
                        <CategoryIcon className="text-6xl text-qalby-orange-600" />
                      )}
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 flex items-center gap-1">
                    {CategoryIcon && <CategoryIcon className="text-base" />}
                    {getCategoryLabel(fund.category)}
                  </div>
                  {/* Like Button */}
                  <button 
                    onClick={(e) => e.preventDefault()}
                    className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                  >
                    <FiHeart className="w-5 h-5 text-gray-700" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-qalby-orange-600 transition-colors">
                    {fund.title}
                  </h3>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Collecté</span>
                      <span className="font-semibold text-qalby-orange-600">
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-qalby-orange-500 rounded-full h-2 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-baseline">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {formatCurrency(fund.current_amount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          sur {formatCurrency(fund.goal_amount)} FCFA
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <FiUsers className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {fund.contributors_count || 0}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <FiClock className="w-4 h-4" />
                      <span className="text-sm font-medium">{daysLeft} jours</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            to="/campaigns"
            className="inline-flex items-center justify-center bg-white text-gray-700 px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-qalby-orange-500 hover:text-qalby-orange-600 transition-all duration-300 font-semibold text-lg"
          >
            Voir toutes les cagnottes
          </Link>
        </div>
      </div>
    </section>
  );
};
