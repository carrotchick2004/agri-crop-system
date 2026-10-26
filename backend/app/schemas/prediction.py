from pydantic import BaseModel
from typing import List, Optional

class CropPredictionInput(BaseModel):
    N: Optional[float] = 90.0
    P: Optional[float] = 42.0
    K: Optional[float] = 43.0
    temperature: float = 28.0
    humidity: float = 65.0
    ph: float = 6.5
    rainfall: Optional[float] = 200.0

class CropRecommendationItem(BaseModel):
    id: str
    name: str
    imageIcon: str
    matchScore: int
    estimatedYield: float
    cycleDays: int
    description: str

class CropPredictionResponse(BaseModel):
    modelUsed: str
    recommendations: List[CropRecommendationItem]
