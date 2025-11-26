import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-qalby-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
              <span className="text-2xl font-bold text-white">
                Qalby
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              La plateforme #1 de cagnottes en ligne en Afrique de l'Ouest. Simple, rapide et sécurisé.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-qalby-orange-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiFacebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-qalby-orange-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiTwitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-qalby-orange-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-qalby-orange-600 rounded-lg flex items-center justify-center transition-colors"
              >
                <FiLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Liens rapides</h3>
            <ul className="space-y-3">
              <li>
                <a href="#features" className="hover:text-qalby-orange-400 transition-colors">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-qalby-orange-400 transition-colors">
                  Comment ça marche
                </a>
              </li>
              <li>
                <a href="#campaigns" className="hover:text-qalby-orange-400 transition-colors">
                  Cagnottes populaires
                </a>
              </li>
              <li>
                <Link to="/register" className="hover:text-qalby-orange-400 transition-colors">
                  Créer une cagnotte
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-qalby-orange-400 transition-colors">
                  Centre d'aide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-qalby-orange-400 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-qalby-orange-400 transition-colors">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-qalby-orange-400 transition-colors">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiMail className="w-5 h-5 text-qalby-orange-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:contact@qalby.com" className="hover:text-qalby-orange-400 transition-colors">
                  contact@qalby.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <FiPhone className="w-5 h-5 text-qalby-orange-400 mt-0.5 flex-shrink-0" />
                <a href="tel:+221771234567" className="hover:text-qalby-orange-400 transition-colors">
                  +221 77 123 45 67
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <FiMapPin className="w-5 h-5 text-qalby-orange-400 mt-0.5 flex-shrink-0" />
                <span>
                  Abidjan, Côte d'Ivoire
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Qalby. Tous droits réservés.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <a href="#" className="hover:text-qalby-orange-400 transition-colors">
                Mentions légales
              </a>
              <a href="#" className="hover:text-qalby-orange-400 transition-colors">
                Cookies
              </a>
              <a href="#" className="hover:text-qalby-orange-400 transition-colors">
                Plan du site
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
