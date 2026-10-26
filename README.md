# 🌱 AgriCorp - Smart Agriculture Management System

ระบบบริหารจัดการฟาร์มอัจฉริยะ (AgriCorp Dashboard) ครบวงจร ทั้งส่วนหน้าบ้าน (Frontend) และหลังบ้าน (Backend) พร้อมระบบ AI แนะนำพืชและฐานข้อมูล PostgreSQL

---

## 📁 โครงสร้างโปรเจ็กต์ (Project Structure)

```
agri-crop-system/
├── frontend/                # 🎨 ส่วนหน้าบ้าน (React 19 + TypeScript + Vite + Tailwind CSS)
│   ├── components/          # React Components (Dashboard, FarmList, AdminPanel, ฯลฯ)
│   ├── contexts/            # State Management (Auth, Farm, Language, Navigation)
│   ├── App.tsx              # Main Application Component
│   ├── index.html           # HTML Template
│   ├── index.css            # Global Styles
│   ├── constants.ts         # ค่าคงที่และข้อมูลจำลอง
│   ├── translations.ts      # ระบบ 2 ภาษา (ไทย / อังกฤษ)
│   ├── types.ts             # TypeScript Type Definitions
│   ├── vite.config.ts       # Vite Bundler Configuration
│   └── package.json         # Frontend Dependencies
│
├── backend/                 # ⚙️ ส่วนหลังบ้าน (Python FastAPI + PostgreSQL + ML)
│   ├── app/
│   │   ├── main.py          # FastAPI Entry Point & Auto-seeding
│   │   ├── config.py        # Configuration & Environment loader
│   │   ├── database.py      # SQLAlchemy Session & Engine
│   │   ├── models/          # Database Models (User, Farm, PlantedCrop)
│   │   ├── schemas/         # Pydantic Schemas
│   │   ├── routers/         # REST APIs (auth, farms, predict)
│   │   └── services/        # Machine Learning Service (.joblib)
│   ├── ml_models/           # จัดเก็บโมเดล AI (ai_model.joblib)
│   ├── init_db.sql          # สคริปต์ SQL สำหรับสร้างตารางใน pgAdmin
│   ├── requirements.txt     # Python Dependencies
│   ├── .env.example         # เทมเพลตตั้งค่าฐานข้อมูล PostgreSQL
│   └── README.md            # คู่มือการติดตั้งและใช้งาน Backend ละเอียด
│
├── .gitignore
├── package.json             # Root Package Script สำหรับสั่งการ Frontend สะดวก
└── README.md
```

---

## 🚀 วิธีการรันโปรเจ็กต์ (Getting Started)

### 1. รัน Frontend (หน้าเว็บ)
สามารถรันคำสั่งจากโฟลเดอร์ Root ได้ทันที:
```bash
# ติดตั้ง dependencies (หากรันครั้งแรก)
npm install --prefix frontend

# เริ่มต้น Dev Server
npm run dev
```
เปิดเว็บเบราว์เซอร์ไปที่: **http://localhost:3000**

---

### 2. รัน Backend (API & ฐานข้อมูล)
```bash
# เข้าโฟลเดอร์ backend
cd backend

# สร้างและเปิดใช้งาน Virtual Environment
python -m venv venv
.\venv\Scripts\Activate.ps1    # สำหรับ Windows PowerShell

# ติดตั้งไลบรารี
pip install -r requirements.txt

# รันเซิร์ฟเวอร์ FastAPI
uvicorn app.main:app --reload --port 8000
```
เปิดดูคู่มือการเชื่อมต่อ pgAdmin ได้ที่: [backend/README.md](backend/README.md)  
เอกสาร API (Swagger UI): **http://localhost:8000/docs**
