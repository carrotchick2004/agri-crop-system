// src/App.tsx
import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FarmList from './components/FarmList';
import LoginPage from './components/LoginPage';
import AdminPanel from './components/AdminPanel'; // Import ใหม่
import { LanguageProvider } from './contexts/LanguageContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { FarmProvider } from './contexts/FarmContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const MainLayout: React.FC = () => {
  const { currentView } = useNavigation();
  const { user } = useAuth();
  
  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-main antialiased h-screen overflow-hidden flex">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header />
        {currentView === 'list' && <FarmList />}
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'admin' && <AdminPanel />}
      </main>
    </div>
  );
};

// ... (ส่วน App component เหมือนเดิม) ...

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <FarmProvider>
          <NavigationProvider>
            <MainLayout />
          </NavigationProvider>
        </FarmProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;