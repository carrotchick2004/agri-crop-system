import React from 'react';
import { StatMetric } from '../../types';

interface StatsCardProps {
  metric: StatMetric;
}

const StatsCard: React.FC<StatsCardProps> = ({ metric }) => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-border-color shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:border-primary/30 transition-colors duration-300">
      <div className={`absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
        <span className={`material-symbols-outlined text-6xl ${metric.colorClass}`}>{metric.icon}</span>
      </div>
      
      <div className="flex justify-between items-start z-10">
        <p className="text-text-secondary text-xs font-bold uppercase tracking-wider">{metric.label}</p>
        {!metric.progress && <span className={`material-symbols-outlined ${metric.colorClass}`}>{metric.icon}</span>}
      </div>
      
      <div className="z-10">
        <div className="flex items-baseline">
          <span className="text-3xl font-bold text-text-main">{metric.value}{metric.unit}</span>
          {metric.change && (
            <span className="text-xs text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded ml-2">
              {metric.change}
            </span>
          )}
        </div>
        
        {metric.progress ? (
          <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${metric.progress}%` }}></div>
          </div>
        ) : (
          <p className="text-xs text-text-secondary mt-1">{metric.status}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
