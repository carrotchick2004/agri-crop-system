import React from 'react';
import { getNutrients, getSoilAnalysis } from '../constants';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useFarms } from '../contexts/FarmContext';

const SoilAnalysis: React.FC = () => {
  const { t, language } = useLanguage();
  const { selectedFarmId } = useNavigation();
  const { getFarmById } = useFarms();
  
  const currentFarm = selectedFarmId ? getFarmById(selectedFarmId) : undefined;
  const templateId = currentFarm ? currentFarm.templateId : 'farm1';
  
  const nutrients = getNutrients(language, templateId);
  const soilData = getSoilAnalysis(templateId);
  
  // Data for the gauge
  const phValue = soilData.ph;
  const phMax = 14;
  const gaugeData = [
    { name: 'pH', value: phValue, fill: phValue < 5.5 ? '#eab308' : (phValue > 7.5 ? '#eab308' : '#13ec5b') }
  ];

  const getPhStatus = () => {
      if (soilData.status === 'acidic') return t('phStatusAcid');
      if (soilData.status === 'alkaline') return t('phStatusAlkaline');
      return t('phStatus');
  }

  return (
    <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-text-main">{t('soilComposition')}</h3>
        <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
          {t('history')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* pH Gauge */}
        <div className="bg-background-light dark:bg-background-dark rounded-lg p-5 flex flex-col items-center justify-center relative min-h-[200px]">
          <div className="w-full h-40 relative flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
               <RadialBarChart 
                  innerRadius="80%" 
                  outerRadius="100%" 
                  barSize={20} 
                  data={gaugeData} 
                  startAngle={180} 
                  endAngle={0}
                  cx="50%"
                  cy="70%"
                >
                 <PolarAngleAxis type="number" domain={[0, phMax]} angleAxisId={0} tick={false} />
                 <RadialBar
                   background
                   dataKey="value"
                   cornerRadius={10}
                   // Fill color is handled in data object, but fallback here
                   fill="#13ec5b"
                 />
               </RadialBarChart>
             </ResponsiveContainer>
             <div className="absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="block text-4xl font-bold text-text-main">{phValue}</span>
                <span className="text-xs text-text-secondary uppercase font-semibold">{t('phLabel')}</span>
             </div>
          </div>
          <p className={`text-sm font-medium px-3 py-1 rounded-full mt-2 ${soilData.status !== 'neutral' ? 'bg-yellow-100 text-yellow-800' : 'bg-primary/10 text-primary'}`}>
              {getPhStatus()}
          </p>
        </div>

        {/* Nutrient Bars */}
        <div className="flex flex-col justify-center gap-6">
          {nutrients.map((nutrient) => (
            <div key={nutrient.name}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-text-main flex items-center gap-1">
                    {nutrient.name} <span className="text-text-secondary text-xs">({nutrient.symbol})</span>
                </span>
                <span className={`text-sm font-bold ${nutrient.status === 'Low' ? 'text-yellow-500' : (nutrient.status === 'High' ? 'text-primary' : 'text-text-secondary')}`}>
                  {nutrient.statusLabel}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-1000 ${nutrient.colorClass}`} 
                  style={{ width: `${nutrient.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoilAnalysis;
