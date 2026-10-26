import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// กำหนดหน้าตาข้อมูลที่จะได้รับกลับมาจาก Python
type PredictionResult = {
  cropName: string;
  confidence: number;
  description: string;
  requiredFertilizer: string;
};

const CropRecommendations: React.FC = () => {
  const { t } = useLanguage();
  
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ข้อมูลจำลอง (สมมติว่าเป็นค่าที่อ่านได้จาก Sensor ในฟาร์มตอนนี้)
  // ในอนาคตคุณสามารถเปลี่ยนตรงนี้ให้รับค่าจาก input หรือ IoT ได้
  const sensorData = {
    N: 90,
    P: 42,
    K: 43,
    temperature: 24.5,
    humidity: 78.2,
    ph: 6.5,
    rainfall: 200.0
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setError(null); // ล้าง Error เก่าก่อน

    try {
      // 1. ส่งข้อมูลไปหา Python Server
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sensorData), // ส่งค่า N,P,K ไป
      });

      if (!response.ok) {
        throw new Error('ไม่สามารถเชื่อมต่อกับ Server ได้');
      }

      // 2. รับผลลัพธ์กลับมา
      const data = await response.json();
      
      // 3. แสดงผล
      setResult(data);
      
    } catch (err) {
      console.error("Error:", err);
      setError("เกิดข้อผิดพลาด! กรุณาตรวจสอบว่าเปิดโปรแกรม Python (app.py) ไว้หรือยัง?");
    } finally {
      setIsLoading(false); // หยุดหมุนไม่ว่าจะสำเร็จหรือล้มเหลว
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-xl text-gray-900">การวิเคราะห์พืชที่เหมาะสม (AI)</h3>
          <p className="text-sm text-gray-500">เชื่อมต่อกับระบบ Machine Learning (Random Forest)</p>
        </div>
      </div>

      {/* ส่วนแสดงสถานะพร้อมปุ่มกด */}
      <div className="bg-green-50 rounded-xl p-6 border border-green-100 flex flex-col items-center justify-center text-center gap-4">
        <div className="bg-white p-4 rounded-full shadow-sm">
           <span className="material-symbols-outlined text-4xl text-green-600">psychology</span>
        </div>
        
        <div>
           <h4 className="font-bold text-gray-800">ข้อมูลสภาพแวดล้อมปัจจุบัน</h4>
           <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs text-gray-600">
             <span className="bg-white px-2 py-1 rounded border">N: {sensorData.N}</span>
             <span className="bg-white px-2 py-1 rounded border">P: {sensorData.P}</span>
             <span className="bg-white px-2 py-1 rounded border">K: {sensorData.K}</span>
             <span className="bg-white px-2 py-1 rounded border">Temp: {sensorData.temperature}°C</span>
           </div>
        </div>

        {/* แสดง Error ถ้ามี */}
        {error && (
          <div className="text-red-500 text-sm bg-red-100 px-3 py-1 rounded">
            {error}
          </div>
        )}

        <button 
          onClick={handleAnalyze}
          disabled={isLoading}
          className={`px-6 py-3 rounded-lg font-bold text-white shadow-md transition-all flex items-center gap-2
            ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:scale-105'}
          `}
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin">refresh</span>
              กำลังถาม AI...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">smart_toy</span>
              วิเคราะห์ผลจริง
            </>
          )}
        </button>
      </div>

      {/* --- Popup แสดงผลลัพธ์ --- */}
      {result && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative">
            
            <div className="bg-green-600 p-6 text-center relative">
              <button 
                onClick={() => setResult(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="inline-flex bg-white/20 p-3 rounded-full mb-3 backdrop-blur-md">
                <span className="material-symbols-outlined text-4xl text-white">eco</span>
              </div>
              <h2 className="text-2xl font-bold text-white">ผลการแนะนำจาก AI</h2>
              <p className="text-green-100 text-sm">ความมั่นใจ: {result.confidence}%</p>
            </div>

            <div className="p-8 text-center space-y-6">
              <div>
                <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold mb-1">พืชที่เหมาะสมที่สุด</p>
                <h3 className="text-4xl font-black text-gray-800 uppercase">{result.cropName}</h3>
              </div>

              <div className="h-px bg-gray-200 w-full"></div>

              <div className="text-left bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div className="flex gap-3 mb-3">
                   <span className="material-symbols-outlined text-green-600 shrink-0">info</span>
                   <p className="text-sm text-gray-700">{result.description}</p>
                </div>
                <div className="flex gap-3">
                   <span className="material-symbols-outlined text-orange-500 shrink-0">science</span>
                   <p className="text-sm text-gray-700">{result.requiredFertilizer}</p>
                </div>
              </div>

              <button 
                onClick={() => setResult(null)}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-colors"
              >
                ปิดหน้าต่าง
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default CropRecommendations;