from fastapi import FastAPI, HTTPException, Depends, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel, EmailStr
from sqlalchemy.future import select
from contextlib import asynccontextmanager
import bcrypt
from config import settings
from typing import AsyncGenerator
from datetime import datetime, timedelta, timezone
from jose import jwt
from database import init_db, AsyncSessionLocal
from models import User

# Настройки JWT
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = "HS256"
# Время жизни токена: 60 * 24 * 14 минут (2 недели)
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 14

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    print("Таблицы созданы успешно!")
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,  # Необходимо для передачи cookies
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

# Эндпоинт регистрации с автоматическим созданием JWT и установкой httpOnly cookie
@app.post("/register")
async def register(user: UserCreate, response: Response, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == user.email)
    result = await db.execute(query)
    db_user = result.scalars().first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_pw)

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    # Генерация JWT после успешной регистрации
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(new_user.id)},
        expires_delta=access_token_expires
    )

    # Устанавливаем httpOnly cookie с JWT
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,    # В секундах
        secure=True,
        samesite="lax"
    )

    return {"message": "User registered successfully"}

# Эндпоинт логина с установкой httpOnly cookie
@app.post("/login")
async def login(user: UserLogin, response: Response, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == user.email)
    result = await db.execute(query)
    db_user = result.scalars().first()

    if not db_user or not bcrypt.checkpw(user.password.encode('utf-8'), db_user.hashed_password.encode('utf-8')):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(db_user.id)},
        expires_delta=access_token_expires
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        secure=True,  
        samesite="lax"
    )

    return {"message": "Login successful"}
