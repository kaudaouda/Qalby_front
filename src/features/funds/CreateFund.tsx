import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks';
import { fundService } from '../../services/fundService';
import { StepIndicator } from './components/StepIndicator';
import { BasicInfoStep } from './components/BasicInfoStep';
import { DetailsStep } from './components/DetailsStep';
import { ImageStep } from './components/ImageStep';
import { ReviewStep } from './components/ReviewStep';

export interface FundFormData {
  title: string;
  description: string;
  category: string;
  goal_amount: string;
  start_date: string;
  end_date: string;
  visibility: 'public' | 'private';
  image?: File;
}

const STEPS = [
  { id: 1, name: 'Informations de base', description: 'Titre et objectif' },
  { id: 2, name: 'Détails', description: 'Description et catégorie' },
  { id: 3, name: 'Image', description: 'Illustrez votre cagnotte' },
  { id: 4, name: 'Vérification', description: 'Vérifiez et publiez' },
];

export const CreateFund = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FundFormData>({
    title: '',
    description: '',
    category: 'other',
    goal_amount: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    visibility: 'public',
  });

  // Rediriger si non connecté
  if (!isAuthenticated) {
    navigate('/login', { state: { from: '/create-fund' } });
    return null;
  }

  const updateFormData = (field: keyof FundFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const fundData = {
        ...formData,
        goal_amount: parseFloat(formData.goal_amount),
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      };

      const response = await fundService.createFund(fundData);
      
      // Rediriger vers la page de la cagnotte créée
      navigate(`/campaign/${response.id}`, {
        state: { justCreated: true },
      });
    } catch (err: any) {
      console.error('Erreur création cagnotte:', err);
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        'Une erreur est survenue lors de la création de la cagnotte'
      );
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <DetailsStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ImageStep
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <ReviewStep
            formData={formData}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
            error={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Créer une cagnotte
          </h1>
          <p className="text-lg text-gray-600">
            Lancez votre cagnotte en quelques minutes
          </p>
        </div>

        {/* Indicateur d'étapes */}
        <StepIndicator steps={STEPS} currentStep={currentStep} />

        {/* Formulaire */}
        <div className="mt-8 bg-white shadow-lg rounded-lg p-8">
          {renderStep()}
        </div>

        {/* Aide */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            Besoin d'aide ?{' '}
            <button
              onClick={() => navigate('/help')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Consultez notre guide
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

