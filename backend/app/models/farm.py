from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base
from app.models.user import user_farms

class Farm(Base):
    __tablename__ = "farms"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    location = Column(String(200), nullable=False)
    area_sqm = Column(Float, default=1600.0)
    area = Column(String(50), default="1600 ตร.ม.")
    status = Column(String(20), default="active") # 'active', 'inactive', 'alert'
    image = Column(String(500), nullable=True)

    # Environmental Sensors
    env_ph = Column(Float, default=6.5)
    env_temp = Column(Float, default=28.0)
    env_humidity = Column(Float, default=60.0)
    env_ec = Column(Float, default=1.2)
    env_water = Column(Float, default=800.0)

    # AI Models info
    reco_model_status = Column(String(20), default="idle")
    reco_model_accuracy = Column(Float, default=0.0)
    reco_model_records = Column(Integer, default=0)
    reco_model_file = Column(String(200), nullable=True)
    reco_model_last_trained = Column(DateTime, nullable=True)

    yield_model_status = Column(String(20), default="idle")
    yield_model_accuracy = Column(Float, default=0.0)
    yield_model_records = Column(Integer, default=0)
    yield_model_file = Column(String(200), nullable=True)
    yield_model_last_trained = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Planted Crop (1-to-1 or None)
    planted_crop = relationship("PlantedCrop", back_populates="farm", uselist=False, cascade="all, delete-orphan")

    # Assigned farmers
    assigned_users = relationship("User", secondary=user_farms, back_populates="assigned_farms")


class PlantedCrop(Base):
    __tablename__ = "planted_crops"

    id = Column(String(50), primary_key=True, index=True)
    farm_id = Column(String(50), ForeignKey("farms.id", ondelete="CASCADE"), unique=True)
    crop_name = Column(String(100), nullable=False)
    crop_icon = Column(String(50), default="🌱")
    color_class = Column(String(50), default="bg-green-500")
    cycle_days = Column(Integer, default=45)
    estimated_yield = Column(Float, default=0.0)
    start_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    farm = relationship("Farm", back_populates="planted_crop")
