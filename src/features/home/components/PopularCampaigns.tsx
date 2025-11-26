import { FiHeart, FiUsers, FiClock } from 'react-icons/fi';

// Mock data - will be replaced with real data from Redux
const campaigns = [
  {
    id: 1,
    title: 'Aide médicale pour Fatou',
    category: 'Santé',
    image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=400&h=300&fit=crop',
    goal: 5000000,
    raised: 3750000,
    contributors: 248,
    daysLeft: 12,
    progress: 75,
  },
  {
    id: 2,
    title: 'Construction école rurale',
    category: 'Éducation',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    goal: 10000000,
    raised: 6500000,
    contributors: 412,
    daysLeft: 25,
    progress: 65,
  },
  {
    id: 3,
    title: 'Mariage de Aminata & Moussa',
    category: 'Événement',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop',
    goal: 2000000,
    raised: 1850000,
    contributors: 156,
    daysLeft: 8,
    progress: 92,
  },
];

export const PopularCampaigns = () => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

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
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                  {campaign.category}
                </div>
                {/* Like Button */}
                <button className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors">
                  <FiHeart className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 group-hover:text-qalby-orange-600 transition-colors">
                  {campaign.title}
                </h3>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Collecté</span>
                    <span className="font-semibold text-qalby-orange-600">
                      {campaign.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-qalby-orange-500 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(campaign.raised)}
                      </div>
                      <div className="text-sm text-gray-500">
                        sur {formatCurrency(campaign.goal)} FCFA
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-1 text-gray-600">
                    <FiUsers className="w-4 h-4" />
                    <span className="text-sm font-medium">{campaign.contributors}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600">
                    <FiClock className="w-4 h-4" />
                    <span className="text-sm font-medium">{campaign.daysLeft} jours</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center justify-center bg-white text-gray-700 px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-qalby-orange-500 hover:text-qalby-orange-600 transition-all duration-300 font-semibold text-lg">
            Voir toutes les cagnottes
          </button>
        </div>
      </div>
    </section>
  );
};
