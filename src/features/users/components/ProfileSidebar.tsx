import { FiHeart, FiUser, FiLock, FiFileText, FiBell } from 'react-icons/fi';

type TabType = 'funds' | 'info' | 'security' | 'identity' | 'communication';

interface ProfileSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const ProfileSidebar = ({ activeTab, onTabChange }: ProfileSidebarProps) => {
  const tabs = [
    { id: 'funds' as TabType, label: 'Mes cagnottes', icon: FiHeart },
    { id: 'info' as TabType, label: 'Mes informations', icon: FiUser },
    { id: 'security' as TabType, label: 'Sécurité', icon: FiLock },
    { id: 'identity' as TabType, label: "Document d'identité", icon: FiFileText },
    { id: 'communication' as TabType, label: 'Préférences de communication', icon: FiBell },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
      <nav className="space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                activeTab === tab.id
                  ? 'bg-qalby-orange-50 text-qalby-orange-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-qalby-orange-600' : 'text-gray-400'}`} />
              <span className="text-sm">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

