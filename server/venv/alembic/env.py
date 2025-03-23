import asyncio
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import create_async_engine
from alembic import context
from models import Base  # Импорт метаданных моделей
import os
from dotenv import load_dotenv
from sqlalchemy import engine_from_config

# Импортируем объект конфигурации Alembic
config = context.config  # 🔥 Сначала объявляем config!

# Загружаем переменные из .env
load_dotenv()

# Читаем URL БД из переменной окружения и передаём в конфиг
config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL"))  # Теперь config определён!

# Настройка логирования, если указана конфигурация в alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Создаём движок
engine = engine_from_config(
    config.get_section(config.config_ini_section),
    prefix="sqlalchemy.",
    poolclass=pool.NullPool,
)

target_metadata = Base.metadata

def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online():
    connectable = create_async_engine(
        config.get_main_option("sqlalchemy.url"),
        poolclass=pool.NullPool,
    )

    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
