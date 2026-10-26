// src/translations.ts

export type Language = 'th' | 'en';

export const translations = {
  th: {
    appTitle: 'AgriCorp',
    searchPlaceholder: 'ค้นหาฟาร์ม...',
    navFarm: 'รายชื่อฟาร์ม',
    dateToday: 'วันนี้',
    logout: 'ออกจากระบบ',
    
    // Farm & Dashboard
    farmListTitle: 'ภาพรวมฟาร์มทั้งหมด',
    viewDashboard: 'ดูแดชบอร์ด',
    currentCrop: 'พืชปัจจุบัน',
    changeCrop: 'เปลี่ยนพืช / เริ่มปลูกใหม่',
    metricsTitle: 'สภาพแวดล้อมปัจจุบัน',
    diseaseTitle: 'วิเคราะห์โรคพืช',
    
    // Edit Env (Updated)
    editEnv: 'แก้ไขค่าสภาพแวดล้อม',
    env_ph: 'ความเป็นกรด-ด่าง (pH)',
    env_temp: 'อุณหภูมิ (°C)',
    env_humidity: 'ความชื้น (%)',
    env_ec: 'ค่าความนำไฟฟ้า (EC)', // เอาไว้
    env_water: 'ปริมาณน้ำ (ลิตร)',   // ใส่เพิ่ม
    // ลบ NPK ออก
    
    // Calendar & Activities
    calendarTitle: 'ปฏิทินการดูแลพืช',
    activityDate: 'วันที่',
    activityDetail: 'กิจกรรม',
    act_water: 'รดน้ำ',
    act_fertilizer: 'ใส่ปุ๋ยบำรุง',
    act_pest: 'ฉีดพ่นสารป้องกันแมลง',
    act_check: 'ตรวจเช็คโรคพืช',
    act_harvest: 'เก็บเกี่ยวผลผลิต',
    status_pending: 'รอถึงกำหนด',
    status_today: 'ทำวันนี้',
    status_done: 'เสร็จสิ้น',
    noPlan: 'ยังไม่มีแผนการปลูก กรุณาเริ่มปลูกพืชก่อน',
    
    // Edit Farm Info
    editFarmInfo: 'แก้ไขข้อมูลฟาร์ม',
    farmName: 'ชื่อฟาร์ม',
    farmArea: 'ขนาดพื้นที่ (ตร.ม.)',
    saveChanges: 'บันทึกการแก้ไข',
    
    // Analysis & Planting
    startAnalysis: 'เริ่มวิเคราะห์การปลูก',
    analyzing: 'กำลังประมวลผล (Random Forest + LSTM)...',
    analysisResult: 'ผลการวิเคราะห์พืช',
    sortBy: 'เรียงลำดับตาม:',
    sortRecommended: 'ความเหมาะสม (Random Forest)',
    sortYield: 'ปริมาณผลผลิต (LSTM)',
    yieldUnit: 'กก./ตร.ม.',
    confidence: 'ความมั่นใจ',
    selectThisCrop: 'เลือกปลูกพืชนี้',
    aiModelUsed: 'AI Models: Random Forest & LSTM',
    
    // Dashboard AI Management
    manageAI: 'จัดการ AI Model',
    farmModels: 'โมเดลประจำฟาร์ม',
    recoModelTitle: 'โมเดลแนะนำพืช (Random Forest)',
    yieldModelTitle: 'โมเดลพยากรณ์ผลผลิต (LSTM)',
    modelDesc: 'โมเดลนี้ใช้ข้อมูลเฉพาะของพื้นที่นี้เพื่อความแม่นยำสูงสุด',

    // Admin Panel
    adminPanel: 'ผู้ดูแลระบบ',
    userManagement: 'จัดการผู้ใช้',
    recoModelTraining: 'เทรน AI แนะนำพืช (Random Forest)',
    yieldModelTraining: 'เทรน AI ผลผลิต (LSTM)',
    uploadCSV: 'อัปโหลด CSV',
    trainModel: 'เริ่มเทรนโมเดล',
    modelStatus: 'สถานะโมเดล',
    lastTrained: 'อัปเดตล่าสุด',
    records: 'จำนวนข้อมูล',
    accuracy: 'ความแม่นยำ',
    
    // Status
    statusActive: 'ปกติ',
    statusAlert: 'ผิดปกติ',
    statusVacant: 'ว่าง',
    
    cancel: 'ยกเลิก',
    confirm: 'ยืนยัน',
    
    // Auth
    loginTitle: 'เข้าสู่ระบบ',
    username: 'ชื่อผู้ใช้',
    password: 'รหัสผ่าน',
    loginButton: 'เข้าสู่ระบบ',
    
    // Map
    mapLocation: 'ตำแหน่งที่ตั้ง'
  },
  en: {
    appTitle: 'AgriCorp',
    searchPlaceholder: 'Search farms...',
    navFarm: 'Farm List',
    dateToday: 'Today',
    logout: 'Logout',

    farmListTitle: 'Farm Overview',
    viewDashboard: 'Dashboard',
    currentCrop: 'Current Crop',
    changeCrop: 'Change Crop / New Planting',
    metricsTitle: 'Current Environment',
    diseaseTitle: 'Disease Analysis',

    // Edit Env
    editEnv: 'Edit Environment Data',
    env_ph: 'pH Level',
    env_temp: 'Temperature (°C)',
    env_humidity: 'Humidity (%)',
    env_ec: 'EC (dS/m)', // Keep
    env_water: 'Water Volume (L)', // Add
    // Remove NPK

    // Calendar & Activities
    calendarTitle: 'Planting Calendar',
    activityDate: 'Date',
    activityDetail: 'Activity',
    act_water: 'Watering',
    act_fertilizer: 'Apply Fertilizer',
    act_pest: 'Pest Control',
    act_check: 'Disease Inspection',
    act_harvest: 'Harvest',
    status_pending: 'Upcoming',
    status_today: 'Today',
    status_done: 'Completed',
    noPlan: 'No active plan. Please start planting first.',

    editFarmInfo: 'Edit Farm Details',
    farmName: 'Farm Name',
    farmArea: 'Area (sq.m.)',
    saveChanges: 'Save Changes',

    // Analysis & Planting
    startAnalysis: 'Start Analysis',
    analyzing: 'Processing (Random Forest + LSTM)...',
    analysisResult: 'Crop Analysis Results',
    sortBy: 'Sort by:',
    sortRecommended: 'Suitability (Random Forest)',
    sortYield: 'Estimated Yield (LSTM)',
    yieldUnit: 'kg/sq.m.',
    confidence: 'Confidence',
    selectThisCrop: 'Plant This Crop',
    aiModelUsed: 'AI Models: Random Forest & LSTM',

    // Dashboard AI Management
    manageAI: 'Manage AI Models',
    farmModels: 'Farm-Specific Models',
    recoModelTitle: 'Crop Recommendation (Random Forest)',
    yieldModelTitle: 'Yield Prediction (LSTM)',
    modelDesc: 'This model uses site-specific data for maximum accuracy.',

    // Admin Panel
    adminPanel: 'Admin Panel',
    userManagement: 'User Management',
    recoModelTraining: 'Train Recommendation AI (Random Forest)',
    yieldModelTraining: 'Train Yield AI (LSTM)',
    uploadCSV: 'Upload CSV',
    trainModel: 'Start Training',
    modelStatus: 'Model Status',
    lastTrained: 'Last Updated',
    records: 'Records',
    accuracy: 'Accuracy',

    statusActive: 'Active',
    statusAlert: 'Alert',
    statusVacant: 'Vacant',

    cancel: 'Cancel',
    confirm: 'Confirm',
    
    loginTitle: 'Login',
    username: 'Username',
    password: 'Password',
    loginButton: 'Login',
    
    mapLocation: 'Location Map'
  }
};