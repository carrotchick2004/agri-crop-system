// src/types.ts

export type UserRole = 'admin' | 'farmer';

export interface User {
  id: string;
  username: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  area?: string;
  role: UserRole;
  isAuthenticated: boolean;
  assignedFarmIds?: string[];
}

// แก้ไข EnvData: ตัด NPK ทิ้ง, มีทั้ง EC และ Water
export interface EnvData {
  ph: number;
  temp: number;
  humidity: number;
  ec: number;    // เอา EC ไว้
  water: number; // เอา Water ใส่เพิ่ม
}

export interface PlantedCropData {
  id: string;
  name: string;
  yield: number;
  cycle: string;
  icon: string;
  color: string;
  startDate: number;
  cycleDays?: number;
}

export interface AIModelInfo {
  version?: string;
  lastTrained: number | null;
  accuracy: number;
  totalRecords: number;
  status: 'idle' | 'training' | 'ready' | 'error';
  fileName?: string;
}

export interface Farm {
  id: string;
  name: string;
  location: string;
  area: string;
  areaSqM?: number;
  status: 'active' | 'inactive' | 'alert';
  image: string;
  envData: EnvData;
  plantedCrop: PlantedCropData | null;
  templateId?: string;
  recoModel: AIModelInfo;
  yieldModel: AIModelInfo;
}

export interface StatMetric {
  id: string;
  label: string;
  value: string;
  unit?: string;
  change?: string;
  status?: string;
  icon: string;
  colorClass: string;
  progress?: number;
}

// CropAnalysisResult และอื่นๆ คงเดิม
export interface CropAnalysisResult {
  id: string;
  name: string;
  imageIcon: string;
  matchScore: number;
  estimatedYield: number;
  cycleDays: number;
  description: string;
}

export interface FarmTemplate {
  id: string;
  nameTh: string;
  nameEn: string;
  locationTh: string;
  locationEn: string;
  image: string;
  baseArea: string;
}

export interface PlantDisease {
  id: string;
  nameTh: string;
  nameEn: string;
  symptoms: string;
  prevention: string;
  image: string;
}

export interface WeatherDay {
    day: string;
    icon: string;
    tempHigh: number;
    tempLow: number;
    condition: string;
    colorClass: string;
}