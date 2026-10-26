import React from 'react';
import { FARM_TEMPLATES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useFarms } from '../contexts/FarmContext';
import { useNavigation } from '../contexts/NavigationContext';

interface AddFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFarmModal: React.FC<AddFarmModalProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const { addFarm, myFarms } = useFarms();
  const { goToDashboard } = useNavigation();

  if (!isOpen) return null;

  // Filter out templates that are already used in active farms
  const usedTemplateIds = myFarms.map(f => f.templateId);
  const availableTemplates = FARM_TEMPLATES.filter(template => !usedTemplateIds.includes(template.id));

  const handleSelectTemplate = (templateId: string) => {
    const template = FARM_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      const newId = addFarm(template, language);
      onClose();
      goToDashboard(newId);
    }
  };

  const isTh = language === 'th';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border-color flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-text-main">{t('selectLocation')}</h2>
            <p className="text-text-secondary text-sm mt-1">{t('selectLocationDesc')}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-background-light rounded-full transition-colors">
            <span className="material-symbols-outlined text-text-main">close</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {availableTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-300">
              <div className="size-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                 <span className="material-symbols-outlined text-4xl text-text-secondary opacity-50">inventory_2</span>
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">{t('noAvailableFarms')}</h3>
              <p className="text-text-secondary max-w-sm text-sm leading-relaxed">{t('restoreFarmHint')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableTemplates.map((template) => (
                <div 
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.id)}
                  className="group cursor-pointer rounded-xl border border-border-color overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all relative animate-in fade-in slide-in-from-bottom-4 duration-300 fill-mode-backwards"
                >
                  <div className="h-40 overflow-hidden relative">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url('${template.image}')` }}
                    ></div>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                  
                  <div className="p-4 bg-background-light dark:bg-background-dark">
                    <h3 className="text-lg font-bold text-text-main mb-1">
                      {isTh ? template.nameTh : template.nameEn}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-text-secondary mb-3">
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      {isTh ? template.locationTh : template.locationEn}
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-text-main">
                          {template.baseArea} {isTh ? 'ไร่' : 'Acres'}
                      </span>
                      <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          {t('addThisFarm')}
                          <span className="material-symbols-outlined text-lg">add_circle</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border-color bg-background-light dark:bg-background-dark flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700 font-medium transition-colors"
          >
            {t('cancel')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFarmModal;