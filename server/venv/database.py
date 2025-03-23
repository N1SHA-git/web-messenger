from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from models import Base
from config import settings

# Задаем строку подключения для асинхронного драйвера asyncpg.
DATABASE_URL = settings.DATABASE_URL_asyncpg

# Создаем асинхронный движок
engine = create_async_engine(DATABASE_URL, echo=True)

# Фабрика асинхронных сессий
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Функция для инициализации базы данных (создания таблиц)
async def init_db():
    # Используем асинхронный контекстный менеджер для работы с соединением
    async with engine.begin() as conn:
        # run_sync выполняет синхронную функцию внутри асинхронного контекста
        await conn.run_sync(Base.metadata.create_all)
