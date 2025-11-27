import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { logout } from '../../store/slices/authSlice';
import { FiUser, FiLogOut, FiSettings, FiChevronDown } from 'react-icons/fi';
import { toast } from 'react-toastify';

export const UserMenu = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Déconnexion réussie');
      navigate('/');
      setIsOpen(false);
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  if (!user) return null;

  // Initiales de l'utilisateur pour l'avatar
  const getInitials = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  // Nom complet ou email
  const getDisplayName = () => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.email;
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Bouton Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors group"
        aria-label="Menu utilisateur"
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-qalby-orange-500 flex items-center justify-center text-white font-semibold text-sm shadow-md group-hover:shadow-lg transition-shadow">
          {user.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={getDisplayName()}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{getInitials()}</span>
          )}
        </div>
        {/* Icône chevron (masquée sur mobile) */}
        <FiChevronDown
          className={`hidden md:block text-gray-600 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          size={16}
        />
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 md:block"
          onMouseLeave={() => setIsOpen(false)}
        >
          {/* Header du menu */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900">{getDisplayName()}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiUser size={18} className="text-gray-400" />
              <span>Mon profil</span>
            </Link>
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiSettings size={18} className="text-gray-400" />
              <span>Paramètres</span>
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <FiLogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

