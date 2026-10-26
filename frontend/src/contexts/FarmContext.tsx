// src/contexts/FarmContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Farm, EnvData, PlantedCropData, AIModelInfo } from '../types';

type FarmContextType = {
  farms: Farm[];
  myFarms: Farm[];
  updateFarmEnv: (id: string, data: EnvData) => void;
  updateFarmInfo: (id: string, name: string, areaSqM: number) => void;
  getFarmById: (id: string) => Farm | undefined;
  plantCrop: (farmId: string, crop: PlantedCropData) => void;
  cancelPlanting: (farmId: string) => void;
  trainFarmAI: (farmId: string, file: File, type: 'reco' | 'yield') => Promise<void>; 
  addFarm: (template: any, lang: any) => string;
};

const FarmContext = createContext<FarmContextType | undefined>(undefined);

const initialModel: AIModelInfo = {
    lastTrained: null,
    accuracy: 0,
    totalRecords: 0,
    status: 'idle'
};

// Initial Data
const INITIAL_FARMS: Farm[] = Array.from({ length: 3 }, (_, i) => ({
  id: `farm_${i + 1}`,
  name: `แปลงเพาะปลูกที่ ${i + 1}`,
  location: `โซน ${String.fromCharCode(65 + i)}`,
  area: '1600 ตร.ม.',
  areaSqM: 1600,
  status: 'active',
  image: `https://picsum.photos/id/${15 + i}/800/600`,
  envData: {
    ph: 6.5, 
    temp: 28, 
    humidity: 60, 
    ec: 1.2,   // Keep EC
    water: 800 // Keep Water, Remove NPK
  },
  plantedCrop: null,
  templateId: 'farm1',
  recoModel: { ...initialModel },
  yieldModel: { ...initialModel }
}));

export const FarmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [farms, setFarms] = useState<Farm[]>(INITIAL_FARMS);

  const getFarmById = (id: string) => farms.find(f => f.id === id);

  const updateFarmEnv = (id: string, data: EnvData) => {
    setFarms(prev => prev.map(f => f.id === id ? { ...f, envData: data } : f));
  };

  const updateFarmInfo = (id: string, name: string, areaSqM: number) => {
    setFarms(prev => prev.map(f => 
      f.id === id ? { ...f, name, areaSqM, area: `${areaSqM} ตร.ม.` } : f
    ));
  };

  const plantCrop = (farmId: string, crop: PlantedCropData) => {
    setFarms(prev => prev.map(f => f.id === farmId ? { ...f, plantedCrop: crop } : f));
  };

  const cancelPlanting = (farmId: string) => {
    setFarms(prev => prev.map(f => f.id === farmId ? { ...f, plantedCrop: null } : f));
  };

  const addFarm = (template: any, lang: any) => {
      const newId = `farm_${farms.length + 1}`;
      const newFarm: Farm = {
          id: newId,
          name: lang === 'th' ? template.nameTh : template.nameEn,
          location: lang === 'th' ? template.locationTh : template.locationEn,
          area: '1600 ตร.ม.',
          areaSqM: 1600,
          status: 'active',
          image: template.image,
          envData: { ph: 6.5, temp: 30, humidity: 65, ec: 1.0, water: 1000 },
          plantedCrop: null,
          templateId: template.id,
          recoModel: { ...initialModel },
          yieldModel: { ...initialModel }
      };
      setFarms([...farms, newFarm]);
      return newId;
  };

  const trainFarmAI = (farmId: string, file: File, type: 'reco' | 'yield') => {
    return new Promise<void>((resolve, reject) => {
      setFarms(prev => prev.map(f => {
          if (f.id !== farmId) return f;
          return {
              ...f,
              [type === 'reco' ? 'recoModel' : 'yieldModel']: {
                  ...f[type === 'reco' ? 'recoModel' : 'yieldModel'],
                  status: 'training'
              }
          };
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').length - 1;
        
        setTimeout(() => {
          const freshAccuracy = 85 + (Math.random() * 14);
          const newInfo: AIModelInfo = {
            lastTrained: Date.now(),
            accuracy: parseFloat(freshAccuracy.toFixed(2)),
            totalRecords: rows > 0 ? rows : 100,
            status: 'ready',
            fileName: file.name
          };
          setFarms(prev => prev.map(f => {
            if (f.id !== farmId) return f;
            return {
                ...f,
                [type === 'reco' ? 'recoModel' : 'yieldModel']: newInfo
            };
          }));
          resolve();
        }, 3000); 
      };
      reader.readAsText(file);
    });
  };

  return (
    <FarmContext.Provider value={{ 
        farms, myFarms: farms,
        updateFarmEnv, updateFarmInfo, getFarmById, 
        plantCrop, cancelPlanting, trainFarmAI, addFarm
    }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarms = () => {
  const context = useContext(FarmContext);
  if (context === undefined) throw new Error('useFarms must be used within FarmProvider');
  return context;
};