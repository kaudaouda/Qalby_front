interface Step {
  id: number;
  name: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-between">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={`flex-1 ${index !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}
          >
            <div className="flex flex-col items-center">
              {/* Cercle avec numéro */}
              <div
                className={`
                  w-10 h-10 flex items-center justify-center rounded-full border-2 text-sm font-semibold
                  ${
                    step.id < currentStep
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : step.id === currentStep
                      ? 'border-primary-600 text-primary-600 bg-white'
                      : 'border-gray-300 text-gray-500 bg-white'
                  }
                `}
              >
                {step.id < currentStep ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.id
                )}
              </div>

              {/* Texte */}
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    step.id <= currentStep ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {step.name}
                </p>
                <p className="text-xs text-gray-500 hidden sm:block">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Ligne de connexion */}
            {index !== steps.length - 1 && (
              <div
                className={`
                  absolute top-5 left-1/2 w-full h-0.5 -translate-x-1/2
                  ${step.id < currentStep ? 'bg-primary-600' : 'bg-gray-300'}
                `}
                style={{ zIndex: -1 }}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

