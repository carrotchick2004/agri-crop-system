// src/components/Dashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigation } from '../contexts/NavigationContext';
import { useFarms } from '../contexts/FarmContext';
import { useAuth } from '../contexts/AuthContext';
import StatsCard from '../components/ui/StatsCard';
import CropAnalysisModal from '../components/modals/CropAnalysisModal';
import { StatMetric, EnvData, AIModelInfo } from '../types';

// --- Sub-component: EditEnvModal ---
const EditEnvModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    initialData: EnvData; 
    onSave: (data: EnvData) => void 
}> = ({ isOpen, onClose, initialData, onSave }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<EnvData>(initialData);
    useEffect(() => { setFormData(initialData); }, [initialData, isOpen]);
    if (!isOpen) return null;
    const handleChange = (key: keyof EnvData, value: string) => { setFormData(prev => ({ ...prev, [key]: Number(value) })); };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); onClose(); };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-lg border border-border-color p-6 overflow-y-auto max-h-[90vh]">
                <h3 className="text-xl font-bold mb-6 text-text-main flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">settings_input_component</span>
                    {t('editEnv')}
                </h3>
                <form onSubmit={handleSubmit}>
                    {/* จัดเป็น Grid แบบ 2 คอลัมน์สำหรับ 5 ค่า */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text-main">{t('env_ph')}</label>
                            <input type="number" step="0.1" value={formData.ph} onChange={e => handleChange('ph', e.target.value)} className="w-full p-2 rounded border border-border-color bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text-main">{t('env_temp')}</label>
                            <input type="number" step="0.1" value={formData.temp} onChange={e => handleChange('temp', e.target.value)} className="w-full p-2 rounded border border-border-color bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text-main">{t('env_humidity')}</label>
                            <input type="number" value={formData.humidity} onChange={e => handleChange('humidity', e.target.value)} className="w-full p-2 rounded border border-border-color bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-text-main">{t('env_ec')}</label>
                            <input type="number" step="0.1" value={formData.ec} onChange={e => handleChange('ec', e.target.value)} className="w-full p-2 rounded border border-border-color bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-text-main">{t('env_water')}</label>
                            <input type="number" value={formData.water} onChange={e => handleChange('water', e.target.value)} className="w-full p-2 rounded border border-border-color bg-background-light dark:bg-background-dark focus:ring-2 focus:ring-primary outline-none" />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-border-color">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">{t('cancel')}</button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover transition-all">{t('saveChanges')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Sub-component: ManageFarmAIModal ---
const ManageFarmAIModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void; 
    recoModel: AIModelInfo & { fileName?: string }; // เพิ่มการรองรับ fileName
    yieldModel: AIModelInfo & { fileName?: string };
    onTrain: (file: File, type: 'reco' | 'yield') => Promise<void>;
}> = ({ isOpen, onClose, recoModel, yieldModel, onTrain }) => {
    const { t, language } = useLanguage();
    const [activeTab, setActiveTab] = useState<'reco' | 'yield'>('reco');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    if (!isOpen) return null;
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]); };
    const handleTrainClick = async () => { if (selectedFile) { await onTrain(selectedFile, activeTab); setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; } };
    const currentModel = activeTab === 'reco' ? recoModel : yieldModel;
    const title = activeTab === 'reco' ? t('recoModelTitle') : t('yieldModelTitle');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-2xl border border-border-color overflow-hidden">
                <div className="p-4 border-b border-border-color flex justify-between items-center bg-background-light dark:bg-background-dark">
                    <h3 className="font-bold text-lg text-text-main flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">psychology</span>
                        {t('manageAI')}
                    </h3>
                    <button onClick={onClose} className="text-text-secondary hover:text-red-500">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div className="p-6">
                    <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6 w-full">
                        <button onClick={() => { setActiveTab('reco'); setSelectedFile(null); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'reco' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-text-secondary'}`}>Random Forest (Recommendation)</button>
                        <button onClick={() => { setActiveTab('yield'); setSelectedFile(null); }} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'yield' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-text-secondary'}`}>LSTM (Yield)</button>
                    </div>
                    <div className="bg-surface-light dark:bg-surface-dark border border-border-color rounded-xl p-6">
                        <h4 className="font-bold text-lg mb-2">{title}</h4>
                        <p className="text-sm text-text-secondary mb-6">{t('modelDesc')}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-text-secondary uppercase mb-1">{t('modelStatus')}</p>
                                    <div className="flex items-center gap-2">
                                        <span className={`size-3 rounded-full ${currentModel.status === 'ready' ? 'bg-green-500' : (currentModel.status === 'training' ? 'bg-yellow-500 animate-pulse' : 'bg-gray-300')}`}></span>
                                        <span className="font-medium capitalize">{currentModel.status === 'idle' ? (language === 'th' ? 'ยังไม่มีโมเดล' : 'No Model') : currentModel.status}</span>
                                    </div>
                                </div>

                                {/* เพิ่มส่วนแสดงชื่อไฟล์ที่อัปโหลดล่าสุด ตรงนี้ */}
                                {currentModel.fileName && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-blue-500">description</span>
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] text-blue-600 dark:text-blue-400 uppercase leading-tight mb-0.5 font-bold">
                                                {language === 'th' ? 'ไฟล์ที่อัปโหลดล่าสุด' : 'Latest Uploaded File'}
                                            </p>
                                            <p className="font-medium text-sm text-blue-900 dark:text-blue-100 truncate" title={currentModel.fileName}>
                                                {currentModel.fileName}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-border-color">
                                    <div>
                                        <p className="text-[10px] text-text-secondary uppercase mb-1">{t('lastTrained')}</p>
                                        <p className="font-medium text-sm">
                                            {currentModel.lastTrained 
                                                ? new Date(currentModel.lastTrained).toLocaleString(language === 'th' ? 'th-TH' : 'en-US', { dateStyle: 'short', timeStyle: 'short' }) 
                                                : '-'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-text-secondary uppercase mb-1">{t('accuracy')}</p>
                                        <p className={`font-bold ${currentModel.accuracy >= 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {currentModel.accuracy > 0 ? `${currentModel.accuracy}%` : '-'}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-text-secondary uppercase mb-1">{t('records')}</p>
                                    <p className="font-mono text-sm">{currentModel.totalRecords.toLocaleString()}</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-3 justify-center">
                                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center hover:bg-gray-50 transition-colors bg-background-light dark:bg-background-dark">
                                    <input type="file" accept=".csv" className="hidden" id="ai-upload" ref={fileInputRef} onChange={handleFileChange} />
                                    <label htmlFor="ai-upload" className="cursor-pointer block">
                                        <span className={`material-symbols-outlined text-3xl mb-2 ${selectedFile ? 'text-primary' : 'text-gray-400'}`}>
                                            {selectedFile ? 'check_circle' : 'upload_file'}
                                        </span>
                                        <p className={`text-sm font-medium truncate px-2 ${selectedFile ? 'text-primary' : 'text-text-secondary'}`} title={selectedFile?.name}>
                                            {selectedFile ? selectedFile.name : t('uploadCSV')}
                                        </p>
                                    </label>
                                </div>
                                <button disabled={!selectedFile || currentModel.status === 'training'} onClick={handleTrainClick} className="w-full py-2 bg-primary text-white font-bold rounded-lg disabled:opacity-50 hover:bg-primary-hover transition-all flex items-center justify-center gap-2">
                                    {currentModel.status === 'training' ? (
                                        <><span className="material-symbols-outlined animate-spin text-sm">sync</span> Training...</>
                                    ) : (
                                        <><span className="material-symbols-outlined text-sm">model_training</span> {t('trainModel')}</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Dashboard ---
const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { selectedFarmId } = useNavigation();
  const { getFarmById, plantCrop, cancelPlanting, updateFarmInfo, updateFarmEnv, trainFarmAI } = useFarms();
  const { user } = useAuth();
  
  const currentFarm = selectedFarmId ? getFarmById(selectedFarmId) : undefined;
  
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [isEditingEnv, setIsEditingEnv] = useState(false);
  const [isManageAI, setIsManageAI] = useState(false);
  const [editName, setEditName] = useState('');
  const [editArea, setEditArea] = useState<number>(0);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);

  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<'list' | 'grid'>('grid');
  
  if (!currentFarm) return null;

  // --- 1. เพิ่มการเช็คสถานะของโมเดลทั้ง 2 ตัว ---
  const isRecoReady = currentFarm.recoModel?.status === 'ready';
  const isYieldReady = currentFarm.yieldModel?.status === 'ready';
  const canStartAnalysis = isRecoReady && isYieldReady;
  // ----------------------------------------

  const handleStartEditInfo = () => { setEditName(currentFarm.name); setEditArea(currentFarm.areaSqM || 1600); setIsEditingInfo(true); };
  const handleSaveInfo = () => { if (selectedFarmId) { updateFarmInfo(selectedFarmId, editName, editArea); setIsEditingInfo(false); } };
  const handleSaveEnv = (data: EnvData) => { if (selectedFarmId) { updateFarmEnv(selectedFarmId, data); setIsEditingEnv(false); } };
  const handleTrainAI = async (file: File, type: 'reco' | 'yield') => { if (selectedFarmId) await trainFarmAI(selectedFarmId, file, type); };
  const handleSelectCrop = (cropId: string, cropName: string) => { if (selectedFarmId) { plantCrop(selectedFarmId, { id: cropId, name: cropName, yield: 0, cycle: '45', icon: '🌱', color: 'bg-green-500', startDate: Date.now(), cycleDays: 45 }); setIsAnalysisOpen(false); } };

  const getActivities = () => {
     if (!currentFarm.plantedCrop) return [];
     const start = currentFarm.plantedCrop.startDate;
     const day = 24 * 60 * 60 * 1000;
     const schedule = [
        { date: start, action: 'act_water', status: 'done' },
        { date: start + (day * 3), action: 'act_check', status: 'done' }, 
        { date: start + (day * 7), action: 'act_fertilizer', status: 'done' },
        { date: Date.now(), action: 'act_water', status: 'today' },
        { date: start + (day * 14), action: 'act_pest', status: 'pending' },
        { date: start + (day * 21), action: 'act_fertilizer', status: 'pending' },
        { date: start + (day * 30), action: 'act_check', status: 'pending' },
        { date: start + (day * (currentFarm.plantedCrop.cycleDays || 45)), action: 'act_harvest', status: 'pending', isUrgent: true },
     ];
     return schedule.sort((a, b) => a.date - b.date);
  };
  const activities = getActivities();

  const renderCalendarGrid = () => {
    // ... (ฟังก์ชันนี้ใช้โค้ดเดิมของคุณได้เลยครับ)
    const viewMonth = currentViewDate.getMonth();
    const viewYear = currentViewDate.getFullYear();

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    const changeMonth = (offset: number) => {
        setCurrentViewDate(new Date(viewYear, viewMonth + offset, 1));
    };

    return (
        <div className="w-full animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-6 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-border-color">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-full shadow-sm transition-all">
                    <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <div className="text-center">
                    <h4 className="text-lg font-bold text-text-main">
                        {currentViewDate.toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', { month: 'long', year: 'numeric' })}
                    </h4>
                </div>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-full shadow-sm transition-all">
                    <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {(language === 'th' ? ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']).map(d => (
                    <div key={d} className="text-xs font-bold text-text-secondary uppercase py-2">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                    if (!day) return <div key={`empty-${idx}`} className="h-24 bg-gray-50/30 dark:bg-gray-800/10 rounded-lg"></div>;
                    
                    const isToday = day === new Date().getDate() && viewMonth === new Date().getMonth() && viewYear === new Date().getFullYear();
                    const dayActivities = activities.filter(act => {
                        const actDate = new Date(act.date);
                        return actDate.getDate() === day && actDate.getMonth() === viewMonth && actDate.getFullYear() === viewYear;
                    });

                    return (
                        <div key={day} className={`h-24 border ${isToday ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border-color bg-white dark:bg-surface-dark'} rounded-lg p-2 relative group hover:shadow-lg transition-all cursor-default`}>
                            <span className={`text-sm font-bold ${isToday ? 'text-primary' : 'text-text-secondary'}`}>{day}</span>
                            <div className="flex flex-col gap-1 mt-1 w-full overflow-y-auto max-h-[60px] no-scrollbar">
                                {dayActivities.map((act, i) => (
                                    <div key={i} className={`text-[9px] px-1.5 py-0.5 rounded-sm truncate w-full font-medium ${
                                        act.status === 'done' ? 'bg-green-100 text-green-700' : 
                                        (act.isUrgent ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-blue-100 text-blue-700')
                                    }`}>
                                        • {t(act.action as any)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

  const env = currentFarm.envData;
  const metrics: StatMetric[] = [
    { id: 'ph', label: 'pH', value: env.ph.toString(), unit: '', icon: 'science', colorClass: 'text-green-500', status: 'Normal' },
    { id: 'ec', label: 'EC', value: env.ec.toString(), unit: 'dS/m', icon: 'bolt', colorClass: 'text-yellow-500', status: 'Optimal' },
    { id: 'temp', label: 'Temp', value: env.temp.toString(), unit: '°C', icon: 'thermostat', colorClass: 'text-orange-500' },
    { id: 'humidity', label: 'Humidity', value: env.humidity.toString(), unit: '%', icon: 'water_drop', colorClass: 'text-blue-500' },
    { id: 'water', label: 'Water', value: env.water.toString(), unit: 'L', icon: 'water', colorClass: 'text-cyan-500' },
    { id: 'area', label: 'Area', value: currentFarm.area, unit: '', icon: 'crop_square', colorClass: 'text-purple-500' }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div className="flex-1">
              <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-bold text-text-main">{currentFarm.name}</h2>
              </div>
              <p className="text-text-secondary flex items-center gap-2 mt-1"><span className="material-symbols-outlined text-sm">location_on</span>{currentFarm.location} • {currentFarm.area}</p>
              
              {user?.role === 'admin' && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button onClick={handleStartEditInfo} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-text-main transition-colors"><span className="material-symbols-outlined text-sm">edit</span>{t('editFarmInfo')}</button>
                    <button onClick={() => setIsEditingEnv(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-text-main transition-colors"><span className="material-symbols-outlined text-sm">settings_input_component</span>{t('editEnv')}</button>
                    <button onClick={() => setIsManageAI(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-sm font-medium transition-colors"><span className="material-symbols-outlined text-sm">psychology</span>{t('manageAI')}</button>
                  </div>
              )}
           </div>
           
           <div>
               {currentFarm.plantedCrop ? (
                   <div className="flex items-center gap-3 bg-white dark:bg-surface-dark px-4 py-2 rounded-xl border border-border-color shadow-sm">
                       <div className={`size-10 rounded-full flex items-center justify-center text-white ${currentFarm.plantedCrop.color}`}>{currentFarm.plantedCrop.icon}</div>
                       <div className="text-right"><p className="text-xs text-text-secondary">{t('currentCrop')}</p><p className="font-bold text-text-main">{currentFarm.plantedCrop.name}</p></div>
                       <button onClick={() => setIsConfirmCancelOpen(true)} className="text-red-500 hover:bg-red-50 p-1 rounded-full ml-2">
                           <span className="material-symbols-outlined">close</span>
                       </button>
                   </div>
               ) : (
                   // --- 2. อัปเดตส่วนปุ่ม Start Analysis เพื่อให้รองรับสถานะปิดการใช้งาน (Disabled) ---
                   <div className="flex flex-col items-end gap-1">
                       <button 
                           onClick={() => setIsAnalysisOpen(true)} 
                           disabled={!canStartAnalysis}
                           className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${
                               canStartAnalysis 
                               ? 'bg-primary text-white shadow-primary/30 hover:bg-primary-hover' 
                               : 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed shadow-none'
                           }`}
                       >
                           <span className="material-symbols-outlined">psychology</span>
                           {t('startAnalysis')}
                       </button>
                       {!canStartAnalysis && (
                           <div className="text-xs text-red-500 flex items-center gap-1 mt-1 font-medium bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md border border-red-100 dark:border-red-900/30">
                               <span className="material-symbols-outlined text-[14px]">info</span>
                               {language === 'th' ? 'กรุณาอัปโหลดและ Train โมเดล AI ทั้ง 2 ตัวก่อน' : 'Please upload and train both AI models first.'}
                           </div>
                       )}
                   </div>
                   // ------------------------------------------------------------------
               )}
           </div>
        </div>

        {/* Modal ยืนยันการยกเลิกการปลูกพืช */}
        {isConfirmCancelOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-2xl w-full max-w-sm border border-border-color text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <span className="material-symbols-outlined text-red-600">warning</span>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-text-main">
                        {language === 'th' ? 'ยืนยันการยกเลิกการปลูก' : 'Confirm Cancellation'}
                    </h3>
                    <p className="text-sm text-text-secondary mb-6">
                        {language === 'th' ? 'คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการปลูกพืชนี้? ข้อมูลกิจกรรมและการแจ้งเตือนทั้งหมดที่เกี่ยวข้องจะถูกลบ' : 'Are you sure you want to cancel planting? All related activities and notifications will be removed.'}
                    </p>
                    <div className="flex justify-center gap-3">
                        <button 
                            onClick={() => setIsConfirmCancelOpen(false)} 
                            className="px-4 py-2 text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium">
                            {t('cancel')}
                        </button>
                        <button 
                            onClick={() => { 
                                cancelPlanting(currentFarm.id); 
                                setIsConfirmCancelOpen(false); 
                            }} 
                            className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors">
                            {language === 'th' ? 'ยืนยันการยกเลิก' : 'Confirm'}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Modals อื่นๆ (ของเดิม) */}
        {isEditingInfo && <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"><div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-2xl w-full max-w-md border border-border-color"><h3 className="text-xl font-bold mb-4 text-text-main">{t('editFarmInfo')}</h3><div className="space-y-4"><div><label className="block text-sm text-text-secondary mb-1">{t('farmName')}</label><input value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-2 border border-border-color rounded bg-background-light dark:bg-background-dark text-text-main focus:ring-2 focus:ring-primary outline-none" /></div><div><label className="block text-sm text-text-secondary mb-1">{t('farmArea')}</label><input type="number" value={editArea} onChange={e => setEditArea(Number(e.target.value))} className="w-full p-2 border border-border-color rounded bg-background-light dark:bg-background-dark text-text-main focus:ring-2 focus:ring-primary outline-none" /></div></div><div className="flex justify-end gap-2 mt-6"><button onClick={() => setIsEditingInfo(false)} className="px-4 py-2 text-text-secondary hover:bg-gray-100 rounded">{t('cancel')}</button><button onClick={handleSaveInfo} className="px-4 py-2 bg-primary text-white font-bold rounded hover:bg-primary-hover">{t('confirm')}</button></div></div></div>}
        <EditEnvModal isOpen={isEditingEnv} onClose={() => setIsEditingEnv(false)} initialData={env} onSave={handleSaveEnv} />
        <ManageFarmAIModal isOpen={isManageAI} onClose={() => setIsManageAI(false)} recoModel={currentFarm.recoModel} yieldModel={currentFarm.yieldModel} onTrain={handleTrainAI} />

        {/* Metrics */}
        <div><h3 className="font-bold text-xl text-text-main mb-4">{t('metricsTitle')}</h3><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">{metrics.map(metric => <StatsCard key={metric.id} metric={metric} />)}</div></div>

        {/* Calendar Section (Full Width) */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color p-6 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-text-main flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                    {t('calendarTitle')}
                </h3>
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 gap-1">
                    <button onClick={() => setCalendarView('grid')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${calendarView === 'grid' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-text-secondary'}`}>Calendar</button>
                    <button onClick={() => setCalendarView('list')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${calendarView === 'list' ? 'bg-white dark:bg-surface-dark shadow text-primary' : 'text-text-secondary'}`}>List</button>
                </div>
            </div>
            {currentFarm.plantedCrop ? (
                <div className="flex-1 animate-in fade-in duration-300">
                    {calendarView === 'grid' && renderCalendarGrid()}
                    {calendarView === 'list' && (
                        <div className="space-y-3">
                            {activities.map((act, index) => {
                                const dateObj = new Date(act.date);
                                const day = dateObj.getDate();
                                const month = dateObj.toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', { month: 'short' });
                                let statusColor = 'bg-gray-100 text-gray-500 border-gray-200';
                                let icon = 'schedule';
                                if (act.status === 'done') { statusColor = 'bg-green-50 text-green-700 border-green-200'; icon = 'check_circle'; } 
                                else if (act.status === 'today') { statusColor = 'bg-blue-50 text-blue-700 border-blue-200 ring-2 ring-blue-100'; icon = 'today'; } 
                                else if (act.isUrgent) { statusColor = 'bg-red-50 text-red-700 border-red-200'; icon = 'priority_high'; }
                                return (
                                    <div key={index} className={`flex items-center gap-4 p-4 rounded-xl border ${statusColor} transition-transform hover:scale-[1.01]`}>
                                        <div className="flex flex-col items-center justify-center min-w-[3.5rem] bg-white dark:bg-background-dark rounded-lg p-2 shadow-sm border border-border-color"><span className="text-2xl font-bold text-text-main leading-none">{day}</span><span className="text-xs text-text-secondary uppercase">{month}</span></div>
                                        <div className="flex-1"><p className="font-bold text-lg">{t(act.action as any)}</p><p className="text-xs opacity-80">{act.status === 'today' ? t('status_today') : (act.status === 'done' ? t('status_done') : t('status_pending'))}</p></div>
                                        <div className="text-2xl"><span className="material-symbols-outlined">{icon}</span></div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 py-10"><span className="material-symbols-outlined text-6xl mb-4 text-gray-300">event_busy</span><p>{t('noPlan')}</p></div>
            )}
        </div>

      </div>

      <CropAnalysisModal isOpen={isAnalysisOpen} onClose={() => setIsAnalysisOpen(false)} onSelectCrop={handleSelectCrop} farmAreaSqM={currentFarm.areaSqM || 1600} currentFarm={currentFarm} />

    </div>
  );
};

export default Dashboard;