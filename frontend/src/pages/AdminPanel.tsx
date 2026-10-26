// src/components/AdminPanel.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useFarms } from '../contexts/FarmContext';
import { User } from '../types';

const AdminPanel: React.FC = () => {
  const { t } = useLanguage();
  const { registeredFarmers, addFarmer, removeFarmer, updateUserFarms } = useAuth();
  const { farms } = useFarms();
  
  // เหลือแค่ Tab Users
  const [activeTab, setActiveTab] = useState<'users'>('users');
  
  // User Management State
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFName, setNewFName] = useState('');
  const [newLName, setNewLName] = useState('');
  const [newArea, setNewArea] = useState('');
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [managingUser, setManagingUser] = useState<User | null>(null);
  const [tempAssignedFarms, setTempAssignedFarms] = useState<string[]>([]);

  // --- Handlers: User Management ---
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUsername && newPassword) {
      const newUser: User = {
        id: `user_${Date.now()}`,
        username: newUsername,
        password: newPassword,
        firstName: newFName,
        lastName: newLName,
        area: newArea,
        role: 'farmer',
        isAuthenticated: false,
        assignedFarmIds: []
      };
      addFarmer(newUser);
      setNewUsername('');
      setNewPassword('');
      setNewFName('');
      setNewLName('');
      setNewArea('');
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm('คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?')) {
      removeFarmer(id);
    }
  };

  const openFarmModal = (user: User) => {
    setManagingUser(user);
    setTempAssignedFarms(user.assignedFarmIds || []);
    setIsFarmModalOpen(true);
  };

  const toggleFarmSelection = (farmId: string) => {
    setTempAssignedFarms(prev => 
      prev.includes(farmId) 
        ? prev.filter(id => id !== farmId) 
        : [...prev, farmId]
    );
  };

  const saveFarmAssignments = () => {
    if (managingUser) {
      updateUserFarms(managingUser.id, tempAssignedFarms);
      setIsFarmModalOpen(false);
      setManagingUser(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-background-light dark:bg-background-dark">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-text-main mb-6">{t('adminPanel')}</h2>
        
        {/* Tab Navigation (เหลือปุ่มเดียว แต่คงไว้เผื่ออนาคต) */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6 w-fit">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-text-secondary hover:text-text-main'}`}
          >
            {t('userManagement')}
          </button>
        </div>

        {/* Content: Users Tab */}
        {activeTab === 'users' && (
           <div className="space-y-6">
              {/* Add User Form */}
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color p-6 shadow-sm">
                <h3 className="text-xl font-bold text-text-main mb-4">เพิ่มเกษตรกรใหม่</h3>
                <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="p-2 border border-border-color rounded bg-background-light dark:bg-background-dark" />
                  <input type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="p-2 border border-border-color rounded bg-background-light dark:bg-background-dark" />
                  <input type="text" placeholder="ชื่อจริง" value={newFName} onChange={(e) => setNewFName(e.target.value)} className="p-2 border border-border-color rounded bg-background-light dark:bg-background-dark" />
                  <input type="text" placeholder="นามสกุล" value={newLName} onChange={(e) => setNewLName(e.target.value)} className="p-2 border border-border-color rounded bg-background-light dark:bg-background-dark" />
                  <input type="text" placeholder="พื้นที่ (เช่น เชียงใหม่)" value={newArea} onChange={(e) => setNewArea(e.target.value)} className="p-2 border border-border-color rounded bg-background-light dark:bg-background-dark md:col-span-2" />
                  <button type="submit" className="md:col-span-2 bg-primary text-white py-2 rounded font-bold hover:bg-primary-hover">บันทึกข้อมูล</button>
                </form>
              </div>

              {/* User List */}
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color p-6 shadow-sm overflow-x-auto">
                <h3 className="text-xl font-bold text-text-main mb-4">รายชื่อเกษตรกร</h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-text-secondary border-b border-border-color">
                      <th className="p-3">ชื่อผู้ใช้</th><th className="p-3">ชื่อ-นามสกุล</th><th className="p-3">พื้นที่</th><th className="p-3">ฟาร์มที่ดูแล</th><th className="p-3">จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registeredFarmers.map(user => (
                      <tr key={user.id} className="border-b border-border-color hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="p-3 font-medium">{user.username}</td>
                        <td className="p-3">{user.firstName} {user.lastName}</td>
                        <td className="p-3">{user.area}</td>
                        <td className="p-3"><span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">{user.assignedFarmIds?.length || 0} แห่ง</span></td>
                        <td className="p-3 flex gap-2">
                          <button onClick={() => openFarmModal(user)} className="text-primary hover:bg-primary/10 p-1 rounded" title="กำหนดสิทธิ์ฟาร์ม"><span className="material-symbols-outlined">rule_settings</span></button>
                          <button onClick={() => handleDeleteUser(user.id)} className="text-red-500 hover:bg-red-50 p-1 rounded" title="ลบผู้ใช้"><span className="material-symbols-outlined">delete</span></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
           </div>
        )}
      </div>

      {/* Farm Assignment Modal */}
      {isFarmModalOpen && managingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-4">กำหนดสิทธิ์การเข้าถึงฟาร์ม: <span className="text-primary">{managingUser.username}</span></h3>
            <div className="max-h-60 overflow-y-auto space-y-2 mb-6 border rounded-lg p-2">
                {farms.map(farm => (
                    <label key={farm.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded cursor-pointer border border-transparent hover:border-gray-200">
                        <input type="checkbox" checked={tempAssignedFarms.includes(farm.id)} onChange={() => toggleFarmSelection(farm.id)} className="size-5 text-primary focus:ring-primary rounded border-gray-300" />
                        <div className="flex-1"><p className="font-bold text-text-main">{farm.name}</p><p className="text-xs text-text-secondary">{farm.location}</p></div>
                        {tempAssignedFarms.includes(farm.id) && <span className="text-green-600 text-xs font-bold px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded">ได้รับอนุญาต</span>}
                    </label>
                ))}
            </div>
            <div className="flex justify-end gap-3">
                <button onClick={() => setIsFarmModalOpen(false)} className="px-4 py-2 rounded-lg text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">ยกเลิก</button>
                <button onClick={saveFarmAssignments} className="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all">บันทึกสิทธิ์</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;