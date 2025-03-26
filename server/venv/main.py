from fastapi import FastAPI, HTTPException, Depends, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from contextlib import asynccontextmanager
import bcrypt
import socketio
from datetime import datetime
from typing import AsyncGenerator, List, Dict
from database import init_db, AsyncSessionLocal
from models import User, Message
from schemas import UserCreate, UserLogin, UserResponse, AvatarUpdate, MessageResponse, MessageCreate
import cloudinary.uploader




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

sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins="*")
socket_app = socketio.ASGIApp(sio, app)

app.mount("/socket.io", socket_app)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

user_socket_map: Dict[int, str] = {}

def get_receiver_socket_id(user_id: int) -> str:
    return user_socket_map.get(user_id)

@sio.event
async def connect(sid, environ):
    try:
        query_params = environ.get('QUERY_STRING', '')
        # making query string a dict
        params = dict(q.split('=') for q in query_params.split('&') if q)
        user_id = int(params.get('user_id'))
        if user_id:
            user_socket_map[user_id] = sid
            await sio.emit("getOnlineUsers", list(user_socket_map.keys()))
            print(f"User {user_id} connected with socket {sid}")
    except Exception as e:
        print(f"Connection error: {e}")

@sio.event
async def disconnect(sid):
    user_id = next((k for k, v in user_socket_map.items() if v == sid), None)
    if user_id:
        del user_socket_map[user_id]
        await sio.emit("getOnlineUsers", list(user_socket_map.keys()))
        print(f"User {user_id} disconnected")



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
async def update_avatar(
    user_id: int,
    avatar: AvatarUpdate,
    db: AsyncSession = Depends(get_db)
):
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    avatar_url = None
    if avatar.profilePic:
        try:
            upload_result = cloudinary.uploader.upload(avatar.profilePic)
            avatar_url = upload_result["secure_url"]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error uploading avatar: {str(e)}")

    user.avatar_url = avatar_url
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

@app.get("/chat/users/{user_id}", response_model=List[UserResponse])
async def get_users_for_sidebar(user_id: int, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.id != user_id)
    result = await db.execute(query)
    users = result.scalars().all()

    if not users:
        raise HTTPException(status_code=404, detail="Users not found")

    return [UserResponse.model_validate(user) for user in users]


@app.get("/messages/{receiver_id}", response_model=List[MessageResponse])
async def get_messages(
    receiver_id: int,
    my_id: int = Query(..., description="my id"),
    db: AsyncSession = Depends(get_db)
):
    query = select(Message).where(
        ((Message.sender_id == my_id) & (Message.receiver_id == receiver_id)) |
        ((Message.sender_id == receiver_id) & (Message.receiver_id == my_id))
    ).order_by(Message.created_at)

    result = await db.execute(query)
    messages = result.scalars().all()

    return [MessageResponse.model_validate(msg) for msg in messages]


@app.post("/messages/send/{receiver_id}")
async def send_message(
    receiver_id: int,
    message_data: MessageCreate,  # data of message (text, image)
    sender_id: int = Query(..., description="sender ID"),
    db: AsyncSession = Depends(get_db)
):
    image_url = None
    if message_data.image:
        try:
            upload_result = cloudinary.uploader.upload(message_data.image)
            image_url = upload_result["secure_url"]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error to upload image: {str(e)}")

    new_message = Message(
        sender_id=sender_id,
        receiver_id=receiver_id,
        text=message_data.text,
        image=image_url,
        created_at=datetime.utcnow(),
    )

    db.add(new_message)
    await db.commit()
    await db.refresh(new_message)

    receiver_socket_id = get_receiver_socket_id(receiver_id)
    if receiver_socket_id:
        message_response = {
            "id": new_message.id,
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "text": message_data.text,
            "image": image_url,
            "created_at": new_message.created_at.isoformat()
        }
        await sio.emit("newMessage", message_response, room=receiver_socket_id)

    return MessageResponse.model_validate(new_message)
