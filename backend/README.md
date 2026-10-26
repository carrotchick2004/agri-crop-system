# AgriCorp Backend (FastAPI + PostgreSQL + pgAdmin)

Backend API สำหรับระบบ AgriCorp Smart Agriculture Dashboard พัฒนาด้วย **Python (FastAPI)** และ **SQLAlchemy ORM** พร้อมรองรับฐานข้อมูล **PostgreSQL** (จัดการผ่าน **pgAdmin**)

---

## โครงสร้างโฟลเดอร์ Backend

```
backend/
├── app/
│   ├── main.py              # จุดเริ่มต้น FastAPI และ Seeding ข้อมูล
│   ├── config.py            # การตั้งค่าอ่านค่าจาก .env
│   ├── database.py          # Session & Engine (PostgreSQL พร้อม SQLite Fallback)
│   ├── models/              # ตารางฐานข้อมูล (User, Farm, PlantedCrop)
│   ├── schemas/             # Pydantic Schemas สำหรับ Request/Response
│   ├── routers/             # API Endpoints (auth, farms, predict)
│   └── services/            # ML Service โหลดโมเดล .joblib และคำนวณผลผลิต
├── ml_models/               # จัดเก็บโมเดล Machine Learning (.joblib)
├── init_db.sql              # สคริปต์ SQL สำหรับรันใน pgAdmin เพื่อสร้างตารางและข้อมูลตั้งต้น
├── requirements.txt         # รายการไลบรารี Python ที่ต้องติดตั้ง
├── .env.example             # เทมเพลตสำหรับตั้งค่าการเชื่อมต่อฐานข้อมูล
└── README.md
```

---

## ขั้นตอนการตั้งค่าร่วมกับ pgAdmin และ PostgreSQL

### 1. สร้างฐานข้อมูลใน pgAdmin
1. เปิดโปรแกรม **pgAdmin 4**
2. เชื่อมต่อไปยัง Server PostgreSQL ของคุณ (เช่น `PostgreSQL 15/16/17`)
3. คลิกขวาที่ **Databases** ➡️ เลือก **Create** ➡️ **Database...**
4. ตั้งชื่อ Database Name: `agricorp_db` แล้วกด **Save**

### 2. นำเข้าตารางและข้อมูลตั้งต้น (Initial Data)
1. ใน pgAdmin คลิกขวาที่ฐานข้อมูล `agricorp_db` ➡️ เลือก **Query Tool**
2. เปิดไฟล์ `backend/init_db.sql` หรือคัดลอกเนื้อหาทั้งหมดในไฟล์ไปวางใน Query Tool
3. กดปุ่ม **Execute (F5 หรือปุ่ม Play รูปสามเหลี่ยม)**
4. ระบบจะสร้างตาราง `users`, `farms`, `user_farms`, `planted_crops` พร้อม Mock Data (admin, somchai, manee และแปลงฟาร์ม 3 แปลง) ให้ทันที

### 3. ตั้งค่าไฟล์ `.env`
สร้างไฟล์ `.env` ในโฟลเดอร์ `backend/` (คัดลอกจาก `.env.example`):
```bash
cp .env.example .env
```
แก้ไขข้อมูลการเชื่อมต่อให้ตรงกับรหัสผ่าน PostgreSQL ในเครื่องของคุณ:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=รหัสผ่าน_Postgres_ของคุณ
DB_NAME=agricorp_db
USE_SQLITE_FALLBACK=true
```
*(หมายเหตุ: หากยังไม่ได้เปิด PostgreSQL ตัวระบบจะสลับไปใช้ SQLite ชั่วคราวอัตโนมัติ เพื่อให้ทดสอบระบบได้โดยไม่ Error)*

---

## ขั้นตอนการติดตั้งและรันเซิร์ฟเวอร์

### 1. เปิด Terminal เข้าโฟลเดอร์ backend
```bash
cd backend
```

### 2. สร้าง Virtual Environment และเปิดใช้งาน
```bash
# Windows PowerShell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3. ติดตั้ง Dependencies
```bash
pip install -r requirements.txt
```

### 4. รันเซิร์ฟเวอร์ FastAPI
```bash
uvicorn app.main:app --reload --port 8000
```

---

## เอกสาร API และการทดสอบ (Swagger UI)

เมื่อรันเซิร์ฟเวอร์แล้ว คุณสามารถเปิดเว็บเบราว์เซอร์ไปที่:
* **Interactive API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **Alternative Docs (ReDoc)**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### สรุป Endpoints สำคัญ:
* `POST /api/auth/login` - เข้าสู่ระบบ (Admin / Farmer)
* `GET  /api/auth/farmers` - รายชื่อเกษตรกรทั้งหมด
* `POST /api/auth/farmers` - เพิ่มเกษตรกรใหม่
* `PUT  /api/auth/farmers/{id}/farms` - กำหนดแปลงให้เกษตรกรดูแล
* `GET  /api/farms/` - รายการแปลงเพาะปลูกทั้งหมด
* `PUT  /api/farms/{id}/env` - อัปเดตค่าเซนเซอร์ (pH, EC, Temp, Humidity, Water)
* `POST /api/farms/{id}/plant` - บันทึกการเลือกปลูกพืช
* `POST /api/farms/{id}/train-ai` - อัปโหลดไฟล์ CSV เพื่อ Train โมเดล AI
* `POST /api/predict/recommend-crops` - เรียกโมเดล AI ทำนายพืชที่เหมาะสมที่สุด
