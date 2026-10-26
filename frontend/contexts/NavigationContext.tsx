// src/contexts/NavigationContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// เพิ่ม 'admin' ใน type View
type View = 'list' | 'dashboard' | 'admin';

type NavigationContextType = {
  currentView: View;
  selectedFarmId: string | null;
  goToDashboard: (farmId: string) => void;
  goHome: () => void;
  setView: (view: View) => void; // เพิ่มฟังก์ชันนี้
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<View>('list');
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);

  const goToDashboard = (farmId: string) => {
    setSelectedFarmId(farmId);
    setCurrentView('dashboard');
  };

  const goHome = () => {
    setCurrentView('list');
    setSelectedFarmId(null);
  };
  
  const setView = (view: View) => {
      setCurrentView(view);
      if (view !== 'dashboard') setSelectedFarmId(null);
  }

  return (
    <NavigationContext.Provider value={{ currentView, selectedFarmId, goToDashboard, goHome, setView }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};