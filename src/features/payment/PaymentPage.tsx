import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FiArrowLeft, FiPhone, FiMessageSquare, FiCheck, FiAlertCircle, FiPlus, FiMinus } from 'react-icons/fi';
import { paymentService, type PaymentInitiationData } from '../../services/paymentService';
import { fundService } from '../../services/fundService';
import type { Fund } from '../../types';

// Import des logos des opérateurs
import orangeLogo from '../../images/payment/orange.png';
import mtnLogo from '../../images/payment/mtn.jpg';
import moovLogo from '../../images/payment/moov.png';
import waveLogo from '../../images/payment/wave.jpg';

interface Provider {
  id: 'orange_money' | 'mtn_money' | 'moov_money' | 'wave';
  name: string;
  logo: string;
  color: string;
  prefixes: string[];
}

const PROVIDERS: Provider[] = [
  {
    id: 'orange_money',
    name: 'Orange Money',
    logo: orangeLogo,
    color: '#FF7900',
    prefixes: ['07', '08', '09'],
  },
  {
    id: 'mtn_money',
    name: 'MTN Money',
    logo: mtnLogo,
    color: '#FFCC00',
    prefixes: ['05', '06'],
  },
  {
    id: 'moov_money',
    name: 'Moov Money',
    logo: moovLogo,
    color: '#0066CC',
    prefixes: ['01', '02', '03'],
  },
  {
    id: 'wave',
    name: 'Wave',
    logo: waveLogo,
    color: '#4A90E2',
    prefixes: ['01', '02', '03', '05', '06', '07', '08', '09'],
  },
];

type PaymentStep = 'form' | 'confirmation' | 'success' | 'error';

