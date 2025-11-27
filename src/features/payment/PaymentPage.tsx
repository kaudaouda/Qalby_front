import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { FiArrowLeft, FiPhone, FiDollarSign, FiMessageSquare, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { paymentService, type PaymentInitiationData } from '../../services/paymentService';
import { fundService } from '../../services/fundService';
import type { Fund } from '../../types';

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
    logo: '🟠',
    color: '#FF7900',
    prefixes: ['07', '08', '09'],
  },
  {
    id: 'mtn_money',
    name: 'MTN Money',
    logo: '🟡',
    color: '#FFCC00',
    prefixes: ['05', '06'],
  },
  {
    id: 'moov_money',
    name: 'Moov Money',
    logo: '🔵',
    color: '#0066CC',
    prefixes: ['01', '02', '03'],
  },
  {
    id: 'wave',
    name: 'Wave',
    logo: '💙',
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
    return new Intl.NumberFormat('fr-FR').format(amount);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-8">
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
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100">
          {/* Header */}
          <div className="border-b border-gray-100 p-6 md:p-8">
            <div className="flex items-start gap-4">
              {fund.image ? (
                <img
                  src={fund.image}
                  alt={fund.title}
                  className="w-20 h-20 rounded-xl object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-qalby-orange-100 to-qalby-orange-200 flex items-center justify-center">
                  <span className="text-2xl">💝</span>
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Participer au projet
                </h1>
                <p className="text-gray-600">
                  {fund.title}
                </p>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="text-gray-500">
                    Objectif : <span className="font-semibold text-gray-900">{formatCurrency(fund.goal_amount)} FCFA</span>
                  </span>
                  <span className="text-gray-500">
                    Collecté : <span className="font-semibold text-qalby-orange-600">{formatCurrency(fund.current_amount)} FCFA</span>
                  </span>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Opérateur Mobile Money *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {PROVIDERS.map((provider) => (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={() => setSelectedProvider(provider)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3 ${
                          selectedProvider?.id === provider.id
                            ? 'border-qalby-orange-500 bg-qalby-orange-50 shadow-lg'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-3xl">{provider.logo}</span>
                        <div className="text-left">
                          <p className="font-semibold text-gray-900 text-sm">{provider.name}</p>
                          <p className="text-xs text-gray-500">{provider.prefixes.join(', ')}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Montant */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                    Montant (FCFA) *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      <FiDollarSign className="w-5 h-5 text-gray-400" />
                    </div>
                    <input
                      type="number"
                      id="amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="1000"
                      min="1"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-qalby-orange-500 transition-colors text-lg font-semibold"
                    />
                  </div>
                  {/* Suggestions de montant */}
                  <div className="flex gap-2 mt-3">
                    {[500, 1000, 2000, 5000, 10000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setAmount(val.toString())}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-qalby-orange-100 hover:text-qalby-orange-700 rounded-xl transition-colors font-medium"
                      >
                        {formatCurrency(val)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Numéro de téléphone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Numéro de téléphone *
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
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-qalby-orange-500 transition-colors text-lg"
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
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-qalby-orange-500 transition-colors resize-none"
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
                <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl">
                  <p className="text-sm text-yellow-900 font-medium">
                    🧪 <strong>Mode simulation</strong> - Aucun argent ne sera débité. Utilisez les numéros de test ci-dessus.
                  </p>
                </div>

                {/* Bouton de soumission */}
                <button
                  type="submit"
                  disabled={loading || !selectedProvider || !amount || !phone}
                  className="w-full py-5 bg-gradient-to-r from-qalby-orange-500 to-qalby-orange-600 text-white font-bold rounded-2xl hover:from-qalby-orange-600 hover:to-qalby-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Traitement...
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
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiPhone className="w-12 h-12 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Confirmez votre paiement
                  </h2>
                  <p className="text-gray-600">
                    Composez le code USSD suivant sur votre téléphone
                  </p>
                </div>

                {/* Code USSD */}
                <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                  <p className="text-sm text-gray-600 text-center mb-3 uppercase tracking-wide">Code USSD</p>
                  <p className="text-4xl font-mono font-bold text-center text-blue-900 mb-4">
                    {paymentData.ussd_code}
                  </p>
                  <p className="text-xs text-center text-gray-600">
                    Copiez ce code et composez-le sur votre téléphone
                  </p>
                </div>

                {/* Détails du paiement */}
                <div className="space-y-3 p-5 bg-gray-50 rounded-2xl">
                  <h3 className="font-semibold text-gray-900 mb-3">Détails du paiement</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant</span>
                      <span className="font-bold text-lg text-qalby-orange-600">{paymentData.amount} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Opérateur</span>
                      <span className="font-semibold">{PROVIDERS.find(p => p.id === paymentData.provider)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Numéro</span>
                      <span className="font-semibold font-mono">{paymentData.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Référence</span>
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
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiCheck className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Paiement confirmé !
                </h2>
                <p className="text-lg text-gray-600 mb-2">
                  Merci pour votre contribution de {amount} FCFA
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

