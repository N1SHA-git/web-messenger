from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: str
    avatar_url: Optional[str] = None
    created_at: datetime
    last_online: datetime

class AvatarUpdate(BaseModel):
    profilePic: str

class MessageCreate(BaseModel):
    text: Optional[str] = None
    image: Optional[str] = None

class MessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    sender_id: int
    receiver_id: int
    text: Optional[str] = None
    image: Optional[str] = None
    created_at: datetime
