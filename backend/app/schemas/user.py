from pydantic import BaseModel
from typing import Optional, List

class UserLoginRequest(BaseModel):
    username: str
    password: str
    role: str = "farmer" # 'farmer' or 'admin'

class UserCreateRequest(BaseModel):
    username: str
    password: str
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    area: Optional[str] = None
    role: str = "farmer"
    assignedFarmIds: Optional[List[str]] = []

class UserResponse(BaseModel):
    id: str
    username: str
    firstName: Optional[str] = None
    lastName: Optional[str] = None
    area: Optional[str] = None
    role: str
    isAuthenticated: bool = True
    assignedFarmIds: List[str] = []

    class Config:
        from_attributes = True

class AssignFarmsRequest(BaseModel):
    farmIds: List[str]
