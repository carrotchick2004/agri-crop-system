// src/components/Sidebar.tsx
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useFarms } from '../contexts/FarmContext';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const { selectedFarmId, currentView, goToDashboard, goHome, setView } = useNavigation();
  const { farms } = useFarms();
  const { user, logout } = useAuth();

  // กรองฟาร์ม
  const accessibleFarms = user?.role === 'admin' 
    ? farms 
    : farms.filter(f => user?.assignedFarmIds?.includes(f.id));

  return (
    <aside className="w-72 flex flex-col border-r border-border-color bg-surface-light dark:bg-surface-dark h-full shrink-0 z-20 hidden md:flex">
      <div 
        className="h-16 flex items-center px-6 border-b border-border-color cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        onClick={goHome}
      >
        <div className="flex items-center gap-3 text-text-main">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-background-dark shadow-sm">
            <span className="material-symbols-outlined text-xl">agriculture</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight">{t('appTitle')}</h1>
        </div>
      </div>
      
      {/* User Info */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-border-color">
          <p className="text-xs text-text-secondary uppercase font-bold tracking-wider mb-1">
              {user?.role === 'admin' ? 'Administrator' : 'Farmer'}
          </p>
          <p className="font-semibold text-text-main truncate">
              {user?.username || 'User'}
          </p>
      </div>

      <div className="p-4 flex-1 overflow-y-auto sidebar-scroll">
        
        {/* Menu for Admin */}
        {user?.role === 'admin' && (
           <div className="mb-6">
              <button 
                  onClick={() => setView('admin')}
                  className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-colors ${currentView === 'admin' ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-gray-100'}`}
              >
                  <span className="material-symbols-outlined">admin_panel_settings</span>
                  {t('adminPanel')}
              </button>
           </div>
        )}

        <div className="flex w-full items-center justify-between mb-4 px-2">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">พื้นที่เพาะปลูก</span>
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-text-secondary px-2 py-0.5 rounded-full">
            {accessibleFarms?.length || 0}
          </span>
        </div>

        <div className="space-y-1">
            {accessibleFarms?.length === 0 ? (
                <div className="text-center py-4 text-xs text-gray-400">ไม่มีฟาร์มที่ดูแล</div>
            ) : (
                accessibleFarms?.map((farm) => (
                    <button
                    key={farm.id}
                    onClick={() => goToDashboard(farm.id)}
                    className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                        selectedFarmId === farm.id 
                        ? 'bg-primary/10 text-primary ring-1 ring-primary/20 shadow-sm' 
                        : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text-main'
                    }`}
                    >
                    <span 
                        className={`material-symbols-outlined ${selectedFarmId === farm.id ? 'text-primary' : ''}`} 
                        style={selectedFarmId === farm.id ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                        location_on
                    </span>
                    <div className="flex flex-col items-start text-left overflow-hidden">
                        <span className={`text-sm truncate w-full ${selectedFarmId === farm.id ? 'font-semibold' : 'font-medium text-text-main'}`}>
                            {farm.name}
                        </span>
                        <span className="text-xs text-text-secondary line-clamp-1">
                            {farm.location}
                        </span>
                    </div>
                    </button>
                ))
            )}
        </div>
      </div>

      <div className="p-4 border-t border-border-color space-y-2">
        <button 
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-lg h-10 border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span>{t('logout')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;