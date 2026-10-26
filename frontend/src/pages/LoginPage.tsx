// src/components/LoginPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const LoginPage: React.FC = () => {
  const { loginAdmin, loginFarmer } = useAuth();
  const { t } = useLanguage(); 
  const [role, setRole] = useState<'farmer' | 'admin'>('farmer');

  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    let success = false;
    
    if (role === 'admin') {
      success = loginAdmin(username, password);
    } else {
      success = loginFarmer(username, password);
    }

    if (!success) {
      setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  // เคลียร์ค่าเมื่อสลับแท็บ
  const switchRole = (newRole: 'farmer' | 'admin') => {
    setRole(newRole);
    setError('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
      <div className="bg-surface-light dark:bg-surface-dark shadow-xl rounded-2xl w-full max-w-md overflow-hidden border border-border-color">
        {/* Header */}
        <div className="bg-primary p-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">AgriCorp</h1>
          <p className="text-green-100">ระบบบริหารจัดการฟาร์มอัจฉริยะ</p>
        </div>

        {/* Role Tabs */}
        <div className="flex border-b border-border-color">
          <button
            onClick={() => switchRole('farmer')}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${role === 'farmer' ? 'text-primary border-b-2 border-primary bg-green-50/50' : 'text-text-secondary hover:bg-gray-50'}`}
          >
            เกษตรกร
          </button>
          <button
            onClick={() => switchRole('admin')}
            className={`flex-1 py-4 text-sm font-bold transition-colors ${role === 'admin' ? 'text-primary border-b-2 border-primary bg-green-50/50' : 'text-text-secondary hover:bg-gray-50'}`}
          >
            เจ้าหน้าที่/ผู้ดูแล
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {role === 'admin' ? 'ชื่อผู้ดูแลระบบ' : 'ชื่อผู้ใช้งาน (ID)'}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-lg border border-border-color bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder={role === 'admin' ? "admin" : "เช่น somchai"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg border border-border-color bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary/50 outline-none"
                placeholder="••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/30 hover:bg-primary-hover transition-all mt-4"
            >
              เข้าสู่ระบบ ({role === 'farmer' ? 'เกษตรกร' : 'Admin'})
            </button>
          </form>

          {role === 'farmer' && (
             <p className="text-center text-xs text-text-secondary mt-4">
               *หากยังไม่มีบัญชี กรุณาติดต่อเจ้าหน้าที่เพื่อสร้างรหัสผ่าน
             </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;