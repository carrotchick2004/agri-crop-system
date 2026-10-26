// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loginAdmin: (username: string, password: string) => boolean;
  loginFarmer: (username: string, password: string) => boolean;
  logout: () => void;
  registeredFarmers: User[];
  addFarmer: (farmer: User) => void;
  removeFarmer: (id: string) => void;
  updateUserFarms: (userId: string, farmIds: string[]) => void; // ฟังก์ชันใหม่
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Mock Database
  const [registeredFarmers, setRegisteredFarmers] = useState<User[]>([
    { 
      id: 'f1', 
      username: 'somchai', 
      password: '123', 
      firstName: 'สมชาย', 
      lastName: 'ใจดี', 
      area: 'เชียงใหม่', 
      role: 'farmer', 
      isAuthenticated: false,
      assignedFarmIds: ['farm_1', 'farm_2'] // สมมติคนนี้ดูแล 2 ที่
    },
    { 
      id: 'f2', 
      username: 'manee', 
      password: '456', 
      firstName: 'มานี', 
      lastName: 'มีตา', 
      area: 'ขอนแก่น', 
      role: 'farmer', 
      isAuthenticated: false,
      assignedFarmIds: [] // คนนี้ยังไม่มีฟาร์ม
    },
  ]);

  const loginAdmin = (username: string, password: string): boolean => {
    if (username === 'admin' && password === '1234') {
      setUser({
        id: 'admin1',
        username: 'admin',
        role: 'admin',
        isAuthenticated: true,
        assignedFarmIds: []
      });
      return true;
    }
    return false;
  };

  const loginFarmer = (username: string, password: string): boolean => {
    const foundFarmer = registeredFarmers.find(
      f => f.username === username && f.password === password
    );

    if (foundFarmer) {
      setUser({ ...foundFarmer, isAuthenticated: true });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const addFarmer = (farmer: User) => {
    // กำหนดค่าเริ่มต้นเป็น empty array ถ้าไม่มีการส่งมา
    setRegisteredFarmers([...registeredFarmers, { ...farmer, assignedFarmIds: farmer.assignedFarmIds || [] }]);
  };

  const removeFarmer = (id: string) => {
    setRegisteredFarmers(registeredFarmers.filter(f => f.id !== id));
  };

  // ฟังก์ชันอัปเดตรายการฟาร์มของเกษตรกร
  const updateUserFarms = (userId: string, farmIds: string[]) => {
    // 1. อัปเดตใน Database (registeredFarmers)
    const updatedFarmers = registeredFarmers.map(farmer => 
      farmer.id === userId ? { ...farmer, assignedFarmIds: farmIds } : farmer
    );
    setRegisteredFarmers(updatedFarmers);

    // 2. ถ้า User คนนั้นล็อกอินอยู่ (หรือเป็น Admin ที่กำลังจัดการ) อาจไม่ต้องอัปเดต state user ทันที
    // แต่ถ้าเป็น user เองที่ล็อกอินอยู่ ก็ควรจะเห็นการเปลี่ยนแปลง (ในเคส real-time) 
    // ในที่นี้เราเน้นอัปเดตที่ registeredFarmers เป็นหลัก
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loginAdmin, 
      loginFarmer, 
      logout, 
      registeredFarmers, 
      addFarmer, 
      removeFarmer,
      updateUserFarms
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};