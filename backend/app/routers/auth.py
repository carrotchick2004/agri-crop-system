from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
from app.database import get_db
from app.models.user import User
from app.models.farm import Farm
from app.schemas.user import UserLoginRequest, UserCreateRequest, UserResponse, AssignFarmsRequest

router = APIRouter(prefix="/api/auth", tags=["Authentication & Users"])

def format_user_response(user: User) -> UserResponse:
    assigned_ids = [farm.id for farm in user.assigned_farms]
    return UserResponse(
        id=user.id,
        username=user.username,
        firstName=user.first_name,
        lastName=user.last_name,
        area=user.area,
        role=user.role,
        isAuthenticated=True,
        assignedFarmIds=assigned_ids
    )

@router.post("/login", response_model=UserResponse)
def login(payload: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username).first()
    if not user or user.password_hash != payload.password or user.role != payload.role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"
        )
    return format_user_response(user)

@router.get("/farmers", response_model=List[UserResponse])
def get_farmers(db: Session = Depends(get_db)):
    farmers = db.query(User).filter(User.role == "farmer").all()
    return [format_user_response(f) for f in farmers]

@router.post("/farmers", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_farmer(payload: UserCreateRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.username == payload.username).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username นี้ถูกใช้งานแล้ว"
        )
    user_id = f"user_{int(datetime.now().timestamp() * 1000)}" if 'datetime' in globals() else f"user_{payload.username}"
    new_user = User(
        id=user_id,
        username=payload.username,
        password_hash=payload.password,
        first_name=payload.firstName,
        last_name=payload.lastName,
        area=payload.area,
        role="farmer"
    )
    if payload.assignedFarmIds:
        farms = db.query(Farm).filter(Farm.id.in_(payload.assignedFarmIds)).all()
        new_user.assigned_farms = farms

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return format_user_response(new_user)

@router.delete("/farmers/{user_id}")
def delete_farmer(user_id: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id, User.role == "farmer").first()
    if not user:
        raise HTTPException(status_code=404, detail="ไม่พบผู้ใช้งานนี้")
    db.delete(user)
    db.commit()
    return {"message": "ลบผู้ใช้สำเร็จ", "id": user_id}

@router.put("/farmers/{user_id}/farms")
def assign_farms(user_id: str, payload: AssignFarmsRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="ไม่พบผู้ใช้งานนี้")
    farms = db.query(Farm).filter(Farm.id.in_(payload.farmIds)).all()
    user.assigned_farms = farms
    db.commit()
    db.refresh(user)
    return format_user_response(user)
