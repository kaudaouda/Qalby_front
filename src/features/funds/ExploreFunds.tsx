import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fundService } from '../../services/fundService';
import type { Fund } from '../../types';
import { useCategoriesWithAll } from '../../hooks/useCategories';

export const ExploreFunds = () => {
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const { categories: categoriesWithAll, loading: categoriesLoading } = useCategoriesWithAll();

  useEffect(() => {
    loadFunds();
  }, [selectedCategory]);

  const loadFunds = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = selectedCategory !== 'all' ? { category: selectedCategory } : {};
      const data = await fundService.getFunds(params);
      setFunds(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      console.error('Erreur chargement cagnottes:', err);
      setError('Impossible de charger les cagnottes');
    } finally {
      setLoading(false);
    }
  };

  const FundCard = ({ fund }: { fund: Fund }) => (
    <Link
      to={`/campaign/${fund.id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Image */}
      {fund.image ? (
        <div className="aspect-video overflow-hidden bg-gray-100">
          <img
            src={fund.image}
            alt={fund.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-video bg-gradient-to-br from-qalby-orange-100 to-qalby-orange-200 flex items-center justify-center">
          {(() => {
            const category = categoriesWithAll.find(c => c.value === fund.category);
            const IconComponent = category?.icon;
            return IconComponent ? (
              <IconComponent className="text-6xl text-qalby-orange-600" />
            ) : (
              <span className="text-6xl">✨</span>
            );
          })()}
        </div>
      )}

      {/* Contenu */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-qalby-orange-600 transition-colors">
          {fund.title}
        </h3>

        {/* Progression */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-2xl font-bold text-qalby-orange-600">
              {fund.current_amount?.toLocaleString('fr-FR')} €
            </span>
            <span className="text-sm text-gray-500">
              sur {fund.goal_amount?.toLocaleString('fr-FR')} €
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-qalby-orange-500 to-qalby-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((fund.current_amount / fund.goal_amount) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            {fund.contributors_count || 0} contributeurs
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            {fund.days_remaining || 0} jours restants
          </span>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Découvrez les cagnottes
          </h1>
          <p className="text-xl text-gray-600">
            Soutenez des projets qui vous tiennent à cœur
          </p>
        </div>

        {/* Filtres par catégorie */}
        <div className="mb-8">
          {categoriesLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-qalby-orange-500"></div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3 justify-center">
              {categoriesWithAll.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`
                    px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2
                    ${
                      selectedCategory === category.value
                        ? 'bg-qalby-orange-500 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                    }
                  `}
                >
                  <IconComponent className="text-lg" />
                  {category.label}
                </button>
              );
            })}
            </div>
          )}
        </div>

        {/* Liste des cagnottes */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-qalby-orange-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadFunds}
              className="px-6 py-3 bg-qalby-orange-500 text-white rounded-lg hover:bg-qalby-orange-600"
            >
              Réessayer
            </button>
          </div>
        ) : funds.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Aucune cagnotte trouvée
            </h3>
            <p className="text-gray-600 mb-6">
              Soyez le premier à créer une cagnotte dans cette catégorie !
            </p>
            <Link
              to="/create-fund"
              className="inline-flex items-center gap-2 px-6 py-3 bg-qalby-orange-500 text-white rounded-lg hover:bg-qalby-orange-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Créer une cagnotte
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {funds.map((fund) => (
                <FundCard key={fund.id} fund={fund} />
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <div className="bg-gradient-to-r from-qalby-orange-500 to-qalby-orange-600 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  Vous avez un projet ?
                </h3>
                <p className="text-lg mb-6">
                  Créez votre cagnotte en quelques minutes
                </p>
                <Link
                  to="/create-fund"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-qalby-orange-600 font-bold rounded-lg hover:shadow-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Créer ma cagnotte
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

