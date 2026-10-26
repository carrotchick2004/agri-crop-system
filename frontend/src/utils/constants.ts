// src/constants.ts
import { StatMetric, SoilNutrient, CropRecommendation, WeatherDay, FarmTemplate, PlantDisease } from '../types';
import { Language } from './translations';

// ... (FarmTemplate เดิมเก็บไว้) ...
export const FARM_TEMPLATES: FarmTemplate[] = [
  {
    id: 'farm1',
    nameTh: 'ฟาร์มกรีนวัลเลย์',
    nameEn: 'Green Valley Farm',
    locationTh: 'เชียงใหม่, ไทย',
    locationEn: 'Chiang Mai, Thailand',
    image: 'https://picsum.photos/id/237/800/600',
    baseArea: '320'
  },
  // ... (อื่นๆ)
];

// โจทย์ 1.3.1 ข้อ 4: Dashboard ต้องมีค่า PH, EC, Temp, Humidity, Water, Area
export const getMetrics = (lang: Language, templateId: string): StatMetric[] => {
  const isTh = lang === 'th';
  
  return [
    {
      id: 'ph',
      label: 'ค่า pH',
      value: '6.5',
      unit: '',
      status: isTh ? 'ปกติ' : 'Normal',
      icon: 'science',
      colorClass: 'text-green-500'
    },
    {
      id: 'ec',
      label: 'ค่า EC', // Electrical Conductivity
      value: '1.2',
      unit: 'dS/m',
      status: isTh ? 'เหมาะสม' : 'Optimal',
      icon: 'bolt',
      colorClass: 'text-yellow-500'
    },
    {
      id: 'temp',
      label: isTh ? 'อุณหภูมิ' : 'Temp',
      value: '28',
      unit: '°C',
      icon: 'thermostat',
      colorClass: 'text-orange-500'
    },
    {
      id: 'humidity',
      label: isTh ? 'ความชื้น' : 'Humidity',
      value: '65',
      unit: '%',
      icon: 'humidity_percentage',
      colorClass: 'text-blue-400'
    },
    {
        id: 'water',
        label: isTh ? 'ปริมาณน้ำ' : 'Water Vol',
        value: '800',
        unit: 'L',
        icon: 'water_drop',
        colorClass: 'text-blue-600'
    }
  ];
};

// โจทย์ 1.3.1 ข้อ 2: พืช 5 ชนิด (ผักกาดขาว, บล็อกโคลี, กะหล่ำปลี, เมล่อน, มะเขือเทศ)
export const getCrops = (lang: Language, templateId: string): CropRecommendation[] => {
  const isTh = lang === 'th';
  
  const crops: CropRecommendation[] = [
    {
      name: isTh ? 'ผักกาดขาว' : 'Chinese Cabbage',
      imageIcon: 'grass',
      matchScore: 95,
      description: isTh ? 'ชอบอากาศเย็น ต้องการน้ำสม่ำเสมอ' : 'Likes cool weather, consistent watering.',
      yield: '3.0 t/ha', cycle: '55d', status: 'Best'
    },
    {
      name: isTh ? 'บล็อกโคลี' : 'Broccoli',
      imageIcon: 'forest',
      matchScore: 88,
      description: isTh ? 'ต้องการดินร่วนระบายน้ำดี' : 'Requires well-drained loamy soil.',
      yield: '15 t/ha', cycle: '75d', status: 'Good'
    },
    {
      name: isTh ? 'กะหล่ำปลี' : 'Cabbage',
      imageIcon: 'radio_button_checked',
      matchScore: 85,
      description: isTh ? 'ทนทานต่อสภาพอากาศได้ดี' : 'Good weather tolerance.',
      yield: '25 t/ha', cycle: '65d', status: 'Good'
    },
    {
      name: isTh ? 'เมล่อน' : 'Melon',
      imageIcon: 'circle',
      matchScore: 75,
      description: isTh ? 'ต้องการแสงแดดจัดและน้ำน้อยช่วงเก็บเกี่ยว' : 'Needs strong sun, less water near harvest.',
      yield: '20 t/ha', cycle: '85d', status: 'Warning',
      tags: [{ label: isTh ? 'ราคา' : 'Price', value: 'High' }]
    },
    {
      name: isTh ? 'มะเขือเทศ' : 'Tomato',
      imageIcon: 'nutrition',
      matchScore: 90,
      description: isTh ? 'ระวังโรครากเน่าหากน้ำขัง' : 'Beware of root rot if waterlogged.',
      yield: '40 t/ha', cycle: '70d', status: 'Best'
    }
  ];

  return crops;
};

