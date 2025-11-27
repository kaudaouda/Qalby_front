import { useState } from 'react';
import { FiX, FiPhone, FiDollarSign, FiMessageSquare, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { paymentService, type PaymentInitiationData } from '../../services/paymentService';

// Import des logos des opérateurs
import orangeLogo from '../../images/payment/orange.png';
import mtnLogo from '../../images/payment/mtn.jpg';
import moovLogo from '../../images/payment/moov.png';
import waveLogo from '../../images/payment/wave.jpg';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  fundId: string;
  fundTitle: string;
  onSuccess?: () => void;
}

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

export const PaymentModal = ({ isOpen, onClose, fundId, fundTitle, onSuccess }: PaymentModalProps) => {
  const [step, setStep] = useState<PaymentStep>('form');
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Pour le step de confirmation
  const [paymentData, setPaymentData] = useState<any>(null);

  if (!isOpen) return null;

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
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedProvider || !amount || !phone) {
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

  const handleClose = () => {
    setStep('form');
    setSelectedProvider(null);
    setAmount('');
    setPhone('');
    setMessage('');
    setError('');
    setPaymentData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between rounded-t-3xl">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Participer</h2>
            <p className="text-sm text-gray-600 mt-1">{fundTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
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
                      <img 
                        src={provider.logo} 
                        alt={provider.name}
                        className="w-12 h-12 object-contain rounded-lg"
                      />
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
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-qalby-orange-500 transition-colors"
                  />
                </div>
                {/* Suggestions de montant */}
                <div className="flex gap-2 mt-2">
                  {[500, 1000, 2000, 5000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val.toString())}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {val}
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
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-qalby-orange-500 transition-colors"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Numéro associé à votre compte Mobile Money
                </p>
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
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-qalby-orange-500 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Erreur */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={loading || !selectedProvider || !amount || !phone}
                className="w-full py-4 bg-gradient-to-r from-qalby-orange-500 to-qalby-orange-600 text-white font-bold rounded-2xl hover:from-qalby-orange-600 hover:to-qalby-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <FiCheck className="w-5 h-5" />
                    Continuer
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'confirmation' && paymentData && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiPhone className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Confirmez votre paiement
                </h3>
                <p className="text-gray-600">
                  Composez le code USSD suivant pour confirmer
                </p>
              </div>

              {/* Code USSD */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                <p className="text-sm text-gray-600 text-center mb-2">Code USSD</p>
                <p className="text-3xl font-mono font-bold text-center text-blue-900">
                  {paymentData.ussd_code}
                </p>
              </div>

              {/* Détails */}
              <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
                <div className="flex justify-between">
                  <span className="text-gray-600">Montant</span>
                  <span className="font-semibold">{paymentData.amount} FCFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Numéro</span>
                  <span className="font-semibold">{paymentData.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Référence</span>
                  <span className="font-mono text-sm">{paymentData.reference}</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-sm text-yellow-800">
                  ℹ️ <strong>Mode simulation :</strong> Pour tester, cliquez directement sur "Confirmer le paiement"
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
              <div className="flex gap-3">
                <button
                  onClick={() => handleConfirmPayment('cancel')}
                  disabled={loading}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleConfirmPayment('confirm')}
                  disabled={loading}
                  className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 disabled:opacity-50 transition-all shadow-lg"
                >
                  {loading ? 'Confirmation...' : 'Confirmer le paiement'}
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Paiement confirmé !
              </h3>
              <p className="text-gray-600 mb-6">
                Merci pour votre contribution
              </p>
              <button
                onClick={handleClose}
                className="px-8 py-3 bg-qalby-orange-500 text-white font-semibold rounded-xl hover:bg-qalby-orange-600 transition-colors"
              >
                Fermer
              </button>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Paiement échoué
              </h3>
              <p className="text-gray-600 mb-6">
                {error || 'Une erreur est survenue'}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    setStep('form');
                    setError('');
                    setPaymentData(null);
                  }}
                  className="px-6 py-3 bg-qalby-orange-500 text-white font-semibold rounded-xl hover:bg-qalby-orange-600 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

