import React from 'react';
import { getForecast } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';

const WeatherWidget: React.FC = () => {
  const { t, language } = useLanguage();
  const forecast = getForecast(language);

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color p-6 shadow-sm relative overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-text-main">{t('weatherTitle')}</h3>
        <span className="text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-1 rounded">{t('days5')}</span>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="size-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-orange-500">
          <span className="material-symbols-outlined text-4xl">partly_cloudy_day</span>
        </div>
        <div>
          <p className="text-4xl font-bold text-text-main">24°</p>
          <p className="text-sm text-text-secondary">{t('weatherCondition')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {forecast.map((day) => (
          <div key={day.day} className="flex items-center justify-between text-sm group cursor-pointer hover:bg-background-light dark:hover:bg-background-dark p-1 rounded transition-colors">
            <span className="text-text-secondary w-8 font-medium">{day.day}</span>
            <span className={`material-symbols-outlined text-lg ${day.colorClass} group-hover:scale-110 transition-transform`}>{day.icon}</span>
            <span className="font-medium text-text-main">{day.tempHigh}° / {day.tempLow}°</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;
