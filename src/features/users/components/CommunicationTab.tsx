import { FiBell } from 'react-icons/fi';

export const CommunicationTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Préférences de communication</h2>
      <div className="text-center py-12">
        <FiBell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Section en cours de développement</p>
        <p className="text-sm text-gray-400 mt-2">Gestion des notifications et emails</p>
      </div>
    </div>
  );
};