export const PaymentPage = () => {
  const { fundId } = useParams<{ fundId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [fund, setFund] = useState<Fund | null>(null);
  const [loadingFund, setLoadingFund] = useState(true);
  
  const [step, setStep] = useState<PaymentStep>('form');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [amount, setAmount] = useState(searchParams.get('amount') || '');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pour le step de confirmation
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const loadFund = async () => {
      if (!fundId) return;
      
      try {
        setLoadingFund(true);
        const data = await fundService.getFundDetail(fundId);
        setFund(data);
      } catch (err) {
        console.error('Erreur chargement cagnotte:', err);
        setError('Cagnotte introuvable');
      } finally {
        setLoadingFund(false);
      }
    };

    loadFund();
  }, [fundId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedProvider || !amount || !phone || !fundId) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Montant invalide');
      return;
    }

    setLoading(true);

    try {
      const data: PaymentInitiationData = {
        fund_id: fundId,
        amount: amountNum,
        phone: phone,
        provider: selectedProvider.id,
        message: message || undefined,
      };

      const result = await paymentService.initiatePayment(data);
      
      if (result.success && result.status === 'pending') {
        setPaymentData(result);
        setStep('confirmation');
      } else if (result.status === 'failed') {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Une erreur est survenue lors du paiement');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (action: 'confirm' | 'cancel') => {
    setLoading(true);
    setError('');

    try {
      const result = await paymentService.confirmPayment({
        transaction_id: paymentData.transaction_id,
        reference: paymentData.reference,
        action: action,
      });

      if (result.success && result.status === 'success') {
        setStep('success');
      } else {
        setStep('error');
        setError(result.message || 'Le paiement a échoué');
      }
    } catch (err: any) {
      setStep('error');
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' F CFA';
  };

  if (loadingFund) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-qalby-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!fund) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h2>
          <p className="text-gray-600 mb-6">Cagnotte introuvable</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-qalby-orange-500 text-white rounded-xl hover:bg-qalby-orange-600 transition-colors font-semibold"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bouton retour */}
        <button
          onClick={() => navigate(`/campaign/${fundId}`)}
          className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span className="font-medium">Retour à la cagnotte</span>
        </button>

        {/* Card principale */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header avec gradient */}
          <div className="bg-gradient-to-r from-qalby-orange-500 to-purple-600 p-6 md:p-8 relative overflow-hidden">
            {/* Motif décoratif */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>
            
            <div className="flex items-start gap-4 relative z-10">
              {fund.image ? (
                <img
                  src={fund.image}
                  alt={fund.title}
                  className="w-20 h-20 rounded-xl object-cover ring-4 ring-white/30 shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/30 shadow-lg">
                  <span className="text-3xl">💝</span>
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                  Participer au projet
                </h1>
                <p className="text-white/90 font-medium drop-shadow">
                  {fund.title}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl">
                    <span className="text-xs text-white/80 block">Objectif</span>
                    <span className="font-bold text-white">{formatCurrency(fund.goal_amount)}</span>
                  </div>
                  <div className="px-4 py-2 bg-white/30 backdrop-blur-sm rounded-xl">
                    <span className="text-xs text-white/80 block">Collecté</span>
                    <span className="font-bold text-white">{formatCurrency(fund.current_amount)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu selon l'étape */}
          <div className="p-6 md:p-8">
            {step === 'form' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Sélection de l'opérateur */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-br from-qalby-orange-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">1</span>
                    Choisissez votre opérateur Mobile Money
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {PROVIDERS.map((provider) => (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={() => setSelectedProvider(provider)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3 ${
                          selectedProvider?.id === provider.id
                            ? 'border-qalby-orange-500 bg-gradient-to-br from-qalby-orange-50 to-purple-50 shadow-xl scale-105'
                            : 'border-gray-200 hover:border-qalby-orange-200 hover:shadow-lg hover:scale-102'
                        }`}
                      >
                        <img 
                          src={provider.logo} 
                          alt={provider.name}
                          className="w-12 h-12 object-contain rounded-lg"
                        />
                        <div className="text-left">
                          <p className="font-semibold text-gray-900">{provider.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Montant */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-br from-qalby-orange-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">2</span>
                    Montant à contribuer
                  </label>
                  <div className="relative">
                    {/* Bouton moins */}
                    <button
                      type="button"
                      onClick={() => {
                        const currentAmount = parseFloat(amount) || 0;
                        const newAmount = Math.max(0, currentAmount - 100);
                        setAmount(newAmount.toString());
                      }}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-qalby-orange-100 hover:to-purple-100 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-md z-10"
                    >
                      <FiMinus className="w-5 h-5 text-gray-600" />
                    </button>
                    
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="1000"
                      min="0"
                      className="w-full px-16 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-qalby-orange-500 focus:ring-4 focus:ring-qalby-orange-100 transition-all text-lg font-bold text-center"
                    />
                    
                    {/* Bouton plus */}
                    <button
                      type="button"
                      onClick={() => {
                        const currentAmount = parseFloat(amount) || 0;
                        setAmount((currentAmount + 100).toString());
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-qalby-orange-500 to-purple-600 hover:from-qalby-orange-600 hover:to-purple-700 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg z-10"
                    >
                      <FiPlus className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Utilisez les boutons +/- pour ajuster le montant par tranche de 100 F CFA
                  </p>
                  
                  {/* Suggestions de montant */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {[500, 1000, 2000, 5000, 10000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val.toString())}
                        className="px-4 py-2 text-sm bg-gradient-to-br from-gray-50 to-gray-100 hover:from-qalby-orange-100 hover:to-purple-100 hover:text-qalby-orange-700 border border-gray-200 hover:border-qalby-orange-300 rounded-xl transition-all font-medium hover:scale-105 hover:shadow-md"
                      >
                        {formatCurrency(val)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Numéro de téléphone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-br from-qalby-orange-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">3</span>
                    Votre numéro Mobile Money
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <FiPhone className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0757000000"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-qalby-orange-500 focus:ring-4 focus:ring-qalby-orange-100 transition-all text-lg font-mono"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Numéro associé à votre compte Mobile Money
                  </p>
                  
                  {/* Numéros de test */}
                  <details className="mt-3">
                    <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-700">
                      🧪 Numéros de test disponibles
                    </summary>
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg text-xs space-y-1">
                      <p><strong>Succès :</strong> 0757000000, 0747000000</p>
                      <p><strong>Échec :</strong> 0757999999, 0747999999</p>
                      <p><strong>Aléatoire :</strong> Tout autre numéro valide</p>
                    </div>
                  </details>
                </div>

                {/* Message (optionnel) */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center text-white text-sm">💬</span>
                    Message de soutien (optionnel)
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-4">
                      <FiMessageSquare className="w-5 h-5 text-gray-400" />
                    </div>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Laissez un message d'encouragement..."
                      rows={3}
                      maxLength={200}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-qalby-orange-500 focus:ring-4 focus:ring-qalby-orange-100 transition-all resize-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {message.length}/200
                  </p>
                </div>

                {/* Erreur */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* Info simulation */}
                <div className="p-5 bg-gradient-to-r from-yellow-50 via-amber-50 to-orange-50 border-2 border-yellow-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 text-xl">
                      🧪
                    </div>
                    <div>
                      <p className="font-bold text-yellow-900 mb-1">Mode simulation activé</p>
                      <p className="text-sm text-yellow-800">
                        Aucun argent ne sera débité. Utilisez les numéros de test ci-dessus pour tester les différents scénarios.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={loading || !selectedProvider || !amount || !phone}
                  className="w-full py-5 bg-gradient-to-r from-qalby-orange-500 via-orange-600 to-purple-600 text-white font-bold rounded-2xl hover:from-qalby-orange-600 hover:via-orange-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2 text-lg relative overflow-hidden group"
                >
                  {/* Effet de brillance au hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <FiCheck className="w-6 h-6" />
                      Continuer vers le paiement
                    </>
                  )}
                </button>
              </form>
            )}

            {step === 'confirmation' && paymentData && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
                    <FiPhone className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Confirmez votre paiement
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Composez le code USSD suivant sur votre téléphone
                  </p>
                </div>

                {/* Code USSD */}
                <div className="relative p-8 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl shadow-2xl overflow-hidden">
                  {/* Motif décoratif */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <p className="text-sm text-white/80 text-center mb-3 uppercase tracking-widest font-semibold">Code USSD</p>
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-4">
                      <p className="text-5xl font-mono font-bold text-center text-white drop-shadow-lg">
                        {paymentData.ussd_code}
                      </p>
                    </div>
                    <p className="text-sm text-center text-white/90 font-medium">
                      📱 Copiez ce code et composez-le sur votre téléphone
                    </p>
                  </div>
                </div>

                {/* Détails du paiement */}
                <div className="space-y-3 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Détails du paiement</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-white rounded-xl">
                      <span className="text-gray-600 font-medium">Montant</span>
                      <span className="font-bold text-lg text-qalby-orange-600">{paymentData.amount} F CFA</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-xl">
                      <span className="text-gray-600 font-medium">Opérateur</span>
                      <span className="font-semibold text-gray-900">{PROVIDERS.find(p => p.id === paymentData.provider)?.name}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-xl">
                      <span className="text-gray-600 font-medium">Numéro</span>
                      <span className="font-semibold font-mono text-gray-900">{paymentData.phone}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-white rounded-xl">
                      <span className="text-gray-600 font-medium">Référence</span>
                      <span className="font-mono text-sm text-gray-700">{paymentData.reference}</span>
                    </div>
                  </div>
                </div>

                {/* Info simulation */}
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-900 font-medium">
                    ℹ️ <strong>Mode simulation :</strong> Cliquez sur "Confirmer le paiement" ci-dessous pour simuler la validation USSD
                  </p>
                </div>

                {/* Erreur */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* Boutons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={() => handleConfirmPayment('cancel')}
                    disabled={loading}
                    className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Annuler le paiement
                  </button>
                  <button
                    onClick={() => handleConfirmPayment('confirm')}
                    disabled={loading}
                    className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Confirmation...
                      </span>
                    ) : (
                      'Confirmer le paiement'
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-12">
                <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce">
                  <FiCheck className="w-16 h-16 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3">
                  Paiement confirmé !
                </h2>
                <p className="text-lg text-gray-600 mb-2">
                  Merci pour votre contribution de <span className="font-bold text-green-600">{amount} F CFA</span>
                </p>
                <p className="text-sm text-gray-500 mb-8">
                  Votre soutien fait la différence
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                  <button
                    onClick={() => navigate(`/campaign/${fundId}`)}
                    className="px-8 py-4 bg-gradient-to-r from-qalby-orange-500 to-qalby-orange-600 text-white font-bold rounded-xl hover:from-qalby-orange-600 hover:to-qalby-orange-700 transition-colors shadow-lg"
                  >
                    Voir la cagnotte
                  </button>
                  <button
                    onClick={() => {
                      setStep('form');
                      setAmount('');
                      setPhone('');
                      setMessage('');
                      setSelectedProvider(null);
                      setPaymentData(null);
                    }}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Contribuer à nouveau
                  </button>
                </div>
              </div>
            )}

            {step === 'error' && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiAlertCircle className="w-12 h-12 text-red-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Paiement échoué
                </h2>
                <p className="text-gray-600 mb-8">
                  {error || 'Une erreur est survenue lors du paiement'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                  <button
                    onClick={() => navigate(`/campaign/${fundId}`)}
                    className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Retour à la cagnotte
                  </button>
                  <button
                    onClick={() => {
                      setStep('form');
                      setError('');
                      setPaymentData(null);
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-qalby-orange-500 to-qalby-orange-600 text-white font-bold rounded-xl hover:from-qalby-orange-600 hover:to-qalby-orange-700 transition-colors shadow-lg"
                  >
                    Réessayer
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info sécurité */}
        {step === 'form' && (
          <div className="mt-6 p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🔒</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Paiement 100% sécurisé</h3>
                <p className="text-sm text-gray-600">
                  Vos informations de paiement sont protégées et chiffrées. Nous ne stockons jamais vos données bancaires.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

