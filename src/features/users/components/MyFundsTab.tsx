import { useNavigate } from 'react-router-dom';
import { FiHeart } from 'react-icons/fi';

interface MyFundsTabProps {
  stats: {
    funds_created: number;
    total_funds_amount: number;
    contributions_made: number;
    total_contributed: number;
  };
}

export const MyFundsTab = ({ stats }: MyFundsTabProps) => {
  const navigate = useNavigate();

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

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mes cagnottes</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl border border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <FiHeart className="w-6 h-6 text-blue-600" />
            <span className="text-3xl font-bold text-blue-900">{stats.funds_created}</span>
          </div>
          <p className="text-sm font-semibold text-blue-900 mb-1">Cagnottes créées</p>
          <p className="text-xs text-blue-700">{formatCurrency(stats.total_funds_amount)} collectés</p>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100/30 rounded-xl border border-green-100">
          <div className="flex items-center justify-between mb-3">
            <FiHeart className="w-6 h-6 text-green-600" />
            <span className="text-3xl font-bold text-green-900">{stats.contributions_made}</span>
          </div>
          <p className="text-sm font-semibold text-green-900 mb-1">Participations</p>
          <p className="text-xs text-green-700">{formatCurrency(stats.total_contributed)} donnés</p>
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
  );
};

