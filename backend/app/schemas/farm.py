from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class EnvDataSchema(BaseModel):
    ph: float
    temp: float
    humidity: float
    ec: float
    water: float

class AIModelInfoSchema(BaseModel):
    lastTrained: Optional[int] = None
    accuracy: float = 0.0
    totalRecords: int = 0
    status: str = "idle"
    fileName: Optional[str] = None

class PlantedCropSchema(BaseModel):
    id: str
    name: str
    yieldAmount: float = 0.0
    cycle: str = "45"
    icon: str = "🌱"
    color: str = "bg-green-500"
    startDate: int
    cycleDays: Optional[int] = 45

class FarmUpdateInfoRequest(BaseModel):
    name: str
    areaSqM: float

class FarmUpdateEnvRequest(BaseModel):
    ph: float
    temp: float
    humidity: float
    ec: float
    water: float

class PlantCropRequest(BaseModel):
    cropId: str
    cropName: str
    yieldAmount: float = 0.0
    cycleDays: int = 45
    icon: str = "🌱"
    color: str = "bg-green-500"

class FarmResponse(BaseModel):
    id: str
    name: str
    location: str
    area: str
    areaSqM: float
    status: str
    image: Optional[str] = None
    envData: EnvDataSchema
    plantedCrop: Optional[PlantedCropSchema] = None
    recoModel: AIModelInfoSchema
    yieldModel: AIModelInfoSchema

    class Config:
        from_attributes = True
