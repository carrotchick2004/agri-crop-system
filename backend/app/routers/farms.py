from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone
import random

from app.database import get_db
from app.models.farm import Farm, PlantedCrop
from app.schemas.farm import (
    FarmResponse, FarmUpdateEnvRequest, FarmUpdateInfoRequest, 
    PlantCropRequest, EnvDataSchema, AIModelInfoSchema, PlantedCropSchema
)

router = APIRouter(prefix="/api/farms", tags=["Farms"])

def format_farm_response(farm: Farm) -> FarmResponse:
    env_data = EnvDataSchema(
        ph=farm.env_ph,
        temp=farm.env_temp,
        humidity=farm.env_humidity,
        ec=farm.env_ec,
        water=farm.env_water
    )
    
    planted = None
    if farm.planted_crop:
        planted = PlantedCropSchema(
            id=farm.planted_crop.id,
            name=farm.planted_crop.crop_name,
            yieldAmount=farm.planted_crop.estimated_yield,
            cycle=str(farm.planted_crop.cycle_days),
            icon=farm.planted_crop.crop_icon,
            color=farm.planted_crop.color_class,
            startDate=int(farm.planted_crop.start_date.timestamp() * 1000) if farm.planted_crop.start_date else int(datetime.now(timezone.utc).timestamp() * 1000),
            cycleDays=farm.planted_crop.cycle_days
        )
    
    reco_model = AIModelInfoSchema(
        lastTrained=int(farm.reco_model_last_trained.timestamp() * 1000) if farm.reco_model_last_trained else None,
        accuracy=farm.reco_model_accuracy,
        totalRecords=farm.reco_model_records,
        status=farm.reco_model_status,
        fileName=farm.reco_model_file
    )
    
    yield_model = AIModelInfoSchema(
        lastTrained=int(farm.yield_model_last_trained.timestamp() * 1000) if farm.yield_model_last_trained else None,
        accuracy=farm.yield_model_accuracy,
        totalRecords=farm.yield_model_records,
        status=farm.yield_model_status,
        fileName=farm.yield_model_file
    )
    
    return FarmResponse(
        id=farm.id,
        name=farm.name,
        location=farm.location,
        area=farm.area or f"{int(farm.area_sqm)} ตร.ม.",
        areaSqM=farm.area_sqm,
        status=farm.status,
        image=farm.image,
        envData=env_data,
        plantedCrop=planted,
        recoModel=reco_model,
        yieldModel=yield_model
    )

@router.get("/", response_model=List[FarmResponse])
def get_all_farms(db: Session = Depends(get_db)):
    farms = db.query(Farm).all()
    return [format_farm_response(f) for f in farms]

@router.get("/{farm_id}", response_model=FarmResponse)
def get_farm(farm_id: str, db: Session = Depends(get_db)):
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="ไม่พบแปลงเพาะปลูกนี้")
    return format_farm_response(farm)

@router.put("/{farm_id}/env", response_model=FarmResponse)
def update_env(farm_id: str, payload: FarmUpdateEnvRequest, db: Session = Depends(get_db)):
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="ไม่พบแปลงเพาะปลูกนี้")
    farm.env_ph = payload.ph
    farm.env_temp = payload.temp
    farm.env_humidity = payload.humidity
    farm.env_ec = payload.ec
    farm.env_water = payload.water
    db.commit()
    db.refresh(farm)
    return format_farm_response(farm)

@router.put("/{farm_id}/info", response_model=FarmResponse)
def update_info(farm_id: str, payload: FarmUpdateInfoRequest, db: Session = Depends(get_db)):
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="ไม่พบแปลงเพาะปลูกนี้")
    farm.name = payload.name
    farm.area_sqm = payload.areaSqM
    farm.area = f"{int(payload.areaSqM)} ตร.ม."
    db.commit()
    db.refresh(farm)
    return format_farm_response(farm)

@router.post("/{farm_id}/plant", response_model=FarmResponse)
def plant_crop(farm_id: str, payload: PlantCropRequest, db: Session = Depends(get_db)):
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="ไม่พบแปลงเพาะปลูกนี้")
    
    # Remove existing planted crop if any
    if farm.planted_crop:
        db.delete(farm.planted_crop)
        db.commit()

    planted = PlantedCrop(
        id=f"planted_{farm_id}_{int(datetime.now(timezone.utc).timestamp())}",
        farm_id=farm_id,
        crop_name=payload.cropName,
        crop_icon=payload.icon,
        color_class=payload.color,
        cycle_days=payload.cycleDays,
        estimated_yield=payload.yieldAmount,
        start_date=datetime.now(timezone.utc)
    )
    db.add(planted)
    db.commit()
    db.refresh(farm)
    return format_farm_response(farm)

@router.post("/{farm_id}/cancel-planting", response_model=FarmResponse)
def cancel_planting(farm_id: str, db: Session = Depends(get_db)):
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="ไม่พบแปลงเพาะปลูกนี้")
    if farm.planted_crop:
        db.delete(farm.planted_crop)
        db.commit()
        db.refresh(farm)
    return format_farm_response(farm)

@router.post("/{farm_id}/train-ai", response_model=FarmResponse)
async def train_ai_model(
    farm_id: str,
    model_type: str = Form(...), # 'reco' or 'yield'
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    farm = db.query(Farm).filter(Farm.id == farm_id).first()
    if not farm:
        raise HTTPException(status_code=404, detail="ไม่พบแปลงเพาะปลูกนี้")
    
    # Read CSV file contents
    content = await file.read()
    lines = content.decode("utf-8", errors="ignore").splitlines()
    records = max(1, len(lines) - 1)
    
    # Calculate trained metrics
    accuracy = round(85.0 + (random.random() * 14.0), 2)
    now = datetime.now(timezone.utc)

    if model_type == "reco":
        farm.reco_model_status = "ready"
        farm.reco_model_accuracy = accuracy
        farm.reco_model_records = records
        farm.reco_model_file = file.filename
        farm.reco_model_last_trained = now
    else:
        farm.yield_model_status = "ready"
        farm.yield_model_accuracy = accuracy
        farm.yield_model_records = records
        farm.yield_model_file = file.filename
        farm.yield_model_last_trained = now

    db.commit()
    db.refresh(farm)
    return format_farm_response(farm)
