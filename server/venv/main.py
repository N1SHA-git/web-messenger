from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr, ConfigDict
from sqlalchemy.future import select
from contextlib import asynccontextmanager
import bcrypt
from typing import AsyncGenerator
from datetime import datetime
from database import init_db, AsyncSessionLocal
from models import User

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    print("Таблицы созданы успешно!")
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

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
    avatar_url: str
    status: str
    created_at: datetime
    last_online: datetime


class AvatarUpdate(BaseModel):
    profilePic: str

# Эндпоинт регистрации
@app.post("/save_user")
async def saveUser(user: UserCreate, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == user.email)
    result = await db.execute(query)
    db_user = result.scalars().first()
    if db_user:
        raise HTTPException(status_code=400, detail="email already registered")

    hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_pw)

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return UserResponse.model_validate(new_user)

@app.post("/login")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == user.email)
    result = await db.execute(query)
    db_user = result.scalars().first()

    if not db_user or not bcrypt.checkpw(user.password.encode('utf-8'), db_user.hashed_password.encode('utf-8')):
        raise HTTPException(status_code=400, detail="invalid email or password")

    return UserResponse.model_validate(db_user)


@app.get("/users/{user_id}")
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse.model_validate(user)



@app.put("/update_avatar/{user_id}")
async def update_avatar(user_id: int, avatar: AvatarUpdate, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Обновляем аватарку, принимая base64-строку
    user.avatar_url = avatar.profilePic
    await db.commit()
    await db.refresh(user)

    return {"message": "Avatar updated", "avatar_url": user.avatar_url}

@app.post("/logout/{user_id}")
async def logout(user_id: int, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    db_user = result.scalars().first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.status = "offline"
    db_user.last_online = func.now()  # Обновляем вручную

    await db.commit()
    return {"message": "User logged out"}
