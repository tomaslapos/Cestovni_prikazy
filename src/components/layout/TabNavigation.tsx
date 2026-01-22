import { MapPin, Car } from 'lucide-react';

type Tab = 'trips' | 'vehicles';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const tabs = [
    { id: 'trips' as Tab, label: 'Cesty', icon: MapPin },
    { id: 'vehicles' as Tab, label: 'Vozidla', icon: Car },
  ];

  return (
    <nav className="border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all relative
                  ${isActive 
                    ? 'text-primary-400' 
                    : 'text-slate-400 hover:text-slate-200'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
