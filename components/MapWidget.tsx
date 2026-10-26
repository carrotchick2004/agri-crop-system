import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const MapWidget: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color p-4 shadow-sm h-64 flex flex-col">
      <h3 className="font-bold text-sm text-text-main mb-3">{t('mapLocation')}</h3>
      <div className="flex-1 w-full rounded-lg bg-gray-200 overflow-hidden relative group cursor-pointer">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
          style={{ backgroundImage: "url('https://picsum.photos/400/300?grayscale&blur=2')" }} // Fallback/Placeholder
        >
            {/* Overlay actual map-like color/texture if needed or just use an image */}
            <div className="absolute inset-0 bg-green-900/20 mix-blend-overlay"></div>
        </div>
        
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors"></div>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="size-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
            <span className="material-symbols-outlined">location_on</span>
          </div>
        </div>
        
        <div className="absolute bottom-3 right-3 bg-surface-light px-2 py-1 rounded text-xs font-bold shadow-sm text-text-main">
           {t('plotA')}
        </div>
      </div>
    </div>
  );
};

export default MapWidget;