// โจทย์ 1.3.1 ข้อ 8 & 9: โรคพืช 5 ชนิด
export const getDiseases = (lang: Language): PlantDisease[] => {
  const isTh = lang === 'th';
  return [
    {
      id: 'd1',
      nameTh: 'โรคราน้ำค้าง',
      nameEn: 'Downy Mildew',
      symptoms: isTh ? 'ใบเป็นจุดเหลืองซีด ด้านหลังใบมีขุยสีขาว' : 'Pale yellow spots on leaves, white fuzz on underside.',
      prevention: isTh ? 'ลดความชื้นในแปลง, ใช้สารกำจัดเชื้อรา' : 'Reduce moisture, use fungicides.',
      image: 'downy_mildew.jpg'
    },
    {
      id: 'd2',
      nameTh: 'โรคเหี่ยวเขียว',
      nameEn: 'Bacterial Wilt',
      symptoms: isTh ? 'ต้นเหี่ยวเฉาอย่างรวดเร็วทั้งที่ยังเขียวอยู่' : 'Plant wilts rapidly while still green.',
      prevention: isTh ? 'ใช้พันธุ์ต้านทาน, ปรับปรุงดินด้วยปูนขาว' : 'Use resistant varieties, amend soil with lime.',
      image: 'wilt.jpg'
    },
    {
      id: 'd3',
      nameTh: 'โรคกล้าเน่า',
      nameEn: 'Damping Off',
      symptoms: isTh ? 'โคนต้นกล้าช้ำเน่าและหักพับ' : 'Seedling stems rot and collapse.',
      prevention: isTh ? 'ใช้วัสดุเพาะที่สะอาด, ไม่รดน้ำชุ่มเกินไป' : 'Use clean soil, avoid overwatering.',
      image: 'damping_off.jpg'
    },
    {
      id: 'd4',
      nameTh: 'โรครากปม',
      nameEn: 'Root Knot Nematode',
      symptoms: isTh ? 'รากเป็นปุ่มปม ต้นแคระแกร็น' : 'Roots have knots/galls, stunted growth.',
      prevention: isTh ? 'ปลูกพืชหมุนเวียน, ใช้ดอกดาวเรืองไล่ไส้เดือนฝอย' : 'Crop rotation, use marigolds.',
      image: 'root_knot.jpg'
    },
    {
      id: 'd5',
      nameTh: 'โรคใบจุด',
      nameEn: 'Leaf Spot',
      symptoms: isTh ? 'ใบมีจุดวงกลมสีน้ำตาล ซ้อนกันเป็นวง' : 'Brown circular spots on leaves.',
      prevention: isTh ? 'ตัดใบที่เป็นโรคเผาทำลาย, ฉีดพ่นสารป้องกัน' : 'Burn infected leaves, apply preventative spray.',
      image: 'leaf_spot.jpg'
    }
  ];
};

// ... (Functions อื่นๆ คงเดิม หรือปรับแก้ตามความจำเป็น) ...
export const getNutrients = (lang: Language, templateId: string): SoilNutrient[] => {
   // คงเดิม หรือปรับค่าได้
   return [
    { name: 'N', symbol: 'N', value: 80, status: 'Normal', statusLabel: 'ปกติ', colorClass: 'bg-green-500' },
    { name: 'P', symbol: 'P', value: 60, status: 'Normal', statusLabel: 'ปกติ', colorClass: 'bg-green-500' },
    { name: 'K', symbol: 'K', value: 40, status: 'Low', statusLabel: 'ต่ำ', colorClass: 'bg-yellow-500' }
   ];
};

export const getForecast = (lang: Language): WeatherDay[] => {
    // คงเดิม
    return []; 
};

export const getSoilAnalysis = (templateId: string) => {
    return { ph: 6.5, status: 'neutral' };
};