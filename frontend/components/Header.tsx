import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useFarms } from '../contexts/FarmContext';

const Header: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const { selectedFarmId, goHome } = useNavigation();
  const { getFarmById } = useFarms();
  
  const currentFarm = selectedFarmId ? getFarmById(selectedFarmId) : undefined;
  const currentFarmName = currentFarm ? currentFarm.name : '';

  const toggleLanguage = () => {
    setLanguage(language === 'th' ? 'en' : 'th');
  };

  return (
    <header className="h-16 shrink-0 border-b border-border-color bg-surface-light dark:bg-surface-dark px-6 flex items-center justify-between z-10 sticky top-0">
      <div className="flex items-center gap-2 text-sm">
        <button className="md:hidden mr-2 text-text-secondary">
             <span className="material-symbols-outlined">menu</span>
        </button>
        <button 
            onClick={goHome}
            className={`${selectedFarmId ? 'text-text-secondary hover:text-primary' : 'font-semibold text-text-main'} transition-colors font-medium`}
        >
            {t('navFarm')}
        </button>
        
        {selectedFarmId && (
            <>
                <span className="text-text-secondary">/</span>
                <span className="font-semibold text-text-main">{currentFarmName}</span>
            </>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleLanguage}
          className="px-2 py-1 rounded border border-border-color text-xs font-bold text-text-secondary hover:text-primary hover:border-primary transition-colors uppercase"
        >
          {language === 'th' ? 'EN' : 'TH'}
        </button>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background-light dark:bg-background-dark border border-border-color">
          <span className="material-symbols-outlined text-text-secondary text-sm">calendar_today</span>
          <span className="text-sm font-medium text-text-main">{t('dateToday')}</span>
        </div>
        
        <button className="relative p-2 rounded-lg hover:bg-background-light dark:hover:bg-background-dark text-text-secondary hover:text-text-main transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-surface-light"></span>
        </button>
        
        <div 
          className="size-9 rounded-full bg-cover bg-center border border-border-color cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" 
          style={{ backgroundImage: "url('https://picsum.photos/100/100')" }}
          title="User Profile"
        ></div>
      </div>
    </header>
  );
};

export default Header;
