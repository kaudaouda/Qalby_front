import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { register, clearError } from '../../store/slices/authSlice';
import { countryService } from '../../services/countryService';
import type { Country } from '../../types';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';

export const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    password_confirm: '',
  });
  const [phoneCode, setPhoneCode] = useState('+225');
  const [showPassword, setShowPassword] = useState(false);
  const [countries, setCountries] = useState<Country[]>([
    { id: '1', name: 'Côte d\'Ivoire', phone_code: '+225', flag: '🇨🇮' }
  ]);
  const [loadingCountries, setLoadingCountries] = useState(true);

  // Charger les pays au montage du composant
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await countryService.getCountries();
        // S'assurer que data est un tableau avant de l'assigner
        if (Array.isArray(data) && data.length > 0) {
        setCountries(data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des pays:', err);
        // Garder le pays par défaut (Côte d'Ivoire) en cas d'erreur
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (formData.password !== formData.password_confirm) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    // Combine phone code with phone number
    const fullPhone = `${phoneCode}${formData.phone}`;

    // Find the country based on phone code
    const selectedCountry = countries.find(c => c.phone_code === phoneCode);

    const registrationData = {
      ...formData,
      phone: fullPhone,
      country: selectedCountry?.id || '',
    };

    try {
      await dispatch(register(registrationData)).unwrap();
      toast.success('Inscription réussie! Vous pouvez maintenant vous connecter.');
      navigate('/login');
    } catch (err: any) {
      toast.error(typeof err === 'string' ? err : 'Échec de l\'inscription');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-neutral-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">Qalby</h1>
          <h2 className="text-2xl font-semibold text-neutral-800">Créer un compte</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Rejoignez Qalby et commencez à créer vos cagnottes
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-xl" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-neutral-700 mb-1">
                Prénom
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Kouassi"
                />
              </div>
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-neutral-700 mb-1">
                Nom
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Yao"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="kouassi@exemple.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                Téléphone
              </label>
              <div className="relative flex">
                {/* Phone Code Selector */}
                <select
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  disabled={loadingCountries}
                  className="appearance-none block w-28 pl-3 pr-8 py-3 border border-r-0 border-neutral-300 text-neutral-900 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-white"
                  style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                >
                  {Array.isArray(countries) && countries.map((country) => (
                    <option key={country.id} value={country.phone_code}>
                      {country.flag} {country.phone_code}
                    </option>
                  ))}
                </select>
                {/* Phone Number Input */}
                <div className="relative flex-1">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-3 pr-3 py-3 border border-neutral-300 text-neutral-900 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder-neutral-400"
                    placeholder="07 12 34 56 78"
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  />
                </div>
              </div>
            </div>


            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  ) : (
                    <FiEye className="h-5 w-5 text-neutral-400 hover:text-neutral-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="password_confirm" className="block text-sm font-medium text-neutral-700 mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password_confirm"
                  name="password_confirm"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password_confirm}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {typeof error === 'string' ? error : JSON.stringify(error)}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Inscription en cours...
                </span>
              ) : (
                'Créer mon compte'
              )}
            </button>
          </div>

          {/* Links */}
          <div className="text-center text-sm">
            <span className="text-neutral-600">Vous avez déjà un compte? </span>
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Se connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
