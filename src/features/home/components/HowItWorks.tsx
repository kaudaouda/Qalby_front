import { FiEdit, FiShare2, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../hooks';

const steps = [
  {
    icon: FiEdit,
    number: '01',
    title: 'Créez votre cagnotte',
    description: 'Définissez votre objectif, ajoutez une description et une image pour présenter votre projet.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: FiShare2,
    number: '02',
    title: 'Partagez avec vos proches',
    description: 'Diffusez votre cagnotte sur les réseaux sociaux, par email ou WhatsApp pour toucher un maximum de personnes.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FiDollarSign,
    number: '03',
    title: 'Recevez les contributions',
    description: 'Acceptez les paiements par Mobile Money, carte bancaire ou virement. Tout est sécurisé.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: FiCheckCircle,
    number: '04',
    title: 'Réalisez votre projet',
    description: 'Retirez vos fonds collectés et concrétisez votre projet. Simple et transparent.',
    color: 'from-amber-500 to-orange-500',
  },
];

export const HowItWorks = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600">
            4 étapes simples pour lancer votre collecte de fonds
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                {/* Connector Line (hidden on last item and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent -translate-x-1/2 z-0" />
                )}

                {/* Card */}
                <div className="relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 h-full">
                  {/* Number Badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-qalby-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${step.color} mb-4 mt-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA - Only show for non-authenticated users */}
        {!isAuthenticated && (
          <div className="text-center mt-12">
            <Link
              to="/register"
              className="inline-flex items-center justify-center bg-qalby-orange-500 text-white px-8 py-4 rounded-xl hover:bg-qalby-orange-600 hover:shadow-xl transition-all duration-300 font-semibold text-lg"
            >
              Commencer maintenant
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
