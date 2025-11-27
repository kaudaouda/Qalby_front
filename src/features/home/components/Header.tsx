import { Link } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useAppSelector } from '../../../hooks';
import { UserMenu } from '../../../components/common/UserMenu';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-qalby-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="text-2xl font-bold text-qalby-orange-600">
              Qalby
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-qalby-orange-600 transition-colors font-medium">
              Fonctionnalités
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-qalby-orange-600 transition-colors font-medium">
              Comment ça marche
            </a>
            <a href="#campaigns" className="text-gray-700 hover:text-qalby-orange-600 transition-colors font-medium">
              Cagnottes
            </a>
            <a href="#about" className="text-gray-700 hover:text-qalby-orange-600 transition-colors font-medium">
              À propos
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-qalby-orange-600 transition-colors font-medium"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-qalby-orange-500 text-white px-6 py-2.5 rounded-lg hover:bg-qalby-orange-600 hover:shadow-lg transition-all duration-300 font-medium"
                >
                  Commencer
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700 hover:text-qalby-orange-600 transition-colors"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-700 hover:text-qalby-orange-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Fonctionnalités
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-qalby-orange-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Comment ça marche
              </a>
              <a
                href="#campaigns"
                className="text-gray-700 hover:text-qalby-orange-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Cagnottes
              </a>
              <a
                href="#about"
                className="text-gray-700 hover:text-qalby-orange-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </a>
              <div className="pt-4 flex flex-col space-y-3">
                {isAuthenticated ? (
                  <div className="px-4 flex justify-center">
                    <UserMenu />
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-center text-gray-700 hover:text-qalby-orange-600 transition-colors font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      className="text-center bg-qalby-orange-500 text-white px-6 py-2.5 rounded-lg hover:bg-qalby-orange-600 hover:shadow-lg transition-all duration-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Commencer
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
