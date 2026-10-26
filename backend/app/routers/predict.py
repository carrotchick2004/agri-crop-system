from fastapi import APIRouter
from app.schemas.prediction import CropPredictionInput, CropPredictionResponse, CropRecommendationItem
from app.services.ml_service import ml_service, CROPS_CATALOG

router = APIRouter(prefix="/api/predict", tags=["AI Prediction"])

@router.post("/recommend-crops", response_model=CropPredictionResponse)
def recommend_crops(payload: CropPredictionInput):
    crops = ml_service.predict_crops(
        ph=payload.ph,
        temp=payload.temperature,
        humidity=payload.humidity,
        water=payload.rainfall or 800.0
    )
    items = [CropRecommendationItem(**crop) for crop in crops]
    return CropPredictionResponse(
        modelUsed=ml_service.model_name,
        recommendations=items
    )

@router.get("/crops-catalog")
def get_catalog():
    return CROPS_CATALOG
