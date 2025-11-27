import { FiInfo } from 'react-icons/fi';

interface CreatorBannerProps {
  isVisible: boolean;
}

export const CreatorBanner = ({ isVisible }: CreatorBannerProps) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <FiInfo className="w-5 h-5" />
        </div>
        <div>
          <p className="font-bold text-lg">Votre cagnotte</p>
          <p className="text-sm text-white/90">
            Vous êtes le créateur de cette cagnotte. Partagez-la pour recevoir plus de contributions !
          </p>
        </div>
      </div>
    </div>
  );
};

