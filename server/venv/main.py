from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from contextlib import asynccontextmanager
import bcrypt
from typing import AsyncGenerator, List
from database import init_db, AsyncSessionLocal
from models import User
from schemas import UserCreate, UserLogin, UserResponse, AvatarUpdate


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


# endpoint for registration
@app.post("/auth/save_user")
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

#endpoint for login

@app.post("/auth/login")
async def login(user: UserLogin, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == user.email)
    result = await db.execute(query)
    db_user = result.scalars().first()

    if not db_user or not bcrypt.checkpw(user.password.encode('utf-8'), db_user.hashed_password.encode('utf-8')):
        raise HTTPException(status_code=400, detail="invalid email or password")

    return UserResponse.model_validate(db_user)

#endpoint for getuser by id
@app.get("/auth/check/{user_id}")
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse.model_validate(user)


#endpoint for update avatar
@app.put("/auth/update_avatar/{user_id}")
async def update_avatar(user_id: int, avatar: AvatarUpdate, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # updating avatar, using base64-str
    user.avatar_url = avatar.profilePic
    await db.commit()
    await db.refresh(user)

    return {"message": "Avatar updated", "avatar_url": user.avatar_url}

# endpoint for logout
@app.post("/auth/logout/{user_id}")
async def logout(user_id: int, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    db_user = result.scalars().first()

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.last_online = func.now()

    await db.commit()
    return {"message": "User logged out"}

@app.get("/messages/users/{user_id}", response_model=List[UserResponse])
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.id != user_id)
    result = await db.execute(query)
    users = result.scalars().all()

    if not users:
        raise HTTPException(status_code=404, detail="Users not found")

    return [UserResponse.model_validate(user) for user in users]
