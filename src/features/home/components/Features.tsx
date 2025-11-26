import { FiShield, FiZap, FiUsers, FiSmartphone, FiCreditCard, FiTrendingUp } from 'react-icons/fi';

const features = [
  {
    icon: FiZap,
    title: 'Rapide et simple',
    description: 'Créez votre cagnotte en moins de 2 minutes. Aucune expertise technique requise.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: FiShield,
    title: 'Sécurisé à 100%',
    description: 'Vos transactions sont protégées par un cryptage de niveau bancaire.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: FiUsers,
    title: 'Partage facile',
    description: 'Partagez votre cagnotte sur tous vos réseaux sociaux en un clic.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FiSmartphone,
    title: 'Mobile Money',
    description: 'Acceptez les paiements via Orange Money, MTN Money, Moov Money et Wave.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: FiCreditCard,
    title: 'Paiements multiples',
    description: 'Cartes bancaires, virements et paiements mobiles acceptés.',
    color: 'from-rose-500 to-red-500',
  },
  {
    icon: FiTrendingUp,
    title: 'Suivi en temps réel',
    description: 'Suivez vos contributions et objectifs avec des statistiques détaillées.',
    color: 'from-indigo-500 to-violet-500',
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Tout ce dont vous avez besoin
            <span className="block text-qalby-orange-600">
              pour réussir votre collecte
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Une plateforme complète pensée pour simplifier vos collectes de fonds
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-qalby-orange-200 hover:shadow-xl transition-all duration-300"
              >

                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
