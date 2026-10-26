// src/components/FarmList.tsx
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useFarms } from '../contexts/FarmContext';
import { useAuth } from '../contexts/AuthContext'; // เพิ่ม AuthContext

const FarmList: React.FC = () => {
  const { t } = useLanguage();
  const { goToDashboard } = useNavigation();
  const { farms } = useFarms();
  const { user } = useAuth(); // ดึง User ที่ล็อกอิน

  // กรองฟาร์ม: แสดงเฉพาะ ID ที่อยู่ใน assignedFarmIds
  // ถ้าเป็น Admin ให้เห็นทั้งหมด (หรือจะให้เห็นเฉพาะที่ตัวเองดูแลก็ได้ แล้วแต่ตรรกะ, แต่ปกติ Admin เห็นหมด)
  const accessibleFarms = user?.role === 'admin' 
    ? farms 
    : farms.filter(f => user?.assignedFarmIds?.includes(f.id));

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto flex flex-col gap-8 h-full">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-text-main tracking-tight mb-1">{t('farmListTitle')}</h2>
            <p className="text-text-secondary">
               {user?.role === 'admin' ? 'พื้นที่เพาะปลูกทั้งหมด (Admin View)' : `พื้นที่ที่คุณได้รับมอบหมาย (${accessibleFarms?.length || 0})`}
            </p>
          </div>
        </div>

        {/* ถ้าไม่มีฟาร์มที่ได้รับมอบหมาย */}
        {accessibleFarms?.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200">
               <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">lock</span>
               <p className="text-text-secondary font-medium">คุณยังไม่ได้รับมอบหมายให้ดูแลพื้นที่ใดๆ</p>
               <p className="text-xs text-gray-400 mt-1">กรุณาติดต่อเจ้าหน้าที่เพื่อขอสิทธิ์เข้าใช้งาน</p>
           </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {accessibleFarms?.map((farm) => (
                <div 
                    key={farm.id}
                    onClick={() => goToDashboard(farm.id)}
                    className="group bg-surface-light dark:bg-surface-dark rounded-2xl p-4 border border-border-color shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer flex flex-col h-[320px]"
                >
                    <div className="relative h-40 mb-4 overflow-hidden rounded-xl bg-gray-100">
                        <img 
                            src={farm.image} 
                            alt={farm.name}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm text-text-main">
                            {farm.area}
                        </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <h3 className="font-bold text-lg text-text-main mb-1 group-hover:text-primary transition-colors">{farm.name}</h3>
                            <div className="flex items-center gap-1 text-xs text-text-secondary mb-3">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                {farm.location}
                            </div>
                            
                            <div className="flex gap-2 text-xs">
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">pH: {farm.envData.ph}</span>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">H: {farm.envData.humidity}%</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border-color">
                            <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                {t('viewDashboard')}
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </span>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default FarmList;