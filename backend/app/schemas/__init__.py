from app.schemas.user import UserLoginRequest, UserCreateRequest, UserResponse, AssignFarmsRequest
from app.schemas.farm import FarmResponse, FarmUpdateEnvRequest, FarmUpdateInfoRequest, PlantCropRequest
from app.schemas.prediction import CropPredictionInput, CropPredictionResponse, CropRecommendationItem

__all__ = [
    "UserLoginRequest", "UserCreateRequest", "UserResponse", "AssignFarmsRequest",
    "FarmResponse", "FarmUpdateEnvRequest", "FarmUpdateInfoRequest", "PlantCropRequest",
    "CropPredictionInput", "CropPredictionResponse", "CropRecommendationItem"
]
