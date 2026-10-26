import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.farm import Farm
from app.routers import auth_router, farms_router, predict_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("agricorp.main")

def seed_initial_data(db):
    """Seed initial users and farms if database is empty."""
    if db.query(User).count() == 0:
        logger.info("Seeding initial users...")
        admin = User(id="admin1", username="admin", password_hash="1234", first_name="ผู้ดูแลระบบ", last_name="ส่วนกลาง", area="สำนักงานใหญ่", role="admin")
        somchai = User(id="f1", username="somchai", password_hash="123", first_name="สมชาย", last_name="ใจดี", area="เชียงใหม่", role="farmer")
        manee = User(id="f2", username="manee", password_hash="456", first_name="มานี", last_name="มีตา", area="ขอนแก่น", role="farmer")
        db.add_all([admin, somchai, manee])
        db.commit()

    if db.query(Farm).count() == 0:
        logger.info("Seeding initial farms...")
        farms = [
            Farm(id="farm_1", name="แปลงเพาะปลูกที่ 1", location="โซน A", area_sqm=1600.0, area="1600 ตร.ม.", status="active", image="https://picsum.photos/id/15/800/600", env_ph=6.5, env_temp=28.0, env_humidity=60.0, env_ec=1.2, env_water=800.0),
            Farm(id="farm_2", name="แปลงเพาะปลูกที่ 2", location="โซน B", area_sqm=1600.0, area="1600 ตร.ม.", status="active", image="https://picsum.photos/id/16/800/600", env_ph=6.2, env_temp=29.5, env_humidity=65.0, env_ec=1.4, env_water=750.0),
            Farm(id="farm_3", name="แปลงเพาะปลูกที่ 3", location="โซน C", area_sqm=2400.0, area="2400 ตร.ม.", status="active", image="https://picsum.photos/id/17/800/600", env_ph=7.0, env_temp=27.0, env_humidity=55.0, env_ec=1.0, env_water=900.0),
        ]
        db.add_all(farms)
        db.commit()

        # Assign farm_1, farm_2 to Somchai (f1)
        somchai = db.query(User).filter(User.id == "f1").first()
        if somchai:
            somchai.assigned_farms = farms[:2]
            db.commit()
        logger.info("Database initialized and seeded successfully.")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed
    try:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        try:
            seed_initial_data(db)
        finally:
            db.close()
    except Exception as e:
        logger.error("Error creating tables or seeding: %s", e)
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API for AgriCorp Smart Agriculture Dashboard (PostgreSQL + FastAPI + ML)",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)
app.include_router(farms_router)
app.include_router(predict_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.API_PORT, reload=True)
