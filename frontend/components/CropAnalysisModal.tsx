// src/components/CropAnalysisModal.tsx
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CropAnalysisResult, Farm } from '../types'; // Import Farm Type

interface CropAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCrop: (cropId: string, cropName: string) => void;
  farmAreaSqM: number;
  currentFarm: Farm; // รับ Farm object เข้ามา
}

const MOCK_CROPS_DATA: CropAnalysisResult[] = [
    { id: 'crop_1', name: 'ผักกาดขาว', imageIcon: '🥬', matchScore: 92, estimatedYield: 2.5, cycleDays: 45, description: 'เหมาะกับดินปัจจุบันมาก' },
    { id: 'crop_2', name: 'แตงกวาญี่ปุ่น', imageIcon: '🥒', matchScore: 85, estimatedYield: 1.8, cycleDays: 60, description: 'ต้องการน้ำเพิ่มเล็กน้อย' },
    { id: 'crop_3', name: 'กะหล่ำปลี', imageIcon: '🟢', matchScore: 78, estimatedYield: 3.0, cycleDays: 55, description: 'ความเสี่ยงโรคปานกลาง' },
    { id: 'crop_4', name: 'เบบี้คอส', imageIcon: '🍀', matchScore: 65, estimatedYield: 4.5, cycleDays: 80, description: 'ผลตอบแทนสูงแต่ดูแลยาก' },
    { id: 'crop_5', name: 'มะเขือเทศ', imageIcon: '🍅', matchScore: 88, estimatedYield: 5.2, cycleDays: 70, description: 'ตลาดต้องการสูง' },
];

