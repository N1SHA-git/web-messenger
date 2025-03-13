from sqlalchemy import Column, Integer, String, DateTime, func
from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    status = Column(String, default="online")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), default=func.now())
    last_online = Column(DateTime(timezone=True), server_default=func.now(), default=func.now(), onupdate=func.now())
