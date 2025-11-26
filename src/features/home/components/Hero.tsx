import { Link } from 'react-router-dom';
import { FiArrowRight, FiPlay } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-qalby-orange-50 -z-10" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-qalby-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-qalby-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-qalby-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000" />

      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-qalby-orange-200">
              <HiSparkles className="text-qalby-orange-500" />
              <span className="text-sm font-medium text-gray-700">
                Plateforme #1 de cagnottes en Afrique de l'Ouest
              </span>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Créez votre
                <span className="block text-qalby-orange-600">
                  cagnotte en ligne
                </span>
                en quelques clics
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Collectez des fonds pour vos projets, événements et causes qui vous tiennent à cœur.
                Simple, rapide et sécurisé.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center space-x-2 bg-qalby-orange-500 text-white px-8 py-4 rounded-xl hover:bg-qalby-orange-600 hover:shadow-xl transition-all duration-300 font-semibold text-lg"
              >
                <span>Créer ma cagnotte</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group inline-flex items-center justify-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-xl border-2 border-gray-200 hover:border-qalby-orange-500 hover:text-qalby-orange-600 transition-all duration-300 font-semibold text-lg">
                <FiPlay className="group-hover:scale-110 transition-transform" />
                <span>Voir la démo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Cagnottes créées</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900">500M+</div>
                <div className="text-sm text-gray-600">FCFA collectés</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-gray-900">98%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image/Illustration */}
          <div className="relative lg:block hidden">
            <div className="relative">
              {/* Placeholder for illustration - you can replace with actual image */}
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  {/* Mock Campaign Card */}
                  <div className="bg-qalby-orange-500 rounded-xl p-6 text-white">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <div className="text-sm opacity-90">Objectif</div>
                        <div className="text-2xl font-bold">1,000,000 FCFA</div>
                      </div>
                      <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                        75%
                      </div>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                      <div className="bg-white rounded-full h-2 w-3/4" />
                    </div>
                    <div className="text-sm opacity-90">120 contributeurs</div>
                  </div>

                  {/* Mock Contributors */}
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                        <div className="w-10 h-10 bg-qalby-orange-400 rounded-full" />
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded w-32 mb-1" />
                          <div className="h-2 bg-gray-100 rounded w-24" />
                        </div>
                        <div className="text-sm font-semibold text-qalby-orange-600">
                          {i * 5000} FCFA
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 animate-float">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-qalby-orange-500 rounded-full animate-ping" />
                  <span className="text-sm font-medium text-gray-700">Nouveau don reçu!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