const CropAnalysisModal: React.FC<CropAnalysisModalProps> = ({ isOpen, onClose, onSelectCrop, farmAreaSqM, currentFarm }) => {
  const { t } = useLanguage();
  
  // ใช้ Model จาก currentFarm โดยตรง
  const recoModelInfo = currentFarm.recoModel;
  const yieldModelInfo = currentFarm.yieldModel;
  
  const [step, setStep] = useState<'start' | 'analyzing' | 'result'>('start');
  const [results, setResults] = useState<CropAnalysisResult[]>([]);
  const [sortBy, setSortBy] = useState<'score' | 'yield'>('score');

  useEffect(() => {
    if (isOpen) {
        setStep('start');
        setResults([]);
        setSortBy('score');
    }
  }, [isOpen]);

  const handleRunAnalysis = () => {
    setStep('analyzing');
    setTimeout(() => {
        // Logic: เช็คว่าโมเดลของฟาร์มนี้ Ready หรือยัง
        const hasRecoModel = recoModelInfo.status === 'ready';
        const hasYieldModel = yieldModelInfo.status === 'ready';
        
        const analyzedData = MOCK_CROPS_DATA.map(c => ({
            ...c,
            // ถ้ามีโมเดล Random Forest ของฟาร์มนี้ ให้คะแนนเปลี่ยน
            matchScore: hasRecoModel ? Math.min(100, Math.floor(c.matchScore * (0.9 + Math.random() * 0.2))) : c.matchScore,
            // ถ้ามีโมเดล LSTM ของฟาร์มนี้ ให้ Yield เปลี่ยน
            estimatedYield: hasYieldModel ? c.estimatedYield * 1.15 : c.estimatedYield
        }));
        
        setResults(analyzedData);
        setStep('result');
    }, 2500);
  };

  const sortedResults = [...results].sort((a, b) => {
      if (sortBy === 'score') return b.matchScore - a.matchScore;
      return b.estimatedYield - a.estimatedYield;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl w-full max-w-2xl border border-border-color overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-border-color flex justify-between items-center bg-background-light dark:bg-background-dark">
            <h3 className="font-bold text-lg text-text-main">
                {step === 'start' ? t('startAnalysis') : t('analysisResult')}
            </h3>
            <button onClick={onClose} className="text-text-secondary hover:text-red-500">
                <span className="material-symbols-outlined">close</span>
            </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
            
            {step === 'start' && (
                <div className="text-center py-10">
                    <div className="flex justify-center gap-4 mb-8">
                        {/* แสดงสถานะโมเดลของฟาร์มนี้ */}
                        <div className="flex flex-col items-center">
                            <div className={`size-16 rounded-full flex items-center justify-center mb-2 ${recoModelInfo.status === 'ready' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                <span className="material-symbols-outlined text-3xl">psychology</span>
                            </div>
                            <p className="text-xs font-bold text-text-secondary">Random Forest</p>
                            <p className="text-[10px] text-gray-400">({recoModelInfo.status})</p>
                        </div>
                        <div className="flex items-center text-text-secondary pt-[-20px]"><span className="material-symbols-outlined">add</span></div>
                        <div className="flex flex-col items-center">
                            <div className={`size-16 rounded-full flex items-center justify-center mb-2 ${yieldModelInfo.status === 'ready' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                <span className="material-symbols-outlined text-3xl">trending_up</span>
                            </div>
                            <p className="text-xs font-bold text-text-secondary">LSTM</p>
                            <p className="text-[10px] text-gray-400">({yieldModelInfo.status})</p>
                        </div>
                    </div>

                    <p className="text-text-secondary mb-8 max-w-md mx-auto">
                        ระบบจะใช้โมเดลประจำฟาร์ม <b>{currentFarm.name}</b> ในการวิเคราะห์
                    </p>
                    <button onClick={handleRunAnalysis} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all text-lg">{t('startAnalysis')}</button>
                </div>
            )}

            {step === 'analyzing' && (
                <div className="text-center py-16">
                    <span className="material-symbols-outlined text-6xl text-primary animate-spin mb-4">settings_suggest</span>
                    <p className="text-text-main font-medium text-lg">{t('analyzing')}</p>
                </div>
            )}

            {step === 'result' && (
                <div className="space-y-4">
                    <div className="flex gap-2 justify-center mb-4">
                         {recoModelInfo.status === 'ready' && <span className="text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">✓ RF: {recoModelInfo.accuracy}%</span>}
                         {yieldModelInfo.status === 'ready' && <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">✓ LSTM: {yieldModelInfo.accuracy}%</span>}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg gap-2">
                        <span className="text-sm font-medium text-text-secondary flex items-center gap-2"><span className="material-symbols-outlined text-lg">sort</span>{t('sortBy')}</span>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <button onClick={() => setSortBy('score')} className={`flex-1 sm:flex-none px-3 py-1.5 rounded text-xs font-medium transition-colors ${sortBy === 'score' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-text-main'}`}>{t('sortRecommended')}</button>
                            <button onClick={() => setSortBy('yield')} className={`flex-1 sm:flex-none px-3 py-1.5 rounded text-xs font-medium transition-colors ${sortBy === 'yield' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-text-main'}`}>{t('sortYield')}</button>
                        </div>
                    </div>

                    {sortedResults.map((crop, idx) => (
                        <div key={crop.id} className="border border-border-color rounded-xl p-4 hover:border-primary/50 transition-colors flex items-center gap-4 bg-background-light dark:bg-background-dark">
                            <div className="size-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl shadow-sm">{crop.imageIcon}</div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-text-main text-lg">{crop.name}</h4>
                                    {idx === 0 && sortBy === 'score' && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold">BEST CHOICE</span>}
                                </div>
                                <p className="text-xs text-text-secondary truncate">{crop.description}</p>
                            </div>
                            <div className="text-right">
                                <div className="flex flex-col items-end">
                                    <span className={`text-sm font-bold ${sortBy === 'score' ? 'text-primary' : 'text-text-secondary'}`}>{crop.matchScore}% Match</span>
                                    <span className={`text-xs font-medium ${sortBy === 'yield' ? 'text-primary' : 'text-text-secondary'}`}>≈ {crop.estimatedYield.toFixed(1)} {t('yieldUnit')}</span>
                                </div>
                            </div>
                            <button onClick={() => onSelectCrop(crop.id, crop.name)} className="px-3 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors font-bold text-sm">{t('selectThisCrop')}</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CropAnalysisModal;