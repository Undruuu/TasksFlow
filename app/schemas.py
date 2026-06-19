from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
from models import TaskStatus

# --- Схемы для пользователей ---
class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# --- Схемы для аутентификации ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    username: str

class TokenData(BaseModel):
    username: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

# --- Схемы для задач ---
class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    status: TaskStatus = TaskStatus.TODO
    deadline: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    status: Optional[TaskStatus] = None
    deadline: Optional[datetime] = None

class TaskResponse(TaskBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True