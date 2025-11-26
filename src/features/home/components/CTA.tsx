import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export const CTA = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
          </div>

          {/* Content */}
          <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Prêt à lancer votre projet ?
            </h2>
            <p className="text-xl sm:text-2xl text-white opacity-90 mb-10 max-w-3xl mx-auto">
              Créez votre cagnotte gratuitement et commencez à collecter des fonds dès aujourd'hui
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center space-x-2 bg-white text-qalby-orange-600 px-8 py-4 rounded-xl hover:shadow-2xl transition-all duration-300 font-bold text-lg"
              >
                <span>Créer ma cagnotte gratuitement</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center space-x-2 bg-transparent text-white px-8 py-4 rounded-xl border-2 border-white hover:bg-white/10 transition-all duration-300 font-bold text-lg"
              >
                <span>Se connecter</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-white opacity-90">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Gratuit</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Sans engagement</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">100% sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
